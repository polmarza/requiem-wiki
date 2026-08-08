"use client";

interface Props {
  nombre: string;
  esTuya?: boolean;
}

/** Cada doliente conectado es una llama. Si se va, su vela se apaga en todas las pantallas. */
export function Vela({ nombre, esTuya }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 w-14 shrink-0">
      <div className="relative h-5 flex items-end justify-center">
        <div
          className="llama w-1.5 h-4 rounded-full blur-[1.5px]"
          style={{
            background:
              "linear-gradient(to top, var(--candle) 20%, var(--candle-alta) 90%)",
            boxShadow: "0 0 14px 5px var(--candle-glow)",
            animationDelay: `${(nombre.length % 7) * 0.3}s`,
          }}
        />
      </div>
      <div className="w-2 h-5 rounded-[2px] bg-gradient-to-b from-[#e8e0d1] to-[#8a8070] opacity-70" />
      <span
        className={`text-[10px] leading-tight text-center truncate w-full ${
          esTuya ? "text-candle" : "text-ink-dim"
        }`}
        title={nombre}
      >
        {nombre}
      </span>
    </div>
  );
}
