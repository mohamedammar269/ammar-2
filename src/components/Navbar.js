'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/#apropos', label: 'À propos' },
  { href: '/#projets', label: 'Projets' },
  { href: '/#ventures', label: 'Ventures' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-navy sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Desktop links - exact Dussey style */}
          <div className="hidden md:flex items-center h-full">
            {links.map(l => {
              const active = pathname === l.href || (l.href !== '/' && l.href !== '/#apropos' && l.href !== '/#projets' && l.href !== '/#ventures' && l.href !== '/#contact' && pathname.startsWith(l.href))
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-4 h-full flex items-center text-sm font-medium tracking-wide border-b-2 transition-all ${
                    active
                      ? 'bg-white text-navy border-transparent font-semibold'
                      : 'text-white border-transparent hover:bg-navy-light hover:text-white'
                  } ${l.label === 'Accueil' && pathname === '/' ? 'bg-white text-navy' : ''}`}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>

          {/* Right: search-like CTA */}
          <div className="hidden md:flex items-center gap-2">
            <a href="mailto:mohamed.soilahoudine.m24@ump.ac.ma" className="flex items-center gap-1.5 text-white text-xs font-medium bg-navy-light hover:bg-white/10 px-3 py-1.5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Recherche ...
            </a>
          </div>

          {/* Mobile burger */}
          <div className="flex items-center gap-3 md:hidden">
            <span className="text-white text-sm font-medium">Soilahoudine M.A.</span>
            <button onClick={() => setOpen(!open)} className="text-white p-1" aria-label="Menu">
              {open ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-navy-light border-t border-white/10">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm text-gray-200 hover:bg-navy hover:text-white border-b border-white/5 last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
