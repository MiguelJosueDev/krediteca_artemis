import { Star, ArrowRight, ExternalLink } from "lucide-react"
import { getTopOffers } from "@/lib/affiliates/leadgid"
import CompareButton from "./CompareButton"

export default async function TopLoans() {
  const loans = await getTopOffers()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
          Top préstamos personales este mes
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-xs text-navy-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center text-[10px] font-bold text-navy-500">
              AI
            </div>
            <span>
              Revisado por <strong className="text-navy-600">Alonso Rodríguez</strong> · Experto en productos bancarios · Actualizado hoy
            </span>
          </div>
        </div>
      </div>

      {/* Header row */}
      <div className="hidden sm:flex items-center justify-end mb-2 pr-4">
        <a
          href="#ver-todos"
          className="text-sm font-semibold text-navy-600 hover:text-teal-600 transition-colors flex items-center gap-1"
        >
          Ver todos <ArrowRight size={14} />
        </a>
      </div>

      {/* Loan cards */}
      <div className="space-y-4">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="group bg-white rounded-2xl border border-surface-300/60 shadow-card hover:shadow-card-hover transition-all duration-300 p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Logo */}
              <div
                className={`shrink-0 w-14 h-14 ${loan.color} rounded-xl flex items-center justify-center text-white text-xl font-bold`}
              >
                {loan.initial}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-navy-400 font-medium uppercase tracking-wide">
                    {loan.bank}
                  </span>
                  {loan.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${loan.badgeColor}`}
                    >
                      {loan.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-navy-900 mb-1">
                  {loan.product}
                </h3>
                <div className="flex items-center gap-3 text-xs text-navy-400">
                  <span className="flex items-center gap-0.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    {loan.rating}
                  </span>
                  <span>·</span>
                  <span>{loan.country}</span>
                  <span>·</span>
                  <span>{loan.regulatedBy}</span>
                </div>
              </div>

              {/* CAT + Actions */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                <div className="text-right">
                  <span className="block text-[10px] font-semibold text-navy-400 uppercase tracking-wide">
                    CAT desde
                  </span>
                  <span className="text-2xl font-bold text-navy-900 tabular-nums">
                    {loan.cat}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={`/api/go/${loan.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all"
                  >
                    Solicitar <ArrowRight size={14} />
                  </a>
                  <CompareButton offerId={loan.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden mt-6 text-center">
        <a
          href="#ver-todos"
          className="text-sm font-semibold text-navy-600 hover:text-teal-600 transition-colors flex items-center justify-center gap-1"
        >
          Ver todos <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
