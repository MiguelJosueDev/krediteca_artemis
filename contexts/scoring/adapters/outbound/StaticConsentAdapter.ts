import type { Applicant, Consent } from "@scoring/domain/types"
import type { ConsentPort } from "@scoring/ports/driven/ConsentPort"

/** Lee el consentimiento ya validado que inyecta el composition root desde el request body. */
export class StaticConsentAdapter implements ConsentPort {
  constructor(private readonly consent: Consent) {}

  resolve(_applicant: Applicant): Consent {
    return this.consent
  }
}
