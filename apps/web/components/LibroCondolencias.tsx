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
  deshabilitado?: boolean;
}

export function LibroCondolencias({ condolencias, alFirmar, deshabilitado }: Props) {
  const [borrador, setBorrador] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [condolencias.length]);

  function alTeclear(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const texto = borrador.trim().slice(0, 200);
    if (!texto) return;
    alFirmar(texto);
    setBorrador("");
  }

  return (
    <div className="flex flex-col h-full border-t lg:border-t-0 lg:border-l border-linea bg-sidebar-bg">
      <div className="px-[18px] py-3.5 pb-2.5 text-[9px] tracking-[0.22em] text-ink-faint border-b border-linea">
        LIBRO DE CONDOLENCIAS
      </div>

      <div className="flex-1 overflow-y-auto px-[18px] py-3 flex flex-col gap-3 min-h-[120px]">
        {condolencias.length === 0 && (
          <p className="text-xs text-ink-faint italic">
            Nadie ha firmado todavía. Sé el primero en decir algo.
          </p>
        )}
        {condolencias.map((c) => (
          <div key={c.id}>
            <div className="text-[10px] text-gold tracking-[0.04em]">{c.nombre}</div>
            <div className="font-lapida italic text-base leading-[1.5] text-ink text-pretty">
              {c.texto}
            </div>
          </div>
        ))}
        <div ref={finRef} />
      </div>

      <div className="p-3.5 pt-3 border-t border-linea">
        <input
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          onKeyDown={alTeclear}
          maxLength={200}
          disabled={deshabilitado}
          placeholder="Firma el libro…"
          className="w-full min-h-11 bg-bg-raised border border-mourning rounded-lg px-3.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink disabled:opacity-40"
        />
      </div>
    </div>
  );
}
