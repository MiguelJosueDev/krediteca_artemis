import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ConsolidationSimulator from "./ConsolidationSimulator"

export const metadata = {
  title: "Calculadora de Consolidación de Deudas",
  description:
    "Suma tus deudas y descubre cuánto ahorrarías al consolidarlas en un solo pago mensual. Compara tu mensualidad actual contra una tasa unificada.",
  alternates: {
    canonical: "/calculadoras/consolidacion",
  },
}

export default function ConsolidationPage() {
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
        <ConsolidationSimulator />

      </main>

      <Footer />
    </div>
  )
}
