import { getTopOffers } from "@/lib/affiliates/leadgid"
import { ArrowRight, Star } from "lucide-react"
import CompareButton from "../CompareButton"

export default async function OfferCard({ slug }) {
  const allOffers = await getTopOffers()
  const offer = allOffers.find((o) => o.id === slug)

  if (!offer) {
    return (
      <div className="p-4 bg-surface-100 border border-surface-300 rounded-xl text-center text-sm text-navy-500">
        Oferta no disponible en este momento.
      </div>
    )
  }

  return (
    <div className="my-8 bg-white rounded-2xl p-5 border border-surface-300/60 shadow-sm flex flex-col sm:flex-row items-center gap-6">
      {/* Brand Icon */}
      <div className={`w-14 h-14 rounded-2xl ${offer.color} flex items-center justify-center shrink-0 shadow-inner`}>
        <span className="text-2xl font-bold text-white">{offer.initial}</span>
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <h4 className="text-lg font-bold text-navy-900 m-0 leading-tight">
          {offer.product}
        </h4>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
          <div className="flex items-center gap-1 text-sm font-semibold text-navy-700">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            {offer.rating}
          </div>
          <span className="w-1 h-1 rounded-full bg-surface-300"></span>
          <span className="text-xs text-navy-500 uppercase tracking-wider font-semibold">
            CAT: {offer.cat}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
        <a
          href={`/api/go/${offer.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
        >
          Solicitar <ArrowRight size={14} />
        </a>
        <CompareButton offerId={offer.id} />
      </div>
    </div>
  )
}
