import type { CandidateOffer, Features, RuleContribution, ScoreResult } from "@scoring/domain/types"
import type { ExplainabilityPort } from "@scoring/ports/driven/ExplainabilityPort"

/**
 * Devuelve las contribuciones ya calculadas por RulesScorer.
 * Σcontributions === score por construcción (RulesScorer es aditivo) → invariante 6.
 */
export class RulesExplainer implements ExplainabilityPort {
  explain(
    _features: Features,
    _offer: CandidateOffer,
    score: ScoreResult
  ): RuleContribution[] {
    return score.contributions
  }
}
