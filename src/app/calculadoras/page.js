
import Link from "next/link"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Banknote, Calculator, Wallet, PiggyBank, TrendingUp, ArrowRight } from "lucide-react"

export default function CalculadorasPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Calculadoras" />

      <main className="flex-1 bg-surface-100 pb-20">
        
        {/* ── Header Section ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy-900 tracking-tight mb-5">
            Calculadoras Financieras
          </h1>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-2xl mx-auto">
            Toma el control de tus finanzas con nuestras herramientas interactivas. Simula escenarios, 
            calcula costos y encuentra la mejor estrategia para tu dinero con total transparencia.
          </p>
        </section>

        {/* ── Calculators Grid ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Simulador de Préstamos */}
            <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-card flex flex-col h-full hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center mb-6 shrink-0">
                <Banknote size={20} className="text-navy-700" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Simulador de Préstamos
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-8 flex-1">
                Calcula tus cuotas mensuales, el interés total y visualiza la tabla de 
                amortización para cualquier tipo de préstamo.
              </p>
              <Link href="/calculadoras/prestamos" className="w-full flex items-center justify-center gap-2 bg-[#5CE1E6] hover:bg-[#4ddbdc] text-teal-950 text-sm font-bold py-3.5 rounded-full transition-colors">
                Iniciar Simulación
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Cálculo de CAT */}
            <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-card flex flex-col h-full hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center mb-6 shrink-0">
                <Calculator size={20} className="text-navy-700" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Cálculo de CAT
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-8 flex-1">
                Descubre el Costo Anual Total real de tus tarjetas o créditos incluyendo 
                comisiones, seguros e impuestos ocultos.
              </p>
              <Link href="/calculadoras/cat" className="w-full flex items-center justify-center gap-2 bg-transparent border border-surface-300 hover:bg-surface-200 text-navy-800 text-sm font-semibold py-3.5 rounded-full transition-colors">
                Calcular CAT
                <ArrowRight size={16} className="text-navy-500" />
              </Link>
            </div>

            {/* Card 3: Capacidad de Pago */}
            <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-card flex flex-col h-full hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center mb-6 shrink-0">
                <Wallet size={20} className="text-navy-700" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Capacidad de Pago
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-8 flex-1">
                Analiza tus ingresos y gastos para determinar exactamente cuánto 
                puedes destinar a nuevas deudas sin riesgo.
              </p>
              <Link href="/calculadoras/capacidad" className="w-full flex items-center justify-center gap-2 bg-transparent border border-surface-300 hover:bg-surface-200 text-navy-800 text-sm font-semibold py-3.5 rounded-full transition-colors">
                Evaluar Capacidad
                <ArrowRight size={16} className="text-navy-500" />
              </Link>
            </div>

            {/* Card 4: Ahorro por Consolidación (Spans 2 columns on large screens) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-surface-200/50 to-surface-300/30 rounded-[2rem] p-8 sm:p-10 border border-surface-300/60 shadow-card flex flex-col h-full hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-surface-300 flex items-center justify-center mb-6 shrink-0">
                <PiggyBank size={20} className="text-navy-800" />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-navy-900 mb-4">
                  Ahorro por Consolidación
                </h3>
                <p className="text-sm sm:text-base text-navy-600 leading-relaxed mb-8">
                  ¿Tienes múltiples deudas? Descubre cuánto podrías ahorrar al mes y en 
                  intereses totales si las unificas en un solo crédito con mejor tasa.
                </p>
                <Link href="/calculadoras/consolidacion" className="w-auto inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-colors">
                  Analizar Consolidación
                  <ArrowRight size={16} className="text-navy-300" />
                </Link>
              </div>
            </div>

            {/* Card 5: Rendimiento de Inversión */}
            <div className="bg-white rounded-[2rem] p-8 border border-surface-300/60 shadow-card flex flex-col h-full hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center mb-6 shrink-0">
                <TrendingUp size={20} className="text-navy-700" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Rendimiento de Inversión
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-8 flex-1">
                Proyecta el crecimiento de tu dinero con el poder del interés 
                compuesto a través del tiempo.
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-transparent border border-surface-300 hover:bg-surface-200 text-navy-800 text-sm font-semibold py-3.5 rounded-full transition-colors">
                Proyectar Ganancias
                <ArrowRight size={16} className="text-navy-500" />
              </button>
            </div>

          </div>
        </section>

        {/* ── Bottom Image ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="w-full h-64 sm:h-80 lg:h-[400px] rounded-[2rem] overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop" 
              alt="Persona calculando finanzas en su computadora portátil" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
