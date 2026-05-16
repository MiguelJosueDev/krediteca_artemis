"use client"

import { useState, useEffect } from "react"
import { Check, ArrowRight } from "lucide-react"

const benefits = [
  "Sin afectar tu buró de crédito",
  "100% en línea, sin filas",
  "Respuesta en menos de 3 minutos",
]

export default function Hero() {
  const [loanAmount, setLoanAmount] = useState(15000)
  const [loanTerm, setLoanTerm] = useState(24)

  /* Derived values */
  const minAmount = 5000
  const maxAmount = 50000
  const minTerm = 6
  const maxTerm = 48
  const monthlyRate = 0.025 // illustrative 2.5% monthly
  const monthlyPayment = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1)
  )

  const amountProgress =
    ((loanAmount - minAmount) / (maxAmount - minAmount)) * 100
  const termProgress = ((loanTerm - minTerm) / (maxTerm - minTerm)) * 100

  return (
    <section className="relative overflow-hidden">
      {/* Subtle bg decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-100 via-white to-teal-50/30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Comparador financiero · México
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: copy ── */}
          <div className="animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-navy-900 leading-[1.1] tracking-tight mb-6">
              Préstamos que
              <br />
              respiran claridad.
            </h1>

            <p className="text-lg text-navy-600 leading-relaxed mb-8 max-w-lg">
              Compara tasas, plazos y requisitos reales de bancos y fintech
              mexicanas. Sin letras chiquitas, sin sorpresas.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-teal-500/10">
                    <Check size={14} className="text-teal-600" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-navy-700">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#comparar"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-teal-500/20"
              >
                Comparar préstamos
                <ArrowRight size={16} />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 border border-surface-400 hover:border-navy-300 text-navy-700 font-semibold px-7 py-3.5 rounded-full transition-all hover:bg-surface-200"
              >
                Cómo funciona
              </a>
            </div>
          </div>

          {/* ── Right: calculator card ── */}
          <div className="animate-fadeInUp" style={{ animationDelay: "120ms" }}>
            <div className="bg-white rounded-3xl p-8 shadow-elevated border border-surface-300/50">
              <h2 className="text-lg font-bold text-navy-900 mb-8">
                Calcula tu préstamo
              </h2>

              {/* Amount */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
                    Monto
                  </label>
                  <span className="text-2xl font-bold text-navy-900 tabular-nums">
                    ${loanAmount.toLocaleString("es-MX")}
                  </span>
                </div>
                <input
                  type="range"
                  min={minAmount}
                  max={maxAmount}
                  step={1000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="loan-slider w-full"
                  style={{ "--progress": `${amountProgress}%` }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] text-navy-400">$5k</span>
                  <span className="text-[11px] text-navy-400">$50k</span>
                </div>
              </div>

              {/* Term */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
                    Plazo (meses)
                  </label>
                  <span className="text-2xl font-bold text-navy-900 tabular-nums">
                    {loanTerm}
                  </span>
                </div>
                <input
                  type="range"
                  min={minTerm}
                  max={maxTerm}
                  step={6}
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="loan-slider w-full"
                  style={{ "--progress": `${termProgress}%` }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] text-navy-400">6</span>
                  <span className="text-[11px] text-navy-400">48</span>
                </div>
              </div>

              {/* Result */}
              <div className="border-t border-surface-300 pt-6 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-navy-500">Pago mensual est.</span>
                  <span className="text-3xl font-bold text-navy-900 tabular-nums">
                    ${monthlyPayment.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>

              <a
                href="#opciones"
                className="flex items-center justify-center gap-2 w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-teal-500/20"
              >
                Ver opciones disponibles
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}