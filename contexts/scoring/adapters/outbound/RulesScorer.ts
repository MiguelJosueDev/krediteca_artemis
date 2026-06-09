import type { CandidateOffer, Features, ScoreResult } from "@scoring/domain/types"
import type { ScoringModelPort } from "@scoring/ports/driven/ScoringModelPort"
import type { ThresholdConfig } from "@scoring/domain/config/thresholds"

/**
 * Scorer transparente basado en reglas. Score ADITIVO → invariante 6 trivial.
 * Pesos y cortes de DTI vienen de config (invariante 5).
 *
 * Contribuciones:
 *   income_margin  = clamp((income − minIncome) / minIncome, 0, 1) * wIncome
 *   dti_health     = wDti si Saludable, wDti/2 si Precaución, 0 si Peligro
 *   capacity_ratio = clamp(capacity / income, 0, 1) * wCapacity
 *
 * Hard exclusions (se comunican al use case vía ScoreResult.score = −1):
 *   income < minIncome → score = −1 (señal de exclusión income_below_minimum)
 *   dti > dtiPrecaucion → score = −2 (señal de exclusión dti_above_band)
 */
export class RulesScorer implements ScoringModelPort {
  constructor(private readonly config: ThresholdConfig) {}

  predict(features: Features, offer: CandidateOffer): ScoreResult {
    const { declaredIncome, dti, availableCapacity } = features
    const { minIncome } = offer
    const { dtiSaludable, dtiPrecaucion, wIncome, wDti, wCapacity } = this.config

    // Hard exclusion: income
    if (declaredIncome < minIncome) {
      return { score: -1, contributions: [{ feature: "income_below_minimum", value: -1 }] }
    }

    // Hard exclusion: DTI
    if (dti > dtiPrecaucion) {
      return { score: -2, contributions: [{ feature: "dti_above_band", value: -2 }] }
    }

    const incomeMargin = minIncome > 0
      ? Math.min((declaredIncome - minIncome) / minIncome, 1) * wIncome
      : wIncome

    const dtiHealth = dti <= dtiSaludable ? wDti : wDti / 2

    const capacityRatio = declaredIncome > 0
      ? Math.min(Math.max(availableCapacity / declaredIncome, 0), 1) * wCapacity
      : 0

    const score = incomeMargin + dtiHealth + capacityRatio

    return {
      score,
      contributions: [
        { feature: "income_margin", value: incomeMargin },
        { feature: "dti_health", value: dtiHealth },
        { feature: "capacity_ratio", value: capacityRatio },
      ],
    }
  }
}
