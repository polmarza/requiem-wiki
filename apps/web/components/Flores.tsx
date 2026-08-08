"use client";

import type { TipoReaccion } from "@/lib/tipos";

export interface FlorCayendo {
  key: number;
  tipo: TipoReaccion;
  x: number;
}

const GLIFO: Record<TipoReaccion, string> = {
  flor: "🌹",
  vela: "🕯️",
  rezo: "🙏",
};

/** Las ofrendas de todos los dolientes, cayendo sobre el féretro a la vez. */
export function Flores({ flores }: { flores: FlorCayendo[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {flores.map((f) => (
        <span
          key={f.key}
          className="flor-cae absolute top-0 text-2xl select-none"
          style={
            {
              left: `${f.x * 100}%`,
              "--giro": `${(f.key % 2 ? 1 : -1) * (25 + (f.key % 40))}deg`,
            } as React.CSSProperties
          }
        >
          {GLIFO[f.tipo]}
        </span>
      ))}
    </div>
  );
}
