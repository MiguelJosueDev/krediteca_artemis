import type { Applicant, Consent, Features } from "@scoring/domain/types"
import type { FeatureStorePort } from "@scoring/ports/driven/FeatureStorePort"

export class InMemoryFeatureStore implements FeatureStorePort {
  buildFeatures(applicant: Applicant, _consent: Consent): Features {
    const { income, housing, utilities, debts } = applicant
    const dti = income > 0 ? ((housing + debts) / income) * 100 : 999
    const availableCapacity = income - (housing + utilities + debts)
    return { declaredIncome: income, dti, availableCapacity }
  }
}
