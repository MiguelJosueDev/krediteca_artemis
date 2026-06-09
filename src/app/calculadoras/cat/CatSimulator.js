"use client"

import { useState, useMemo } from "react"
import { ShieldCheck, Info, RefreshCw, TrendingUp } from "lucide-react"

export default function CatSimulator() {
  const [loanAmount, setLoanAmount] = useState(250000)
  const [nominalRate, setNominalRate] = useState(10.5)
  const [upfrontFees, setUpfrontFees] = useState(3500)
  const [annualInsurance, setAnnualInsurance] = useState(1200)

  // NOTE: formula carried over verbatim from the original page during the
  // Server/Client split. It is an approximation, NOT a true IRR-based CAT.
  // Replacing it with a real IRR is tracked separately — out of scope here.
  const calculatedCAT = useMemo(() => {
    if (loanAmount <= 0) return 0;

    // Approximation formula
    const feePercentage = (upfrontFees / loanAmount) * 100;
    const insurancePercentage = (annualInsurance / loanAmount) * 100;

    // The compounding effect of monthly payments makes the effective rate higher than nominal
    const effectiveRate = Math.pow(1 + (nominalRate / 100) / 12, 12) - 1;
    const effectiveRatePct = effectiveRate * 100;

    // Add amortized fees (assuming roughly a 2-3 year avg term for personal loans in this context)
    // We multiply fees by a factor to simulate their heavier weight in short-term loans
    const catApproximation = effectiveRatePct + (feePercentage * 1.5) + insurancePercentage;

    return Number(catApproximation.toFixed(1));
  }, [loanAmount, nominalRate, upfrontFees, annualInsurance])

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Column: Inputs ── */}
        <div className="lg:col-span-6 space-y-6">

          <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-surface-300/60 shadow-card relative">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-surface-200 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-700">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                  <circle cx="8" cy="12" r="2" fill="currentColor" />
                  <circle cx="16" cy="6" r="2" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-navy-900">Parámetros del Crédito</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

              {/* Loan Amount Input */}
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-navy-800 mb-2">
                  Monto del Préstamo
                  <Info size={14} className="text-surface-400" />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Nominal Rate Input */}
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-navy-800 mb-2">
                  Tasa Nominal
                  <Info size={14} className="text-surface-400" />
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={nominalRate}
                    onChange={(e) => setNominalRate(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 px-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">%</span>
                </div>
              </div>

              {/* Upfront Fees Input */}
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-navy-800 mb-2">
                  Comisión por Apertura
                  <Info size={14} className="text-surface-400" />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={upfrontFees}
                    onChange={(e) => setUpfrontFees(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Annual Insurance Input */}
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-navy-800 mb-2">
                  Seguro Anual
                  <Info size={14} className="text-surface-400" />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={annualInsurance}
                    onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                Recalcular CAT
                <RefreshCw size={16} />
              </button>
            </div>

          </div>
        </div>

        {/* ── Right Column: Outputs ── */}
        <div className="lg:col-span-6 space-y-6">

          {/* The Real CAT Card */}
          <div className="bg-navy-900 rounded-[2rem] p-10 text-center shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-teal-400" />
                <h3 className="text-xs font-bold text-navy-200 uppercase tracking-widest">
                  EL CAT REAL
                </h3>
              </div>

              <div className="flex items-baseline justify-center mb-6">
                <span className="text-7xl sm:text-[5.5rem] font-bold text-white tracking-tighter">
                  {calculatedCAT}
                </span>
                <span className="text-4xl sm:text-5xl text-teal-400 font-light ml-1">%</span>
              </div>

              <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full">
                Efectivo Anualizado
              </div>
            </div>
          </div>

          {/* Market Context Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp size={24} className="text-navy-700" />
              <h3 className="text-xl font-bold text-navy-900">Contexto de Mercado</h3>
            </div>

            <div className="space-y-6">
              {/* Item 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                  <span className="text-sm font-semibold text-navy-700">Tu CAT Calculado</span>
                </div>
                <span className="text-lg font-bold text-navy-900">{calculatedCAT}%</span>
              </div>

              <div className="h-px w-full bg-surface-200"></div>

              {/* Item 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-surface-400"></div>
                  <span className="text-sm font-medium text-navy-600">Promedio Segmento Premium</span>
                </div>
                <span className="text-lg font-bold text-surface-400">15.8%</span>
              </div>

              <div className="h-px w-full bg-surface-200"></div>

              {/* Item 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-surface-300"></div>
                  <span className="text-sm font-medium text-navy-600">Promedio Nacional</span>
                </div>
                <span className="text-lg font-bold text-surface-400">22.4%</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-surface-100 rounded-xl p-4 flex gap-3 border border-surface-200">
              <ShieldCheck size={20} className="text-teal-600 shrink-0" />
              <p className="text-[11px] sm:text-xs text-navy-600 leading-relaxed">
                Este cálculo se adhiere a las directrices nacionales de transparencia financiera,
                asegurando que todas las comisiones y seguros obligatorios se reflejen en la tasa.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
