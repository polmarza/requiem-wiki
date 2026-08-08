# Roadmap — Réquiem.wiki

Horizonte único: la ventana del hackathon. Deadline de entrega: **domingo 9 de agosto
de 2026, 10:00 UTC-5**. Todos los commits deben caer dentro de la ventana oficial.

El plan asume ~24h de trabajo efectivo desde ahora (madrugada del 8) hasta la entrega,
con margen para dormir algo. Regla de oro: **desplegar desde la hora 0 y en continuo** —
el deploy no es una fase final, es el estado permanente del proyecto.

---

## Fase 0 — Cimientos y riesgo fuera (primeras ~3h)

Objetivo: matar las dos incógnitas (Portal y stream) antes de construir nada bonito.

- [x] Scaffold Next.js + repo público. Deploy en Vercel: pendiente de OK explícito del
      usuario (se hace al final, según lo acordado).
- [x] Spike Portal: proyecto creado, SDK integrado, presencia + estado sincronizado
      funcionando entre dos navegadores. Verificado también servidor→cliente por REST.
- [x] Consumidor del stream `page-delete` de Wikimedia con filtro (ns=0, no redirects,
      filtro de sensibilidad, **eventos canary de comprobación de salud**) y cola
      amortiguadora.
- [x] Elegía por Claude API en streaming desde el servidor, con traducción de títulos
      no hispanos integrada en el propio duelo.

**Hito de fase:** un borrado real de Wikipedia llega y su elegía se genera, visible en
dos navegadores a la vez. Feo, pero vivo.

## Fase 1 — El funeral completo (siguientes ~6h)

Objetivo: el bucle central del producto, de punta a punta.

- [x] Director de ceremonias (servidor): saca de la cola, marca el funeral activo,
      pide la elegía, publica estado canónico vía Portal, temporiza el duelo (mínimo
      25s, se prolonga hasta 4 min si no hay relevo — el ritmo real medido de
      Wikimedia es más lento que un duelo fijo de 45s), pasa al siguiente.
- [x] Escena de la esquela: título/wiki/causa real (con sintaxis `[[wiki]]`
      parseada), entrada procesional, elegía escribiéndose letra a letra sincronizada.
- [x] Velas de presencia con nombre (entrada "Entrar a la capilla").
- [x] Ofrendas (flor/vela/rezo) cayendo/ascendiendo sobre la esquela en todas las
      pantallas, con contador por funeral.
- [x] Libro de condolencias (chat).

**Hito de fase:** MVP completo desplegado — cumple ya todos los MUST del PRD salvo
pulido. A partir de aquí, todo es mejora.

## Fase 2 — Alma y liturgia (siguientes ~5h)

- [x] Dirección de arte completa: rediseño "Esquela impresa" vía Claude Design
      (tres direcciones exploradas, esta elegida), implementado sobre la lógica de
      tiempo real ya existente.
- [x] Campana (acorde de tres notas) + "ding" en ofrenda propia, con toggle de
      sonido. (El diseño elegido no lleva órgano ambiental — se descartó al pasar de
      capilla oscura a esquela impresa.)
- [x] "N almas esperan turno" en cabecera (sustituye a la cola visible con iconos
      pensada originalmente) + contador del día.
- [x] Notificación "Ha muerto un artículo en español" (toast).
- [x] Persistencia de funerales en Supabase (`archivo.ts`, best-effort) — código
      listo; pendiente de que exista la tabla (`apps/director/migrations/001_funerales.sql`).
- [ ] Ajuste fino del prompt de la elegía con ≥20 borrados reales (tono, longitud,
      casos raros: títulos en otros alfabetos, vandalismo, páginas técnicas).

## Fase 3 — Entrega (últimas ~4h, con colchón)

- [ ] QA multi-dispositivo (2 móviles + desktop simultáneos).
- [ ] Endurecer reconexiones (stream caído, Portal reconectando, pestaña dormida).
- [ ] README del repo + explicación de uso de Portal (requisito del form).
- [ ] **Vídeo de 90s** según guion del PRD.
- [ ] Pitch de 280 caracteres + envío del Google Form oficial.
- [ ] `/security-review` antes del último merge.

## COULD (solo si la Fase 3 queda cerrada con margen)

- El oficiante responde en el libro de condolencias.
- Obituario del día (las 5 muertes más trágicas).
- El cementerio (archivo navegable de funerales).
- TTS de la elegía.

---

## Fuera del hackathon (registrado, no planificado)

Ver `mejoras/backlog.md` a partir de la entrega: white-label del formato "velatorio de
datos", donaciones, salas por idioma.
