import { createClient } from "@supabase/supabase-js";
import type { Difunto } from "./tipos.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Sin Supabase configurado, el archivo simplemente no escribe: la ceremonia no depende de él. */
const supabase = url && clave ? createClient(url, clave) : null;

interface DatosArchivo {
  difunto: Difunto;
  elegia: string;
  flores: number;
  dolientesMax: number;
  ensayo?: boolean;
}

export async function archivarFuneral(datos: DatosArchivo): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("funerales").insert({
    id: datos.difunto.id,
    wiki: datos.difunto.wiki,
    dominio: datos.difunto.dominio,
    titulo: datos.difunto.titulo,
    ns: datos.difunto.ns,
    causa: datos.difunto.causa,
    usuario_admin: datos.difunto.admin,
    hora_muerte: datos.difunto.horaMuerte,
    elegia: datos.elegia,
    flores: datos.flores,
    dolientes_max: datos.dolientesMax,
    ensayo: datos.ensayo ?? false,
  });

  if (error) {
    // Un difunto no archivado no es tragedia: ya fue velado en vivo, que es lo
    // que importa. Solo lo perdemos del cementerio histórico.
    console.warn(`[archivo] no se pudo archivar «${datos.difunto.titulo}»:`, error.message);
  }
}
