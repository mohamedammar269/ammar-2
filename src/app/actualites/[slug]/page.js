// import TopBar from '@/components/TopBar'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import { prisma } from '@/lib/prisma'
// import { notFound } from 'next/navigation'
// import Link from 'next/link'
// import Image from 'next/image'

// async function getArticle(slug) {
//   try {
//     return await prisma.article.findUnique({
//       where: { slug, published: true },
//       include: { author: { select: { name: true, image: true } } },
//     })
//   } catch { return null }
// }

// async function getRelated(slug, category) {
//   try {
//     return await prisma.article.findMany({
//       where: { published: true, category, NOT: { slug } },
//       take: 3,
//       orderBy: { createdAt: 'desc' },
//     })
//   } catch { return [] }
// }

// export async function generateMetadata({ params }) {
//   const article = await getArticle(params.slug)
//   if (!article) return { title: 'Article introuvable' }
//   return { title: `${article.title} — Soilahoudine Mohamed Ali`, description: article.excerpt }
// }

// export default async function ArticlePage({ params }) {
//   const article = await getArticle(params.slug)
//   if (!article) notFound()

//   const related = article.category ? await getRelated(params.slug, article.category) : []

//   const date = new Date(article.createdAt).toLocaleDateString('fr-FR', {
//     day: 'numeric', month: 'long', year: 'numeric'
//   })

//   return (
//     <>
//       <TopBar />
//       <Navbar />
//       <main>
//         {/* Cover */}
//         {article.coverImage ? (
//           <div className="relative h-64 md:h-96 bg-navy">
//             <Image src={article.coverImage} alt={article.title} fill className="object-cover opacity-60" priority />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 md:px-8 pb-8">
//               {article.category && (
//                 <span className="inline-block bg-gold text-white text-xs font-semibold px-3 py-1 mb-3 uppercase tracking-wide">{article.category}</span>
//               )}
//               <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight">{article.title}</h1>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-navy py-12">
//             <div className="max-w-4xl mx-auto px-4 md:px-8">
//               {article.category && (
//                 <span className="inline-block bg-gold text-white text-xs font-semibold px-3 py-1 mb-4 uppercase tracking-wide">{article.category}</span>
//               )}
//               <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight">{article.title}</h1>
//             </div>
//           </div>
//         )}

//         {/* Meta */}
//         <div className="border-b border-gray-200 bg-white">
//           <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               <time>{date}</time>
//               {article.tags && (
//                 <div className="flex gap-1.5 flex-wrap">
//                   {article.tags.split(',').map(t => (
//                     <span key={t} className="tag">{t.trim()}</span>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <Link href="/actualites" className="text-sm text-navy font-medium hover:text-gold transition-colors">← Retour aux actualités</Link>
//           </div>
//         </div>

//         {/* Content */}
//         <article className="max-w-4xl mx-auto px-4 md:px-8 py-10">
//           {article.excerpt && (
//             <p className="text-xl text-gray-500 font-light leading-relaxed mb-8 pb-8 border-b border-gray-200 italic">
//               {article.excerpt}
//             </p>
//           )}
//           <div
//             className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-navy"
//             dangerouslySetInnerHTML={{ __html: article.content }}
//           />
//         </article>

//         {/* Related */}
//         {related.length > 0 && (
//           <section className="bg-gray-50 py-12">
//             <div className="max-w-7xl mx-auto px-4 md:px-8">
//               <h2 className="font-serif text-2xl text-navy font-semibold mb-6">Articles similaires</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {related.map(a => (
//                   <Link key={a.id} href={`/actualites/${a.slug}`} className="card p-5 group block">
//                     {a.category && <span className="text-xs text-gold font-semibold uppercase">{a.category}</span>}
//                     <h3 className="font-serif text-lg text-navy font-semibold mt-1 group-hover:text-gold transition-colors line-clamp-2">{a.title}</h3>
//                     <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}
//       </main>
//       <Footer />
//     </>
//   )
// }
import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

async function getArticle(slug) {
  try {
    return await prisma.article.findUnique({
      where: { slug, published: true },
      include: { author: { select: { name: true, image: true } } },
    })
  } catch {
    return null
  }
}

async function getRelated(slug, category) {
  try {
    return await prisma.article.findMany({
      where: { published: true, category, NOT: { slug } },
      take: 3,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article introuvable' }
  return {
    title: `${article.title} — Soilahoudine Mohamed Ali`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const related = article.category
    ? await getRelated(slug, article.category)
    : []

  const date = new Date(article.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        {article.coverImage ? (
          <div className="relative h-64 md:h-96 bg-navy">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 md:px-8 pb-8">
              {article.category && (
                <span className="inline-block bg-gold text-white text-xs font-semibold px-3 py-1 mb-3 uppercase tracking-wide">
                  {article.category}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="bg-navy py-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              {article.category && (
                <span className="inline-block bg-gold text-white text-xs font-semibold px-3 py-1 mb-4 uppercase tracking-wide">
                  {article.category}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        )}

        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time>{date}</time>
              {article.tags && (
                <div className="flex gap-1.5 flex-wrap">
                  {article.tags.split(',').map((t) => (
                    <span key={t} className="tag">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/actualites"
              className="text-sm text-navy font-medium hover:text-gold transition-colors"
            >
              ← Retour aux actualités
            </Link>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 md:px-8 py-10">
          {article.excerpt && (
            <p className="text-xl text-gray-500 font-light leading-relaxed mb-8 pb-8 border-b border-gray-200 italic">
              {article.excerpt}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {related.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <h2 className="font-serif text-2xl text-navy font-semibold mb-6">
                Articles similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((a) => (
                  <Link
                    key={a.id}
                    href={`/actualites/${a.slug}`}
                    className="card p-5 group block"
                  >
                    {a.category && (
                      <span className="text-xs text-gold font-semibold uppercase">
                        {a.category}
                      </span>
                    )}
                    <h3 className="font-serif text-lg text-navy font-semibold mt-1 group-hover:text-gold transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
