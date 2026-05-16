import { getEPCStats } from "@/lib/db"
import { BadgeDollarSign, MousePointerClick, ArrowRightLeft } from "lucide-react"

export const dynamic = "force-dynamic" // Asegura que siempre consulte la DB en vivo

export default function DashboardPage() {
  const stats = getEPCStats()

  return (
    <div className="min-h-screen bg-surface-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-navy-900">Dashboard de Atribución</h1>
          <p className="text-navy-500 mt-2">Métricas de rendimiento de ofertas financieras (EPC)</p>
        </header>

        {stats.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-surface-300 text-center text-navy-500">
            Todavía no hay clics registrados en el sistema.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-300 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-200 border-b border-surface-300">
                    <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider">Oferta (ID)</th>
                    <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider text-right">Clics Totales</th>
                    <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider text-right">Conversiones</th>
                    <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider text-right">Ingresos (MXN)</th>
                    <th className="px-6 py-4 text-xs font-bold text-teal-600 uppercase tracking-wider text-right bg-teal-50/50">EPC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {stats.map((row) => (
                    <tr key={row.offer_id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-navy-900">{row.offer_id}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-navy-700">
                          <MousePointerClick size={14} className="text-navy-400" />
                          {row.total_clicks}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-navy-700">
                          <ArrowRightLeft size={14} className="text-navy-400" />
                          {row.total_conversions}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-navy-700">
                          <BadgeDollarSign size={14} className="text-emerald-500" />
                          ${row.total_revenue.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right bg-teal-50/30">
                        <span className="font-bold text-teal-700 text-lg">
                          ${row.epc}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
