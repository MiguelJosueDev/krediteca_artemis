import type { CandidateOffer, Features, RuleContribution, ScoreResult } from "@scoring/domain/types"
import type { ExplainabilityPort } from "@scoring/ports/driven/ExplainabilityPort"

/** coherent: true → Σcontributions == score (invariante 6 satisfecho).
 *  coherent: false → viola invariante 6 (para probar que assess falla cerrado). */
export class FakeExplainabilityPort implements ExplainabilityPort {
  constructor(private readonly coherent: boolean = true) {}

  explain(_features: Features, _offer: CandidateOffer, score: ScoreResult): RuleContribution[] {
    if (this.coherent) {
      return score.contributions
    }
    // Contribución que NO suma el score → viola invariante 6
    return [{ feature: "broken", value: score.score + 999 }]
  }
}
