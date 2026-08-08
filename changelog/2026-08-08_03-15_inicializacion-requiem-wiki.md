# Inicialización del proyecto Réquiem.wiki

**Fecha:** 2026-08-08 03:15
**Tipo:** Configuración

## Qué se hizo

Se convirtió la plantilla en el repositorio del proyecto real: **Réquiem.wiki**, la
capilla funeraria digital que vela en directo cada artículo que Wikipedia borra,
construida para The Realtime Hackathon (Portal, 7–9 agosto 2026).

- Documentadas las bases del hackathon y el brief del organizador (`docs/hackathon-brief.md`).
- Rellenada toda la documentación de `docs/`: PRD (MoSCoW), business, design system
  (capilla de madrugada), arquitectura (Next.js + Portal + Claude + Wikimedia
  EventStreams + Supabase, con director de ceremonias como proceso long-lived),
  data model (contrato Portal + tabla `funerales`), user flows, roadmap por fases
  contra reloj y estrategia de testing mínima.
- Verificado en vivo el stream `page-delete` de Wikimedia (~4 borrados/min, ~1/min de
  artículos ns=0) y la doc real de Portal (paquetes `@portalsdk/*`, publicación
  server-side vía REST, auth anónima, límites).
- Reescritos `README.md` y `CLAUDE.md` para el proyecto; `LICENSE` con autor real;
  `.env.example` con las variables del stack.
- MCPs: Supabase y Vercel ya disponibles a nivel global del usuario; Portal no tiene
  MCP oficial (verificado). No se añadió ninguno de alcance proyecto.
- Limpiados `changelog/` y `mejoras/backlog.md` (con dos primeras ideas reales);
  eliminada `.template/` y el comando `/init-proyecto`.

## Qué se modificó

- `docs/*` (los 9 archivos)
- `README.md`, `CLAUDE.md`, `LICENSE`, `.env.example`
- `changelog/README.md`, `mejoras/backlog.md`
- Eliminados: `.template/`, `.claude/commands/init-proyecto.md`

## Por qué

Arranque del proyecto del hackathon: la documentación completa permite a cualquier
agente de código trabajar con todo el contexto durante la carrera de ~24h. La entrega
es el 9 de agosto a las 10:00 UTC-5.
