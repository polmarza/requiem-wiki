# Design System — Réquiem.wiki

La estética ES el producto: una capilla funeraria digital. Todo lo visual debe sostener
la ficción de velatorio con ternura melancólica — solemne pero cálido, nunca tétrico de
película de terror, nunca paródico.

---

## Dirección de arte

**Concepto:** capilla de madrugada. Oscuridad cálida iluminada por velas. El féretro es
el centro absoluto de la escena; todo lo demás (velas, flores, condolencias) orbita a su
alrededor. Silencio visual: pocas cosas, mucho aire.

Referencias de sensación: iglesia románica de noche, luto victoriano suavizado,
esquelas de periódico, lápidas con serif tallada.

**Anti-referencias:** Halloween, esqueletos, terror, gore, morado neón "spooky",
cualquier cosa que grite "broma".

---

## Paleta

Modo único (oscuro — es de noche en la capilla, siempre):

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#0d0b09` | Fondo de la capilla, casi negro cálido |
| `--bg-raised` | `#171310` | Superficies elevadas (féretro, paneles) |
| `--candle` | `#f5a623` → `#ffd9a0` | Llamas de vela (gradiente animado) |
| `--candle-glow` | `rgba(245,166,35,.14)` | Halos de luz de vela |
| `--ink` | `#e8e0d1` | Texto principal, blanco hueso |
| `--ink-dim` | `#8a8070` | Texto secundario, piedra |
| `--gold` | `#b08d3f` | Detalles litúrgicos: marcos, filos, ornamentos |
| `--mourning` | `#2b2320` | Bordes, separadores, madera oscura |
| `--rose` | `#c96f6f` | Flores, corazones de condolencia |
| `--live` | `#7da87b` | Indicador "en directo", verde apagado |

Regla: la luz siempre es cálida (ámbar de vela). Nada de azules fríos salvo, quizá, el
amanecer del "obituario del día".

---

## Tipografía

- **Display / títulos de féretro:** serif con carácter lapidario — `Cormorant Garamond`
  (Google Fonts) en pesos 500–600. Los títulos de artículos muertos van en esta, grandes,
  como nombre en una esquela.
- **Cuerpo / UI:** `Inter` 400/500 para condolencias, metadatos, controles.
- **Datos litúrgicos** (causa de muerte, timestamps, wiki de origen): `Inter` 400 en
  `--ink-dim`, tamaño pequeño, estilo ficha de registro civil.
- La elegía se escribe letra a letra en Cormorant itálica, tamaño medio-grande: es la
  voz del oficiante.

---

## Componentes clave

- **El féretro:** tarjeta central con marco `--gold` fino, título del artículo en
  Cormorant, "✝ es.wikipedia.org · 2019–2026" y la causa de defunción real citada.
  Entra con animación lenta (procesión, ~2s) y sale con fundido a negro.
- **Velas de presencia:** fila/borde inferior de velas, una por doliente, con llama
  animada (CSS) y nombre debajo en pequeño. Al conectarse: la vela se enciende
  (fade-in + flicker). Al irse: la llama se apaga con un hilo de humo.
- **Flores/reacciones:** al reaccionar, caen flores (🌹/🕯️/🙏 estilizados) sobre el
  féretro con física suave, visibles para todos a la vez.
- **Libro de condolencias:** panel lateral (drawer en móvil) con mensajes en tipografía
  de cuerpo; sin avatares, solo nombre + texto, como firmas en un libro.
- **Cola de difuntos:** silueta discreta de féretros esperando en el lateral, con
  contador ("3 almas esperan").
- **Contador del día:** numeral grande y sobrio: "Hoy hemos velado **1.247** artículos".

---

## Movimiento y sonido

- Todo movimiento es **lento y procesional** (600ms–2s, easing suave). Nada rebota.
- Las llamas parpadean sutilmente en bucle (CSS, no JS).
- La elegía se escribe a ritmo de lectura (~30–40ms/carácter), sincronizada para todos.
- **Campana** (una sola, grave) cuando entra un féretro. **Órgano ambiental** en bucle
  muy bajo, apagable; el botón de mute es visible desde el primer segundo (autoplay
  policies: el sonido arranca tras el primer gesto del usuario).

---

## Voz y microcopy

- El sistema habla como un oficiante sereno con humor melancólico fino:
  - Portada: "Cada minuto, Wikipedia borra conocimiento para siempre. Alguien tenía
    que velarlo."
  - Vacío entre funerales: "La capilla espera. Nadie ha muerto todavía."
  - Entrada: "Enciende tu vela" (input de nombre) → "Pasa, hay sitio."
  - Notificación: "Ha muerto un artículo en tu idioma."
- Jamás sarcasmo contra el difunto ni contra sus autores. El humor sale de la ternura
  ("Murió como vivió: sin fuentes fiables"), no de la burla.

---

## Responsive

- Móvil primero para dolientes (la demo usa varios teléfonos): féretro a pantalla
  completa, velas en el borde inferior, condolencias en drawer.
- Desktop: capilla amplia — féretro centrado, velas abajo, libro de condolencias a la
  derecha, cola de difuntos a la izquierda.
