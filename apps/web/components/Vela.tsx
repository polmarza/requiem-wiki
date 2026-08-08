"use client";

interface Props {
  nombre: string;
  esTuya?: boolean;
}

/** Cada doliente conectado es una llama. Si se va, su vela se apaga en todas las pantallas. */
export function Vela({ nombre, esTuya }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 w-[98px] shrink-0">
      <div
        className="llama w-2.5 h-[15px]"
        style={{
          background:
            "radial-gradient(circle at 50% 75%, var(--candle) 0%, var(--candle-deep) 55%, transparent 78%)",
          borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
        }}
      />
      <div className="w-[7px] h-[22px] rounded-[2px] bg-gradient-to-b from-bg-raised to-mourning border border-mourning" />
      <span
        className={`text-[9px] leading-tight text-center max-w-full truncate ${
          esTuya ? "text-gold" : "text-ink-dim"
        }`}
        title={nombre}
      >
        {nombre}
      </span>
    </div>
  );
}
