import type { Applicant, CandidateOffer, EligibilityDecision } from "@scoring/domain/types"

export interface AssessContext {
  offers: CandidateOffer[]
}

/** Puerto driving: único punto de entrada. La API/BFF llama solo esto. */
export interface CreditDecisionUseCase {
  assess(applicant: Applicant, context: AssessContext): EligibilityDecision
}
