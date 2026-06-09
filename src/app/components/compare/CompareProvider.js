"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { MAX_COMPARE } from "@/lib/catalog"

const STORAGE_KEY = "krediteca:compare"

const CompareContext = createContext(null)

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error("useCompare debe usarse dentro de <CompareProvider>")
  return ctx
}

/**
 * Estado global de comparación.
 * - `catalog`: items normalizados (tarjetas + préstamos) que arma el layout en
 *   el servidor; se usa solo para resolver claves seleccionadas a su data.
 * - selección persistida en localStorage; arranca vacía en SSR y se hidrata en
 *   un efecto para no romper el render del servidor.
 */
export default function CompareProvider({ catalog = [], children }) {
  const byKey = new Map(catalog.map((i) => [i.key, i]))

  const [keys, setKeys] = useState([])
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  // Hidratar selección desde localStorage tras montar (evita mismatch SSR).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      if (Array.isArray(saved)) {
        // Descartar claves que ya no existen en el catálogo actual.
        setKeys(saved.filter((k) => byKey.has(k)).slice(0, MAX_COMPARE))
      }
    } catch {
      // localStorage corrupto o inaccesible: arrancamos vacíos, sin romper.
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persistir cada cambio (solo después de montar).
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    } catch {
      /* sin persistencia si el navegador la bloquea */
    }
  }, [keys, mounted])

  const has = (key) => keys.includes(key)

  const toggle = (key) => {
    if (!byKey.has(key)) return // clave desconocida: no hacer nada
    setKeys((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      if (prev.length >= MAX_COMPARE) return prev // tope alcanzado: ignorar
      return [...prev, key]
    })
  }

  const remove = (key) => setKeys((prev) => prev.filter((k) => k !== key))
  const clear = () => setKeys([])

  // Items seleccionados resueltos a su data normalizada, en orden de selección.
  const items = keys.map((k) => byKey.get(k)).filter(Boolean)

  const value = {
    mounted,
    keys,
    items,
    count: items.length,
    max: MAX_COMPARE,
    has,
    toggle,
    remove,
    clear,
    open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
  }

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
