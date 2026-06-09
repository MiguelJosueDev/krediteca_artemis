// Tipos del dominio de elegibilidad/lead-gen.
// Ningún import de infra, adapters, Next, ni librerías externas.

/** Input crudo declarado por el usuario — lo que escribe en el simulador. */
export interface Applicant {
  income: number        // ingreso neto mensual declarado (MXN)
  housing: number
  utilities: number
  debts: number         // pagos mínimos mensuales de deudas existentes
  contact: {
    name: string
    email: string
    phone?: string
  }
}

/** Base legal vigente para procesar los datos del solicitante. */
export interface Consent {
  granted: boolean
  basis: "consent" | "none"
  privacyNoticeVersion: string  // versión del aviso LFPDPPP aceptado
  timestamp: string             // ISO 8601
}

/** Vector de features point-in-time derivado del input declarado.
 *  v0: solo first-party. Alt-data futura entraría aquí, gateada por consent. */
export interface Features {
  declaredIncome: number
  dti: number               // (housing + debts) / income * 100
  availableCapacity: number // income − (housing + utilities + debts)
}

/** Oferta candidata inyectada por el composition root — el dominio NO conoce el catálogo. */
export interface CandidateOffer {
  id: string
  minIncome: number
  routable: boolean         // existe en el redirect-map y está activa
}

/** Contribución aditiva de una regla al score. Σcontributions == score (inv. 6). */
export interface RuleContribution {
  feature: string
  value: number
}

/** Score escalar producido por ScoringModelPort. */
export interface ScoreResult {
  score: number
  contributions: RuleContribution[]
}

/** Razón interna de exclusión — etiqueta para ML futuro, NO aviso al consumidor. */
export type ExclusionReason =
  | "income_below_minimum"
  | "dti_above_band"
  | "not_routable"
  | "below_threshold"

/** Oferta ruteada con banda honesta (sin % inventado). */
export interface RankedOffer {
  offerId: string
  band: "alta" | "media" | "baja"
  score: number
  contributions: RuleContribution[]
}

/** Oferta excluida con razón interna. */
export interface ExcludedOffer {
  offerId: string
  reason: ExclusionReason
  detail: string
}

/** = CreditDecision en el contexto lead-gen. */
export interface EligibilityDecision {
  decisionId: string
  ranked: RankedOffer[]
  excluded: ExcludedOffer[]
  appliedThreshold: number
  configVersion: string
  modelVersion: "rules-v0"
  createdAt: string
}

/** Registro inmutable, reconstruible bit a bit (invariante 4). */
export interface DecisionRecord {
  decisionId: string
  applicant: Applicant
  features: Features
  consent: Consent
  decision: EligibilityDecision
  modelVersion: "rules-v0"
  configVersion: string
  createdAt: string
}

/** Outcome crudo desde el postback del partner. */
export interface RawOutcome {
  clickId: string
  status: string    // 'approved' | 'pending' | ... (valores del partner)
  payout: number
  receivedAt: string
}

/** Outcome resuelto para el pipeline de ML. */
export interface Outcome {
  decisionId: string
  offerId: string
  converted: boolean  // status === 'approved'
  payout: number
  maturedAt: string
}
