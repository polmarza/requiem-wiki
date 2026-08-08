# Estrategia de testing — Réquiem.wiki

Contexto: hackathon de ~24h de código. La estrategia es deliberadamente mínima y
desequilibrada hacia la verificación manual de lo que se ve en la demo.

---

## Filosofía

Testeamos lo que puede arruinar la demo en vivo, nada más. Un test unitario de un
componente visual es tiempo robado al pulido de la capilla; un fallo silencioso en el
filtro de sensibilidad o en el parser del stream sí puede matar el producto delante de
un juez. Prioridad: (1) lógica pura de filtrado/cola, (2) smoke manual multi-dispositivo
constante, (3) nada más.

---

## Stack de testing

| Tipo | Herramienta |
|------|-------------|
| Unitario (lógica pura) | Vitest |
| Integración / E2E | Manual, protocolo de smoke abajo |

---

## Qué testear

### Sí testear (Vitest, rápido)
- Filtros del stream: namespace, redirects, dedupe por `meta.id`, filtro de
  sensibilidad (casos: biografía con fechas recientes, título ofensivo, título en
  alfabeto no latino, borrado masivo).
- Lógica de la cola de difuntos: orden, capado, relajación del filtro en sequía,
  "fosa común" en borrados masivos.
- Normalización de datos del evento (underscores→espacios, dominio, causa).
- Elegía de respaldo cuando Claude falla o excede timeout.

### No testear (o mockear)
- Componentes visuales y animaciones (se validan con los ojos).
- Portal y Claude API (integraciones de terceros; el spike de Fase 0 es su test).
- El stream real de Wikimedia (se testea el parser con eventos capturados en fixture).

---

## Protocolo de smoke manual (antes de cada hito y antes de entregar)

1. Dos navegadores + un móvil en la URL de producción a la vez.
2. Entrar con nombres distintos → las tres velas se ven en los tres dispositivos.
3. Esperar (o forzar en ensayo) un funeral → féretro y elegía sincronizados en los tres.
4. Flores desde el móvil → caen en los otros dos en <1s.
5. Condolencia desde un navegador → aparece en todos.
6. Cerrar una pestaña → su vela se apaga en las demás.
7. Matar la conexión (modo avión 10s) → reconecta y se realinea con el funeral en curso.

---

## Convenciones

- Archivos: `nombre.test.ts` junto al archivo que testea.
- Fixtures de eventos reales del stream en `src/lib/wikimedia/__fixtures__/`.

---

## Cobertura objetivo

Sin objetivo numérico. Cobertura al 100% de una sola cosa: la función de filtrado de
sensibilidad (es el riesgo reputacional del producto).

---

## Cómo correr los tests

```bash
pnpm test
```
