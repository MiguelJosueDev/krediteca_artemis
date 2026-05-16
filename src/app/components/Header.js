"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Préstamos", href: "/" },
  { label: "Comparador", href: "/comparador" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Blog", href: "/blog" },
  { label: "Sobre Nosotros", href: "/contacto" },
]

export default function Header({ activeLink = "Préstamos" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img 
              src="/krediteca_logo_navbar.png" 
              alt="Krediteca" 
              className="h-8 w-auto" 
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.label === activeLink
              const isInternal = link.href.startsWith("/")
              const Tag = isInternal ? Link : "a"

              return (
                <Tag
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-navy-900 underline underline-offset-[6px] decoration-2 decoration-navy-900"
                      : "text-navy-700 hover:text-navy-900"
                  }`}
                >
                  {link.label}
                </Tag>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#login"
              className="text-sm font-medium text-navy-700 hover:text-navy-900 transition-colors"
            >
              Iniciar sesión
            </a>
            <a
              href="#solicitar"
              className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-teal-500/20"
            >
              Solicitar
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-navy-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-surface-300 animate-fadeIn">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = link.label === activeLink
                const isInternal = link.href.startsWith("/")
                const Tag = isInternal ? Link : "a"

                return (
                  <Tag
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium py-2 ${
                      isActive ? "text-navy-900 font-bold" : "text-navy-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Tag>
                )
              })}
              <hr className="border-surface-300 my-1" />
              <a href="#login" className="text-sm font-medium text-navy-700 py-2">
                Iniciar sesión
              </a>
              <a
                href="#solicitar"
                className="inline-flex items-center justify-center bg-teal-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full mt-1"
              >
                Solicitar
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}