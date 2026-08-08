"use client";

import type { ReactNode } from "react";
import type { EstadoFuneral } from "@/lib/tipos";

interface Props {
  estado: EstadoFuneral;
  elegia: string;
  escribiendo: boolean;
  pensando: boolean;
  esperaSegundos: number;
}

function horaLegible(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("es-ES", { hour12: false });
  } catch {
    return "";
  }
}

/**
 * La causa de un borrado real trae sintaxis wiki: [[Enlace]] o [[Enlace|Etiqueta]].
 * Se muestra como en la propia Wikipedia: el enlace resaltado, sin corchetes.
 */
function nodosCausa(texto: string): ReactNode[] {
  const nodos: ReactNode[] = [];
  const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  let clave = 0;

  while ((m = re.exec(texto))) {
    if (m.index > ultimo) nodos.push(texto.slice(ultimo, m.index));
    nodos.push(
      <span key={clave++} className="text-gold border-b border-dotted border-gold/50">
        {m[2] || m[1]}
      </span>,
    );
    ultimo = re.lastIndex;
  }
  if (ultimo < texto.length) nodos.push(texto.slice(ultimo));
  return nodos;
}

export function Feretro({ estado, elegia, escribiendo, pensando, esperaSegundos }: Props) {
  if (estado.fase === "espera" || !estado.titulo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-[22px] text-center max-w-[440px] mx-auto">
        <div className="font-lapida text-[34px] text-ink-faint">†</div>
        <div className="font-lapida text-2xl text-ink-dim">
          La capilla está en silencio.
        </div>
        <div className="text-xs leading-[1.8] text-ink-dim">
          Ningún artículo ha muerto en los últimos instantes.
          <br />
          La próxima esquela puede llegar en cualquier momento.
        </div>
        <div className="text-[10px] tracking-[0.1em] text-ink-faint punto-vivo">
          esperando el stream de Wikimedia · último funeral hace {esperaSegundos} s
        </div>
      </div>
    );
  }

  // Cumplido el duelo mínimo, el féretro se queda mientras no haya relevo.
  const velandoSinRelevo = estado.fase === "duelo" && estado.colaTamano === 0;
  const hayElegia = elegia.length > 0;

  return (
    <div
      key={estado.id}
      className={`w-full ${estado.fase === "cierre" ? "sale-feretro" : "entra-feretro"}`}
    >
      <div className="w-full max-w-[620px] mx-auto bg-ink p-1.5 shadow-[0_18px_44px_-26px_rgba(33,29,23,.55)]">
        <div className="bg-bg-raised border border-ink px-7 sm:px-8 py-6 sm:py-7 text-center">
          <div className="font-lapida text-2xl leading-none text-ink">†</div>

          <h1 className="font-lapida font-medium text-[clamp(24px,4.6vw,42px)] leading-[1.18] my-3.5 text-ink text-balance break-words">
            {estado.titulo}
          </h1>

          <div className="font-lapida italic text-[15px] text-ink-dim mb-4.5">
            Falleció a las {horaLegible(estado.horaMuerte)} en {estado.dominio}
          </div>

          <div className="w-16 h-px bg-ink mx-auto mb-3.5" />

          <div className="text-[9px] tracking-[0.22em] text-ink-faint mb-2">
            CAUSA DE LA DEFUNCIÓN, SEGÚN EL REGISTRO
          </div>
          <div className="text-[11.5px] leading-[1.7] text-ink-dim max-w-[500px] mx-auto text-pretty">
            {nodosCausa(estado.causa ?? "")}
          </div>

          <div className="font-lapida text-[17px] tracking-[0.32em] mt-5 text-ink">
            D. E. P.
          </div>
          <div className="font-lapida italic text-[13px] text-ink-dim mt-1.5">
            Sus dolientes, presentes en esta capilla, no lo olvidan.
          </div>
        </div>
      </div>

      <div className="max-w-[560px] mx-auto mt-6 text-center min-h-[96px] px-1.5">
        {pensando && (
          <div className="text-[10px] tracking-[0.16em] text-ink-faint punto-vivo">
            LA OFICIANTE PREPARA LA ELEGÍA…
          </div>
        )}
        {hayElegia && (
          <>
            <div className="text-[9px] tracking-[0.22em] text-ink-faint mb-3">
              ELEGÍA
              {escribiendo && <span className="text-gold"> · escribiéndose ahora</span>}
            </div>
            <div className="font-lapida italic text-[19px] leading-[1.75] text-ink text-pretty">
              {elegia}
              {escribiendo && <span className="pluma" />}
            </div>
          </>
        )}
      </div>

      {velandoSinRelevo && (
        <div className="mt-4 mx-auto w-fit text-[10px] tracking-[0.08em] text-ink-faint border border-mourning rounded-full px-3.5 py-1.5">
          El velatorio se prolonga — se sigue velando al mismo difunto
        </div>
      )}
    </div>
  );
}
