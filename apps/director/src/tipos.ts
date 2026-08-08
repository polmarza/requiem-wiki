/** Un artículo borrado, ya normalizado desde el evento crudo de Wikimedia. */
export interface Difunto {
  id: string;
  titulo: string;
  wiki: string;
  dominio: string;
  ns: number;
  causa: string;
  admin: string;
  horaMuerte: string;
  esEspanol: boolean;
}

export type FaseCeremonia =
  | "espera"
  | "procesion"
  | "elegia"
  | "duelo"
  | "cierre";

/** Estado canónico del funeral que el director publica a todos los dolientes. */
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

/** Evento crudo del stream page-delete de Wikimedia (solo los campos que usamos). */
export interface EventoBorrado {
  meta?: { id?: string; domain?: string; dt?: string };
  database?: string;
  page_title?: string;
  page_namespace?: number;
  page_is_redirect?: boolean;
  comment?: string;
  performer?: { user_text?: string };
}
