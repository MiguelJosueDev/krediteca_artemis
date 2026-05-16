import { Eye, Clock, ShieldCheck, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Eye,
    title: "Transparencia total",
    description:
      "Visualiza el desglose: cuánto pagas en intereses, comisiones y CAT real.",
    detail: (
      <div className="flex items-center gap-2 mt-4">
        <span className="progress-chip bg-navy-900 text-white">Capital 65%</span>
        <span className="progress-chip bg-teal-100 text-teal-700">Interés 23%</span>
        <span className="progress-chip bg-surface-300 text-navy-600">CAT 18%</span>
      </div>
    ),
  },
  {
    icon: Clock,
    title: "Aprobación en minutos",
    description:
      "Compara, elige y solicita 100% en línea. Respuesta en menos de 3 minutos.",
    detail: (
      <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-navy-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          1. Compara
        </span>
        <span className="text-surface-400">→</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          2. Solicita
        </span>
        <span className="text-surface-400">→</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-300" />
          3. Aprobado
        </span>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Datos protegidos",
    description:
      "Encriptación de grado bancario. No vendemos tu información a terceros. Cumplimos LFPDPPP.",
  },
  {
    icon: TrendingUp,
    title: "Construye tu historial",
    description:
      "¿Sin buró o historial bajo? Encuentra opciones para tu perfil y mejora tu score.",
  },
]

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid sm:grid-cols-2 gap-5 stagger">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              className="group bg-white rounded-2xl p-7 border border-surface-300/60 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fadeInUp"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-200 group-hover:bg-teal-50 transition-colors mb-5">
                <Icon size={20} className="text-navy-700 group-hover:text-teal-600 transition-colors" />
              </div>

              <h3 className="text-lg font-bold text-navy-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-navy-500 leading-relaxed">
                {f.description}
              </p>

              {f.detail && f.detail}
            </div>
          )
        })}
      </div>
    </section>
  )
}
