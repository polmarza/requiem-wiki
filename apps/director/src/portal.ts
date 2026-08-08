const API = "https://api.useportal.co/v1";
const CANAL = "capilla";

/**
 * Publica en el canal como oficiante. Portal acepta un senderId arbitrario
 * cuando la petición va firmada con la clave secreta, así que el director
 * habla siempre con la misma voz.
 */
export async function publicar(
  type: string,
  content: unknown,
  opciones: { ephemeral?: boolean } = {},
): Promise<void> {
  const secreto = process.env.PORTAL_SECRET;
  if (!secreto) throw new Error("Falta PORTAL_SECRET");

  try {
    const res = await fetch(`${API}/channels/${CANAL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secreto}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: "oficiante",
        type,
        content,
        ...(opciones.ephemeral ? { ephemeral: true } : {}),
      }),
    });

    if (!res.ok) {
      console.warn(`[portal] ${type} → HTTP ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    // Que Portal falle un instante no puede detener la ceremonia.
    console.warn(`[portal] error publicando ${type}:`, err);
  }
}
