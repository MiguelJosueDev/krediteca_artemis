import { Shield } from "lucide-react"

const badges = [
  { name: "CONDUSEF", weight: "font-bold" },
  { name: "Banxico", weight: "font-bold" },
  { name: "CNBV", weight: "font-bold" },
  { name: "Buró de Crédito", weight: "font-bold" },
]

export default function TrustBadges() {
  return (
    <section className="border-y border-surface-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-[11px] font-semibold text-navy-400 uppercase tracking-[0.15em] mb-6">
          Información verificada con fuentes oficiales
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {badges.map((b) => (
            <span
              key={b.name}
              className={`text-lg sm:text-xl text-navy-800 ${b.weight} tracking-tight`}
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
