import type { Applicant, Consent } from "@scoring/domain/types"
import type { ConsentPort } from "@scoring/ports/driven/ConsentPort"

export class FakeConsentPort implements ConsentPort {
  constructor(private readonly granted: boolean, private readonly version = "test-v1") {}

  resolve(_applicant: Applicant): Consent {
    return {
      granted: this.granted,
      basis: this.granted ? "consent" : "none",
      privacyNoticeVersion: this.version,
      timestamp: new Date().toISOString(),
    }
  }
}
