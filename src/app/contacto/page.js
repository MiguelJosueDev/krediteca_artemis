import Header from "../components/Header"
import Footer from "../components/Footer"
import { Mail, Phone, Linkedin, Twitter, Facebook } from "lucide-react"
import ContactForm from "../components/ContactForm"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Sobre Nosotros" />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="text-center pt-16 pb-12 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-navy-900 leading-tight tracking-tight mb-5">
            Estamos aquí para ayudarte
          </h1>
          <p className="text-base sm:text-lg text-navy-500 max-w-xl mx-auto leading-relaxed">
            ¿Tienes dudas sobre nuestros comparadores o calculadoras? Nuestro equipo
            de expertos está listo para brindarte la claridad financiera que necesitas.
          </p>
        </section>

        {/* ── Contact grid ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* ── Left column: info cards ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Email card */}
              <div className="bg-white rounded-2xl p-6 border border-surface-300/60 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 shrink-0">
                    <Mail size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">Correo Electrónico</h3>
                    <p className="text-sm text-navy-500 leading-relaxed mb-3">
                      Para consultas detalladas o soporte técnico.
                    </p>
                    <a
                      href="mailto:hola@krediteca.com"
                      className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      hola@krediteca.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone card */}
              <div className="bg-white rounded-2xl p-6 border border-surface-300/60 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 shrink-0">
                    <Phone size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900 mb-1">Teléfono</h3>
                    <p className="text-sm text-navy-500 leading-relaxed mb-3">
                      Lunes a Viernes, 9:00 – 18:00 (CST).
                    </p>
                    <a
                      href="tel:+525512345678"
                      className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      +52 55 1234 5678
                    </a>
                  </div>
                </div>
              </div>

              {/* Social card */}
              <div className="bg-white rounded-2xl p-6 border border-surface-300/60 shadow-card">
                <h3 className="font-bold text-navy-900 mb-4">Conecta con nosotros</h3>
                <div className="flex items-center gap-3">
                  {[
                    { Icon: Linkedin, href: "#", label: "LinkedIn" },
                    { Icon: Twitter, href: "#", label: "Twitter" },
                    { Icon: Facebook, href: "#", label: "Facebook" },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-surface-200 hover:bg-navy-900 hover:text-white text-navy-600 transition-all duration-200"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
