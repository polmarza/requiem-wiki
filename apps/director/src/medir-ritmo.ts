/**
 * Herramienta de diagnóstico: mide cuántos borrados reales pasan los filtros y
 * por qué se descartan los demás. Sirve para calibrar el ritmo de la capilla.
 *
 *   pnpm --filter director exec tsx src/medir-ritmo.ts [segundos]
 */
import { filtrarBorrado } from "./filtros.js";
import { escucharBorrados } from "./wikimedia.js";

const SEGUNDOS = Number(process.argv[2] ?? 300);

let total = 0;
let aceptadosEstrictos = 0;
let aceptadosConBorradores = 0;
const motivos = new Map<string, number>();
const titulos: string[] = [];

const cerrar = escucharBorrados((ev) => {
  total++;

  const estricto = filtrarBorrado(ev);
  if ("difunto" in estricto) {
    aceptadosEstrictos++;
    titulos.push(`[artículo] ${estricto.difunto.titulo}`);
  } else {
    motivos.set(estricto.descartado, (motivos.get(estricto.descartado) ?? 0) + 1);
  }

  const relajado = filtrarBorrado(ev, { aceptarBorradores: true });
  if ("difunto" in relajado) {
    aceptadosConBorradores++;
    if (!("difunto" in estricto)) titulos.push(`[borrador] ${relajado.difunto.titulo}`);
  }
});

const inicio = Date.now();
console.log(`Midiendo el pulso de la muerte durante ${SEGUNDOS}s…\n`);

setTimeout(() => {
  cerrar();
  const minutos = (Date.now() - inicio) / 60000;

  console.log(`\n=== ${total} borrados en ${minutos.toFixed(1)} min ===`);
  console.log(`Aceptados (solo artículos): ${aceptadosEstrictos} → ${(aceptadosEstrictos / minutos).toFixed(1)}/min`);
  console.log(`Aceptados (con borradores): ${aceptadosConBorradores} → ${(aceptadosConBorradores / minutos).toFixed(1)}/min`);

  console.log("\nMotivos de descarte:");
  for (const [motivo, n] of [...motivos].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${motivo}`);
  }

  console.log("\nDifuntos que habrían sido velados:");
  for (const t of titulos.slice(0, 25)) console.log(`  · ${t}`);

  process.exit(0);
}, SEGUNDOS * 1000);
