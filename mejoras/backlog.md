# Backlog de mejoras

Ideas de mejora que no entran ahora pero que no queremos perder. No es un compromiso,
es un repositorio de ideas.

---

## Formato de entrada

```
### [MEJORA-XX] Título de la idea
**Área:** Frontend / Backend / UX / Infraestructura / Negocio
**Prioridad estimada:** Alta / Media / Baja
**Origen:** De dónde salió la idea (conversación, feedback de usuario, etc.)

Descripción breve de la mejora y por qué aportaría valor.
```

---

### [MEJORA-01] Velatorio de datos white-label
**Área:** Negocio
**Prioridad estimada:** Baja
**Origen:** Definición del proyecto (business.md)

El formato "velatorio de X que muere en vivo" es reutilizable con otras fuentes:
dominios caducados, repos archivados de GitHub, tweets borrados. Post-hackathon.

### [MEJORA-02] Salas por idioma
**Área:** Frontend / Backend
**Prioridad estimada:** Baja
**Origen:** Decisión de arquitectura (canal único `capilla`)

Si el canal global se quedara pequeño o el público lo pidiera, capillas por idioma
(es, en, fr…) filtrando el stream por wiki de origen.

### [MEJORA-03] Archivar flores y dolientes reales por funeral
**Área:** Backend
**Prioridad estimada:** Media
**Origen:** Implementación de `archivo.ts` (2026-08-08)

El director solo publica en el canal de Portal, no lo escucha, así que
`funerales.flores` y `funerales.dolientes_max` se archivan siempre a 0. Para
contarlos de verdad el director tendría que suscribirse también al canal
`capilla` (o leer un resumen que el propio canal exponga) y acumular por
`funeralId` mientras dura el duelo.
