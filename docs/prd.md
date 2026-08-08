# Product Requirements Document (PRD)

Proyecto para **The Realtime Hackathon** (Portal, 7–9 agosto 2026).
Contexto completo del hackathon en [hackathon-brief.md](hackathon-brief.md).

---

## Resumen ejecutivo

**Réquiem.wiki** es una capilla funeraria digital abierta 24/7 donde se vela, en directo,
cada artículo que Wikipedia borra en este preciso instante. El stream oficial de Wikimedia
(EventStreams) emite cada borrado en tiempo real: "Garaje Punk de Albacete", "Lista de
personajes menores de una serie cancelada", la biografía de alguien que no llegó a ser
notable. Cada muerte entra en la capilla como un féretro con el título del artículo y la
causa de defunción real escrita por el administrador que lo borró ("A7: sin relevancia
enciclopédica").

Una IA oficia el funeral: escribe una elegía única en streaming y la recita letra a letra,
sincronizada en las pantallas de todos los presentes. Los visitantes son los dolientes:
su presencia son velas encendidas en la capilla, sus reacciones son flores que caen sobre
el féretro, su chat es el libro de condolencias compartido.

Existe porque nadie mira el stream de Wikipedia y ve muerte en vez de datos. Es humor
negro con peso emocional real: ese artículo existía hace 40 segundos, alguien lo escribió
con ilusión, y tú eres literalmente la última persona del planeta que verá su nombre.

---

## Problema que resuelve

No resuelve un problema utilitario: crea un ritual. Cada minuto Wikipedia borra
conocimiento para siempre y nadie lo presencia — el borrado es un evento administrativo
invisible. Réquiem.wiki convierte ese momento en una experiencia colectiva: da testigo,
compañía y despedida a algo que desaparece sin que nadie lo mire.

En términos del hackathon: demuestra que el tiempo real (Portal) + IA pueden crear peso
emocional compartido a partir de un feed técnico — impacto cultural + efecto wow.

---

## Usuario objetivo

1. **El juez del hackathon** (usuario crítico real): entra, entiende el concepto en
   10 segundos, siente la presencia de otros, deja una flor, lo cuenta en la cena.
2. **El visitante curioso de internet**: llega por un enlace compartido, se queda más de
   lo que esperaba viendo morir artículos, participa en el libro de condolencias.
3. **El wikipedista / nostálgico digital**: le duele de verdad el borrado de conocimiento;
   es quien vuelve y comparte.

No hay registro ni cuentas: cualquiera entra y ya es un doliente con su vela.

---

## Funcionalidades core (MoSCoW)

### MUST
- **Stream de muertes real:** conexión a Wikimedia EventStreams (SSE público, sin API
  key), filtrando eventos de borrado de artículos. Reconexión automática.
- **La capilla:** escena única donde entra el féretro del artículo actual con título,
  wiki de origen, causa de borrado real y hora de la muerte.
- **Elegía por IA en streaming:** Claude genera una elegía de 4–6 frases con tono
  solemne-tierno (nunca burla), que se escribe en vivo letra a letra.
- **Funeral sincronizado (Portal):** todos los dolientes ven el mismo féretro y la misma
  elegía escribiéndose en el mismo instante (sync de estado).
- **Velas de presencia (Portal):** cada usuario conectado es una vela encendida con su
  nombre; al irse, su vela se apaga en la pantalla de todos.
- **Flores y reacciones (Portal):** reacciones de audiencia (flor, lágrima, amén) que
  caen sobre el féretro en tiempo real en todas las pantallas.
- **Libro de condolencias (Portal):** chat en vivo compartido de la capilla.
- **Filtro de sensibilidad:** excluir borrados de biografías de personas reales
  potencialmente sensibles (por namespace/categoría/heurística de título).
- **Desplegado y público:** demo en vivo + repo público en GitHub (requisito de bases).

### SHOULD
- **Cola de difuntos:** si mueren varios artículos seguidos, cola visible de féretros
  "esperando velatorio" — refuerza la sensación de flujo constante.
- **Contador del día:** "Hoy hemos velado N artículos."
- **Notificaciones (Portal):** "Ha muerto un artículo en español" cuando cae uno de
  es.wikipedia.
- **Sonido:** campana al entrar un féretro, órgano ambiental bajito (con mute).
- **Entrada como doliente:** elegir nombre (sin auth) antes de entrar a la capilla.

### COULD
- **El oficiante responde:** la IA contesta en el libro de condolencias como cura de la
  parroquia.
- **Obituario del día:** la IA compone al cierre el resumen de las 5 muertes más
  trágicas de la jornada.
- **El cementerio:** archivo navegable de funerales pasados con sus elegías.
- **TTS:** la elegía recitada con voz.

### WON'T (esta versión)
- Cuentas de usuario, login o perfiles persistentes.
- Interfaz multiidioma (interfaz y elegías en español; los artículos velados llegan de
  cualquier wiki).
- Apps móviles nativas (web responsive basta).
- Moderación avanzada del chat (filtro básico como mucho).
- Recuperación/undelete de artículos o interacción con Wikipedia más allá de leer el
  stream.

---

## Flujos de usuario principales

**Flujo del doliente:**
El usuario llega a la URL, ve una portada mínima ("Cada minuto, Wikipedia borra
conocimiento para siempre"), escribe su nombre y entra a la capilla. Su vela se enciende
en la pantalla de todos. Ve el féretro del artículo actual y la elegía escribiéndose en
vivo. Deja flores con un clic, escribe en el libro de condolencias. Cuando muere un nuevo
artículo, suena la campana y entra el siguiente féretro para todos a la vez.

**Flujo de la muerte (sistema):**
Wikimedia emite un evento de borrado → el servidor lo filtra (tipo, sensibilidad) y lo
encola → al tocar turno, el féretro entra en la capilla (estado sincronizado vía Portal)
→ se pide la elegía a Claude en streaming y se retransmite letra a letra a todos →
ventana de duelo (~40–60s) con reacciones y condolencias → el féretro sale, entra el
siguiente.

**Flujo de la demo (90s):**
Campana sobre negro → entra un féretro real con timestamp → elegía escribiéndose →
pantalla partida con 3 dispositivos dejando flores sincronizadas → notificación "ha
muerto un artículo en español" → contador del día → logo.

---

## Requisitos no funcionales

- **La capilla nunca puede estar vacía de contenido:** si el stream se corta o hay pocos
  borrados en ese momento, debe haber gestión elegante (cola amortiguadora, últimos
  funerales, "la capilla espera"). La demo no puede depender de la suerte del minuto.
- **Latencia percibida:** reacciones y velas deben sentirse instantáneas (<300ms
  percibidos); la elegía puede "pensarse" 2–3s porque es diegético (el cura medita).
- **Coste acotado:** una llamada corta a Claude por funeral; presupuesto trivial.
- **Responsive:** debe funcionar bien en móvil (la demo usa varios teléfonos).
- **Tono:** solemne-tierno con humor melancólico. Jamás mofa. Jamás ensañamiento con
  biografías de personas reales.
- **Sin datos personales:** solo nombre elegido libremente; nada persistente del usuario.

---

## Fuera de alcance (explícito)

- Cualquier funcionalidad de edición o restauración de artículos de Wikipedia.
- Monetización (ver business.md: es una pieza de hackathon/portfolio).
- Escalado más allá de una sala global única (una sola capilla compartida; sin salas
  privadas en esta versión).
- Soporte de navegadores antiguos.
