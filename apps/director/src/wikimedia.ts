import { EventSource } from "eventsource";
import type { EventoBorrado } from "./tipos.js";

const STREAM_URL = "https://stream.wikimedia.org/v2/stream/page-delete";

/**
 * Escucha el stream público de borrados de Wikimedia. `eventsource` ya
 * reconecta solo con backoff y reenvía Last-Event-ID, así que no perdemos
 * muertes durante un corte breve.
 */
export function escucharBorrados(
  alBorrar: (ev: EventoBorrado) => void,
): () => void {
  const es = new EventSource(STREAM_URL);

  es.onmessage = (mensaje) => {
    try {
      alBorrar(JSON.parse(mensaje.data) as EventoBorrado);
    } catch {
      // Un evento malformado no puede tumbar la capilla.
    }
  };

  // Wikimedia cierra las conexiones ociosas cada pocos minutos; el reconectado
  // es rutina, no una avería, así que no lo anunciamos.
  es.onerror = () => {};

  return () => es.close();
}
