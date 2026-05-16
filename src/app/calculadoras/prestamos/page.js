"use client"

import { useState, useMemo } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { ChevronDown, ArrowRight, ShieldCheck, ChevronRight } from "lucide-react"

export default function PrestamosSimulatorPage() {
  const [loanAmount, setLoanAmount] = useState(25000)
  const [termLength, setTermLength] = useState(36) // months
  const [creditScore, setCreditScore] = useState("excellent")

  // Mock APR based on credit score
  const rates = {
    excellent: 8.4,
    good: 12.5,
    fair: 18.2,
    poor: 24.5,
  }

  const annualRate = rates[creditScore] || 8.4

  // Calculations
  const { monthlyPayment, totalInterest } = useMemo(() => {
    const p = loanAmount
    const r = annualRate / 100 / 12 // monthly interest rate
    const n = termLength

    if (r === 0) return { monthlyPayment: p / n, totalInterest: 0 }

    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = payment * n
    const interest = total - p

    return {
      monthlyPayment: payment,
      totalInterest: interest > 0 ? interest : 0,
    }
  }, [loanAmount, termLength, annualRate])

  // Chart values
  const totalAmount = loanAmount + totalInterest
  const principalPercentage = (loanAmount / totalAmount) * 100
  const interestPercentage = (totalInterest / totalAmount) * 100

  // SVG Circle Logic for the doughnut chart
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (principalPercentage / 100) * circumference

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Calculadoras" />

      <main className="flex-1 bg-surface-100 pb-20">
        
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight mb-4">
            Simulador de Préstamos Personales
          </h1>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-3xl">
            Diseña tu estrategia de pago óptima. Ajusta los parámetros a continuación para ver un 
            desglose en tiempo real de tu posible estructura de préstamo, completamente transparente.
          </p>
        </section>

        {/* Simulator Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Inputs ── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Main Controls Card */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-surface-300/60 shadow-card">
                
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
                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-navy-900 focus:outline-none"
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
                <div className="mb-10">
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
                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-navy-900 focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #0F172A ${(termLength - 12) / 72 * 100}%, #E2E8F0 ${(termLength - 12) / 72 * 100}%)`
                    }}
                  />
                  <div className="flex justify-between mt-2 text-xs font-semibold text-navy-400">
                    <span>12 Meses</span>
                    <span>84 Meses</span>
                  </div>
                </div>

                {/* Credit Score */}
                <div>
                  <label className="block text-lg font-bold text-navy-900 mb-4">
                    Score Crediticio Estimado
                  </label>
                  <div className="relative">
                    <select 
                      value={creditScore}
                      onChange={(e) => setCreditScore(e.target.value)}
                      className="w-full appearance-none bg-surface-100 border border-surface-300 text-navy-900 font-semibold rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="excellent">Excelente (720 - 850)</option>
                      <option value="good">Bueno (690 - 719)</option>
                      <option value="fair">Regular (630 - 689)</option>
                      <option value="poor">Malo (Menos de 630)</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-navy-500 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Mini Stats Cards */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-surface-300/60 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-navy-500 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                    EST. TASA ANUAL
                  </span>
                  <div className="text-3xl font-bold text-navy-900">
                    {annualRate.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-surface-300/60 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-navy-500 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                    INTERÉS TOTAL
                  </span>
                  <div className="text-3xl font-bold text-navy-900">
                    ${Math.round(totalInterest).toLocaleString()}
                  </div>
                </div>
              </div>

            </div>

            {/* ── Right Column: Outputs ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Payment Results Card */}
              <div className="bg-navy-900 rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                {/* Background Pattern */}
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
                    {/* SVG Doughnut */}
                    <div className="relative w-24 h-24 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track (Interest) */}
                        <circle
                          cx="50" cy="50" r={radius}
                          fill="transparent" stroke="#0D9488" strokeWidth="12"
                        />
                        {/* Foreground track (Principal) */}
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
                    
                    {/* Legend */}
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

                  <button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl transition-colors">
                    Ver Tabla de Amortización
                  </button>
                </div>
              </div>

              {/* Top Matches Card */}
              <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-navy-900">Mejores Opciones</h3>
                  <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wide">Basado en selección</span>
                </div>

                <div className="space-y-4">
                  {/* Match 1 */}
                  <div className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-surface-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-navy-700 font-bold">
                        B
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-900">Banregio</h4>
                        <p className="text-[11px] text-navy-500 font-medium">{annualRate}% CAT • Sin comisión apertura</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-navy-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                  
                  {/* Match 2 */}
                  <div className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-surface-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-navy-700 font-bold">
                        S
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-900">Scotiabank</h4>
                        <p className="text-[11px] text-navy-500 font-medium">{(annualRate + 0.3).toFixed(1)}% CAT • Fondeo rápido</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-navy-400 group-hover:text-teal-600 transition-colors" />
                  </div>

                  {/* Match 3 */}
                  <div className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-surface-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-navy-700 font-bold">
                        K
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-900">Kueski</h4>
                        <p className="text-[11px] text-navy-500 font-medium">{(annualRate + 1.2).toFixed(1)}% CAT • Términos flexibles</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-navy-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="relative rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-navy-900/80 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop" 
              alt="Asesor financiero" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="relative z-20 text-center py-20 px-4 sm:px-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                ¿Listo para dar el siguiente paso?
              </h2>
              <p className="text-lg text-navy-100 max-w-2xl mx-auto mb-8">
                Nuestros asesores están disponibles para revisar tu simulación y proporcionar 
                orientación personalizada sobre tu solicitud de préstamo.
              </p>
              <button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 font-semibold py-4 px-8 rounded-full backdrop-blur-md transition-all duration-300">
                Hablar con un Asesor
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
