import type { Applicant, Consent, Features } from "@scoring/domain/types"

export interface FeatureStorePort {
  /** Construye el vector de features point-in-time. En v0 solo usa input declarado. */
  buildFeatures(applicant: Applicant, consent: Consent): Features
}
