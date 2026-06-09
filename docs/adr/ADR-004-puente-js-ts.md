# ADR-004 — Puente JS↔TS: TypeScript aislado en `contexts/scoring/`

**Estado:** Aceptado  
**Fecha:** 2026-06-09  
**Decidor:** Miguel Cruz

## Contexto

El repo es JavaScript puro (jsconfig.json, sin tsconfig). El manifiesto del scoring y el
sprint planning asumen TypeScript para los contratos de puerto y los tipos del dominio.

## Decisión

TypeScript **aislado a `contexts/scoring/`**. El código fuente JS de `src/` no se toca.

Implementación:
- `tsconfig.json` raíz NUEVO con `allowJs:true, checkJs:false` — el JS existente se transpila
  pero nunca se type-checkea; cero errores de tipo nuevos en `src/`.
- `include: ["src", "contexts"]` — Next transpila el TS de `contexts/` al seguir imports.
- Paths: `@scoring/*` → `./contexts/scoring/*`.
- devDeps: `typescript`, `@types/node`, `@types/better-sqlite3`, `@types/react`.
- `vitest.config.ts` con `vite-tsconfig-paths` (vitest no lee paths de tsconfig nativamente).
- `jsconfig.json` queda; Next lo ignora cuando hay tsconfig (sin efecto).

## Alternativa rechazada

Pre-compilar `contexts/` con `tsc` a JS y que Next nunca vea `.ts`. Rechazada por peso
operativo (step de build extra, sourcemaps, watch mode, dos configs de módulos). Reconsiderar
si Turbopack presenta problemas con paths fuera de `src/`.

## Consecuencias

- La config del repo cambia aunque "el código JS no se toca".
- Verificar que el alias `@scoring/*` resuelve bajo **Turbopack dev**, no solo build/vitest.
- Los errores de tipo solo aparecen en `contexts/scoring/**/*.ts`, nunca en `src/**/*.js`.
