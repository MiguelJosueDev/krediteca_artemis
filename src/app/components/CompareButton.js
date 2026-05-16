"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export default function CompareButton({ offerId }) {
  const [isComparing, setIsComparing] = useState(false)

  const handleCompareToggle = () => {
    setIsComparing(!isComparing)
    
    // Aquí iría la lógica para interactuar con un contexto de "Comparador"
    // Ejemplo:
    // if (!isComparing) addOfferToComparison(offerId)
    // else removeOfferFromComparison(offerId)
  }

  return (
    <button 
      onClick={handleCompareToggle}
      className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all flex items-center gap-1 justify-center ${
        isComparing 
          ? "bg-teal-50 border-teal-200 text-teal-700" 
          : "border-surface-300 text-navy-500 hover:text-navy-700 hover:bg-surface-50"
      }`}
    >
      {isComparing ? (
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
