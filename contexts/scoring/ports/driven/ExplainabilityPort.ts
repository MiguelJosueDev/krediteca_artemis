import type { CandidateOffer, Features, RuleContribution, ScoreResult } from "@scoring/domain/types"

export interface ExplainabilityPort {
  /**
   * Devuelve las contribuciones aditivas que explican el score.
   * DEBE satisfacer: Σcontributions[i].value === score.score (invariante 6).
   * El dominio lo asserta en assess(); si no se cumple, falla cerrado.
   */
  explain(features: Features, offer: CandidateOffer, score: ScoreResult): RuleContribution[]
}
