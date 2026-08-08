# Roadmap — Réquiem.wiki

Horizonte único: la ventana del hackathon. Deadline de entrega: **domingo 9 de agosto
de 2026, 10:00 UTC-5**. Todos los commits deben caer dentro de la ventana oficial.

El plan asume ~24h de trabajo efectivo desde ahora (madrugada del 8) hasta la entrega,
con margen para dormir algo. Regla de oro: **desplegar desde la hora 0 y en continuo** —
el deploy no es una fase final, es el estado permanente del proyecto.

---

## Fase 0 — Cimientos y riesgo fuera (primeras ~3h)

Objetivo: matar las dos incógnitas (Portal y stream) antes de construir nada bonito.

- [ ] Scaffold Next.js + deploy inicial en Vercel (hola-capilla en producción).
- [ ] Spike Portal: proyecto creado, SDK integrado, presencia + estado sincronizado
      funcionando entre dos navegadores. **Si Portal falla aquí, replanteamos ya.**
- [ ] Consumidor del stream `page-delete` de Wikimedia con filtro (ns=0, no redirects,
      filtro de sensibilidad) y cola amortiguadora.
- [ ] Elegía por Claude API en streaming (prompt v1) desde el servidor.

**Hito de fase:** un borrado real de Wikipedia llega y su elegía se genera, visible en
dos navegadores a la vez. Feo, pero vivo.

## Fase 1 — El funeral completo (siguientes ~6h)

Objetivo: el bucle central del producto, de punta a punta.

- [ ] Director de ceremonias (servidor): saca de la cola, marca el funeral activo,
      pide la elegía, publica estado canónico vía Portal, temporiza el duelo (~45s),
      pasa al siguiente.
- [ ] Escena de la capilla: féretro con título/wiki/causa real, entrada procesional,
      elegía escribiéndose letra a letra sincronizada.
- [ ] Velas de presencia con nombre (entrada "Enciende tu vela").
- [ ] Reacciones-flores cayendo sobre el féretro en todas las pantallas.
- [ ] Libro de condolencias (chat).

**Hito de fase:** MVP completo desplegado — cumple ya todos los MUST del PRD salvo
pulido. A partir de aquí, todo es mejora.

## Fase 2 — Alma y liturgia (siguientes ~5h)

- [ ] Dirección de arte completa (paleta, Cormorant, llamas animadas, procesión).
- [ ] Campana + órgano ambiental con mute.
- [ ] Cola de difuntos visible + contador del día.
- [ ] Notificación "Ha muerto un artículo en español".
- [ ] Persistencia de funerales (archivo de muertos del día) para el contador y el
      obituario.
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
