"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Banknote, Home, CreditCard, Activity, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"

const PRIVACY_NOTICE_VERSION = "2026-06-09"

const BAND_LABELS = {
  alta: { label: "Alta elegibilidad", color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
  media: { label: "Media elegibilidad", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  baja: { label: "Baja elegibilidad", color: "text-navy-600", bg: "bg-surface-50 border-surface-200" },
}

const EXCLUSION_LABELS = {
  income_below_minimum: "Tu ingreso declarado no alcanza el mínimo de esta oferta.",
  dti_above_band: "Tu ratio deuda-ingreso supera el umbral de esta oferta.",
  not_routable: "Oferta no disponible en este momento.",
  below_threshold: "Tu perfil está por debajo del umbral de elegibilidad.",
}

export default function CapacitySimulator() {
  const [income, setIncome] = useState(6500)
  const [housing, setHousing] = useState(2200)
  const [utilities, setUtilities] = useState(450)
  const [debts, setDebts] = useState(850)

  // Captura de contacto y consentimiento
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)

  // Estado del submit
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { decisionId, offers, excluded }
  const [error, setError] = useState(null)

  const { availableCapacity, dti, status } = useMemo(() => {
    const expenses = housing + utilities + debts
    let capacity = income - expenses
    if (capacity < 0) capacity = 0

    let ratio = 0
    if (income > 0) {
      ratio = ((housing + debts) / income) * 100
    }

    let status = { text: "Saludable", color: "text-teal-600", bg: "bg-teal-600", stroke: "#0D9488" }
    if (ratio > 43) {
      status = { text: "Peligro", color: "text-red-500", bg: "bg-red-500", stroke: "#EF4444" }
    } else if (ratio > 35) {
      status = { text: "Precaución", color: "text-amber-500", bg: "bg-amber-500", stroke: "#F59E0B" }
    }

    return { availableCapacity: capacity, dti: Math.round(ratio), status }
  }, [income, housing, utilities, debts])

  const radius = 60
  const circumference = Math.PI * radius
  let fillPercentage = dti / 100
  if (fillPercentage > 1) fillPercentage = 1
  const strokeDashoffset = circumference - (fillPercentage * circumference)

  const canSubmit = consent && email.trim() && name.trim() && income > 0

  async function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income, housing, utilities, debts,
          contact: { name, email },
          consent: { granted: true, privacyNoticeVersion: PRIVACY_NOTICE_VERSION },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al evaluar elegibilidad.")
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Column: Inputs ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Income */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-300/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Banknote size={20} className="text-teal-600" />
              <h3 className="text-lg font-bold text-navy-900">Ingreso Mensual</h3>
            </div>
            <div className="relative z-10">
              <label className="block text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">
                INGRESO NETO (DESPUÉS DE IMPUESTOS)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-bold text-lg">$</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full bg-white border border-surface-300 focus:border-teal-500 rounded-xl py-4 pl-8 pr-4 text-navy-900 font-bold text-lg transition-colors focus:outline-none focus:ring-4 focus:ring-teal-500/10 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Fixed Expenses */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-300/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Home size={20} className="text-navy-700" />
              <h3 className="text-lg font-bold text-navy-900">Gastos Fijos</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">VIVIENDA (RENTA/HIPOTECA)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
                  <input type="number" value={housing} onChange={(e) => setHousing(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">SERVICIOS BÁSICOS</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
                  <input type="number" value={utilities} onChange={(e) => setUtilities(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Debts */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-300/60 shadow-sm bg-gradient-to-br from-surface-100 to-white">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard size={20} className="text-navy-700" />
              <h3 className="text-lg font-bold text-navy-900">Deudas Actuales</h3>
            </div>
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wide">PAGOS MÍNIMOS MENSUALES</label>
                <span className="text-2xl font-bold text-navy-900">${debts.toLocaleString()}</span>
              </div>
              <input type="range" min="0" max="5000" step="50" value={debts}
                onChange={(e) => setDebts(Number(e.target.value))}
                className="w-full h-2 bg-surface-300 rounded-lg appearance-none cursor-pointer accent-navy-900 focus:outline-none"
                style={{ background: `linear-gradient(to right, #0F172A ${(debts / 5000) * 100}%, #CBD5E1 ${(debts / 5000) * 100}%)` }}
              />
            </div>
          </div>

          {/* Captura de contacto + consentimiento */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-300/60 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-navy-900">Ver mis opciones personalizadas</h3>
            <p className="text-sm text-navy-500">
              Ingresa tus datos para ver qué productos encajan con tu perfil declarado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">NOMBRE</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">CORREO</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* Consentimiento LFPDPPP */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all ${
                consent ? "bg-teal-500 border-teal-500" : "border-surface-400 group-hover:border-navy-300"
              }`}>
                {consent && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="sr-only" />
              <span className="text-xs text-navy-600 leading-relaxed">
                Acepto el{" "}
                <Link href="/aviso-privacidad" className="text-teal-600 underline font-semibold" target="_blank">
                  Aviso de Privacidad
                </Link>{" "}
                y el tratamiento de mis datos personales para evaluar mi elegibilidad en las ofertas presentadas,
                de conformidad con la LFPDPPP. Krediteca no otorga crédito; actúa como plataforma comparativa.
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Activity size={18} />
              {loading ? "Calculando..." : "Ver mis opciones"}
            </button>
            {!canSubmit && !loading && (
              <p className="text-xs text-center text-navy-400">
                Completa nombre, correo y acepta el aviso para continuar.
              </p>
            )}
          </div>

          {/* Resultado: ofertas rankeadas */}
          {result && (
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-300/60 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-teal-600" />
                <h3 className="text-lg font-bold text-navy-900">Tus opciones con mayor probabilidad</h3>
              </div>

              {result.offers.length === 0 && (
                <p className="text-sm text-navy-500">
                  Con el perfil declarado actual, ninguna oferta cumple los criterios mínimos.
                  Considera reducir tus deudas o aumentar tu ingreso declarado.
                </p>
              )}

              {result.offers.map((offer) => {
                const band = BAND_LABELS[offer.band] ?? BAND_LABELS.baja
                return (
                  <div key={offer.offerId} className={`flex items-center justify-between p-4 rounded-2xl border ${band.bg}`}>
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wide ${band.color}`}>
                        {band.label}
                      </span>
                      <p className="text-sm font-bold text-navy-900 capitalize">{offer.offerId}</p>
                    </div>
                    <a
                      href={offer.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      Solicitar <ArrowRight size={12} />
                    </a>
                  </div>
                )
              })}

              {result.excluded?.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-navy-400 cursor-pointer hover:text-navy-600">
                    Ver ofertas no disponibles ({result.excluded.length})
                  </summary>
                  <div className="mt-3 space-y-2">
                    {result.excluded.map((ex) => (
                      <div key={ex.offerId} className="flex items-start gap-3 p-3 bg-surface-50 rounded-xl border border-surface-200">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-navy-600 capitalize">{ex.offerId}</p>
                          <p className="text-xs text-navy-400">{EXCLUSION_LABELS[ex.reason] ?? ex.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              <p className="text-[11px] text-navy-400 leading-relaxed border-t border-surface-100 pt-3">
                La elegibilidad se evalúa con base en los datos declarados y reglas de perfil.
                No garantiza la aprobación por parte del producto financiero seleccionado.
              </p>
            </div>
          )}

        </div>

        {/* ── Right Column: Outputs ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Capacity Result Card */}
          <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-surface-300/60 shadow-card text-center flex flex-col items-center">
            <h3 className="text-sm font-bold text-navy-900 mb-2">Capacidad Disponible</h3>
            <div className="text-6xl font-bold text-teal-700 tracking-tight mb-2">
              ${availableCapacity.toLocaleString()}
            </div>
            <p className="text-sm text-surface-400 mb-10">por mes</p>

            {/* SVG Semi-Circle Gauge */}
            <div className="relative w-48 h-24 overflow-hidden mb-6">
              <svg className="w-full h-full transform" viewBox="0 0 140 70">
                <path d="M 10,70 A 60,60 0 0,1 130,70" fill="none" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" />
                <path d="M 10,70 A 60,60 0 0,1 130,70"
                  fill="none" stroke={status.stroke} strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-surface-200 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${status.bg}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${status.color}`}>{status.text}</span>
              </div>
            </div>

            <div className="w-full h-px bg-surface-200 mb-6"></div>
            <div className="w-full flex justify-between items-center">
              <span className="text-sm font-medium text-navy-500">Ratio Deuda-Ingreso</span>
              <span className="text-base font-bold text-navy-900">{dti}%</span>
            </div>
          </div>

          {/* Strategic Insight Box */}
          <div className="bg-[#E0E7FF] rounded-[2rem] p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full border-[16px] border-indigo-500/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-indigo-900" />
                <h3 className="text-base font-bold text-indigo-950">Análisis Estratégico</h3>
              </div>
              <p className="text-sm text-indigo-900 leading-relaxed mb-6">
                {status.text === "Saludable"
                  ? `Estás en una posición cómoda. Con $${availableCapacity.toLocaleString()} de capacidad mensual excedente, tienes espacio para financiar una compra moderada sin estresar tu presupuesto.`
                  : status.text === "Precaución"
                  ? `Tu presupuesto está ajustado. Con $${availableCapacity.toLocaleString()} disponibles, te recomendamos considerar consolidar tus deudas actuales para liberar flujo de efectivo antes de asumir un nuevo crédito.`
                  : `Tu nivel de endeudamiento es alto. Es recomendable reducir tus deudas actuales antes de adquirir nuevos compromisos financieros para evitar estrés económico.`
                }
              </p>
              <div className="bg-indigo-900/5 rounded-xl p-4">
                <p className="text-xs text-indigo-950 font-medium">
                  <span className="font-bold">Recomendación:</span> Mantén el total de tus pagos mensuales por debajo del 36% de tu ingreso neto para conservar un estado &quot;Saludable&quot;.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
