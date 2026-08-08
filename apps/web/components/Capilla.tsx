"use client";

import { useChannel } from "@portalsdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tanerCampana, tanerOfrenda } from "@/lib/campanas";
import { CANAL_CAPILLA } from "@/lib/portal";
import { ESTADO_INICIAL, type EstadoFuneral, type TipoReaccion } from "@/lib/tipos";
import { Feretro } from "./Feretro";
import { Flores, type FlorCayendo } from "./Flores";
import { LibroCondolencias, type Condolencia } from "./LibroCondolencias";
import { Vela } from "./Vela";

const OFICIANTE = "oficiante";
const OFRENDAS: { tipo: TipoReaccion; glifo: string; etiqueta: string; color: string }[] = [
  { tipo: "flor", glifo: "❀", etiqueta: "Dejar una flor", color: "text-rose" },
  { tipo: "vela", glifo: "", etiqueta: "Encender una vela", color: "" },
  { tipo: "rezo", glifo: "✦", etiqueta: "Rezar", color: "text-gold" },
];

interface MensajeCapilla {
  [clave: string]: unknown;
}

export function Capilla({ nombre }: { nombre: string }) {
  /** Solo lo efímero (chunks y ofrendas) vive en estado local; el resto se deriva del canal. */
  const [chunkElegia, setChunkElegia] = useState<{ id: string; texto: string } | null>(null);
  const [flores, setFlores] = useState<FlorCayendo[]>([]);
  const [necrologica, setNecrologica] = useState<string | null>(null);
  const [sonido, setSonido] = useState(false);
  const [contadores, setContadores] = useState({ flor: 0, vela: 0, rezo: 0 });
  const [campanadaKey, setCampanadaKey] = useState(0);
  const contadorFlor = useRef(0);
  const funeralIdRef = useRef<string | null>(null);

  const alMensaje = useCallback((msg: {
    type?: string;
    content?: MensajeCapilla;
    sender?: { id?: string };
  }) => {
    const contenido = msg.content ?? {};
    // Solo el oficiante dicta la ceremonia; lo demás es ruido.
    const esOficiante = msg.sender?.id === OFICIANTE;

    switch (msg.type) {
      case "elegia.chunk": {
        if (!esOficiante) return;
        setChunkElegia({
          id: String(contenido.funeralId ?? ""),
          texto: String(contenido.texto ?? ""),
        });
        return;
      }
      case "necrologica.es": {
        if (!esOficiante) return;
        setNecrologica(String(contenido.titulo ?? ""));
        setTimeout(() => setNecrologica(null), 7000);
        return;
      }
      case "reaccion": {
        const tipo = (contenido.tipo as TipoReaccion) ?? "flor";
        const x = typeof contenido.x === "number" ? contenido.x : Math.random();
        const key = ++contadorFlor.current;
        setFlores((f) => [...f, { key, tipo, x }]);
        setTimeout(() => setFlores((f) => f.filter((i) => i.key !== key)), 4600);
        setContadores((c) => ({ ...c, [tipo]: c[tipo] + 1 }));
        return;
      }
    }
  }, []);

  const { messages, send, presence, me, status } = useChannel<MensajeCapilla>({
    channelId: CANAL_CAPILLA,
    history: 30,
    metadata: { nombre },
    onMessage: alMensaje,
  });

  /**
   * El estado se deriva del último anuncio del oficiante en el canal. Así, quien
   * llega a mitad de ceremonia se coloca en el punto exacto en que está la
   * capilla: el historial le da el mismo féretro que ven los demás.
   */
  const estado = useMemo<EstadoFuneral>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.type === "funeral.estado" && m.sender?.id === OFICIANTE) {
        return m.content as unknown as EstadoFuneral;
      }
    }
    return ESTADO_INICIAL;
  }, [messages]);

  const elegiaCompleta = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.type === "elegia.completa" && m.sender?.id === OFICIANTE) {
        const c = m.content as { funeralId?: string; texto?: string };
        if (c.funeralId === estado.id) return String(c.texto ?? "");
        return "";
      }
    }
    return "";
  }, [messages, estado.id]);

  // Mientras el oficiante escribe mandamos chunks; al cerrar manda el texto final.
  const chunkVigente = chunkElegia?.id === estado.id ? chunkElegia.texto : "";
  const elegia = elegiaCompleta || chunkVigente;
  const escribiendo = !elegiaCompleta && Boolean(chunkVigente);
  const pensando = estado.fase === "elegia" && !elegia;

  // Un funeral nuevo reinicia el contador de ofrendas y hace sonar la campana.
  useEffect(() => {
    if (funeralIdRef.current === estado.id) return;
    funeralIdRef.current = estado.id;
    setContadores({ flor: 0, vela: 0, rezo: 0 });
  }, [estado.id]);

  const ultimoTanido = useRef<string | null>(null);
  useEffect(() => {
    if (!estado.id || estado.fase !== "procesion") return;
    if (ultimoTanido.current === estado.id) return;
    ultimoTanido.current = estado.id;
    setCampanadaKey((k) => k + 1);
    if (sonido) tanerCampana();
  }, [estado.id, estado.fase, sonido]);

  // Cuánto lleva la capilla en silencio, para la nota al pie de "espera".
  const [esperaSeg, setEsperaSeg] = useState(0);
  const esperaDesde = useRef(Date.now());
  useEffect(() => {
    if (estado.fase !== "espera") {
      esperaDesde.current = Date.now();
      setEsperaSeg(0);
      return;
    }
    const id = setInterval(() => {
      setEsperaSeg(Math.floor((Date.now() - esperaDesde.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [estado.fase]);

  // El título de la pestaña avisa aunque el doliente esté en otra ventana.
  useEffect(() => {
    document.title = necrologica
      ? "✝ Ha muerto un artículo en español"
      : "Réquiem.wiki — el velatorio del conocimiento";
  }, [necrologica]);

  const dolientes = useMemo(() => {
    if (presence?.kind !== "detailed") return null;
    return presence.participants.map((p) => ({
      id: p.id,
      nombre: String(
        (p.metadata as { nombre?: string } | undefined)?.nombre ?? "Doliente",
      ),
      esYo: p.id === me?.id,
    }));
  }, [presence, me]);

  const numeroVelas =
    presence?.kind === "detailed" ? presence.participants.length : presence?.count ?? 1;
  const modoRecuento = dolientes ? dolientes.length > 12 : true;

  const condolencias = useMemo<Condolencia[]>(
    () =>
      messages
        .filter((m) => !m.type && m.sender?.id !== OFICIANTE)
        .slice(-60)
        .map((m) => ({
          id: m.id,
          nombre: String(
            (m.content as { nombre?: string })?.nombre ?? "Doliente",
          ),
          texto: String((m.content as { texto?: string })?.texto ?? ""),
        }))
        .filter((c) => c.texto),
    [messages],
  );

  const conectado = status === "ready";
  const degradada = !conectado;

  function ofrendar(tipo: TipoReaccion) {
    if (degradada) return;
    void send({
      type: "reaccion",
      content: { tipo, x: 6 + Math.random() * 86 },
      ephemeral: true,
    });
    if (sonido) tanerOfrenda();
  }

  function firmar(texto: string) {
    if (degradada) return;
    void send({ content: { nombre, texto } });
  }

  const fechaHoy = useMemo(
    () =>
      new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  return (
    <div className="nave flex-1 flex flex-col min-h-0">
      <header className="flex flex-wrap items-baseline gap-x-6 gap-y-2.5 px-[22px] py-3.5 border-b-2 border-ink text-[11px] tracking-[0.06em] text-ink-dim">
        <div className="font-lapida text-xl tracking-[0.14em] text-ink">
          RÉQUIEM<span className="text-ink-faint">.WIKI</span>
        </div>
        <div className="text-[10px] text-ink-faint">esquelas en directo · edición permanente</div>
        <div className="text-[10px] text-ink-faint capitalize">{fechaHoy}</div>
        <div className="flex-1" />
        <div>
          <span className={`punto-vivo ${conectado ? "text-live" : "text-gold"}`}>●</span>{" "}
          {conectado ? "en directo" : "conexión degradada"}
        </div>
        <div>
          <span className="text-ink">{estado.veladosHoy}</span> velados hoy
        </div>
        <div>
          <span className="text-ink">{estado.colaTamano}</span> almas esperan turno
        </div>
        <button
          onClick={() => setSonido((s) => !s)}
          className="border border-mourning rounded-full text-ink-dim text-[10px] px-3 py-1.5 hover:border-ink hover:text-ink transition-colors whitespace-nowrap"
        >
          sonido · {sonido ? "on" : "off"}
        </button>
      </header>

      {degradada && (
        <div className="text-center px-4 py-2 bg-[#ddd4c2] border-b border-[#b5aa93] text-gold text-[11px]">
          ○ Conexión degradada — sigues viendo el funeral, pero no puedes participar.
        </div>
      )}

      <div className="flex-1 flex flex-wrap items-stretch min-h-0">
        <div className="flex-1 basis-[620px] min-w-0 flex flex-col items-center relative px-5 pt-7 pb-[18px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
            <Flores flores={flores} />
          </div>
          <div
            key={campanadaKey}
            className="absolute inset-0 pointer-events-none campanada"
            style={{
              background:
                "radial-gradient(700px 420px at 50% 30%, rgba(33,29,23,.14), transparent 70%)",
            }}
          />

          <Feretro
            estado={estado}
            elegia={elegia}
            escribiendo={escribiendo}
            pensando={pensando}
            esperaSegundos={esperaSeg}
          />

          <div className="flex-1 min-h-3.5" />

          <div className="flex flex-col items-center gap-1.5 mb-[18px] max-w-full">
            <div className="text-[9px] tracking-[0.22em] text-ink-faint">DOLIENTES PRESENTES</div>
            {modoRecuento ? (
              <div className="flex items-center gap-3">
                <div
                  className="llama w-[11px] h-4"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 75%, var(--candle) 0%, var(--candle-deep) 55%, transparent 78%)",
                    borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
                  }}
                />
                <div className="font-lapida text-[22px] text-ink">
                  {numeroVelas}{" "}
                  <span className="text-sm text-ink-dim">dolientes velan en este momento</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-3.5 max-w-[600px]">
                {dolientes?.map((d) => (
                  <Vela key={d.id} nombre={d.nombre} esTuya={d.esYo} />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 pb-1">
            {OFRENDAS.map((o) => (
              <button
                key={o.tipo}
                onClick={() => ofrendar(o.tipo)}
                disabled={degradada}
                title={o.etiqueta}
                className="flex items-center gap-2.5 min-h-12 px-5 bg-bg-raised border border-ink rounded-full text-ink text-xs hover:bg-ink hover:text-bg-raised transition-colors active:scale-[.96] disabled:opacity-35 disabled:pointer-events-none"
              >
                {o.tipo === "vela" ? (
                  <span
                    className="inline-block w-2 h-3"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 75%, var(--candle) 0%, var(--candle-deep) 55%, transparent 80%)",
                      borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
                    }}
                  />
                ) : (
                  <span className={`${o.color} text-[15px]`}>{o.glifo}</span>
                )}
                {o.etiqueta}
                <span className="opacity-50 text-[10px]">
                  {contadores[o.tipo] || ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        <aside className="flex-1 basis-[300px] min-w-[280px] max-w-[430px] flex flex-col max-h-[45vh] lg:max-h-none">
          <LibroCondolencias
            condolencias={condolencias}
            alFirmar={firmar}
            deshabilitado={degradada}
          />
        </aside>
      </div>

      {necrologica && (
        <div className="toast-entra fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-ink rounded-md px-5 py-3 text-xs text-bg-raised shadow-[0_12px_40px_rgba(33,29,23,.4)] max-w-[90vw] text-center">
          † Ha muerto un artículo en tu idioma:{" "}
          <span className="font-lapida italic text-sm">«{necrologica}»</span>
        </div>
      )}
    </div>
  );
}
