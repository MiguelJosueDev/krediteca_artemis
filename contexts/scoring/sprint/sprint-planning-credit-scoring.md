# Sprint Planning — Credit Scoring (arranque)

**Estado real:** solo existe el frontend. Sin datos etiquetados → sin ML todavía.
La meta de estos sprints **no** es entrenar un modelo, es llegar a *"tomamos
decisiones seguras con reglas y capturamos los datos que mañana permitirán
entrenar uno"*. El ML está **bloqueado por la maduración de outcomes**, no por
la ingeniería; por eso aparece como un *gate*, no como un sprint.

**Cadencia:** sprints de 2 semanas. Tallas: **S** ≈ 1–2 d · **M** ≈ 3–5 d ·
**L** ≈ 1 semana+. Supuesto: 1 ingeniero + IA. Ajusta a tu velocidad real.
Los Sprints 0–3 son ~6–8 semanas de trabajo; el modelo ML llega *meses después
del Sprint 3*, cuando el outcome madure.

**Principios (heredados):** dominio puro tras puertos · TDD contra fakes · un
ADR por decisión estructural · diffs < 50 líneas · cada cambio declara qué
puerto/contrato toca.

---

## Sprint 0 — Cimientos (1 semana)
**Meta:** esqueleto hexagonal listo y el contrato de datos blindado.

- **M** — Scaffold por bounded context (`contexts/`, `adapters/`, `ml/`) + CLAUDE.md raíz y de `scoring`. *(hecho)*
- **S** — CI + lint + test runner + proceso de ADR en `docs/adr/`.
- **S** — Contrato `decision-log.ts` + `DecisionRecordPort`. *(hecho)*
- **M** — `FakeDecisionRecordPort` en memoria + tests del contrato (append-only, reconstrucción, re-etiquetado de outcomes).
- **S** — **ADR-001 — Modelo de negocio: ¿originación o lead-gen?** Define el `Outcome`, la latencia de feedback y si la acción adversa te aplica a ti o al partner. El código no se bloquea (la unión `RawOutcome` lo absorbe), pero esta decisión sí gobierna los Sprints 2–3.

**DoD:** tests verdes sobre el dominio del contrato; ADR-001 escrito (aunque sea "decidido provisionalmente").

---

## Sprint 1 — Núcleo de decisión + reglas v0
**Meta:** una solicitud entra y sale una decisión reconstruible, server-side, sin ML.

- **L** — `CreditDecisionUseCase`: orquesta consent → features → scorer → decision → record. Lógica pura.
- **M** — `ScoringModelPort` + `RulesScorer` v0: reglas transparentes (ratio cuota/ingreso, ingreso mínimo, checks KYC/fraude). Tu campeón de arranque.
- **M** — `ConsentPort` + adaptador básico; gating real de features alternativas (las omitidas se marcan `gatedByConsent`, no se borran).
- **M** — Generación de acción adversa desde los drivers de las reglas (factores de crédito legítimos, no proxies).
- **L** — Unit tests del dominio contra fakes: invariantes 1–6, gating, rechazo→razón, umbral versionado por config.

**DoD:** test e2e in-memory: input → decisión + `DecisionRecord` reconstruible; cero imports de infra en `domain/`.

---

## Sprint 2 — Persistencia, captura en frontend y paridad
**Meta:** end-to-end real, desde el frontend hasta el registro persistido.

- **M** — Adaptador `DecisionRecordPort` → Postgres, append-only e inmutable.
- **M** — Contract test del adaptador (round-trip + reconstrucción exacta).
- **M** — El frontend emite `ApplicationSubmitted` (input crudo + consentimiento); el backend computa las features point-in-time.
- **L** — **Test de paridad train/serving** del pipeline de features (el bug silencioso #1).
- **S** — Implementar `isExploration`: aprobar una fracción aleatoria en la banda incierta (rompe el sesgo de selección desde el día 1).
- **M** — *(si originación)* integrar buró (Círculo / BC) como `FeatureSource`; *(si lead-gen)* recibir el postback del partner.

**DoD:** una solicitud real desde el frontend queda persistida con consentimiento amarrado; paridad verde; exploración activa.

---

## Sprint 3 — Operar y empezar a generar verdad
**Meta:** decisiones reales en piloto (límites chicos) y outcomes empezando a fluir.

- **M** — Despliegue del piloto con la política de reglas y montos chicos / volumen acotado.
- **M** — `attachOutcome`: enganchar el resultado real (repago o conversión) cuando llega → arranca el reloj de maduración.
- **M** — Monitoreo de fase temprana: PSI de features, tasa de aprobación, % de exploración, integridad del logging. *(Aún no hay model drift: no hay modelo.)*
- **S** — Tablero de salud de datos: ¿cuántas decisiones maduras llevamos?, ¿cuántos eventos "malos"?

**DoD:** decisiones reales registrándose; outcomes adjuntándose; contador de maduración corriendo.

---

## Gate (Sprint N — BLOQUEADO) — Primer modelo ML
**No empieza** hasta cumplir el criterio de datos: ≥ X decisiones maduras y ≥ Y
eventos "malos" (define X/Y con un cálculo, no a ojo). Hasta entonces, las
reglas mandan y este gate permanece cerrado.

Cuando se abra:
- Armar el set con `listMaturedExamples` (snapshot point-in-time, sin leakage).
- Baseline defendible primero: logística + WoE. Luego LightGBM como *challenger*.
- Evaluar contra criterios de aceptación: AUC con intervalo de confianza, calibración (ECE), fairness (AIR), **out-of-time** — no holdout aleatorio.
- Shadow mode contra las reglas antes de exponer dinero. Swap del puerto solo si gana de verdad.

---

### Decisiones que este plan deja explícitas (no las pospongas)
1. **ADR-001:** ¿originación o lead-gen? Gobierna outcome, latencia y obligaciones legales.
2. **Definición de "malo"** y ventana de desempeño (versionada).
3. **Marco legal real:** LFPDPPP / CONDUSEF / reglas de buró en México — verifícalo con abogado, no contra GDPR/ECOA de los documentos.
