"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { loanTotals, buildAmortizationSchedule } from "@/lib/finance"
import CompareButton from "../../components/CompareButton"

export default function LoanSimulator({ offers = [] }) {
  const amortizable = offers.filter((o) => o.amortizable !== false)
  const defaultId = amortizable[0]?.id ?? null

  const [selectedId, setSelectedId] = useState(defaultId)
  const [loanAmount, setLoanAmount] = useState(25000)
  const [termLength, setTermLength] = useState(36)
  const [showSchedule, setShowSchedule] = useState(false)

  const selectedOffer = amortizable.find((o) => o.id === selectedId) ?? amortizable[0]
  const annualRate = selectedOffer?.aprPct ?? 0

  const { monthlyPayment, totalInterest } = useMemo(
    () => loanTotals({ principal: loanAmount, annualRatePct: annualRate, months: termLength }),
    [loanAmount, annualRate, termLength]
  )

  const schedule = useMemo(
    () =>
      showSchedule
        ? buildAmortizationSchedule({ principal: loanAmount, annualRatePct: annualRate, months: termLength })
        : [],
    [showSchedule, loanAmount, annualRate, termLength]
  )

  // Doughnut chart
  const totalAmount = loanAmount + totalInterest
  const principalPercentage = totalAmount > 0 ? (loanAmount / totalAmount) * 100 : 100
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (principalPercentage / 100) * circumference

  // "Mejores Opciones": todas las ofertas ordenadas por aprPct asc (mejor CAT primero)
  const sortedOffers = [...offers].sort((a, b) => a.aprPct - b.aprPct)

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Column: Inputs ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Main Controls Card */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-surface-300/60 shadow-card">

            {/* Product selector */}
            <div className="mb-10">
              <label className="block text-lg font-bold text-navy-900 mb-4">
                Producto
              </label>
              <div className="relative">
                <select
                  value={selectedId ?? ""}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full appearance-none bg-surface-100 border border-surface-300 text-navy-900 font-semibold rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  {amortizable.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.bank} — {o.product} ({o.catLabel || "CAT"} {o.cat})
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-navy-500 pointer-events-none" />
              </div>
            </div>

            {/* Loan Amount */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <label className="text-lg font-bold text-navy-900">Monto del Préstamo</label>
                <span className="text-3xl font-bold text-teal-600">
                  ${loanAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-navy-900 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #0F172A ${(loanAmount - 1000) / 99000 * 100}%, #E2E8F0 ${(loanAmount - 1000) / 99000 * 100}%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs font-semibold text-navy-400">
                <span>$1,000</span>
                <span>$100,000</span>
              </div>
            </div>

            {/* Term Length */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-lg font-bold text-navy-900">Plazo</label>
                <span className="text-3xl font-bold text-teal-600">
                  {termLength} <span className="text-xl">meses</span>
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="84"
                step="12"
                value={termLength}
                onChange={(e) => setTermLength(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-navy-900 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #0F172A ${(termLength - 12) / 72 * 100}%, #E2E8F0 ${(termLength - 12) / 72 * 100}%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs font-semibold text-navy-400">
                <span>12 Meses</span>
                <span>84 Meses</span>
              </div>
            </div>

          </div>

          {/* Mini Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-surface-300/60 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-navy-500 font-bold uppercase tracking-wider text-[10px] mb-2">
                CAT DEL PRODUCTO
              </span>
              <div className="text-3xl font-bold text-navy-900">
                {annualRate.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-surface-300/60 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-navy-500 font-bold uppercase tracking-wider text-[10px] mb-2">
                INTERÉS TOTAL
              </span>
              <div className="text-3xl font-bold text-navy-900">
                ${Math.round(totalInterest).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Amortization Table */}
          {showSchedule && (
            <div className="bg-white rounded-[2rem] border border-surface-300/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-200">
                <h3 className="text-base font-bold text-navy-900">Tabla de Amortización</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-surface-50">
                    <tr>
                      {["Mes", "Pago", "Capital", "Interés", "Saldo"].map((h) => (
                        <th key={h} className="px-4 py-2 text-[11px] font-bold text-navy-400 uppercase tracking-wide text-right first:text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr key={row.month} className="border-t border-surface-100 hover:bg-surface-50">
                        <td className="px-4 py-2 font-medium text-navy-600">{row.month}</td>
                        <td className="px-4 py-2 text-right text-navy-800">${Math.round(row.payment).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-indigo-700">${Math.round(row.principalPart).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-teal-700">${Math.round(row.interestPart).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-semibold text-navy-900">${Math.round(row.balance).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* ── Right Column: Outputs ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Payment Results Card */}
          <div className="bg-navy-900 rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="80" height="80" rx="10" />
                <rect x="25" y="25" width="20" height="50" rx="2" fill="white" />
                <rect x="55" y="25" width="20" height="50" rx="2" fill="white" />
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-xs font-bold text-navy-300 uppercase tracking-widest mb-2">
                Pago Mensual Estimado
              </h3>
              <div className="flex items-baseline mb-10 border-b border-navy-800 pb-10">
                <span className="text-6xl font-bold tracking-tight">
                  ${Math.round(monthlyPayment).toLocaleString()}
                </span>
                <span className="text-xl text-navy-400 font-medium ml-2">/mo</span>
              </div>

              {/* Chart and Legend */}
              <div className="flex items-center gap-8 mb-10">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#0D9488" strokeWidth="12" />
                    <circle
                      cx="50" cy="50" r={radius}
                      fill="transparent" stroke="#818CF8" strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                      <span className="text-sm font-medium text-navy-200">Capital</span>
                    </div>
                    <span className="text-sm font-bold text-white">${Math.round(loanAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                      <span className="text-sm font-medium text-navy-200">Interés</span>
                    </div>
                    <span className="text-sm font-bold text-white">${Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSchedule((s) => !s)}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl transition-colors"
              >
                {showSchedule ? "Ocultar Tabla de Amortización" : "Ver Tabla de Amortización"}
              </button>
            </div>
          </div>

          {/* Mejores Opciones — productos reales del catálogo */}
          <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-900">Mejores Opciones</h3>
              <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wide">Menor CAT primero</span>
            </div>

            <div className="space-y-4">
              {sortedOffers.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-surface-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`shrink-0 w-10 h-10 ${loan.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {loan.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-navy-900">{loan.bank}</span>
                        {loan.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${loan.badgeColor}`}>
                            {loan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-navy-500 font-medium">
                        {loan.catLabel || "CAT desde"} {loan.cat}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <CompareButton itemKey={`loan:${loan.id}`} />
                    <a
                      href={`/api/go/${loan.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                    >
                      Solicitar
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer YMYL */}
            <p className="mt-5 text-[11px] text-navy-400 leading-relaxed border-t border-surface-100 pt-4">
              El simulador asume un préstamo a <strong>plazos fijos</strong> con mensualidades iguales
              (amortización francesa). El CAT real puede incluir comisiones e IVA no modelados aquí.
              Algunos productos no son a plazos fijos y no aparecen en el selector de cálculo.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
