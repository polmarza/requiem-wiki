import type { Difunto } from "./tipos.js";

/** Más allá de esto, la espera sería tan larga que el difunto ya no es noticia. */
const MAX_EN_COLA = 12;

/**
 * Cola de difuntos esperando velatorio. Amortigua las rachas (un admin que
 * borra treinta páginas de golpe) y las sequías: si no entra nada nuevo, la
 * capilla tiene reserva para seguir oficiando.
 */
export class ColaDifuntos {
  #cola: Difunto[] = [];
  #vistos = new Set<string>();
  /** Cuántos murieron sin velatorio individual por desbordamiento. */
  fosaComun = 0;

  encolar(difunto: Difunto): boolean {
    if (this.#vistos.has(difunto.id)) return false;
    this.#vistos.add(difunto.id);

    if (this.#cola.length >= MAX_EN_COLA) {
      this.fosaComun++;
      return false;
    }
    this.#cola.push(difunto);
    return true;
  }

  siguiente(): Difunto | null {
    return this.#cola.shift() ?? null;
  }

  get tamano(): number {
    return this.#cola.length;
  }

  /** El set de vistos no puede crecer sin fin en un proceso de días. */
  purgarMemoria(): void {
    if (this.#vistos.size > 5000) this.#vistos.clear();
  }
}
