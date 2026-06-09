import type { Applicant, Consent } from "@scoring/domain/types"

export interface ConsentPort {
  resolve(applicant: Applicant): Consent
}
