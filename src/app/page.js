import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
export const revalidate = 60

async function getData() {
  try {
    const [articles, projets] = await Promise.all([
      prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 7,
      }),
      prisma.projet.findMany({
        where: { published: true },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
        take: 6,
      }),
    ])
    return { articles, projets }
  } catch {
    return { articles: [], projets: [] }
  }
}

const defaultProjets = [
  {
    id: '1',
    title: 'Détection de Fake News',
    description:
      'Classification BERT fine-tuné sur corpus multilingue. Knowledge Graph pour raisonnement factuel. Mémoire Master 2.',
    tags: 'BERT,Hugging Face,Python',
    category: 'Mémoire Master 2',
    liveUrl: null,
    githubUrl: null,
    featured: true,
  },
  {
    id: '2',
    title: 'Anomaly Detection — Zero-Day & Ransomware',
    description:
      "Détection d'anomalies sur UGRansom. 6 modèles comparés. Précision max : 99,48% avec LightGBM.",
    tags: 'LightGBM,XGBoost,CNN,LSTM',
    category: 'Cybersécurité',
    liveUrl: null,
    githubUrl: null,
    featured: false,
  },
  {
    id: '3',
    title: 'Press-IA',
    description:
      "IA de classification et résumé d'articles de presse pour KM-News. NLP + mBART via API Flask.",
    tags: 'mBART,Flask,Next.js',
    category: 'NLP · Publication',
    liveUrl: null,
    githubUrl: null,
    featured: false,
  },
  {
    id: '4',
    title: 'KM-News & Stud-Access',
    description:
      'Deux plateformes web complètes — interfaces, back-end et déploiement Vercel.',
    tags: 'Next.js,React.js,MongoDB',
    category: 'Web',
    liveUrl: 'https://km-news.net',
    githubUrl: null,
    featured: false,
  },
]

function ArticleGridCard({ article, featured }) {
  const date = new Date(article.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  if (featured) {
    return (
      <Link
        href={`/actualites/${article.slug}`}
        className="group block relative overflow-hidden bg-gray-900"
        style={{ minHeight: '380px' }}
      >
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
          />
        )}
        {!article.coverImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {article.category && (
            <span className="inline-block bg-gold text-white text-xs font-bold px-3 py-1 mb-3 uppercase tracking-wider">
              {article.category}
            </span>
          )}
          <h2 className="font-serif text-2xl md:text-3xl text-white font-semibold leading-tight mb-3 group-hover:text-gold-light transition-colors">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}
          <time className="text-gray-400 text-xs">{date}</time>
        </div>
      </Link>
    )
  }
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group block bg-white border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      {article.coverImage && (
        <div className="relative overflow-hidden" style={{ height: '160px' }}>
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div
        className={`p-4 ${!article.coverImage ? 'border-t-4 border-gold' : ''}`}
      >
        {article.category && (
          <span className="text-xs font-bold text-gold uppercase tracking-wide">
            {article.category}
          </span>
        )}
        <h3 className="font-serif text-base font-semibold text-navy leading-snug mt-1 mb-2 group-hover:text-gold transition-colors line-clamp-3">
          {article.title}
        </h3>
        <time className="text-xs text-gray-400">{date}</time>
      </div>
    </Link>
  )
}

const ventures = [
  {
    name: 'Komor-IA',
    role: 'Fondateur & CEO',
    year: '2025',
    desc: "Startup comorienne d'IA. Solutions adaptées au marché comorien et à la diaspora.",
    url: 'https://komor-ia.vercel.app',
  },
  {
    name: 'KM-News',
    role: 'Fondateur & DG',
    year: '2023–présent',
    desc: "Média d'information comorien. Journalisme + IA pour classification et résumé automatique.",
    url: 'https://km-news.net',
  },
  {
    name: 'Woudja',
    role: 'Co-fondateur',
    year: 'En cours',
    desc: 'Marque de vêtements à identité culturelle comorienne. Vision créative et stratégique.',
    url: null,
  },
]

export default async function Home() {
  const { articles, projets: dbProjets } = await getData()
  const projets = dbProjets.length > 0 ? dbProjets : defaultProjets
  const [featured, ...rest] = articles

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* ── HERO / ARTICLES GRID - exactement comme Dussey ── */}
          {articles.length > 0 ? (
            <section className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Article principal - grande colonne gauche */}
                {featured && (
                  <div className="md:col-span-1">
                    <ArticleGridCard article={featured} featured />
                  </div>
                )}
                {/* 4 articles secondaires - grille 2x2 droite */}
                <div className="grid grid-cols-2 gap-4">
                  {rest.slice(0, 4).map((a) => (
                    <ArticleGridCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
              {/* Voir plus */}
              <div className="text-center mt-6">
                <Link
                  href="/actualites"
                  className="inline-flex items-center gap-2 border border-navy text-navy px-6 py-2.5 text-sm font-semibold hover:bg-navy hover:text-white transition-colors"
                >
                  + Plus d'actualités
                </Link>
              </div>
            </section>
          ) : (
            /* Hero quand pas d'articles */
            <section className="mb-10 bg-navy text-white p-10 md:p-16">
              <div className="max-w-2xl">
                <p className="text-gold text-xs font-bold tracking-widest uppercase mb-4">
                  IA · Data Science · Entrepreneur
                </p>
                <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
                  Soilahoudine
                  <br />
                  <span className="text-gold">Mohamed Ali</span>
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  Étudiant en Master IA & Data Science, CEO de Komor-IA et
                  Fondateur de KM-News. Je conçois des solutions d'IA à fort
                  impact pour l'Afrique et la diaspora comorienne.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link
                    href="/#projets"
                    className="bg-gold hover:bg-gold-dark text-white px-6 py-3 font-semibold text-sm transition-colors"
                  >
                    Voir mes projets
                  </Link>
                  <Link
                    href="/#contact"
                    className="border border-white text-white px-6 py-3 font-semibold text-sm hover:bg-white hover:text-navy transition-colors"
                  >
                    Me contacter
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ── DEUX COLONNES : Projets + Ventures (comme Dussey "Plus d'activités") ── */}
          <section className="mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Projets IA */}
              <div id="projets">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-2xl text-navy font-bold border-l-4 border-gold pl-3">
                    Projets IA & Tech
                  </h2>
                </div>
                <div className="space-y-4">
                  {projets.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-gray-100 p-5 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          {p.category && (
                            <span className="text-xs font-bold text-gold uppercase tracking-wide">
                              {p.category}
                            </span>
                          )}
                          <h3 className="font-serif text-lg text-navy font-semibold leading-snug mt-0.5 group-hover:text-gold transition-colors">
                            {p.title}
                          </h3>
                        </div>
                        {p.featured && (
                          <span className="shrink-0 bg-gold text-white text-xs px-2 py-0.5 font-bold">
                            En cours
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">
                        {p.description}
                      </p>
                      {p.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.tags.split(',').map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-navy/10 text-navy px-2 py-0.5 font-medium"
                            >
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gold font-bold hover:underline"
                          >
                            Voir le site →
                          </a>
                        )}
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-navy font-bold hover:underline"
                          >
                            GitHub →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ventures + Compétences */}
              <div id="ventures">
                <div className="mb-5">
                  <h2 className="font-serif text-2xl text-navy font-bold border-l-4 border-gold pl-3">
                    Ventures & Initiatives
                  </h2>
                </div>
                <div className="space-y-4 mb-8">
                  {ventures.map((v) => (
                    <div
                      key={v.name}
                      className="bg-white border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif text-lg text-navy font-semibold">
                            {v.name}
                          </h3>
                          <p className="text-gold text-xs font-bold uppercase tracking-wide">
                            {v.role}
                          </p>
                        </div>
                        <span className="text-gray-400 text-xs font-medium shrink-0">
                          {v.year}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">
                        {v.desc}
                      </p>
                      {v.url && (
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gold font-bold hover:underline"
                        >
                          {v.url.replace('https://', '')} →
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Compétences clés */}
                <div id="competences">
                  <h2 className="font-serif text-2xl text-navy font-bold border-l-4 border-gold pl-3 mb-5">
                    Compétences clés
                  </h2>
                  <div className="bg-white border border-gray-100 p-5">
                    {[
                      {
                        label: 'Machine Learning & IA',
                        items: [
                          'BERT',
                          'TensorFlow',
                          'PyTorch',
                          'LightGBM',
                          'XGBoost',
                          'CNN',
                          'LSTM',
                        ],
                      },
                      {
                        label: 'NLP & Langage',
                        items: [
                          'Hugging Face',
                          'mBART',
                          'spaCy',
                          'NLTK',
                          'TF-IDF',
                        ],
                      },
                      {
                        label: 'Web & DevOps',
                        items: [
                          'Next.js',
                          'React',
                          'Flask',
                          'MySQL',
                          'MongoDB',
                          'Vercel',
                        ],
                      },
                    ].map((g) => (
                      <div key={g.label} className="mb-4 last:mb-0">
                        <p className="text-xs font-bold text-navy uppercase tracking-wide mb-2">
                          {g.label}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {g.items.map((i) => (
                            <span
                              key={i}
                              className="text-xs bg-navy/10 text-navy px-2 py-0.5"
                            >
                              {i}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── À PROPOS ── */}
          <section id="apropos" className="mb-10">
            <h2 className="font-serif text-2xl text-navy font-bold border-l-4 border-gold pl-3 mb-6">
              À propos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-100 p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Étudiant en Master 2 Intelligence Artificielle et Sciences de
                  Données à l'Université Mohamed Premier d'Oujda, je me
                  spécialise dans l'IA appliquée, le NLP et l'analyse de
                  données.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Entrepreneur, j'ai fondé Komor-IA, une startup d'IA pour le
                  marché comorien, et KM-News, un média d'information. Je suis
                  aussi co-fondateur de Woudja, une marque de vêtements à
                  identité culturelle.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Je maîtrise le cycle complet d'un projet tech, du recueil des
                  besoins, à la modélisation IA, jusqu'au déploiement en
                  production.
                </p>
              </div>
              <div id="contact" className="bg-navy text-white p-6">
                <h3 className="font-serif text-xl font-semibold mb-4">
                  Contact
                </h3>
                <ul className="space-y-3 text-sm">
                  {[
                    {
                      l: 'Email',
                      v: 'mohamed.soilahoudine.m24@ump.ac.ma',
                      href: 'mailto:mohamed.soilahoudine.m24@ump.ac.ma',
                    },
                    {
                      l: 'Téléphone',
                      v: '+212 774-32-97-51',
                      href: 'tel:+212774329751',
                    },
                    {
                      l: 'LinkedIn',
                      v: 'soilahoudine-mohamed',
                      href: 'https://www.linkedin.com/in/soilahoudine-mohamed-8b6b60378/',
                    },
                    {
                      l: 'Localisation',
                      v: 'El Qods, Oujda — Maroc',
                      href: null,
                    },
                  ].map((c) => (
                    <li
                      key={c.l}
                      className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0"
                    >
                      <span className="text-gray-400 text-xs uppercase tracking-wide font-medium">
                        {c.l}
                      </span>
                      {c.href ? (
                        <a
                          href={c.href}
                          target={
                            c.href.startsWith('http') ? '_blank' : undefined
                          }
                          rel="noopener noreferrer"
                          className="text-gold-light hover:text-white transition-colors text-right text-xs"
                        >
                          {c.v}
                        </a>
                      ) : (
                        <span className="text-gray-200 text-xs">{c.v}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
