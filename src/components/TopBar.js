import Image from 'next/image'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="bg-white border-b border-gray-200 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold shrink-0 bg-navy">
            <Image
              src="/photo.png"
              alt="Soilahoudine Mohamed Ali"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-serif text-lg md:text-xl font-bold text-navy leading-tight group-hover:text-navy-light transition-colors">
              Soilahoudine Mohamed Ali
            </p>
            <p className="text-xs md:text-sm text-gray-600 leading-snug mt-0.5">
              CEO de Komor-IA · Fondateur & DG de KM-News
            </p>
            <p className="text-xs text-gold font-medium mt-0.5 hidden md:block">
              Étudiant en Master IA & Data Science — Université Mohamed Premier
              d'Oujda
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {[
            {
              label: 'LinkedIn',
              href: 'https://linkedin.com/in/soilahoudine-mohamed',
              svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
              fill: true,
            },
            {
              label: 'GitHub',
              href: 'https://github.com',
              svg: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z',
              fill: true,
            },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="text-gray-400 hover:text-navy transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d={s.svg} />
              </svg>
            </a>
          ))}
          <a
            href="https://km-news.net"
            target="_blank"
            rel="noopener noreferrer"
            title="KM-News"
            className="text-gray-400 hover:text-navy transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </a>
          <a
            href="mailto:mohamed.soilahoudine.m24@ump.ac.ma"
            title="Email"
            className="text-gray-400 hover:text-navy transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
