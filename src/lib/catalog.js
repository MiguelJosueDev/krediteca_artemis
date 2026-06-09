// Catálogo compartido (datos públicos, importable en cliente y servidor).
// NO poner aquí nada secreto: las API keys de afiliados viven en leadgid.js con
// `import "server-only"`. Esto es solo data de producto y helpers de normalización.

/* ── Tarjetas de crédito (antes inline en CardComparator) ── */
export const allCards = [
  {
    id: 1,
    issuer: "CITIBANAMEX",
    name: "Simplicity",
    rating: 4.8,
    annuity: "Sin costo",
    minIncome: 7000,
    keyBenefit: "Meses sin intereses",
    benefits: ["Meses sin Intereses"],
    color: "from-slate-200 to-slate-300",
    iconBg: "bg-gradient-to-br from-slate-100 to-slate-300",
  },
  {
    id: 2,
    issuer: "AMERICAN EXPRESS",
    name: "Gold Elite Credit Card",
    rating: 4.9,
    annuity: "$1,700",
    annuityNote: "1er año gratis",
    minIncome: 15000,
    keyBenefit: "Bebida gratis Starbucks",
    benefits: ["Cashback"],
    color: "from-slate-700 to-slate-900",
    iconBg: "bg-gradient-to-br from-slate-600 to-slate-900",
  },
  {
    id: 3,
    issuer: "BBVA",
    name: "Tarjeta Azul",
    rating: 4.6,
    annuity: "$748",
    minIncome: 6000,
    keyBenefit: "9% en Puntos BBVA",
    benefits: ["Puntos de Viaje"],
    color: "from-blue-800 to-blue-950",
    iconBg: "bg-gradient-to-br from-blue-700 to-blue-950",
  },
  {
    id: 4,
    issuer: "NU",
    name: "Nu Tarjeta de Crédito",
    rating: 4.7,
    annuity: "Sin costo",
    minIncome: 0,
    keyBenefit: "Sin comisiones ocultas",
    benefits: ["Sin Anualidad"],
    color: "from-purple-500 to-purple-700",
    iconBg: "bg-gradient-to-br from-purple-400 to-purple-700",
  },
  {
    id: 5,
    issuer: "HSBC",
    name: "2Now",
    rating: 4.4,
    annuity: "Sin costo",
    minIncome: 8000,
    keyBenefit: "2% cashback en todo",
    benefits: ["Cashback", "Sin Anualidad"],
    color: "from-red-600 to-red-800",
    iconBg: "bg-gradient-to-br from-red-500 to-red-800",
  },
  {
    id: 6,
    issuer: "BANORTE",
    name: "Mujer Banorte",
    rating: 4.3,
    annuity: "$850",
    minIncome: 10000,
    keyBenefit: "Seguros incluidos",
    benefits: ["Meses sin Intereses"],
    color: "from-red-700 to-red-900",
    iconBg: "bg-gradient-to-br from-red-600 to-red-900",
  },
  {
    id: 7,
    issuer: "SCOTIABANK",
    name: "Scotia Travel Platinum",
    rating: 4.5,
    annuity: "$1,200",
    minIncome: 15000,
    keyBenefit: "Millas en cada compra",
    benefits: ["Puntos de Viaje"],
    color: "from-red-500 to-red-700",
    iconBg: "bg-gradient-to-br from-red-400 to-red-700",
  },
  {
    id: 8,
    issuer: "SANTANDER",
    name: "Free",
    rating: 4.2,
    annuity: "Sin costo",
    minIncome: 5000,
    keyBenefit: "Sin anualidad de por vida",
    benefits: ["Sin Anualidad", "Cashback"],
    color: "from-red-600 to-red-800",
    iconBg: "bg-gradient-to-br from-red-500 to-red-800",
  },
  {
    id: 9,
    issuer: "INBURSA",
    name: "Clásica Inbursa",
    rating: 4.0,
    annuity: "$500",
    minIncome: 4500,
    keyBenefit: "Tasa preferencial",
    benefits: ["Meses sin Intereses"],
    color: "from-green-700 to-green-900",
    iconBg: "bg-gradient-to-br from-green-600 to-green-900",
  },
]

export const benefitOptions = [
  "Cashback",
  "Puntos de Viaje",
  "Sin Anualidad",
  "Meses sin Intereses",
]

export const issuerOptions = [
  "Todos los emisores",
  "CITIBANAMEX",
  "AMERICAN EXPRESS",
  "BBVA",
  "NU",
  "HSBC",
  "BANORTE",
  "SCOTIABANK",
  "SANTANDER",
  "INBURSA",
]

export const sortOptions = ["Recomendadas", "Menor anualidad", "Mayor rating", "Menor ingreso"]

/* ── Normalización a una forma común para el comparador ──
   Tarjetas y préstamos son productos distintos: cada uno llena solo sus campos
   y el resto queda null. La vista muestra "—" donde no aplica (sin fingir
   equivalencias, que en YMYL sería engañoso). */

export function normalizeCard(c) {
  return {
    key: `card:${c.id}`,
    type: "card",
    id: c.id,
    brand: c.issuer,
    name: c.name,
    rating: c.rating,
    chipBg: c.iconBg,
    initial: c.issuer.charAt(0),
    badge: null,
    rate: null,
    annuity: c.annuityNote ? `${c.annuity} (${c.annuityNote})` : c.annuity,
    minIncome: c.minIncome,
    keyBenefit: c.keyBenefit,
    regulatedBy: null,
    country: "México",
    aprPct: null, // una tarjeta cobra anualidad, no interés anualizable así
    ctaHref: "#", // placeholder hasta que existan deeplinks de tarjetas
  }
}

export function normalizeLoan(l) {
  return {
    key: `loan:${l.id}`,
    type: "loan",
    id: l.id,
    brand: l.bank,
    name: l.product,
    rating: l.rating,
    chipBg: l.color,
    initial: l.initial,
    badge: l.badge,
    rate: `${l.catLabel || "CAT desde"} ${l.cat}`,
    annuity: null,
    minIncome: null,
    keyBenefit: null,
    regulatedBy: l.regulatedBy,
    country: l.country,
    aprPct: l.aprPct ?? null, // tasa anual numérica para estimar intereses
    ctaHref: `/api/go/${l.id}`, // invariante #3: outbound siempre vía /api/go/[id]
  }
}

// Filas de la tabla comparativa. Cada una resuelve su celda desde el item
// normalizado y cae a "—" cuando el producto no tiene ese atributo.
export const COMPARE_ROWS = [
  { label: "Calificación", cell: (i) => (i.rating ? `★ ${i.rating}` : "—") },
  { label: "CAT / Tasa", cell: (i) => i.rate || "—" },
  { label: "Anualidad", cell: (i) => i.annuity || "—" },
  {
    label: "Ingreso mínimo",
    cell: (i) =>
      i.minIncome != null ? `$${i.minIncome.toLocaleString("es-MX")}` : "—",
  },
  { label: "Beneficio clave", cell: (i) => i.keyBenefit || "—" },
  { label: "Regulación", cell: (i) => i.regulatedBy || "—" },
  { label: "País", cell: (i) => i.country || "—" },
]

// Tope de items comparables a la vez (mantiene la tabla legible en móvil).
export const MAX_COMPARE = 4

/**
 * Estimación de intereses en pesos.
 * Interés SIMPLE a la tasa anual mostrada: monto × tasa × (meses/12).
 * Es deliberadamente una aproximación transparente: NO amortiza, NO incluye
 * comisiones ni IVA, y usa la tasa tal cual se muestra (que en algunos productos
 * es un máximo y en otros un mínimo). Para un cálculo exacto de un solo préstamo
 * está /calculadoras/prestamos. Devuelve null si el item no tiene tasa (tarjetas).
 */
export function estimateInterest({ aprPct, monto, plazoMeses }) {
  if (aprPct == null || !monto || monto <= 0 || !plazoMeses || plazoMeses <= 0) {
    return null
  }
  return monto * (aprPct / 100) * (plazoMeses / 12)
}
