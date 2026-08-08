"use client";

import { useEffect, useRef, useState } from "react";

export interface Condolencia {
  id: string;
  nombre: string;
  texto: string;
}

interface Props {
  condolencias: Condolencia[];
  alFirmar: (texto: string) => void;
}

export function LibroCondolencias({ condolencias, alFirmar }: Props) {
  const [borrador, setBorrador] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [condolencias.length]);

  function firmar(e: React.FormEvent) {
    e.preventDefault();
    const texto = borrador.trim().slice(0, 200);
    if (!texto) return;
    alFirmar(texto);
    setBorrador("");
  }

  return (
    <div className="flex flex-col h-full border-t lg:border-t-0 lg:border-l border-mourning">
      <h2 className="font-lapida text-base text-ink-dim px-4 py-3 border-b border-mourning shrink-0">
        Libro de condolencias
      </h2>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[8rem]">
        {condolencias.length === 0 && (
          <p className="text-xs text-ink-dim/60 italic">
            Nadie ha firmado todavía. Sé el primero en decir algo.
          </p>
        )}
        {condolencias.map((c) => (
          <div key={c.id} className="text-sm leading-snug">
            <span className="text-candle/80 text-xs">{c.nombre}</span>
            <p className="text-ink/85">{c.texto}</p>
          </div>
        ))}
        <div ref={finRef} />
      </div>

      <form onSubmit={firmar} className="p-3 border-t border-mourning shrink-0">
        <input
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          maxLength={200}
          placeholder="Deja unas palabras…"
          className="w-full bg-transparent border border-mourning px-3 py-2 text-sm text-ink placeholder:text-ink-dim/50 focus:outline-none focus:border-gold/50"
        />
      </form>
    </div>
  );
}
