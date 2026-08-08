# Réquiem.wiki ✝

**El velatorio en vivo del conocimiento que muere.**

Cada minuto, Wikipedia borra artículos para siempre. Réquiem.wiki es una capilla
funeraria digital abierta 24/7 donde cada borrado entra, en directo, como un féretro
con su causa de defunción real. Una IA oficia el funeral y recita una elegía única;
los visitantes son los dolientes: su presencia son velas encendidas, sus reacciones
son flores sobre el féretro, su chat es el libro de condolencias.

Proyecto construido para **The Realtime Hackathon** (Portal, 7–9 agosto 2026).

---

## Qué problema resuelve

Ninguno utilitario — crea un ritual. El borrado de conocimiento es un evento
administrativo invisible; Réquiem.wiki le da testigo, compañía y despedida. Eres
literalmente la última persona del planeta que verá ese título.

En términos del hackathon: tiempo real (Portal) + IA (Claude) generando peso emocional
colectivo a partir de un feed técnico real (Wikimedia EventStreams).

## Cómo funciona

```
Wikimedia EventStreams (SSE page-delete)
        │
        ▼
  Director de ceremonias (Node, long-lived) ──── Claude API (elegías en streaming)
        │                                            │
        ▼                                            ▼
  Portal (canal `capilla`) ◄──────────────── estado canónico del funeral
        │
        ▼
  Dolientes (Next.js en Vercel): velas de presencia, flores, condolencias
```

Detalle completo en [docs/architecture.md](docs/architecture.md).

## Requisitos previos

- Node 20+ y **pnpm v11** (no npm, no yarn)
- Cuenta de Portal ([useportal.co](https://useportal.co)) con proyecto creado
- Clave de API de Anthropic
- Proyecto de Supabase (tabla `funerales`, ver [docs/data-model.md](docs/data-model.md))

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores. Nunca comitees credenciales.

## Instalación y desarrollo

```bash
pnpm install
pnpm dev            # web (Next.js) en localhost:3000
pnpm director:dev   # director de ceremonias en local
```

## Estructura de carpetas

```
apps/web/        → Next.js: portada y capilla (Vercel)
apps/director/   → Proceso Node: stream de Wikimedia, cola, ceremonias, elegías (Railway)
docs/            → Documentación viva del proyecto (leer antes de tocar código)
changelog/       → Registro de cambios importantes
mejoras/         → Backlog de ideas
```

## Cómo contribuir

Este repo se trabaja con agentes de código siguiendo el protocolo de `CLAUDE.md`:
leer `docs/` antes de actuar, registrar cambios en `changelog/`, mantener la
documentación sincronizada y pasar `/security-review` antes de mergear.

## Estado del proyecto

🚧 **En construcción durante el hackathon** — deadline: 9 de agosto de 2026, 10:00 UTC-5.

## Licencia

MIT. Ver [`LICENSE`](./LICENSE).
