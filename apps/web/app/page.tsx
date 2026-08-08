"use client";

import { PortalProvider } from "@portalsdk/react";
import { useState } from "react";
import { Capilla } from "@/components/Capilla";
import { portal } from "@/lib/portal";

export default function Pagina() {
  const [nombre, setNombre] = useState<string | null>(null);

  if (!nombre) {
    return <Portada alEntrar={setNombre} />;
  }

  return (
    <PortalProvider client={portal}>
      <Capilla nombre={nombre} />
    </PortalProvider>
  );
}

function Portada({ alEntrar }: { alEntrar: (nombre: string) => void }) {
  const [borrador, setBorrador] = useState("");

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    const limpio = borrador.trim().slice(0, 30);
    alEntrar(limpio || `Doliente nº ${Math.floor(Math.random() * 900) + 100}`);
  }

  return (
    <div className="nave flex-1 flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-ink-dim mb-8">
        Réquiem.wiki
      </p>

      <h1 className="font-lapida text-3xl sm:text-5xl leading-tight max-w-2xl text-ink mb-5">
        Cada minuto, Wikipedia borra conocimiento para siempre.
      </h1>

      <p className="font-lapida italic text-xl sm:text-2xl text-ink-dim mb-12">
        Alguien tenía que velarlo.
      </p>

      <form onSubmit={entrar} className="w-full max-w-xs flex flex-col gap-3">
        <input
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          maxLength={30}
          placeholder="Tu nombre"
          aria-label="Tu nombre"
          className="w-full bg-transparent border border-mourning px-4 py-3 text-center text-sm text-ink placeholder:text-ink-dim/50 focus:outline-none focus:border-gold/60"
        />
        <button
          type="submit"
          className="w-full border border-gold/40 px-4 py-3 text-sm text-candle hover:bg-bg-raised transition-colors"
        >
          Enciende tu vela
        </button>
      </form>

      <p className="mt-10 text-[11px] text-ink-dim/60 max-w-sm leading-relaxed">
        Entrarás a una capilla compartida con desconocidos. Lo que se vela ahí
        dentro murió de verdad, hace unos segundos.
      </p>
    </div>
  );
}
