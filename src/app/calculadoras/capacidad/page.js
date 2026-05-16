"use client"

import { useState, useMemo } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Banknote, Home, CreditCard, Activity, TrendingUp } from "lucide-react"

export default function PaymentCapacityPage() {
  const [income, setIncome] = useState(6500)
  const [housing, setHousing] = useState(2200)
  const [utilities, setUtilities] = useState(450)
  const [debts, setDebts] = useState(850)

  const { availableCapacity, dti, status } = useMemo(() => {
    const expenses = housing + utilities + debts
    let capacity = income - expenses
    if (capacity < 0) capacity = 0

    // DTI is typically (Housing + Debt) / Income
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

    return {
      availableCapacity: capacity,
      dti: Math.round(ratio),
      status
    }
  }, [income, housing, utilities, debts])

  // SVG Semi-circle logic
  const radius = 60
  const circumference = Math.PI * radius // semi-circle is just PI * r
  // dashoffset for semi-circle filling (0 is full, circumference is empty)
  // map DTI (0-100) to semi-circle (0-180 degrees)
  let fillPercentage = dti / 100
  if (fillPercentage > 1) fillPercentage = 1
  const strokeDashoffset = circumference - (fillPercentage * circumference)

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Calculadoras" />

      <main className="flex-1 bg-surface-100 pb-20">
        
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight mb-4">
            Herramienta de Capacidad de Pago
          </h1>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-3xl">
            Descubre tu verdadero ancho de banda financiero. Ingresa tus datos a continuación para 
            obtener una visión clara y transparente de cuánto compromiso adicional puedes manejar 
            cómodamente.
          </p>
        </section>

        {/* Simulator Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Inputs ── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Income Section */}
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

              {/* Fixed Expenses Section */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-300/60 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Home size={20} className="text-navy-700" />
                  <h3 className="text-lg font-bold text-navy-900">Gastos Fijos</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">
                      VIVIENDA (RENTA/HIPOTECA)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
                      <input 
                        type="number"
                        value={housing}
                        onChange={(e) => setHousing(Number(e.target.value))}
                        className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-400 uppercase tracking-wide mb-2">
                      SERVICIOS BÁSICOS
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-500 font-semibold">$</span>
                      <input 
                        type="number"
                        value={utilities}
                        onChange={(e) => setUtilities(Number(e.target.value))}
                        className="w-full bg-surface-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl py-3 pl-8 pr-4 text-navy-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Debts Section (Slider) */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-300/60 shadow-sm bg-gradient-to-br from-surface-100 to-white">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard size={20} className="text-navy-700" />
                  <h3 className="text-lg font-bold text-navy-900">Deudas Actuales</h3>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-xs font-bold text-navy-400 uppercase tracking-wide">
                      PAGOS MÍNIMOS MENSUALES
                    </label>
                    <span className="text-2xl font-bold text-navy-900">
                      ${debts.toLocaleString()}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="50"
                    value={debts}
                    onChange={(e) => setDebts(Number(e.target.value))}
                    className="w-full h-2 bg-surface-300 rounded-lg appearance-none cursor-pointer accent-navy-900 focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #0F172A ${(debts / 5000) * 100}%, #CBD5E1 ${(debts / 5000) * 100}%)`
                    }}
                  />
                </div>

                <div className="mt-8">
                  <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Activity size={18} />
                    Calcular Capacidad
                  </button>
                </div>
              </div>

            </div>

            {/* ── Right Column: Outputs ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Capacity Result Card */}
              <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-surface-300/60 shadow-card text-center flex flex-col items-center">
                <h3 className="text-sm font-bold text-navy-900 mb-2">
                  Capacidad Disponible
                </h3>
                <div className="text-6xl font-bold text-teal-700 tracking-tight mb-2">
                  ${availableCapacity.toLocaleString()}
                </div>
                <p className="text-sm text-surface-400 mb-10">por mes</p>

                {/* SVG Semi-Circle Gauge */}
                <div className="relative w-48 h-24 overflow-hidden mb-6">
                  <svg className="w-full h-full transform" viewBox="0 0 140 70">
                    {/* Background track */}
                    <path 
                      d="M 10,70 A 60,60 0 0,1 130,70" 
                      fill="none" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" 
                    />
                    {/* Value track */}
                    <path 
                      d="M 10,70 A 60,60 0 0,1 130,70" 
                      fill="none" stroke={status.stroke} strokeWidth="16" strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Status indicator inside the semi-circle */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-surface-200 shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${status.bg}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${status.color}`}>
                      {status.text}
                    </span>
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
                    <h3 className="text-base font-bold text-indigo-950">
                      Análisis Estratégico
                    </h3>
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
                      <span className="font-bold">Recomendación:</span> Mantén el total de tus pagos mensuales por debajo del 36% de tu ingreso neto para conservar un estado "Saludable".
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Bottom Image ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="w-full h-48 sm:h-64 lg:h-80 rounded-[2rem] overflow-hidden shadow-sm relative">
            {/* The mockup shows an illustration or lifestyle photo here */}
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2000&auto=format&fit=crop" 
              alt="Pareja revisando finanzas juntos" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
