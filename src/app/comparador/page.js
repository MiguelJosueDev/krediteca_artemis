import Header from "../components/Header"
import Footer from "../components/Footer"
import CardComparator from "./CardComparator"

export const metadata = {
  title: "Comparador de Tarjetas de Crédito",
  description:
    "Compara tarjetas de crédito en México por anualidad, ingreso mínimo y beneficios. Filtra entre los principales bancos y elige la mejor opción para tu perfil.",
  alternates: {
    canonical: "/comparador",
  },
}

export default function ComparadorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Comparador" />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-3">
            Compara Tarjetas de Crédito
          </h1>
          <p className="text-base text-navy-500 max-w-xl leading-relaxed">
            Encuentra la tarjeta perfecta para tu estilo de vida. Filtra por beneficios,
            comisiones y requisitos para tomar la mejor decisión financiera.
          </p>
        </section>

        {/* ── Content grid + mobile drawer (client island) ── */}
        <CardComparator />
      </main>

      <Footer />
    </div>
  )
}
