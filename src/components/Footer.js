import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-400">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-white text-lg mb-3">
              Soilahoudine M.A.
            </h3>
            <div className="w-8 h-0.5 bg-gold mb-4" />
            <p className="text-sm leading-relaxed">
              CEO de Komor-IA · Fondateur de KM-News
              <br />
              Master IA & Data Science
              <br />
              Oujda, Maroc
            </p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {['/', '/#projets', '/#ventures', '/actualites', '/#contact'].map(
                (href, i) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:text-gold transition-colors"
                    >
                      {
                        [
                          'Accueil',
                          'Projets',
                          'Ventures',
                          'Actualités',
                          'Contact',
                        ][i]
                      }
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:mohamed.soilahoudine.m24@ump.ac.ma"
                  className="hover:text-gold transition-colors break-all"
                >
                  mohamed.soilahoudine.m24@ump.ac.ma
                </a>
              </li>
              <li>
                <a
                  href="tel:+212774329751"
                  className="hover:text-gold transition-colors"
                >
                  +212 774-32-97-51
                </a>
              </li>
              <li>
                <a
                  href="linkedin.com/in/soilahoudine-mohamed-8b6b60378?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://km-news.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  km-news.net
                </a>
              </li>
              <li>
                <a
                  href="https://komor-ia.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  komor-ia.vercel.app
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <span>
            © {new Date().getFullYear()} Soilahoudine Mohamed Ali. Tous droits
            réservés.
          </span>
          <Link href="/admin" className="hover:text-gold transition-colors">
            Connexion
          </Link>
        </div>
      </div>
    </footer>
  )
}
