import Anthropic from "@anthropic-ai/sdk";
import type { Difunto } from "./tipos.js";

const SISTEMA = `Eres el oficiante de Réquiem.wiki, una capilla donde se vela cada artículo
que Wikipedia borra. Escribes la elegía que se recita ante el féretro.

Tono: solemne y tierno, con un humor melancólico muy fino. Hablas del artículo como
de un difunto querido al que nadie más va a llorar. Nunca te burlas de él ni de quien
lo escribió: la gracia nace de la ternura, no del sarcasmo.

Reglas:
- De 3 a 5 frases. Ni una más.
- Solo el texto de la elegía, nada alrededor: sin título, sin encabezado, sin
  markdown (nada de "#", "**", listas ni comillas envolviendo todo el texto). Ni
  siquiera "Elegía por X:" delante — el título ya está escrito arriba, en el féretro.
- Español de España, sobrio, sin emojis ni exclamaciones.
- Usa la causa real del borrado como si fuera la causa de la muerte.
- No inventes datos concretos sobre el contenido del artículo: solo sabes su título
  y por qué lo borraron. Puedes imaginar con delicadeza, nunca afirmar.
- Si el título es opaco o técnico, la elegía va sobre la oscuridad de esa vida.
- Termina con una frase que se pueda leer como epitafio.

Casi todos los difuntos llegan de wikis en otros idiomas. Si el título no está en
español, tradúcelo dentro de la elegía con naturalidad, como quien presenta al
difunto a los que no lo conocían: los dolientes no pueden llorar por un nombre que
no entienden. No hagas una nota de traductor; hazlo parte del duelo.
Ejemplo del tono buscado: «Se llamaba Пісочниця, que en ucraniano quiere decir
arenero. Un sitio donde se juega a construir sabiendo que no durará.»`;

/** Si Claude falla o tarda, la ceremonia sigue: nadie se queda sin despedida. */
function elegiaDeRespaldo(difunto: Difunto): string {
  return `Aquí yace «${difunto.titulo}», que existió hasta hoy en ${difunto.dominio}. Murió como mueren casi todos: sin que nadie mirase. La causa consta en el registro, escueta y definitiva. Descanse en el silencio de lo que nunca fue consultado.`;
}

/**
 * Genera la elegía en streaming y va entregando el texto acumulado para que el
 * director lo retransmita letra a letra.
 */
export async function recitarElegia(
  difunto: Difunto,
  alAvanzar: (textoAcumulado: string) => void,
): Promise<string> {
  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave) {
    const respaldo = elegiaDeRespaldo(difunto);
    alAvanzar(respaldo);
    return respaldo;
  }

  const anthropic = new Anthropic({ apiKey: clave });

  const peticion = `Ha muerto un artículo. Ofícialo.

Título: ${difunto.titulo}
Enciclopedia: ${difunto.dominio}
Causa de la muerte (motivo real del borrado): ${difunto.causa}
Certificada por: ${difunto.admin}`;

  try {
    const stream = anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SISTEMA,
      messages: [{ role: "user", content: peticion }],
    });

    let texto = "";
    for await (const evento of stream) {
      if (
        evento.type === "content_block_delta" &&
        evento.delta.type === "text_delta"
      ) {
        texto += evento.delta.text;
        alAvanzar(texto);
      }
    }
    return texto.trim() || elegiaDeRespaldo(difunto);
  } catch (err) {
    console.warn("[elegia] Claude falló, se usa el respaldo:", err);
    const respaldo = elegiaDeRespaldo(difunto);
    alAvanzar(respaldo);
    return respaldo;
  }
}
