"use client"

import { useState, useMemo } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Trash2, PlusCircle, Sparkles } from "lucide-react"

export default function ConsolidationPage() {
  const [debts, setDebts] = useState([
    { id: 1, type: "Tarjeta de Crédito", balance: 12500, rate: 21.5 },
    { id: 2, type: "Préstamo Personal", balance: 8200, rate: 14.2 }
  ])

  // New consolidation loan estimated rate
  const consolidationRate = 8.5
  const termMonths = 36 // Assuming 3 years for comparison

  const addDebt = () => {
    const newId = debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1
    setDebts([...debts, { id: newId, type: "Otra Deuda", balance: 0, rate: 0 }])
  }

  const removeDebt = (id) => {
    setDebts(debts.filter(d => d.id !== id))
  }

  const updateDebt = (id, field, value) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d))
  }

  // Calculate PMT (Monthly Payment)
  const calculatePMT = (principal, annualRate, months) => {
    if (principal <= 0) return 0
    if (annualRate <= 0) return principal / months
    const r = (annualRate / 100) / 12
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  }

  const { totalBalance, currentMonthly, newMonthly, savings } = useMemo(() => {
    let totalBal = 0
    let currMon = 0

    debts.forEach(debt => {
      totalBal += debt.balance
      // Assuming existing debts are also amortized over the same term for a fair comparison,
      // or we just calculate their specific PMT
      currMon += calculatePMT(debt.balance, debt.rate, termMonths)
    })

    const newMon = calculatePMT(totalBal, consolidationRate, termMonths)
    const sav = currMon - newMon

    return {
      totalBalance: totalBal,
      currentMonthly: currMon,
      newMonthly: newMon,
      savings: sav > 0 ? sav : 0
    }
  }, [debts])

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Calculadoras" />

      <main className="flex-1 bg-surface-100 pb-20">
        
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight mb-4">
            Recupera tu Claridad Financiera
          </h1>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Consolida tus múltiples deudas en un solo pago mensual manejable. 
            Observa tus ahorros potenciales al instante con nuestra calculadora segura.
          </p>
        </section>

        {/* Simulator Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Inputs ── */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-surface-300/60 shadow-sm relative">
                
                <h2 className="text-2xl font-bold text-navy-900 mb-8">Tus Deudas Actuales</h2>

                <div className="space-y-6 mb-8">
                  {debts.map((debt, index) => (
                    <div key={debt.id} className="bg-surface-100 rounded-2xl p-4 sm:p-6 border border-surface-200 flex flex-col sm:flex-row gap-4 sm:gap-6 items-end relative group transition-all hover:border-teal-200 hover:shadow-sm">
                      
                      {/* Tipo de Deuda */}
                      <div className="w-full sm:flex-1">
                        <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wide mb-1.5">
                          Tipo de Deuda
                        </label>
                        <input 
                          type="text"
                          value={debt.type}
                          onChange={(e) => updateDebt(debt.id, 'type', e.target.value)}
                          className="w-full bg-white border border-surface-300 focus:border-teal-500 rounded-xl py-2.5 px-4 text-navy-900 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                      </div>

                      {/* Saldo */}
                      <div className="w-full sm:flex-1">
                        <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wide mb-1.5">
                          Saldo Pendiente
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 font-semibold text-sm">$</span>
                          <input 
                            type="number"
                            value={debt.balance === 0 ? '' : debt.balance}
                            onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                            className="w-full bg-white border border-surface-300 focus:border-teal-500 rounded-xl py-2.5 pl-7 pr-3 text-navy-900 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                          />
                        </div>
                      </div>

                      {/* Tasa */}
                      <div className="w-full sm:w-28">
                        <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wide mb-1.5">
                          Tasa Anual
                        </label>
                        <div className="relative">
                          <input 
                            type="number"
                            step="0.1"
                            value={debt.rate === 0 ? '' : debt.rate}
                            onChange={(e) => updateDebt(debt.id, 'rate', Number(e.target.value))}
                            className="w-full bg-white border border-surface-300 focus:border-teal-500 rounded-xl py-2.5 pl-3 pr-7 text-navy-900 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 font-semibold text-sm">%</span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      {debts.length > 1 && (
                        <button 
                          onClick={() => removeDebt(debt.id)}
                          className="w-10 h-10 shrink-0 rounded-xl bg-white border border-surface-200 text-surface-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
                          aria-label="Eliminar deuda"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Debt Button */}
                <button 
                  onClick={addDebt}
                  className="w-full border-2 border-dashed border-surface-300 hover:border-teal-400 bg-surface-50 hover:bg-teal-50/50 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-navy-500 hover:text-teal-700 transition-all mb-8"
                >
                  <PlusCircle size={18} />
                  AGREGAR OTRA DEUDA
                </button>

                <div className="h-px w-full bg-surface-200 mb-8"></div>

                {/* Total Balance */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end bg-surface-100 p-6 rounded-2xl border border-surface-200">
                  <span className="text-sm font-bold text-navy-500 uppercase tracking-wider mb-2 sm:mb-0">
                    Total Deuda Actual
                  </span>
                  <span className="text-4xl font-bold text-navy-900">
                    ${totalBalance.toLocaleString()}
                  </span>
                </div>

              </div>
            </div>

            {/* ── Right Column: Outputs ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Savings Card */}
              <div className="bg-teal-700 rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
                {/* Abstract graphic */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xs font-bold text-teal-100 uppercase tracking-widest mb-4">
                    Ahorro Mensual Estimado
                  </h3>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-6xl sm:text-7xl font-bold tracking-tighter">
                      ${Math.round(savings).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-teal-100 leading-relaxed font-medium">
                    Al consolidar en un solo préstamo de Krediteca con una tasa estimada del <strong className="text-white">{consolidationRate}% CAT</strong>.
                  </p>
                </div>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                
                {/* Current */}
                <div className="bg-surface-200 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-3">
                    MENSUALIDAD ACTUAL
                  </span>
                  <div className="text-3xl font-bold text-navy-900 mb-2">
                    ${Math.round(currentMonthly).toLocaleString()}
                  </div>
                  <span className="text-xs font-medium text-surface-400 line-through decoration-surface-400">
                    Múltiples Pagos
                  </span>
                </div>

                {/* New */}
                <div className="bg-white border border-teal-100 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Sparkles size={24} className="text-teal-600" />
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-3 relative z-10">
                    NUEVA MENSUALIDAD
                  </span>
                  <div className="text-3xl font-bold text-teal-700 mb-2 relative z-10">
                    ${Math.round(newMonthly).toLocaleString()}
                  </div>
                  <span className="text-xs font-medium text-teal-600 relative z-10">
                    Pago Único
                  </span>
                </div>

              </div>

              {/* CTA Card */}
              <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-sm text-center">
                <h3 className="text-xl font-bold text-navy-900 mb-2">
                  ¿Listo para simplificar?
                </h3>
                <p className="text-sm text-navy-500 mb-6 px-4">
                  Revisa tu tasa personalizada sin impactar tu historial crediticio.
                </p>
                <button className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl transition-colors">
                  Ver Mis Opciones
                </button>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
