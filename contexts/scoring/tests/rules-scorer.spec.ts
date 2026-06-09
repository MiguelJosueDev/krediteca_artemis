import { describe, it, expect } from "vitest"
import { RulesScorer } from "@scoring/adapters/outbound/RulesScorer"
import { THRESHOLDS } from "@scoring/domain/config/thresholds"
import type { CandidateOffer, Features } from "@scoring/domain/types"

const scorer = new RulesScorer(THRESHOLDS)

const baseFeatures: Features = {
  declaredIncome: 10000,
  dti: 25,
  availableCapacity: 7000,
}

const offer: CandidateOffer = { id: "nu", minIncome: 7000, routable: true }

describe("RulesScorer v0", () => {
  it("score === suma de contribuciones (invariante 6 por construcción)", () => {
    const result = scorer.predict(baseFeatures, offer)
    const sum = result.contributions.reduce((acc, c) => acc + c.value, 0)
    expect(Math.abs(sum - result.score)).toBeLessThan(1e-9)
  })

  it("score ∈ [0, 1] para inputs válidos", () => {
    const result = scorer.predict(baseFeatures, offer)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(1)
  })

  it("ingreso < minIncome → score = -1 (income_below_minimum)", () => {
    const lowIncomeFeatures: Features = { ...baseFeatures, declaredIncome: 5000 }
    const result = scorer.predict(lowIncomeFeatures, offer)
    expect(result.score).toBe(-1)
    expect(result.contributions[0].feature).toBe("income_below_minimum")
  })

  it("DTI > dtiPrecaucion → score = -2 (dti_above_band)", () => {
    const highDtiFeatures: Features = { ...baseFeatures, dti: 50 }
    const result = scorer.predict(highDtiFeatures, offer)
    expect(result.score).toBe(-2)
    expect(result.contributions[0].feature).toBe("dti_above_band")
  })

  it("DTI en banda Precaución reduce dtiHealth a la mitad", () => {
    const precaucion: Features = { ...baseFeatures, dti: 40 } // 35 < 40 <= 43
    const saludable: Features = { ...baseFeatures, dti: 20 }
    const rP = scorer.predict(precaucion, offer)
    const rS = scorer.predict(saludable, offer)
    // El score de precaución debe ser menor al de saludable
    expect(rP.score).toBeLessThan(rS.score)
  })

  it("mayor ingreso sobre minIncome → mayor income_margin → mayor score", () => {
    const highIncome: Features = { ...baseFeatures, declaredIncome: 20000 }
    const rBase = scorer.predict(baseFeatures, offer)
    const rHigh = scorer.predict(highIncome, offer)
    expect(rHigh.score).toBeGreaterThan(rBase.score)
  })

  it("ingreso justo en el mínimo → income_margin = 0", () => {
    const exactMin: Features = { ...baseFeatures, declaredIncome: offer.minIncome }
    const result = scorer.predict(exactMin, offer)
    const incomeContrib = result.contributions.find(c => c.feature === "income_margin")
    expect(incomeContrib?.value).toBeCloseTo(0, 5)
  })

  it("tres contribuciones nominadas: income_margin, dti_health, capacity_ratio", () => {
    const result = scorer.predict(baseFeatures, offer)
    const names = result.contributions.map(c => c.feature)
    expect(names).toContain("income_margin")
    expect(names).toContain("dti_health")
    expect(names).toContain("capacity_ratio")
  })
})
