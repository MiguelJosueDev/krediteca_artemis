import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import Database from "better-sqlite3"
import path from "path"
import { getTopOffers } from "@/lib/affiliates/leadgid"
import { affiliateRedirectMap } from "@/lib/affiliates/redirect-map"
// Composition root: único punto donde JS instancia adaptadores TS e inyecta en el use case.
import { makeAssess } from "@scoring/application/assess"
import { InMemoryFeatureStore } from "@scoring/adapters/outbound/InMemoryFeatureStore"
import { StaticConsentAdapter } from "@scoring/adapters/outbound/StaticConsentAdapter"
import { RulesScorer } from "@scoring/adapters/outbound/RulesScorer"
import { RulesExplainer } from "@scoring/adapters/outbound/RulesExplainer"
import { SqliteDecisionRecord } from "@scoring/adapters/outbound/SqliteDecisionRecord"
import { THRESHOLDS } from "@scoring/domain/config/thresholds"

const PRIVACY_NOTICE_VERSION = "2026-06-09"

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const { income, housing, utilities, debts, contact, consent: consentInput } = body

  // Validación básica de input
  if (!consentInput?.granted) {
    return NextResponse.json({ error: "Se requiere consentimiento para continuar." }, { status: 400 })
  }
  if (!contact?.email || !contact?.name) {
    return NextResponse.json({ error: "Nombre y correo son requeridos." }, { status: 400 })
  }
  if (typeof income !== "number" || income <= 0) {
    return NextResponse.json({ error: "Ingreso inválido." }, { status: 400 })
  }

  const applicant = { income, housing: housing ?? 0, utilities: utilities ?? 0, debts: debts ?? 0, contact }

  const consent = {
    granted: true,
    basis: "consent",
    privacyNoticeVersion: consentInput.privacyNoticeVersion ?? PRIVACY_NOTICE_VERSION,
    timestamp: new Date().toISOString(),
  }

  // Construir catálogo de ofertas candidatas (routable = existe en redirect-map y está activa)
  const loanOffers = await getTopOffers()
  const candidates = loanOffers.map((o) => ({
    id: o.id,
    minIncome: o.minIncome ?? 0,
    routable: !!(affiliateRedirectMap[o.id]?.active),
  }))

  // Instanciar adaptadores e inyectar
  const db = new Database(path.join(process.cwd(), "attribution.db"))
  const deps = {
    consentPort: new StaticConsentAdapter(consent),
    featureStore: new InMemoryFeatureStore(),
    scorer: new RulesScorer(THRESHOLDS),
    explainer: new RulesExplainer(),
    record: new SqliteDecisionRecord(db),
    config: THRESHOLDS,
    idGen: () => uuidv4(),
    clock: () => new Date().toISOString(),
  }

  let decision
  try {
    decision = makeAssess(deps).assess(applicant, { offers: candidates })
  } catch (err) {
    console.error("[eligibility] Error en assess:", err)
    return NextResponse.json({ error: "Error interno al evaluar elegibilidad." }, { status: 500 })
  }

  // Formatear respuesta (banda honesta, sin score crudo)
  const offers = decision.ranked.map((r) => ({
    offerId: r.offerId,
    band: r.band,
    ctaHref: `/api/go/${r.offerId}?dec=${decision.decisionId}`,
  }))

  const excluded = decision.excluded.map((e) => ({
    offerId: e.offerId,
    reason: e.reason,
    detail: e.detail,
  }))

  return NextResponse.json({ decisionId: decision.decisionId, offers, excluded })
}
