import Header from "../components/Header"
import Footer from "../components/Footer"

export const metadata = {
  title: "Aviso de Privacidad",
  description: "Aviso de privacidad de Krediteca conforme a la LFPDPPP.",
  alternates: { canonical: "/aviso-privacidad" },
  robots: { index: false },
}

export default function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-navy-900 mb-8">Aviso de Privacidad</h1>

        {/* ⚠️ PLACEHOLDER — Requiere revisión legal antes de capturar datos reales */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-amber-800">
            Este aviso es un borrador de trabajo. Debe ser revisado y validado por un abogado
            especialista en LFPDPPP/CONDUSEF antes de operar en producción.
          </p>
        </div>

        <div className="prose prose-sm text-navy-700 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-navy-900">Responsable del tratamiento</h2>
            <p>
              Krediteca (en adelante &quot;Krediteca&quot;) es responsable del uso y protección de sus datos
              personales, con domicilio en Ciudad de México, México.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-900">Datos que recopilamos</h2>
            <p>
              Al usar la Herramienta de Capacidad de Pago, recopilamos: nombre, correo electrónico,
              ingresos mensuales declarados y gastos declarados. Estos datos son de carácter
              financiero y se tratan de conformidad con la Ley Federal de Protección de Datos
              Personales en Posesión de los Particulares (LFPDPPP).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-900">Finalidad del tratamiento</h2>
            <p>
              Sus datos se utilizan para: (i) evaluar su elegibilidad para productos financieros
              ofrecidos por terceros afiliados; (ii) mostrarle ofertas ordenadas por probabilidad de
              aprobación; (iii) mejorar nuestros modelos de elegibilidad a futuro.
            </p>
            <p>
              Krediteca <strong>no otorga crédito</strong>; actúa como plataforma de comparación y
              ruteo. La decisión crediticia la toma el partner afiliado (Nu, Mercado Pago, Kueski u
              otros).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-900">Transferencia de datos</h2>
            <p>
              Sus datos podrán ser transferidos a los partners afiliados para los que se muestra
              elegibilidad, únicamente con su consentimiento expreso previo (el clic en &quot;Solicitar&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-900">Derechos ARCO</h2>
            <p>
              Puede ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición
              escribiendo a: <a href="mailto:privacidad@krediteca.com" className="text-teal-600 underline">privacidad@krediteca.com</a>.
              Su solicitud será atendida en un plazo máximo de 20 días hábiles conforme a la LFPDPPP.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-900">Conservación</h2>
            <p>
              Sus datos se conservarán durante el tiempo necesario para cumplir la finalidad descrita
              y conforme a las disposiciones legales aplicables. [<em>Especificar plazo — pendiente de revisión legal</em>]
            </p>
          </section>

          <p className="text-xs text-navy-400 border-t border-surface-200 pt-4">
            Versión del aviso: 2026-06-09 (borrador). CONDUSEF: [<em>número de registro</em>].
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
