import type { Difunto, EventoBorrado } from "./tipos.js";

/**
 * Palabras que sugieren que el título es vandalismo u ofensa, no conocimiento.
 * No velamos insultos: rompen el tono y no hay nada que llorar ahí.
 */
const TITULOS_VETADOS = [
  "puta", "polla", "mierda", "gilipollas", "maricon", "coño",
  "fuck", "shit", "penis", "cock", "nigger", "faggot", "bitch",
  "asdf", "qwerty", "test page", "sandbox",
];

/**
 * Señales de que el artículo es la biografía de una persona real reciente.
 * Una elegía con humor sobre alguien que quizá acaba de morir de verdad es
 * exactamente el fallo que hunde el producto, así que ante la duda no se vela.
 */
const SENALES_BIOGRAFIA = [
  "biography of a living person",
  "blp",
  "persona viva",
  "recently deceased",
  "fallecido",
  "obituary",
  "g10", // Wikipedia: ataque a persona viva
];

/** Namespaces que aceptamos: 0 = artículo. 118 = borrador (solo en sequía). */
export const NS_ARTICULO = 0;
export const NS_BORRADOR = 118;

export function normalizarTitulo(titulo: string): string {
  return titulo.replace(/_/g, " ").trim();
}

function pareceNombrePropio(titulo: string): boolean {
  const palabras = normalizarTitulo(titulo).split(" ").filter(Boolean);
  if (palabras.length < 2 || palabras.length > 4) return false;
  // Dos a cuatro palabras, todas capitalizadas y sin cifras: casi siempre es
  // el nombre de una persona.
  return palabras.every((p) => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ'’-]+$/.test(p));
}

export interface OpcionesFiltro {
  /** En sequía aceptamos borradores abandonados para que la capilla no calle. */
  aceptarBorradores?: boolean;
}

/**
 * Decide si un borrado merece velatorio. Devuelve el difunto normalizado o
 * null con el motivo del descarte.
 */
export function filtrarBorrado(
  ev: EventoBorrado,
  opciones: OpcionesFiltro = {},
): { difunto: Difunto } | { descartado: string } {
  const ns = ev.page_namespace;
  const nsAceptados = opciones.aceptarBorradores
    ? [NS_ARTICULO, NS_BORRADOR]
    : [NS_ARTICULO];

  if (ns === undefined || !nsAceptados.includes(ns)) {
    return { descartado: `namespace ${ns}` };
  }
  if (ev.page_is_redirect) {
    return { descartado: "es redirect" };
  }
  if (!ev.page_title) {
    return { descartado: "sin título" };
  }

  const titulo = normalizarTitulo(ev.page_title);
  const tituloBajo = titulo.toLowerCase();
  const causa = (ev.comment ?? "").trim();
  const causaBaja = causa.toLowerCase();

  if (TITULOS_VETADOS.some((v) => tituloBajo.includes(v))) {
    return { descartado: "título vetado" };
  }
  if (SENALES_BIOGRAFIA.some((s) => causaBaja.includes(s))) {
    return { descartado: "posible biografía sensible" };
  }
  if (pareceNombrePropio(titulo)) {
    return { descartado: "parece nombre de persona" };
  }

  const wiki = ev.database ?? "desconocido";

  return {
    difunto: {
      id: ev.meta?.id ?? `${wiki}:${ev.page_title}:${ev.meta?.dt ?? Date.now()}`,
      titulo,
      wiki,
      dominio: ev.meta?.domain ?? `${wiki}.org`,
      ns,
      causa: causa || "Sin causa declarada",
      admin: ev.performer?.user_text ?? "un administrador",
      horaMuerte: ev.meta?.dt ?? new Date().toISOString(),
      esEspanol: wiki === "eswiki",
    },
  };
}
