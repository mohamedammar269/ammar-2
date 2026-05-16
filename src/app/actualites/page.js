import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
  title: 'Actualités — Soilahoudine Mohamed Ali',
  description:
    "Articles, analyses et réflexions sur l'IA, l'entrepreneuriat et les Comores.",
}

async function getArticles(category) {
  try {
    return await prisma.article.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await prisma.article.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category'],
    })
    return res.map((a) => a.category).filter(Boolean)
  } catch {
    return []
  }
}

// export default async function ActualitesPage({ searchParams }) {
//   const category = searchParams?.category || null
export default async function ActualitesPage({ searchParams }) {
  const params = await searchParams
  const category = params?.category || null
  const [articles, categories] = await Promise.all([
    getArticles(category),
    getCategories(),
  ])
  const [featured, ...rest] = articles

  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        {/* Header */}
        <div className="bg-navy py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                Publications
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Actualités
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          {/* Filtres catégories */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              <Link
                href="/actualites"
                className={`text-xs font-semibold px-4 py-2 border transition-colors ${!category ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-600 hover:border-navy hover:text-navy'}`}
              >
                Tout
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/actualites?category=${c}`}
                  className={`text-xs font-semibold px-4 py-2 border transition-colors ${category === c ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-600 hover:border-navy hover:text-navy'}`}
                >
                  {c}
                </Link>
              ))}
            </div>
          )}

          {articles.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-gray-400">
                Aucun article pour l'instant.
              </p>
              <p className="text-gray-400 text-sm mt-2">Revenez bientôt !</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && !category && (
                <div className="mb-8">
                  <ArticleCard article={featured} featured />
                </div>
              )}
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(category ? articles : rest).map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
