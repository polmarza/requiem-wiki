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
    const limpio = borrador.trim().slice(0, 24);
    alEntrar(limpio || `Doliente #${Math.floor(Math.random() * 90) + 10}`);
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-6 px-7 text-center"
      style={{
        background:
          "radial-gradient(900px 560px at 50% 20%, var(--bg-raised) 0%, #e5decf 62%)",
      }}
    >
      <div className="font-lapida text-[34px] leading-none text-ink">†</div>

      <h1 className="font-lapida text-[clamp(34px,6vw,52px)] tracking-[0.1em] text-ink">
        RÉQUIEM<span className="text-ink-faint">.WIKI</span>
      </h1>

      <p className="font-lapida italic text-[clamp(17px,2.6vw,21px)] leading-[1.7] text-[#453e33] max-w-[520px] text-balance">
        Cada minuto, Wikipedia borra artículos para siempre. Aquí se les vela
        en directo, en el instante exacto de su muerte.
      </p>

      <form onSubmit={entrar} className="flex flex-wrap justify-center gap-2.5 w-[min(440px,100%)]">
        <input
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          maxLength={24}
          placeholder="Tu nombre (opcional)"
          aria-label="Tu nombre"
          className="flex-1 basis-[220px] min-h-12 bg-bg-raised border border-mourning rounded-lg px-4 text-[13px] text-ink placeholder:text-ink-faint text-center focus:outline-none focus:border-ink"
        />
        <button
          type="submit"
          className="shrink-0 min-h-12 px-[26px] bg-ink border-none rounded-lg text-bg-raised text-[13px] font-medium hover:bg-[#37312a] active:scale-[.97] transition-colors"
        >
          Entrar a la capilla
        </button>
      </form>

      <p className="text-[10px] leading-[1.8] text-ink-faint max-w-[420px]">
        Compartirás sala con desconocidos.
        <br />
        Todo lo que aquí se vela murió de verdad hace unos segundos.
      </p>
    </div>
  );
}
