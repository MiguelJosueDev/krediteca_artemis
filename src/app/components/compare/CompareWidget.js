"use client"

import { useState } from "react"
import Link from "next/link"
import { X, ArrowRight, Scale } from "lucide-react"
import { COMPARE_ROWS, estimateInterest } from "@/lib/catalog"
import { useCompare } from "./CompareProvider"

const pesos = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 })

/* Chip de marca reutilizado en la bandeja y los encabezados del modal. */
function BrandChip({ item, size = "sm" }) {
  const dim = size === "lg" ? "w-12 h-12 text-lg" : "w-9 h-9 text-sm"
  return (
    <div
      className={`shrink-0 ${dim} ${item.chipBg} rounded-xl flex items-center justify-center text-white font-bold`}
    >
      {item.initial}
    </div>
  )
}

export default function CompareWidget() {
  const { mounted, items, count, max, remove, clear, open, openModal, closeModal } =
    useCompare()
  const [monto, setMonto] = useState(10000)
  const [plazoMeses, setPlazoMeses] = useState(12)

  // En SSR y primer render: nada (evita mismatch). Sin selección: nada.
  if (!mounted || count === 0) return null

  // La estimación de intereses solo aplica a productos con tasa (préstamos).
  const anyLoan = items.some((i) => i.aprPct != null)

  return (
    <>
      {/* ── Bandeja flotante ── */}
      {!open && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
          <div className="pointer-events-auto max-w-3xl mx-auto bg-white border border-surface-300 shadow-elevated rounded-2xl p-3 sm:p-4 flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="shrink-0 flex items-center gap-1.5 bg-surface-100 border border-surface-200 rounded-full pl-1.5 pr-2 py-1"
                >
                  <BrandChip item={item} />
                  <span className="text-xs font-semibold text-navy-700 max-w-[90px] truncate">
                    {item.brand}
                  </span>
                  <button
                    onClick={() => remove(item.key)}
                    className="text-navy-400 hover:text-red-500 transition-colors"
                    aria-label={`Quitar ${item.brand} de la comparación`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {count < max && (
                <span className="shrink-0 text-xs text-navy-400 pl-1">
                  Agrega hasta {max - count} más
                </span>
              )}
            </div>

            <button
              onClick={clear}
              className="shrink-0 text-xs font-semibold text-navy-500 hover:text-navy-700 transition-colors px-2"
            >
              Limpiar
            </button>
            <button
              onClick={openModal}
              disabled={count < 2}
              className="shrink-0 inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all"
            >
              <Scale size={15} />
              Comparar ({count})
            </button>
          </div>
        </div>
      )}

      {/* ── Modal lado a lado ── */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:m-auto sm:max-w-4xl sm:h-fit sm:max-h-[88vh] bg-white sm:rounded-3xl rounded-t-3xl shadow-elevated overflow-hidden flex flex-col max-h-[88vh]">
            {/* Cabecera */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-surface-200">
              <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <Scale size={18} className="text-teal-600" />
                Comparación
              </h2>
              <button
                onClick={closeModal}
                className="text-navy-400 hover:text-navy-700 transition-colors"
                aria-label="Cerrar comparación"
              >
                <X size={20} />
              </button>
            </div>

            {/* Inputs de estimación de intereses (solo si hay préstamos) */}
            {anyLoan && (
              <div className="px-5 sm:px-6 py-3 border-b border-surface-200 bg-surface-50 flex flex-wrap items-end gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wide mb-1">
                    Monto
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500 font-semibold text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={monto}
                      onChange={(e) => setMonto(Number(e.target.value))}
                      className="w-36 bg-white border border-surface-300 focus:border-teal-500 rounded-xl py-2 pl-7 pr-3 text-navy-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wide mb-1">
                    Plazo (meses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plazoMeses}
                    onChange={(e) => setPlazoMeses(Number(e.target.value))}
                    className="w-24 bg-white border border-surface-300 focus:border-teal-500 rounded-xl py-2 px-3 text-navy-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <p className="text-[11px] text-navy-400 flex-1 min-w-[180px] leading-snug">
                  Cuánto pagarías de intereses a la tasa anual mostrada de cada préstamo.
                </p>
              </div>
            )}

            {/* Tabla */}
            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white z-10 w-28 sm:w-36" />
                    {items.map((item) => (
                      <th
                        key={item.key}
                        className="p-4 align-top border-l border-surface-200 min-w-[150px]"
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <BrandChip item={item} size="lg" />
                          <div>
                            <div className="text-[10px] font-semibold text-navy-400 uppercase tracking-wide">
                              {item.brand}
                            </div>
                            <div className="text-sm font-bold text-navy-900 leading-tight">
                              {item.name}
                            </div>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Fila destacada: interés estimado en pesos */}
                  {anyLoan && (
                    <tr className="border-t border-surface-200 bg-teal-50/60">
                      <td className="sticky left-0 bg-teal-50 z-10 px-3 py-3 text-[11px] font-bold text-teal-800 uppercase tracking-wide">
                        Interés estimado
                      </td>
                      {items.map((item) => {
                        const interes = estimateInterest({
                          aprPct: item.aprPct,
                          monto,
                          plazoMeses,
                        })
                        return (
                          <td
                            key={item.key}
                            className="px-4 py-3 text-center border-l border-surface-200"
                          >
                            {interes == null ? (
                              <span className="text-sm font-semibold text-navy-300">—</span>
                            ) : (
                              <span className="text-base font-bold text-teal-700">
                                {pesos(interes)}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )}

                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="border-t border-surface-200">
                      <td className="sticky left-0 bg-surface-50 z-10 px-3 py-3 text-[11px] font-bold text-navy-500 uppercase tracking-wide">
                        {row.label}
                      </td>
                      {items.map((item) => (
                        <td
                          key={item.key}
                          className="px-4 py-3 text-center text-sm font-semibold text-navy-800 border-l border-surface-200"
                        >
                          {row.cell(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Fila de acción */}
                  <tr className="border-t border-surface-200">
                    <td className="sticky left-0 bg-surface-50 z-10" />
                    {items.map((item) => (
                      <td key={item.key} className="px-4 py-4 border-l border-surface-200">
                        <a
                          href={item.ctaHref}
                          target={item.type === "loan" ? "_blank" : undefined}
                          rel={item.type === "loan" ? "noopener noreferrer" : undefined}
                          className="inline-flex w-full items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
                        >
                          Solicitar <ArrowRight size={14} />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Disclaimer del cálculo (YMYL: el método y sus límites, explícitos) */}
            {anyLoan && (
              <p className="px-5 sm:px-6 py-3 text-[11px] text-navy-400 leading-relaxed border-t border-surface-200">
                Interés simple estimado = monto × tasa anual × (meses/12). No incluye
                comisiones, IVA ni amortización, y algunas tasas mostradas son máximos
                (p. ej. Kueski) y otras mínimos. Para el cálculo exacto de un préstamo usa la{" "}
                <Link
                  href="/calculadoras/prestamos"
                  className="text-teal-600 font-semibold underline"
                >
                  calculadora de préstamos
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
