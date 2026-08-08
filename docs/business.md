# Modelo de negocio

Contexto: **Réquiem.wiki** es una pieza de hackathon (The Realtime Hackathon, Portal,
7–9 agosto 2026). El "negocio" aquí es ganar el hackathon y servir de pieza de
portfolio/viral; no hay monetización en el horizonte de esta versión.

---

## Propuesta de valor

Convierte el borrado invisible de conocimiento en Wikipedia en un ritual colectivo en
vivo: cualquier persona puede asistir, acompañada de desconocidos, al último instante de
un artículo que nadie volverá a ver.

- **Para los jueces:** demuestra realtime (Portal) + IA con impacto cultural y efecto
  wow en una sola frase de pitch.
- **Para el visitante:** una experiencia emocional rara e hipnótica, gratis y sin
  registro.

---

## Modelo de monetización

Ninguno en esta versión. Gratuito, sin cuentas, sin datos personales.

Sostenibilidad de costes del MVP:
- Wikimedia EventStreams: gratis, público, sin API key.
- Claude API: una llamada corta por funeral (~centavos/día a la tasa esperada de
  borrados).
- Portal: free tier del hackathon.
- Hosting: free tier (Vercel u similar).

Posibilidades futuras (fuera de alcance, solo registradas): donaciones tipo Ko-fi
("paga una vela"), versión white-label del formato "velatorio de datos" para otras
fuentes (dominios caducados, repos archivados, tweets borrados).

---

## Competidores y diferenciación

| Competidor | Qué hace | Diferencia nuestra |
|------------|----------|---------------------|
| Listen to Wikipedia (listen.hatnote.com) | Sonifica ediciones de Wikipedia en tiempo real | Mira lo que nace; nosotros velamos lo que muere. Sin ritual colectivo, sin IA, sin presencia compartida |
| Dashboards de recent changes (Wikistats, contadores) | Visualizan actividad como métricas | Datos, no emoción; nadie "asiste" a nada |
| Deletionpedia y archivos de artículos borrados | Archivan artículos eliminados a posteriori | Archivo estático; no hay directo, ni ceremonia, ni compañía |
| Otros equipos del hackathon (previsión) | Dashboards, mapas, chats colaborativos con IA | Nadie más mirará el stream de Wikipedia y verá muerte en vez de datos |

---

## Métricas de éxito

En orden de prioridad real:

1. **Ganar o quedar 2º en el hackathon** (US$500 / US$300).
2. Demo en vivo impecable durante la evaluación: la capilla nunca vacía, funerales
   entrando solos, ≥2 dispositivos sincronizados en el vídeo de 90s.
3. Que al menos un juez lo mencione espontáneamente ("lo cuenta en la cena").
4. Post-hackathon (bonus): compartible en redes; >100 visitantes orgánicos la primera
   semana.

---

## Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Tono de la elegía cae en burla o toca una biografía sensible | Media | Alto (mata la magia y puede ofender) | Filtro de biografías/temas sensibles antes de entrar a capilla + prompt con tono fijado + revisión manual del prompt con casos reales |
| Tasa de borrados baja en el momento de la demo | Media | Alto (capilla vacía) | Cola amortiguadora de borrados recientes + ritmo de funeral controlado por el director, no por el stream crudo |
| Portal (plataforma nueva) tiene fricción o límites inesperados | Media | Alto | Spike de integración en las primeras horas de código; plan B degradado documentado en architecture.md |
| Corte del stream de Wikimedia | Baja | Medio | Reconexión automática + buffer de últimos eventos |
| Quedarse sin tiempo para el deploy y el vídeo | Media | Crítico (requisito de bases) | Deploy desde la hora 0 y desplegar en continuo; el vídeo se graba con margen |

---

## Restricciones

- **Tiempo:** ~24h de código efectivas dentro de la ventana oficial de commits
  (cierra el 9 de agosto, 10:00 UTC-5).
- **Equipo:** una persona + agentes de código.
- **Tecnología impuesta:** Portal debe ser parte central de la experiencia (criterio de
  evaluación); IA obligatoria; demo desplegada y repo público obligatorios.
- **Idioma:** producto y demo en español (permitido por las bases).
- **Presupuesto:** ~0. Todo en free tiers salvo centavos de API de Claude.
