import { Ceremonia } from "./ceremonia.js";
import { ColaDifuntos } from "./cola.js";
import { filtrarBorrado } from "./filtros.js";
import { escucharBorrados } from "./wikimedia.js";

const cola = new ColaDifuntos();
const ceremonia = new Ceremonia(cola);

console.log("✝ Réquiem.wiki — abriendo la capilla");

const cerrarStream = escucharBorrados((evento) => {
  // En sequía relajamos el filtro: mejor velar un borrador abandonado que
  // dejar la capilla muda delante de un juez.
  const resultado = filtrarBorrado(evento, {
    aceptarBorradores: ceremonia.sequia,
  });

  if ("difunto" in resultado) {
    if (cola.encolar(resultado.difunto)) {
      console.log(`+ En cola: «${resultado.difunto.titulo}» (${cola.tamano} esperando)`);
    }
  }
});

void ceremonia.arrancar();

function cerrar(): void {
  console.log("\n✝ Cerrando la capilla");
  ceremonia.detener();
  cerrarStream();
  process.exit(0);
}

process.on("SIGINT", cerrar);
process.on("SIGTERM", cerrar);
