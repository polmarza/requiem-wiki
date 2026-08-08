# Design System — Réquiem.wiki

La estética ES el producto: una esquela mortuoria impresa, viva. Todo lo visual debe
sostener la ficción de un periódico de esquelas que se actualiza solo, en directo —
solemne, tipográfico, con ternura melancólica. Nunca tétrico de película de terror,
nunca paródico.

**Origen de esta dirección:** se exploraron tres direcciones en Claude Design
("Capilla nocturna", oscura y de vela; "Rito digital"; "Esquela impresa") y se eligió
esta última — sustituye a una primera versión propia de capilla oscura que se
descartó por completo. El archivo fuente es el proyecto de Claude Design
`Capilla digital: tres direcciones vivas` (`Requiem-C-Esquela-impresa.dc.html`).

---

## Dirección de arte

**Concepto:** una esquela de periódico — papel color hueso, marco negro, tipografía
serif para lo humano y monoespaciada para lo administrativo. El féretro es la esquela
misma: un recuadro con marco negro sobre el papel, con la tipografía y el registro de
una nota necrológica real. Todo lo demás (velas, ofrendas, condolencias) es aparato
periodístico alrededor: cabecera, columnas, pie.

Referencias de sensación: esquela de periódico español, ficha de registro civil,
tipografía de máquina de escribir para los metadatos, serif clásica para los nombres.

**Anti-referencias:** Halloween, esqueletos, terror, gore, dark mode "gótico",
cualquier cosa que grite "broma".

---

## Paleta

Modo único (papel — es una esquela impresa, siempre de día):

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#e9e3d6` | Papel: fondo de toda la aplicación |
| `--bg-raised` | `#f2ecdf` | Superficies elevadas: interior de la esquela, inputs |
| `--sidebar-bg` | `#e2dbcb` | Fondo del libro de condolencias |
| `--ink` | `#211d17` | Texto principal, negro cálido; también el marco de la esquela |
| `--ink-dim` | `#5c554a` | Texto secundario: subtítulos, causa de la muerte |
| `--ink-faint` | `#a89e8c` | Texto terciario: etiquetas, metadatos, ".WIKI" |
| `--gold` | `#5c4a2e` | Acento: enlaces, causa resaltada, firma "gold" del texto |
| `--mourning` | `#c4baa6` | Bordes suaves: inputs, botones, tarjetas |
| `--linea` | `#d0c7b2` | Separadores del lateral de condolencias |
| `--rose` | `#7a3b3b` | La flor (❀) |
| `--live` | `#5e7a3d` | Indicador "en directo" |
| `--candle` / `--candle-deep` | `#e0a23d` / `#b06f1d` | Llama de vela (gradiente radial) |

Regla: nunca azules fríos ni negro puro de pantalla — todo el contraste sale de
tinta oscura cálida sobre papel claro, como una esquela real.

---

## Tipografía

- **Display / humano:** `Cormorant Garamond` (Google Fonts), 400–600, con itálica.
  Título del difunto, "D. E. P.", elegía, wordmark, libro de condolencias.
- **UI / administrativo:** `IBM Plex Mono`, 400/500. Cabecera, etiquetas en
  versalitas espaciadas ("CAUSA DE LA DEFUNCIÓN, SEGÚN EL REGISTRO"), botones,
  contadores, inputs. Es la voz del "registro civil" de la capilla — todo lo que no
  es la voz humana del oficiante o de los dolientes va en esta.
- La elegía se escribe letra a letra en Cormorant itálica: es la voz del oficiante,
  nunca en monoespaciada.

---

## Componentes clave

- **La esquela (féretro):** marco negro (`--ink`) de 6px envolviendo una tarjeta
  `--bg-raised` con borde `--ink`. Contenido: cruz †, título en Cormorant
  `clamp(24px,4.6vw,42px)`, "Falleció a las {hora} en {dominio}" en itálica, regla
  horizontal, etiqueta "CAUSA DE LA DEFUNCIÓN, SEGÚN EL REGISTRO", causa real con la
  sintaxis `[[wiki]]` parseada como enlaces (`--gold`, subrayado punteado), "D. E. P."
  espaciado, cierre "Sus dolientes, presentes en esta capilla, no lo olvidan.". Debajo
  y fuera del marco: la elegía, con etiqueta "ELEGÍA · escribiéndose ahora" mientras
  se escribe y un cursor parpadeante (`.pluma`).
- **Velas de presencia:** llama (radial-gradient `--candle`→`--candle-deep`) + palo +
  nombre en Plex Mono 9px. Con más de 12 dolientes, cambia a modo recuento: una sola
  llama + "N dolientes velan en este momento".
- **Ofrendas:** tres comportamientos distintos, no un genérico que cae:
  - Flor (❀, `--rose`): cae desde arriba con rotación (`caer`, 3.4s).
  - Rezo (✦, `--gold`): asciende desde abajo (`subir`, 3.2s).
  - Vela: un óvalo de llama que aparece, se sostiene y se apaga (`posarse`, 4.4s).
  Cada botón de ofrenda lleva un contador de lo llevado en el funeral actual.
- **Libro de condolencias:** panel lateral con fondo `--sidebar-bg`, mensajes en
  Cormorant itálica, sin avatares.
- **Cabecera:** wordmark "RÉQUIEM.WIKI" (el ".WIKI" en `--ink-faint`), tagline,
  fecha de hoy, indicador de conexión, "N velados hoy", "N almas esperan turno",
  botón de sonido.
- **Estado de espera:** cruz atenuada + "La capilla está en silencio." + contador de
  segundos desde el último funeral, para que la ausencia también se sienta viva.
- **Conexión degradada:** aviso banda superior + inputs/botones deshabilitados al 35%
  de opacidad — se sigue viendo el funeral, no se puede participar.
- **Necrológica en tu idioma:** toast invertido (fondo `--ink`, texto `--bg-raised`)
  fijo arriba, única superficie oscura de toda la interfaz — un inserto de última hora.

---

## Movimiento y sonido

- Movimiento procesional (2.4–4.4s, easing suave), nunca rebota.
- La elegía se escribe a ritmo de lectura, sincronizada para todos vía Portal.
- **Campana:** acorde de tres notas (392/587.3/784 Hz, seno, caída exponencial a 4s)
  al entrar un féretro nuevo. **Ofrenda propia:** un "ding" breve (1174 Hz, 0.8s).
  Ambos en `lib/campanas.ts`, sintetizados con WebAudio, sin archivos de audio ni
  ambiente de fondo — el sonido es puntual, no una atmósfera continua. El toggle
  "sonido · on/off" en la cabecera controla ambos.

---

## Voz y microcopy

- Registro formal de esquela, con ternura melancólica, nunca burla:
  - Entrada: "Cada minuto, Wikipedia borra artículos para siempre. Aquí se les vela
    en directo, en el instante exacto de su muerte." → botón "Entrar a la capilla".
  - Vacío: "La capilla está en silencio." + "Ningún artículo ha muerto en los
    últimos instantes. La próxima esquela puede llegar en cualquier momento."
  - Notificación: "Ha muerto un artículo en tu idioma: «título»".
  - Duelo prolongado: "El velatorio se prolonga — se sigue velando al mismo difunto".
- Los nombres de doliente por defecto usan `#` (ASCII), no "nº": ver nota técnica.

---

## Responsive

- Móvil primero: la esquela ocupa el ancho, velas y ofrendas debajo, libro de
  condolencias apilado al final (la demo se graba con varios móviles a la vez).
- Desktop: esquela centrada a la izquierda, libro de condolencias como columna fija
  a la derecha (`lg:flex-row`).

---

## Nota técnica: Next.js 16 / Turbopack y caracteres no-ASCII

Se observó en desarrollo que un carácter especial (el ordinal "º", U+00BA) dentro de
un *template literal* de cliente aparecía corrompido en el navegador ("nÂº") pese a
que el archivo fuente estaba correctamente codificado en UTF-8 (verificado byte a
byte). No se confirmó la causa raíz — probablemente un detalle de la canalización de
Turbopack en esta versión muy reciente de Next.js (16.3, con menos de un mes de vida)
— pero el workaround aplicado fue simple: evitar ese carácter en cadenas generadas en
runtime y usar ASCII (`#` en vez de "nº"). El texto estático en JSX (acentos, "¿",
"«»", "†") no mostró el problema. Si reaparece con otro carácter, sospechar primero
de Turbopack antes que del propio código.
