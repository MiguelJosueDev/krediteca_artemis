import { ShieldAlert } from "lucide-react"

export default function Disclaimer({ text }) {
  return (
    <div className="my-8 px-5 py-4 bg-surface-100 border border-surface-300 rounded-xl flex items-start gap-3">
      <ShieldAlert className="text-navy-400 shrink-0 mt-0.5" size={18} />
      <p className="text-[13px] text-navy-500 italic m-0 leading-relaxed">
        {text}
      </p>
    </div>
  )
}
