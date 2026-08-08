"use client";

import type { EstadoFuneral } from "@/lib/tipos";

interface Props {
  estado: EstadoFuneral;
  elegia: string;
  escribiendo: boolean;
}

function horaLegible(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "";
  }
}

export function Feretro({ estado, elegia, escribiendo }: Props) {
  if (estado.fase === "espera" || !estado.titulo) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="font-lapida text-2xl italic text-ink-dim">
          La capilla espera.
        </p>
        <p className="text-sm text-ink-dim/70">
          Nadie ha muerto todavía. No tardará.
        </p>
      </div>
    );
  }

  // Cumplido el duelo mínimo, el féretro se queda mientras no haya relevo.
  const velandoSinRelevo = estado.fase === "duelo" && estado.colaTamano === 0;

  return (
    <div
      key={estado.id}
      className="entra-feretro w-full max-w-2xl mx-auto text-center"
    >
      <div className="border border-gold/35 bg-bg-raised/80 px-6 py-8 sm:px-12 sm:py-10 shadow-[0_0_60px_-20px_var(--candle-glow)]">
        <div className="text-[10px] uppercase tracking-[0.28em] text-ink-dim mb-5">
          {estado.dominio}
        </div>

        <h1 className="font-lapida text-3xl sm:text-5xl leading-tight text-ink mb-5 break-words">
          {estado.titulo}
        </h1>

        <div className="w-14 h-px bg-gold/45 mx-auto mb-5" />

        <p className="text-xs text-ink-dim leading-relaxed max-w-lg mx-auto">
          <span className="text-ink-dim/60">Causa de la muerte: </span>
          <span className="italic">{estado.causa}</span>
        </p>
        <p className="text-[11px] text-ink-dim/60 mt-2">
          Hora de la defunción: {horaLegible(estado.horaMuerte)}
        </p>

        {(estado.fase === "elegia" || estado.fase === "duelo" || estado.fase === "cierre") && (
          <div className="mt-8 pt-7 border-t border-mourning min-h-[7rem]">
            <p
              className={`font-lapida italic text-lg sm:text-xl leading-relaxed text-ink/90 ${
                escribiendo ? "pluma" : ""
              }`}
            >
              {elegia || (
                <span className="text-ink-dim not-italic text-sm">
                  El oficiante medita…
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {velandoSinRelevo && (
        <p className="mt-5 text-[11px] text-ink-dim/60 italic">
          Seguimos velándole hasta que llegue el siguiente.
        </p>
      )}
    </div>
  );
}
