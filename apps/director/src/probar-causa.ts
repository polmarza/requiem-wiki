/**
 * Herramienta de diagnóstico para calibrar el prompt de traducción de causas.
 *
 *   pnpm --filter director exec tsx src/probar-causa.ts
 */
import { traducirCausa } from "./causa.js";

const casos = [
  {
    titulo: "Draft:Toi Time",
    causa:
      "[[WP:CSD#G13|G13]]: Abandoned draft or AfC submission – If you wish to retrieve it, please see [[WP:REFUND/G13]]",
  },
  {
    titulo: "Место злочина",
    causa: "Избрисано ради ослобађања места за премештање из „[[Место злочина (ТВ серија)]]”",
  },
  {
    titulo: "チェンタウロRGO",
    causa: "独立記事作成の目安に合致しないページ: [[Wikipedia:削除依頼/チェンタウロRGO]]",
  },
  {
    titulo: "Q140917696",
    causa: "Does not meet the notability policy: [[WP:RfD|RfD]]: Walled garden for [[Q140917732]].",
  },
];

for (const caso of casos) {
  const traducida = await traducirCausa({
    id: "test",
    titulo: caso.titulo,
    wiki: "test",
    dominio: "test",
    ns: 0,
    causa: caso.causa,
    admin: "test",
    horaMuerte: new Date().toISOString(),
    esEspanol: false,
  });
  console.log(`\n«${caso.titulo}»`);
  console.log(`  original:   ${caso.causa}`);
  console.log(`  traducida:  ${traducida}`);
}
