const columns = [
  {
    title: "Productos",
    links: [
      { label: "Préstamos", href: "#" },
      { label: "Tarjetas crédito", href: "#" },
      { label: "Tarjetas débito", href: "#" },
      { label: "Calculadoras", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "#" },
      { label: "Glosario", href: "#" },
      { label: "Guías", href: "#" },
      { label: "Noticias", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Equipo editorial", href: "#" },
      { label: "Metodología", href: "#" },
      { label: "Cómo generamos ingresos", href: "#" },
      { label: "Reglas editoriales", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Contacto", href: "#" },
    ],
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-surface-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold text-navy-400 uppercase tracking-[0.12em] mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-navy-600 hover:text-navy-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-surface-300 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="/krediteca_logo_navbar.png" 
              alt="Krediteca" 
              className="h-7 w-auto" 
            />
          </div>

          <p className="text-xs text-navy-400 text-center sm:text-right">
            © {currentYear} Krediteca · México
          </p>
        </div>

        {/* Regulatory Disclaimer (YMYL) */}
        <div className="text-[10px] sm:text-xs text-navy-400 leading-relaxed text-center max-w-4xl mx-auto border-t border-surface-300/50 pt-6">
          <p className="mb-2">
            <strong className="font-semibold text-navy-500">Aviso legal:</strong> Krediteca es una plataforma informativa y comparativa de productos financieros, no somos un banco, financiera, ni emitimos crédito directamente. No captamos recursos del público. Toda la información presentada (incluyendo tasas, CAT y plazos) es con fines ilustrativos y puede variar según la evaluación crediticia de cada institución.
          </p>
          <p>
            Al usar nuestro sitio, aceptas nuestros Términos y Condiciones y Política de Privacidad. Para reportar cualquier anomalía financiera en México, puedes dirigirte a la <a href="https://www.condusef.gob.mx/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy-600">CONDUSEF</a>.
          </p>
        </div>
      </div>
    </footer>
  )
}