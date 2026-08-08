import Anthropic from "@anthropic-ai/sdk";
import type { Difunto } from "./tipos.js";

const SISTEMA = `Traduces al español, con tono de registro civil — seco, técnico, sin
adornos ni compasión —, la causa administrativa de un borrado de Wikipedia. No eres
el oficiante: eres el funcionario que rellenó el formulario.

Reglas:
- Devuelve solo la traducción, sin comillas ni explicaciones ni notas.
- Cualquier fragmento entre corchetes dobles, [[así]] o [[así|así]], se copia BYTE A
  BYTE, sin traducir ni tocar ni una letra dentro de los corchetes: son enlaces reales
  del registro de Wikipedia y hay que conservarlos intactos para que seguir siendo
  clicables tenga sentido.
- Traduce todo el texto que quede fuera de esos corchetes a español neutro, incluida
  la jerga de borrado (abandoned draft, non-notable, expired PROD, foreign-language
  article...). Los códigos cortos que ya son casi universales en Wikipedia (G13, A7,
  CSD, PROD, RfD) puedes dejarlos tal cual si no tienen traducción natural.
- Si el texto ya está en español, corrígelo solo si hace falta y devuélvelo igual.
- Una sola línea. No añadas nada que no estuviera ya en el original.`;

/** Sin traducción disponible, se muestra la causa tal cual llegó del registro. */
export async function traducirCausa(difunto: Difunto): Promise<string> {
  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave || !difunto.causa) return difunto.causa;

  const anthropic = new Anthropic({ apiKey: clave });

  try {
    const respuesta = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: SISTEMA,
      messages: [{ role: "user", content: difunto.causa }],
    });

    const bloque = respuesta.content.find((b) => b.type === "text");
    const texto = bloque && bloque.type === "text" ? bloque.text.trim() : "";
    return texto || difunto.causa;
  } catch (err) {
    console.warn("[causa] traducción falló, se muestra el original:", err);
    return difunto.causa;
  }
}
