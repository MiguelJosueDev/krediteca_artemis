import type { CandidateOffer, Features, ScoreResult } from "@scoring/domain/types"
import type { ScoringModelPort } from "@scoring/ports/driven/ScoringModelPort"

export class FakeScoringModelPort implements ScoringModelPort {
  constructor(private readonly fixedScore: number = 0.5) {}

  predict(_features: Features, _offer: CandidateOffer): ScoreResult {
    return {
      score: this.fixedScore,
      contributions: [{ feature: "fake_score", value: this.fixedScore }],
    }
  }
}
