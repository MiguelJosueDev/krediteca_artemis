"use client"

import { Check } from "lucide-react"
import { useCompare } from "./compare/CompareProvider"

/**
 * Botón "Comparar" / "En lista".
 * `itemKey` es la clave tipada del catálogo: `card:3`, `loan:kueski`.
 * El estado vive en el contexto global (persistido en localStorage), no aquí,
 * para que la bandeja y los demás botones reaccionen a la misma selección.
 */
export default function CompareButton({ itemKey }) {
  const { has, toggle, count, max } = useCompare()
  const selected = has(itemKey)
  const atLimit = !selected && count >= max

  return (
    <button
      onClick={() => toggle(itemKey)}
      disabled={atLimit}
      title={atLimit ? `Máximo ${max} para comparar` : undefined}
      className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all flex items-center gap-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed ${
        selected
          ? "bg-teal-50 border-teal-200 text-teal-700"
          : "border-surface-300 text-navy-500 hover:text-navy-700 hover:bg-surface-50"
      }`}
    >
      {selected ? (
        <>
          <Check size={12} />
          En lista
        </>
      ) : (
        "Comparar"
      )}
    </button>
  )
}
