import "server-only"

// Fallback estático para asegurar que el sitio siempre renderice incluso si la API falla
const fallbackOffers = [
  {
    id: "nu", // Este ID debe mapear con redirect-map.js
    bank: "Nu",
    product: "Préstamo personal Nu",
    badge: "Selecto",
    badgeColor: "bg-teal-100 text-teal-700",
    rating: 4.6,
    regulatedBy: "Regulado CNBV",
    country: "México",
    cat: "45.5%",
    color: "bg-indigo-600",
    initial: "N",
  },
  {
    id: "mercadopago",
    bank: "Mercado Pago",
    product: "Crédito Mercado Pago",
    badge: null,
    rating: 4.4,
    regulatedBy: "Regulado CNBV",
    country: "México",
    cat: "52.3%",
    color: "bg-sky-500",
    initial: "M",
  },
  {
    id: "kueski",
    bank: "Kueski",
    product: "Kueski Pay",
    badge: "Popular",
    badgeColor: "bg-amber-100 text-amber-700",
    rating: 4.2,
    regulatedBy: "Regulado CNBV",
    country: "México",
    cat: "68.0%",
    color: "bg-emerald-500",
    initial: "K",
  },
]

export async function getTopOffers() {
  // Simularemos la arquitectura de LeadGid pero usaremos el fallback por ahora
  
  /*
  // --- Futura implementación real con ISR ---
  try {
    const res = await fetch("https://api.leadgid.com/v1/offers", {
      headers: {
        Authorization: `Bearer ${process.env.LEADGID_API_KEY}`,
      },
      next: {
        revalidate: 3600, // ISR: revalidar cada 1 hora
        tags: ["offers"], // Permitirá revalidación bajo demanda vía webhook
      },
    });

    if (!res.ok) {
      console.error("LeadGid API failed:", res.statusText);
      return fallbackOffers;
    }

    const data = await res.json();
    return data.offers; // Asumiendo mapeo necesario

  } catch (error) {
    console.error("Error fetching offers from LeadGid:", error);
    return fallbackOffers;
  }
  */

  // Por ahora, para no bloquear el desarrollo, devolvemos el fallback instantáneamente
  return fallbackOffers
}
