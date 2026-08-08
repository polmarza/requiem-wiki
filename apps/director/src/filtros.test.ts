import { describe, expect, it } from "vitest";
import { filtrarBorrado, normalizarTitulo } from "./filtros.js";
import type { EventoBorrado } from "./tipos.js";

function evento(extra: Partial<EventoBorrado> = {}): EventoBorrado {
  return {
    meta: { id: "abc", domain: "es.wikipedia.org", dt: "2026-08-08T03:00:00Z" },
    database: "eswiki",
    page_title: "Garaje_Punk_de_Albacete",
    page_namespace: 0,
    page_is_redirect: false,
    comment: "A7: sin relevancia enciclopédica",
    performer: { user_text: "AdminX" },
    ...extra,
  };
}

describe("normalizarTitulo", () => {
  it("cambia guiones bajos por espacios", () => {
    expect(normalizarTitulo("Lista_de_cosas")).toBe("Lista de cosas");
  });
});

describe("filtrarBorrado", () => {
  it("acepta un artículo normal y lo normaliza", () => {
    const r = filtrarBorrado(evento());
    expect("difunto" in r).toBe(true);
    if (!("difunto" in r)) return;
    expect(r.difunto.titulo).toBe("Garaje Punk de Albacete");
    expect(r.difunto.causa).toBe("A7: sin relevancia enciclopédica");
    expect(r.difunto.esEspanol).toBe(true);
  });

  it("descarta namespaces que no son artículo", () => {
    const r = filtrarBorrado(evento({ page_namespace: 1 }));
    expect(r).toEqual({ descartado: "namespace 1" });
  });

  it("acepta borradores solo cuando se le pide", () => {
    const ev = evento({ page_namespace: 118, page_title: "Draft:OH!SOME" });
    expect("descartado" in filtrarBorrado(ev)).toBe(true);
    expect("difunto" in filtrarBorrado(ev, { aceptarBorradores: true })).toBe(true);
  });

  it("descarta los eventos canary de comprobación de salud del stream", () => {
    const ev = evento({
      meta: { id: "x", domain: "canary", dt: "2026-08-08T03:00:00Z" },
      page_title: "example page title",
      comment: "",
    });
    expect(filtrarBorrado(ev)).toEqual({
      descartado: "evento canary (no es un borrado real)",
    });
  });

  it("descarta redirects", () => {
    expect(filtrarBorrado(evento({ page_is_redirect: true }))).toEqual({
      descartado: "es redirect",
    });
  });

  it("descarta títulos ofensivos o de prueba", () => {
    expect("descartado" in filtrarBorrado(evento({ page_title: "Pepito_es_gilipollas" }))).toBe(true);
    expect("descartado" in filtrarBorrado(evento({ page_title: "asdfasdf" }))).toBe(true);
  });

  it("descarta borrados marcados como biografía sensible", () => {
    const r = filtrarBorrado(evento({ comment: "G10: attack page on a living person, BLP violation" }));
    expect(r).toEqual({ descartado: "posible biografía sensible" });
  });

  it("descarta títulos que parecen nombres de persona", () => {
    expect(filtrarBorrado(evento({ page_title: "María_Fernández_Gómez" }))).toEqual({
      descartado: "parece nombre de persona",
    });
  });

  it("no confunde un título largo con un nombre propio", () => {
    const r = filtrarBorrado(evento({ page_title: "Lista_de_personajes_menores_de_Fringe" }));
    expect("difunto" in r).toBe(true);
  });

  it("sobrevive a un evento sin causa ni admin", () => {
    const r = filtrarBorrado(evento({ comment: "", performer: undefined }));
    if (!("difunto" in r)) throw new Error("debería aceptarse");
    expect(r.difunto.causa).toBe("Sin causa declarada");
    expect(r.difunto.admin).toBe("un administrador");
  });
});
