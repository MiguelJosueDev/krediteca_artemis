import { describe, it, expect } from "vitest"
import { makeAssess } from "@scoring/application/assess"
import { InMemoryFeatureStore } from "@scoring/adapters/outbound/InMemoryFeatureStore"
import { RulesScorer } from "@scoring/adapters/outbound/RulesScorer"
import { RulesExplainer } from "@scoring/adapters/outbound/RulesExplainer"
import { FakeConsentPort } from "./fakes/FakeConsentPort"
import { FakeDecisionRecordPort } from "./fakes/FakeDecisionRecordPort"
import { FakeExplainabilityPort } from "./fakes/FakeExplainabilityPort"
import { FakeScoringModelPort } from "./fakes/FakeScoringModelPort"
import { THRESHOLDS } from "@scoring/domain/config/thresholds"
import type { CandidateOffer, Applicant } from "@scoring/domain/types"

const applicant: Applicant = {
  income: 10000,
  housing: 2000,
  utilities: 500,
  debts: 500,
  contact: { name: "Test", email: "test@test.com" },
}

const routableOffer: CandidateOffer = { id: "nu", minIncome: 7000, routable: true }
const nonRoutableOffer: CandidateOffer = { id: "nonexistent", minIncome: 0, routable: false }
const highIncomeOffer: CandidateOffer = { id: "premium", minIncome: 50000, routable: true }

function makeDeps(overrides = {}) {
  return {
    consentPort: new FakeConsentPort(true),
    featureStore: new InMemoryFeatureStore(),
    scorer: new RulesScorer(THRESHOLDS),
    explainer: new RulesExplainer(),
    record: new FakeDecisionRecordPort(),
    config: THRESHOLDS,
    idGen: () => "test-decision-id",
    clock: () => "2026-06-09T00:00:00.000Z",
    ...overrides,
  }
}

describe("assess — invariantes del dominio", () => {
  // Invariante 2: gating de consentimiento
  it("inv-2: falla cerrado si consent no fue otorgado", () => {
    const deps = makeDeps({ consentPort: new FakeConsentPort(false) })
    const uc = makeAssess(deps)
    expect(() => uc.assess(applicant, { offers: [routableOffer] })).toThrow("ConsentRequired")
  })

  it("inv-2: no persiste nada si consent denegado", () => {
    const record = new FakeDecisionRecordPort()
    const deps = makeDeps({ consentPort: new FakeConsentPort(false), record })
    const uc = makeAssess(deps)
    expect(() => uc.assess(applicant, { offers: [routableOffer] })).toThrow()
    expect(record.size).toBe(0)
  })

  // Invariante 3: toda exclusión emite razón
  it("inv-3: oferta no-ruteable emite razón not_routable", () => {
    const deps = makeDeps()
    const result = makeAssess(deps).assess(applicant, { offers: [nonRoutableOffer] })
    expect(result.excluded).toHaveLength(1)
    expect(result.excluded[0].reason).toBe("not_routable")
    expect(result.excluded[0].detail).toBeTruthy()
  })

  it("inv-3: ingreso insuficiente emite razón income_below_minimum", () => {
    const deps = makeDeps()
    const result = makeAssess(deps).assess(applicant, { offers: [highIncomeOffer] })
    expect(result.excluded).toHaveLength(1)
    expect(result.excluded[0].reason).toBe("income_below_minimum")
    expect(result.excluded[0].detail).toContain("10,000")
  })

  // Invariante 4: persistencia inmutable — reconstrucción round-trip
  it("inv-4: la decisión se persiste y es reconstruible por decisionId", () => {
    const record = new FakeDecisionRecordPort()
    const deps = makeDeps({ record })
    makeAssess(deps).assess(applicant, { offers: [routableOffer] })
    const stored = record.getById("test-decision-id")
    expect(stored).not.toBeNull()
    expect(stored!.decisionId).toBe("test-decision-id")
    expect(stored!.applicant.income).toBe(10000)
    expect(stored!.modelVersion).toBe("rules-v0")
  })

  it("inv-4 append-only: dos persists con mismo id lanzan error", () => {
    const record = new FakeDecisionRecordPort()
    // Primer insert
    record.append({
      decisionId: "same-id", applicant, features: { declaredIncome: 1, dti: 1, availableCapacity: 1 },
      consent: { granted: true, basis: "consent", privacyNoticeVersion: "v1", timestamp: "" },
      decision: { decisionId: "same-id", ranked: [], excluded: [], appliedThreshold: 0, configVersion: "v0", modelVersion: "rules-v0", createdAt: "" },
      modelVersion: "rules-v0", configVersion: "v0", createdAt: "",
    })
    // Segundo insert con mismo id debe lanzar
    expect(() => record.append({
      decisionId: "same-id", applicant, features: { declaredIncome: 1, dti: 1, availableCapacity: 1 },
      consent: { granted: true, basis: "consent", privacyNoticeVersion: "v1", timestamp: "" },
      decision: { decisionId: "same-id", ranked: [], excluded: [], appliedThreshold: 0, configVersion: "v0", modelVersion: "rules-v0", createdAt: "" },
      modelVersion: "rules-v0", configVersion: "v0", createdAt: "",
    })).toThrow("ImmutabilityViolation")
  })

  // Invariante 5: umbral de config — cambiar el umbral cambia qué entra a ranked
  it("inv-5: umbral alto excluye oferta con score bajo", () => {
    const strictConfig = { ...THRESHOLDS, configVersion: "rules-v0.strict", routingThreshold: 0.99 }
    const deps = makeDeps({ config: strictConfig, scorer: new RulesScorer(strictConfig) })
    const result = makeAssess(deps).assess(applicant, { offers: [routableOffer] })
    // El score de Nu con ingreso 10k debería quedar bajo un umbral de 0.99
    const allExcluded = result.ranked.length === 0
    expect(allExcluded || result.excluded.some(e => e.reason === "below_threshold")).toBe(true)
  })

  it("inv-5: umbral bajo acepta la misma oferta", () => {
    const lenientConfig = { ...THRESHOLDS, configVersion: "rules-v0.lenient", routingThreshold: 0.0 }
    const deps = makeDeps({ config: lenientConfig, scorer: new RulesScorer(lenientConfig) })
    const result = makeAssess(deps).assess(applicant, { offers: [routableOffer] })
    expect(result.ranked.length).toBeGreaterThan(0)
  })

  // Invariante 6: coherencia de explicación — falla cerrado si atribuciones incoherentes
  it("inv-6: falla cerrado si atribuciones no suman el score", () => {
    const deps = makeDeps({
      scorer: new FakeScoringModelPort(0.5),
      explainer: new FakeExplainabilityPort(false), // incoherente
    })
    expect(() => makeAssess(deps).assess(applicant, { offers: [routableOffer] }))
      .toThrow("ExplanationCoherenceViolation")
  })

  it("inv-6: pasa cuando atribuciones son coherentes", () => {
    const deps = makeDeps({
      scorer: new FakeScoringModelPort(0.5),
      explainer: new FakeExplainabilityPort(true),
    })
    expect(() => makeAssess(deps).assess(applicant, { offers: [routableOffer] })).not.toThrow()
  })

  // Ranked ordenado desc por score
  it("ranked se ordena mejor primero", () => {
    const offerA: CandidateOffer = { id: "a", minIncome: 1000, routable: true }
    const offerB: CandidateOffer = { id: "b", minIncome: 9000, routable: true }
    const deps = makeDeps()
    const result = makeAssess(deps).assess(applicant, { offers: [offerB, offerA] })
    if (result.ranked.length >= 2) {
      expect(result.ranked[0].score).toBeGreaterThanOrEqual(result.ranked[1].score)
    }
  })
})
