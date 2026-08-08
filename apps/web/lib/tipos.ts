export type FaseCeremonia =
  | "espera"
  | "procesion"
  | "elegia"
  | "duelo"
  | "cierre";

export interface EstadoFuneral {
  id: string | null;
  fase: FaseCeremonia;
  titulo: string | null;
  wiki: string | null;
  dominio: string | null;
  causa: string | null;
  horaMuerte: string | null;
  colaTamano: number;
  veladosHoy: number;
}

export const ESTADO_INICIAL: EstadoFuneral = {
  id: null,
  fase: "espera",
  titulo: null,
  wiki: null,
  dominio: null,
  causa: null,
  horaMuerte: null,
  colaTamano: 0,
  veladosHoy: 0,
};

export type TipoReaccion = "flor" | "vela" | "rezo";

export interface Reaccion {
  tipo: TipoReaccion;
  x: number;
}
