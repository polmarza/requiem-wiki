# Hackathon brief — The Realtime Hackathon (Portal)

Documento de referencia con las bases del hackathon y las notas tomadas durante la
presentación. Sirve de contexto para las decisiones de producto que se tomen en
`prd.md`, `business.md` y `architecture.md` una vez elijamos qué construir.

Fuente: https://hack.useportal.co/terms

---

## Fechas y plazos

- **Duración:** 39 horas, online. 7–9 de agosto de 2026.
- **Ventana de commits válida:** 7 de agosto 19:00 UTC-5 → 9 de agosto 10:00 UTC-5.
- **Deadline de entrega:** domingo 9 de agosto de 2026, 10:00 UTC-5.
- **Presentación final:** 9 de agosto, 19:00 UTC-5.

> Solo cuentan los commits hechos dentro de la ventana oficial — es uno de los criterios
> de evaluación. No tiene sentido traer código previo.

---

## Equipo

- Individual o en equipo de hasta 4 personas.
- Participantes de Latinoamérica y del resto del mundo.
- Perfil esperado: diseñadores, developers y product creators.

---

## Requisitos obligatorios del proyecto

1. **Capacidad de IA** integrada de forma real (no un plugin cosmético).
2. **Interacción significativa en tiempo real impulsada por Portal** — tiene que ser
   parte importante de la experiencia, no un añadido.
3. Producto **funcional**, no solo un concepto o mockup.
4. **Repositorio público en GitHub.**
5. **Versión desplegada** (demo en vivo, no solo local).
6. **Sincronización en tiempo real** entre usuarios, clientes de software, agentes o
   fuentes de datos en vivo independientes.
7. Idioma del proyecto y de la demo: **español o inglés**.

---

## Qué ofrece Portal (la plataforma sobre la que se construye)

- Chat en vivo
- Indicadores de presencia
- Cursores colaborativos
- Tracking de actividad de agentes
- Monitorización de ubicación
- Reacciones de audiencia
- Notificaciones
- Sincronización entre usuarios / agentes / apps

Portal es el motor de tiempo real: la idea del proyecto tiene que apoyarse en estas
piezas, no reinventarlas con un WebSocket propio.

---

## Entrega (Google Form oficial)

- Nombre del equipo y de cada integrante
- Usuario de Discord (al menos un contacto)
- Pitch del producto (máx. 280 caracteres)
- URL de demo en vivo (funcional)
- Vídeo de demo grabado (máx. 90 segundos)
- URL del repositorio de GitHub
- Explicación de cómo se usó Portal

---

## Criterios de evaluación

- Calidad de la integración con Portal (debe ser parte central de la experiencia)
- Commits dentro de la ventana horaria oficial
- Producto funcional demostrable
- Cómo de significativa es la interacción en tiempo real que habilita Portal

---

## Premios

- Total: **US$800**
- 1er puesto: **US$500**
- 2do puesto: **US$300**

---

## Ideas de referencia (de las bases, no vinculantes)

Espacios de trabajo multijugador, centros de operaciones con IA, canvas colaborativos,
mapas en vivo, streams interactivos, voz en tiempo real, juegos, experimentos sociales
novedosos — cualquier cosa con interacción en tiempo real significativa.

---

## Notas tomadas durante la presentación (brief del organizador)

> "Algo que se sienta vivo, data que se sienta real, carros moviéndose, chats en donde
> las personas interactúen, que se sientan dinámicas, datos cambiando en tiempo real.
> Ser creativo, que además de realtime tenga algo de IA. Tiene que ser un proyecto con
> impacto, pero que también tenga efecto wow."

Lectura de este brief:
- **"Que se sienta vivo"** → prioriza señales de movimiento/cambio continuo visibles
  (posiciones, contadores, estados) por encima de datos estáticos que se refrescan.
- **Impacto + efecto wow** → el juez recuerda un problema real resuelto, pero lo que
  engancha en 90 segundos de vídeo es lo visual: movimiento, IA generando algo delante
  de la cámara, varias personas/agentes interactuando a la vez.
- IA no puede ser decorativa: debe hacer algo que cambie el estado en tiempo real
  (generar, decidir, clasificar, responder) — no solo un chatbot de ayuda aparte.

---

## Restricciones que esto impone al proyecto

- **Tiempo:** ~30h reales de las 39h de ventana → MVP muy acotado, sin margen para
  infraestructura propia de tiempo real (usar Portal, no reinventar).
- **Demo-first:** todo lo que no se vea en 90 segundos de vídeo no puntúa igual que lo
  que sí se ve. Priorizar lo demostrable visualmente.
- **Despliegue obligatorio:** hay que reservar tiempo para desplegar, no dejarlo para
  el final.
- **Portal como dependencia central:** cualquier decisión de arquitectura debe partir
  de qué primitivas de Portal (chat, presencia, cursores, agentes, ubicación,
  reacciones, notificaciones) usa el proyecto, no al revés.
