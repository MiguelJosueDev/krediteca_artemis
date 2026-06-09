# frontend — sitio Krediteca (manifiesto)

## Propósito (una frase)

Servir el comparador financiero MX como HTML rápido e indexable, con señales **E-E-A-T/YMYL** y outbound a partners que no fuga PageRank ni credenciales — **el render manda, la interactividad es la excepción**.

## Stack

Next.js 15 (App Router) + React 19 + Tailwind 3.4 + Turbopack. Sin TypeScript. Contenido en MDX (`src/content/`), afiliación server-side (`src/lib/affiliates/`), atribución en SQLite (`attribution.db` vía `src/lib/db.js`). Migración a Sanity CMS = Fase 4, pendiente.

## Invariantes (no se rompen — romperlas regresa deuda SEO)

1. **Server Component por defecto.** `"use client"` solo en hoja con interactividad real (estado, eventos, browser APIs). Nunca en `page.js` raíz: si el page necesita estado, extraer el fragmento a un Client Component hijo aislado (patrón `CompareButton.js`). Protege LCP y bundle size.
2. **Secretos detrás de `import "server-only"`.** Todo módulo que toque API keys de afiliados declara `server-only` como primera línea (hoy: `src/lib/affiliates/leadgid.js`). Garantía estructural, no convención.
3. **Outbound a partners siempre vía `/api/go/[id]`.** Nunca `<a href="https://partner.com/?aff=...">` directo en el HTML. El endpoint responde 307 + `X-Robots-Tag: noindex, nofollow`; `robots.js` mantiene `Disallow: /api/go/`. Protege PageRank y habilita atribución server-side.
4. **Frontmatter del blog es el contrato.** Campos fijos: `title, slug, description, category, tags, author, reviewedBy, publishedAt, updatedAt, image, draft`. Cambiar el esquema rompe la migración a Sanity.
5. **URLs del blog son `/blog/[categoria]/[slug]`.** Cementado en Fase 3; debe sobrevivir la migración a Sanity sin 301s — los backlinks dependen de ello.
6. **Solo 3 componentes MDX:** `<Callout>`, `<Disclaimer>`, `<OfferCard>` (registrados en `src/app/components/mdx/index.js`). Restricción draconiana intencional para que el adaptador a Portable Text en Fase 4 sea trivial.
7. **`src/lib/blog.js` es el único acceso al filesystem para contenido.** Ningún `page.js` importa `fs` ni `gray-matter` directo.

## YMYL (no negociable en vertical financiera MX)

Toda página de contenido financiero exige: autor con bio (`src/content/authors/*.json`), `reviewedBy` (revisor experto), fechas `publishedAt`/`updatedAt` visibles, disclaimers CNBV/CONDUSEF, y JSON-LD (`Article` + `Person` + `BreadcrumbList`; `FinancialService` + `Organization` en `layout.js`). Core Web Vitals es restricción dura, no nice-to-have.

## Read-set (qué leer para tocar esto)

- El árbol que editas bajo `src/app/**` + el loader/lib que toca (`src/lib/blog.js`, `src/lib/affiliates/**`, `src/lib/db.js`).
- **Ignora:** `contexts/**` (otro contexto, otras reglas), `node_modules/**`, `.next/**`. El motor de scoring no es asunto del frontend.

## Al editar

Antes de aprobar un cambio, verifica que no rompa ninguno de los 7. Si una necesidad real exige romper uno, levanta la alerta explícita con el tradeoff cuantificado — no lo decidas en silencio. No propongas features de una fase no abierta (i18n = Fase 5, no acordada). Diff pequeño y enfocado; si no cabe limpio, propón alternativas antes de escribir.
