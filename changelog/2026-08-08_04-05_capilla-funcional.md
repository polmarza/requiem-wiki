# Capilla funcional: director de ceremonias y velatorio en tiempo real

**Fecha:** 2026-08-08 04:05
**Tipo:** Feature

## Qué se hizo

Construido el bucle completo del producto, de punta a punta y verificado en vivo.

**Director de ceremonias (`apps/director`)**
- Consumidor del stream público `page-delete` de Wikimedia (SSE, sin API key).
- Filtros con 10 tests: descarta redirects, namespaces que no son artículo,
  títulos vandálicos/ofensivos, borrados marcados como biografía sensible y
  títulos que parecen nombres de persona. En sequía relaja el filtro para aceptar
  borradores abandonados y que la capilla no calle.
- Cola de difuntos con dedupe, capado a 12 y contador de "fosa común".
- Máquina de estados de la ceremonia: procesión → elegía → duelo → cierre, con
  publicación del estado canónico en Portal en cada cambio de fase.
- Elegías por Claude en streaming (Haiku 4.5) con elegía de respaldo local si la
  API falla o tarda.
- Herramienta de diagnóstico `medir-ritmo.ts` para calibrar cada cuánto entra un
  difunto que pase los filtros.

**Capilla (`apps/web`)**
- Portada ("Enciende tu vela") y escena de la capilla con féretro, causa de
  defunción real y elegía escribiéndose letra a letra.
- Velas de presencia por doliente, ofrendas efímeras (flor/vela/rezo) que caen
  sobre el féretro en todas las pantallas, y libro de condolencias.
- Campana y órgano sintetizados con WebAudio (sin archivos de audio).
- Dirección de arte del design system: paleta de capilla, Cormorant Garamond,
  animaciones procesionales.

## Qué se modificó

- `apps/director/src/*` (nuevo): tipos, filtros + tests, wikimedia, cola, portal,
  elegia, ceremonia, index, medir-ritmo
- `apps/web/app/*`: layout, page, globals.css
- `apps/web/components/*` (nuevo): Capilla, Feretro, Vela, Flores, LibroCondolencias
- `apps/web/lib/*` (nuevo): portal, tipos, campanas
- `docs/architecture.md`, `docs/design-system.md`
- `.mcp.json` (nuevo): MCP de Supabase a nivel proyecto

## Por qué

Es el MVP del hackathon. Se priorizó cerrar el bucle completo (muerte real →
elegía → duelo sincronizado) antes que pulir, porque los criterios de evaluación
premian un producto funcional con Portal en el centro de la experiencia.

**Hallazgo relevante:** el endpoint REST `/history` de Portal devuelve vacío pese a
que los mensajes publicados por HTTP reciben `seq`; el SDK sí entrega el historial
en su snapshot. Por eso el cliente deriva el estado del array `messages` y no del
callback `onMessage`, que solo dispara con mensajes nuevos y dejaría la capilla
vacía a quien entra a mitad de ceremonia.
