"use client"

import { useState, useMemo } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import {
  Star,
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  CreditCard,
  X,
} from "lucide-react"

/* ── Card data ── */
const allCards = [
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

const benefitOptions = [
  "Cashback",
  "Puntos de Viaje",
  "Sin Anualidad",
  "Meses sin Intereses",
]

const issuerOptions = [
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

const sortOptions = ["Recomendadas", "Menor anualidad", "Mayor rating", "Menor ingreso"]

export default function ComparadorPage() {
  const [minIncome, setMinIncome] = useState(0)
  const [selectedBenefits, setSelectedBenefits] = useState(["Puntos de Viaje"])
  const [selectedIssuer, setSelectedIssuer] = useState("Todos los emisores")
  const [issuerOpen, setIssuerOpen] = useState(false)
  const [sortBy, setSortBy] = useState("Recomendadas")
  const [sortOpen, setSortOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(3)
  const [mobileFilters, setMobileFilters] = useState(false)

  const toggleBenefit = (b) => {
    setSelectedBenefits((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    )
  }

  const clearFilters = () => {
    setMinIncome(0)
    setSelectedBenefits([])
    setSelectedIssuer("Todos los emisores")
  }

  const filtered = useMemo(() => {
    let result = allCards.filter((c) => c.minIncome <= (minIncome || 90000))

    if (selectedBenefits.length > 0) {
      result = result.filter((c) =>
        selectedBenefits.some((b) => c.benefits.includes(b))
      )
    }

    if (selectedIssuer !== "Todos los emisores") {
      result = result.filter((c) => c.issuer === selectedIssuer)
    }

    if (sortBy === "Mayor rating") result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === "Menor ingreso") result.sort((a, b) => a.minIncome - b.minIncome)

    return result
  }, [minIncome, selectedBenefits, selectedIssuer, sortBy])

  const incomeProgress = (minIncome / 90000) * 100

  /* ── Filter panel (shared between desktop sidebar + mobile drawer) ── */
  const FilterPanel = ({ onClose }) => (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy-900">Filtros</h3>
        <button
          onClick={clearFilters}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Income slider */}
      <div>
        <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">
          Ingresos Mínimos (Mensuales)
        </label>
        <input
          type="range"
          min={0}
          max={90000}
          step={1000}
          value={minIncome}
          onChange={(e) => setMinIncome(parseInt(e.target.value))}
          className="loan-slider w-full"
          style={{ "--progress": `${incomeProgress}%` }}
        />
        <div className="flex justify-between mt-1.5 text-[11px] text-navy-400">
          <span>$0</span>
          <span>${minIncome > 0 ? minIncome.toLocaleString("es-MX") : "—"}</span>
          <span>$90,000+</span>
        </div>
      </div>

      {/* Benefits checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">
          Beneficios Principales
        </label>
        <div className="space-y-2.5">
          {benefitOptions.map((b) => (
            <label
              key={b}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all ${
                  selectedBenefits.includes(b)
                    ? "bg-teal-500 border-teal-500"
                    : "border-surface-400 group-hover:border-navy-300"
                }`}
              >
                {selectedBenefits.includes(b) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm text-navy-700">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Issuer dropdown */}
      <div>
        <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">
          Emisor
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIssuerOpen(!issuerOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-200 border border-surface-300 text-sm text-navy-700 transition-all"
          >
            <span>{selectedIssuer}</span>
            <ChevronDown
              size={15}
              className={`text-navy-400 transition-transform ${issuerOpen ? "rotate-180" : ""}`}
            />
          </button>
          {issuerOpen && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-surface-300 rounded-xl shadow-elevated max-h-48 overflow-y-auto animate-fadeIn">
              {issuerOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedIssuer(opt)
                    setIssuerOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-200 transition-colors ${
                    selectedIssuer === opt
                      ? "text-teal-600 font-semibold bg-teal-50"
                      : "text-navy-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile close */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-navy-900 text-white font-semibold py-3 rounded-2xl mt-4 lg:hidden"
        >
          Aplicar filtros
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Comparador" />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-3">
            Compara Tarjetas de Crédito
          </h1>
          <p className="text-base text-navy-500 max-w-xl leading-relaxed">
            Encuentra la tarjeta perfecta para tu estilo de vida. Filtra por beneficios,
            comisiones y requisitos para tomar la mejor decisión financiera.
          </p>
        </section>

        {/* ── Content grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex gap-8">
            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:block w-[260px] shrink-0">
              <div className="bg-white rounded-2xl border border-surface-300/60 shadow-card p-6 sticky top-24">
                <FilterPanel />
              </div>
            </aside>

            {/* ── Main column ── */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setMobileFilters(true)}
                    className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-navy-700 bg-white border border-surface-300 rounded-xl px-4 py-2.5"
                  >
                    <SlidersHorizontal size={15} /> Filtros
                  </button>

                  <span className="text-sm text-navy-500">
                    Mostrando{" "}
                    <strong className="text-navy-800">{filtered.length}</strong>{" "}
                    tarjetas encontradas
                  </span>
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
                  >
                    Ordenar por:{" "}
                    <span className="font-semibold text-navy-900">{sortBy}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-surface-300 rounded-xl shadow-elevated w-48 z-20 animate-fadeIn">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt)
                            setSortOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-200 transition-colors ${
                            sortBy === opt
                              ? "text-teal-600 font-semibold"
                              : "text-navy-700"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Card list ── */}
              <div className="space-y-4">
                {filtered.slice(0, visibleCount).map((card) => (
                  <div
                    key={card.id}
                    className="group bg-white rounded-2xl border border-surface-300/60 shadow-card hover:shadow-card-hover transition-all duration-300 p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Card icon */}
                      <div
                        className={`shrink-0 w-[100px] h-[65px] ${card.iconBg} rounded-xl flex items-center justify-center`}
                      >
                        <CreditCard size={28} className="text-white/90" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider">
                            {card.issuer}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-navy-900 mb-2">
                          {card.name}
                        </h3>

                        {/* Details row */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-navy-500">
                          <div>
                            <span className="text-navy-400">Anualidad</span>
                            <br />
                            <span className="font-bold text-navy-800">
                              {card.annuity}
                            </span>{" "}
                            {card.annuityNote && (
                              <span className="text-navy-400">
                                {card.annuityNote}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-navy-400">Ingreso Mín.</span>
                            <br />
                            <span className="font-bold text-navy-800">
                              ${card.minIncome.toLocaleString("es-MX")}
                            </span>
                          </div>
                          <div>
                            <span className="text-navy-400">Beneficio Clave</span>
                            <br />
                            <span className="font-bold text-teal-700">
                              {card.keyBenefit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating + Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                        <span className="flex items-center gap-1 text-sm font-semibold text-navy-700">
                          <Star
                            size={14}
                            className="text-amber-400 fill-amber-400"
                          />
                          {card.rating}
                        </span>

                        <a
                          href="#"
                          className="inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all whitespace-nowrap"
                        >
                          Solicitar ahora
                        </a>
                        <button className="text-xs font-medium text-navy-500 hover:text-navy-700 transition-colors border border-surface-300 rounded-full px-4 py-1.5 whitespace-nowrap">
                          Comparar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load more */}
              {visibleCount < filtered.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleCount((c) => c + 3)}
                    className="text-sm font-semibold text-navy-600 hover:text-navy-900 border border-surface-400 hover:border-navy-300 rounded-full px-6 py-2.5 transition-all"
                  >
                    Cargar más tarjetas
                  </button>
                </div>
              )}

              {/* Transparency disclaimer */}
              <div className="mt-10 bg-surface-200 border border-surface-300 rounded-xl p-5">
                <p className="text-xs text-navy-500 leading-relaxed">
                  <strong className="text-navy-700">
                    Aviso de transparencia:
                  </strong>{" "}
                  Krediteca puede recibir una compensación de los emisores de
                  tarjetas de crédito presentados en este sitio web. Esta
                  compensación puede afectar cómo y dónde aparecen los productos
                  (incluyendo, por ejemplo, el orden en que aparecen). Krediteca no
                  incluye todas las ofertas de tarjetas de crédito disponibles en el
                  mercado.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Mobile filters drawer ── */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-fadeInUp">
            <div className="flex justify-end mb-2">
              <button onClick={() => setMobileFilters(false)}>
                <X size={20} className="text-navy-500" />
              </button>
            </div>
            <FilterPanel onClose={() => setMobileFilters(false)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
