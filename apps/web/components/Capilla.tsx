"use client";

import { useChannel } from "@portalsdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { arrancarOrgano, pararOrgano, tanerCampana } from "@/lib/campanas";
import { CANAL_CAPILLA } from "@/lib/portal";
import { ESTADO_INICIAL, type EstadoFuneral, type TipoReaccion } from "@/lib/tipos";
import { Feretro } from "./Feretro";
import { Flores, type FlorCayendo } from "./Flores";
import { LibroCondolencias, type Condolencia } from "./LibroCondolencias";
import { Vela } from "./Vela";

const OFICIANTE = "oficiante";
const OFRENDAS: { tipo: TipoReaccion; glifo: string; etiqueta: string }[] = [
  { tipo: "flor", glifo: "🌹", etiqueta: "Dejar una flor" },
  { tipo: "vela", glifo: "🕯️", etiqueta: "Encender una vela" },
  { tipo: "rezo", glifo: "🙏", etiqueta: "Rezar" },
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
  const contadorFlor = useRef(0);

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
        setTimeout(() => setFlores((f) => f.filter((i) => i.key !== key)), 3600);
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

  // El título de la pestaña avisa aunque el doliente esté en otra ventana.
  useEffect(() => {
    document.title = necrologica
      ? "✝ Ha muerto un artículo en español"
      : "Réquiem.wiki — el velatorio del conocimiento";
  }, [necrologica]);

  // La campana suena cuando entra un féretro nuevo, no en cada cambio de fase.
  const ultimoTanido = useRef<string | null>(null);
  useEffect(() => {
    if (!sonido || !estado.id || estado.fase !== "procesion") return;
    if (ultimoTanido.current === estado.id) return;
    ultimoTanido.current = estado.id;
    tanerCampana();
  }, [estado.id, estado.fase, sonido]);

  function alternarSonido() {
    if (sonido) {
      pararOrgano();
      setSonido(false);
    } else {
      arrancarOrgano();
      tanerCampana();
      setSonido(true);
    }
  }

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

  function ofrendar(tipo: TipoReaccion) {
    void send({
      type: "reaccion",
      content: { tipo, x: 0.12 + Math.random() * 0.76 },
      ephemeral: true,
    });
  }

  function firmar(texto: string) {
    void send({ content: { nombre, texto } });
  }

  const conectado = status === "ready";

  return (
    <div className="nave flex-1 flex flex-col lg:flex-row min-h-0">
      <div className="relative flex-1 flex flex-col min-h-0">
        <header className="flex items-center justify-between px-4 py-3 text-[11px] text-ink-dim shrink-0">
          <span className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                conectado ? "bg-live punto-vivo" : "bg-ink-dim"
              }`}
            />
            {conectado ? "En directo" : "Velando en silencio"}
          </span>
          <span className="font-lapida text-sm text-ink-dim">Réquiem.wiki</span>
          <span className="flex items-center gap-3">
            <span>{estado.veladosHoy} velados hoy</span>
            {estado.colaTamano > 0 && (
              <span
                className="text-ink-dim/70"
                title={`${estado.colaTamano} artículos esperan velatorio`}
              >
                {"✝".repeat(Math.min(estado.colaTamano, 6))}
                {estado.colaTamano > 6 && `+${estado.colaTamano - 6}`}
              </span>
            )}
            <button
              onClick={alternarSonido}
              aria-label={sonido ? "Silenciar la capilla" : "Escuchar la capilla"}
              title={sonido ? "Silenciar la capilla" : "Escuchar la capilla"}
              className="text-ink-dim hover:text-candle transition-colors text-sm"
            >
              {sonido ? "♪" : "🔇"}
            </button>
          </span>
        </header>

        {necrologica && (
          <div className="mx-4 mb-2 border border-gold/40 bg-bg-raised px-4 py-2.5 text-xs text-ink shrink-0">
            <span className="text-candle">✝ </span>
            Ha muerto un artículo en tu idioma: «{necrologica}»
          </div>
        )}

        <main className="relative flex-1 flex items-center justify-center px-4 py-6 min-h-0 overflow-y-auto">
          <Flores flores={flores} />
          <Feretro estado={estado} elegia={elegia} escribiendo={escribiendo} />
        </main>

        <div className="flex justify-center gap-3 py-3 shrink-0">
          {OFRENDAS.map((o) => (
            <button
              key={o.tipo}
              onClick={() => ofrendar(o.tipo)}
              title={o.etiqueta}
              aria-label={o.etiqueta}
              className="text-2xl w-12 h-12 rounded-full border border-mourning hover:border-gold/50 hover:bg-bg-raised transition-colors active:scale-90"
            >
              {o.glifo}
            </button>
          ))}
        </div>

        <footer className="shrink-0 border-t border-mourning px-4 pt-3 pb-4">
          <div className="flex items-end gap-1 overflow-x-auto pb-1">
            {dolientes
              ? dolientes.map((d) => (
                  <Vela key={d.id} nombre={d.nombre} esTuya={d.esYo} />
                ))
              : (
                <p className="text-xs text-ink-dim py-3">
                  {numeroVelas} velas encendidas
                </p>
              )}
          </div>
        </footer>
      </div>

      <aside className="lg:w-80 shrink-0 flex flex-col max-h-[45vh] lg:max-h-none">
        <LibroCondolencias condolencias={condolencias} alFirmar={firmar} />
      </aside>
    </div>
  );
}
