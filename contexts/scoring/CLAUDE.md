# scoring — núcleo de dominio (manifiesto)

## Propósito (una frase)

Dado un solicitante y sus features, decidir aprobar o rechazar — con score, umbral aplicado y razón de acción adversa — **sin saber qué modelo, base de datos o transporte hay detrás**.

## Puertos

**Driving (lo que este contexto expone):**

- `CreditDecisionUseCase` — `assess(applicant, context) -> CreditDecision`. Único punto de entrada. La API/BFF llama esto, nada más.

**Driven (de lo que este contexto depende — interfaces, no implementaciones):**

- `FeatureStorePort` — vector de features del solicitante (mismas online y offline).
- `ConsentPort` — base legal vigente para usar features alternativas.
- `ScoringModelPort` — `predict(features) -> probability`. Aquí entra LightGBM/XGBoost; el dominio no lo sabe.
- `ExplainabilityPort` — `explain(features) -> attributions`. TreeSHAP detrás.
- `DecisionRecordPort` — persistencia inmutable de la decisión.

Para trabajar en este contexto, esos puertos son tu mundo. **No abras sus adaptadores** (`adapters/outbound/*`). Si el comportamiento interno de un adaptador importa para tu cambio, el límite está mal — arréglalo en el código, no leyendo más.

## Invariantes (no se rompen)

1. **Pureza:** `CreditDecision` es función de (features, predicción, política de umbral). Cero imports de `adapters/`, `ml/`, HTTP, SQL o librerías de ML en `domain/`.
2. **Gating de consentimiento:** sin base legal vía `ConsentPort`, las features alternativas no entran al modelo. Se decide solo con lo permitido.
3. **Acción adversa:** todo rechazo emite su razón (derivada de `ExplainabilityPort`). Un rechazo sin razón es un bug, no un caso válido.
4. **Trazabilidad:** toda decisión se persiste vía `DecisionRecordPort` con `model_version` + features usadas + atribuciones, reconstruible bit a bit.
5. **Umbral versionado:** el corte viene de configuración versionada (derivada del KS), nunca hardcodeado en el dominio.
6. **Coherencia de explicación:** las atribuciones de `ExplainabilityPort` suman la predicción (eficiencia SHAP). El dominio lo asserta; si no se cumple, falla cerrado.

## Read-set (qué leer para tocar esto)

- `contexts/scoring/domain/**` y `contexts/scoring/ports/**` — siempre.
- `docs/adr/` — solo el ADR que cite tu cambio.
- **Ignora:** `adapters/**`, `ml/**`, otros `contexts/**`. Si tu cambio parece necesitarlos, relee primero el puerto correspondiente.

## Tests = spec ejecutable

Los nombres en `tests/` describen el comportamiento esperado contra fakes (`FakeScoringModelPort`, `FakeConsentPort`, etc.). Léelos antes que la implementación. La lógica de decisión se prueba **aquí, en unit, sin modelo real**. Lo que cruza puertos (paridad train/serving, contract tests) vive en el contexto dueño de la costura, no aquí.

## Al editar

Di qué puerto tocas. Si tocas la firma de un puerto driven, es **cambio de contrato**: actualiza el puerto, sus adaptadores y los contract tests en el mismo cambio, o no lo hagas. Diff < 50 líneas; si no cabe limpio, propón alternativas antes de escribir.
