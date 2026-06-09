import Header from "../../components/Header"
import Footer from "../../components/Footer"
import LoanSimulator from "./LoanSimulator"
import { getTopOffers } from "@/lib/affiliates/leadgid"
import Link from "next/link"

export const metadata = {
  title: "Simulador de Préstamos Personales",
  description:
    "Simula tu préstamo personal con tasas reales de Nu, Mercado Pago y más. Ve el pago mensual, interés total y tabla de amortización mes a mes.",
  alternates: {
    canonical: "/calculadoras/prestamos",
  },
}

export default async function PrestamosSimulatorPage() {
  const offers = await getTopOffers()

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
            Elige un producto real, ajusta monto y plazo, y ve el desglose exacto de lo que
            pagarías: mensualidad, interés total y tabla de amortización mes a mes.
          </p>
        </section>

        {/* Simulator Grid */}
        <LoanSimulator offers={offers} />

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
              <Link
                href="/contacto"
                className="inline-block bg-white/20 hover:bg-white/30 text-white border border-white/40 font-semibold py-4 px-8 rounded-full backdrop-blur-md transition-all duration-300"
              >
                Hablar con un Asesor
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
