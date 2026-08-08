import { ColaDifuntos } from "./cola.js";
import { recitarElegia } from "./elegia.js";
import { publicar } from "./portal.js";
import type { Difunto, EstadoFuneral, FaseCeremonia } from "./tipos.js";

/** Duración de cada fase, en milisegundos. */
const PROCESION = 3_000;
const DUELO = 40_000;
const CIERRE = 2_500;
const ESPERA_SI_VACIA = 6_000;
/** Los chunks de elegía van ephemeral; sin throttle saturaríamos el canal. */
const THROTTLE_ELEGIA = 400;

function dormir(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Oficia funerales uno tras otro, sin parar, mientras haya difuntos. Publica en
 * cada cambio de fase el estado canónico para que cualquiera que llegue a mitad
 * de ceremonia se coloque en el punto exacto en que está la capilla.
 */
export class Ceremonia {
  #cola: ColaDifuntos;
  #veladosHoy = 0;
  #actual: Difunto | null = null;
  #fase: FaseCeremonia = "espera";
  #corriendo = false;

  constructor(cola: ColaDifuntos) {
    this.#cola = cola;
  }

  get sequia(): boolean {
    return this.#fase === "espera" && this.#cola.tamano === 0;
  }

  #estado(): EstadoFuneral {
    return {
      id: this.#actual?.id ?? null,
      fase: this.#fase,
      titulo: this.#actual?.titulo ?? null,
      wiki: this.#actual?.wiki ?? null,
      dominio: this.#actual?.dominio ?? null,
      causa: this.#actual?.causa ?? null,
      horaMuerte: this.#actual?.horaMuerte ?? null,
      colaTamano: this.#cola.tamano,
      veladosHoy: this.#veladosHoy,
    };
  }

  async #anunciar(fase: FaseCeremonia): Promise<void> {
    this.#fase = fase;
    await publicar("funeral.estado", this.#estado());
  }

  async arrancar(): Promise<void> {
    if (this.#corriendo) return;
    this.#corriendo = true;
    await this.#anunciar("espera");

    while (this.#corriendo) {
      const difunto = this.#cola.siguiente();

      if (!difunto) {
        if (this.#fase !== "espera") await this.#anunciar("espera");
        await dormir(ESPERA_SI_VACIA);
        continue;
      }

      await this.#oficiar(difunto);
    }
  }

  async #oficiar(difunto: Difunto): Promise<void> {
    this.#actual = difunto;
    console.log(`✝ Velando «${difunto.titulo}» (${difunto.dominio}) — ${difunto.causa}`);

    await this.#anunciar("procesion");
    if (difunto.esEspanol) {
      await publicar("necrologica.es", { titulo: difunto.titulo });
    }
    await dormir(PROCESION);

    await this.#anunciar("elegia");
    let ultimoEnvio = 0;
    const elegia = await recitarElegia(difunto, (texto) => {
      const ahora = Date.now();
      if (ahora - ultimoEnvio < THROTTLE_ELEGIA) return;
      ultimoEnvio = ahora;
      void publicar(
        "elegia.chunk",
        { funeralId: difunto.id, texto },
        { ephemeral: true },
      );
    });
    await publicar("elegia.completa", { funeralId: difunto.id, texto: elegia });

    await this.#anunciar("duelo");
    await dormir(DUELO);

    this.#veladosHoy++;
    await this.#anunciar("cierre");
    await dormir(CIERRE);

    this.#actual = null;
    this.#cola.purgarMemoria();
  }

  detener(): void {
    this.#corriendo = false;
  }
}
