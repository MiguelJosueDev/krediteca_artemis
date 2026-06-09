import Header from "../../components/Header"
import Footer from "../../components/Footer"
import CapacitySimulator from "./CapacitySimulator"

export const metadata = {
  title: "Calculadora de Capacidad de Pago",
  description:
    "Calcula cuánto crédito puedes manejar cómodamente. Conoce tu ratio deuda-ingreso (DTI) y tu capacidad mensual disponible con datos reales.",
  alternates: {
    canonical: "/calculadoras/capacidad",
  },
}

export default function PaymentCapacityPage() {
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
        <CapacitySimulator />

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
