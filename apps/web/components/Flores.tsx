"use client";

import type { TipoReaccion } from "@/lib/tipos";

export interface FlorCayendo {
  key: number;
  tipo: TipoReaccion;
  x: number;
}

/** Cada ofrenda se comporta distinto: la flor cae, el rezo asciende, la vela se posa y prende. */
function Ofrenda({ tipo, x, id }: { tipo: TipoReaccion; x: number; id: number }) {
  if (tipo === "flor") {
    return (
      <span
        className="flor-cae absolute top-[4%] select-none text-rose"
        style={{ left: `${x}%`, fontSize: `${17 + (id % 3) * 3}px` }}
      >
        ❀
      </span>
    );
  }
  if (tipo === "rezo") {
    return (
      <span
        className="rezo-sube absolute bottom-[18%] select-none text-gold text-[15px]"
        style={{ left: `${x}%` }}
      >
        ✦
      </span>
    );
  }
  return (
    <div
      className="vela-posa absolute bottom-[26%] w-[9px] h-3.5"
      style={{
        left: `${x}%`,
        background:
          "radial-gradient(circle at 50% 75%, var(--candle) 0%, var(--candle-deep) 55%, transparent 78%)",
        borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
      }}
    />
  );
}

export function Flores({ flores }: { flores: FlorCayendo[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {flores.map((f) => (
        <Ofrenda key={f.key} tipo={f.tipo} x={f.x} id={f.key} />
      ))}
    </div>
  );
}
