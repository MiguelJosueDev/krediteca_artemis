import { AlertTriangle, Info, CheckCircle } from "lucide-react"

export default function Callout({ children, type = "info", title }) {
  const styles = {
    info: "bg-teal-50 border-teal-200 text-teal-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  }

  const icons = {
    info: <Info className="text-teal-600" size={20} />,
    warning: <AlertTriangle className="text-amber-600" size={20} />,
    success: <CheckCircle className="text-emerald-600" size={20} />,
  }

  return (
    <div className={`my-6 p-5 border rounded-2xl flex gap-4 ${styles[type]}`}>
      <div className="shrink-0 mt-0.5">
        {icons[type]}
      </div>
      <div>
        {title && <h4 className="font-bold mb-1 m-0">{title}</h4>}
        <div className="prose-sm m-0 leading-relaxed opacity-90">
          {children}
        </div>
      </div>
    </div>
  )
}
