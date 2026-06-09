import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { ShieldCheck } from "lucide-react"
import CatSimulator from "./CatSimulator"

export const metadata = {
  title: "Calculadora de CAT (Costo Anual Total)",
  description:
    "Calcula el Costo Anual Total real de un crédito: integra tasa nominal, comisiones y seguros obligatorios en una sola métrica transparente.",
  alternates: {
    canonical: "/calculadoras/cat",
  },
}

export default function CATCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Calculadoras" />

      <main className="flex-1 bg-surface-100 pb-20">

        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-teal-600" />
            <span className="text-sm font-bold text-teal-800 uppercase tracking-widest">
              Herramienta de Transparencia
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight mb-4">
            Costo Anual Total (CAT)
          </h1>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-3xl">
            Descubre el verdadero costo de pedir prestado. El Costo Anual Total (CAT) integra las
            tasas nominales con comisiones ocultas y seguros obligatorios para proporcionar una métrica
            definitiva y transparente para una planificación financiera rigurosa.
          </p>
        </section>

        {/* Simulator Grid */}
        <CatSimulator />

      </main>

      <Footer />
    </div>
  )
}
