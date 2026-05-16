"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const subjects = [
  "Duda sobre comparador de hipotecas",
  "Duda sobre comparador de préstamos",
  "Duda sobre tarjetas de crédito",
  "Problema con mi cuenta",
  "Sugerencias",
  "Otro",
]

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
  })
  const [subjectOpen, setSubjectOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl p-7 sm:p-9 border border-surface-300/60 shadow-elevated h-full">
      <h2 className="text-2xl font-bold text-navy-900 mb-8">
        Envíanos un mensaje
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + Email row */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Ej. Ana García"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-surface-300 text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ana@ejemplo.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-surface-300 text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>
        </div>

        {/* Subject dropdown */}
        <div>
          <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">
            Asunto
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSubjectOpen(!subjectOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-200 border border-surface-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            >
              <span>{form.subject}</span>
              <ChevronDown
                size={16}
                className={`text-navy-400 transition-transform ${subjectOpen ? "rotate-180" : ""}`}
              />
            </button>

            {subjectOpen && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-surface-300 rounded-xl shadow-elevated overflow-hidden animate-fadeIn">
                {subjects.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      handleChange("subject", s)
                      setSubjectOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-200 transition-colors ${
                      form.subject === s
                        ? "text-teal-600 font-semibold bg-teal-50"
                        : "text-navy-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message textarea */}
        <div>
          <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">
            Mensaje
          </label>
          <textarea
            rows={5}
            placeholder="¿En qué podemos ayudarte?"
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-surface-300 text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-teal-600/20"
        >
          {submitted ? (
            <>
              <span>¡Mensaje enviado!</span>
              <span className="text-teal-200">✓</span>
            </>
          ) : (
            <>
              <span>Enviar Mensaje</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
