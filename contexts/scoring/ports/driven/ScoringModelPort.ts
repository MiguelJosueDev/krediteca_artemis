import type { CandidateOffer, Features, ScoreResult } from "@scoring/domain/types"

export interface ScoringModelPort {
  /** Score escalar por (features, oferta). En v0 = RulesScorer. En vN = LightGBM/XGBoost. */
  predict(features: Features, offer: CandidateOffer): ScoreResult
}
