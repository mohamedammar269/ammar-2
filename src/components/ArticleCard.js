import Link from 'next/link'
import Image from 'next/image'

export default function ArticleCard({ article, featured = false }) {
  const date = new Date(article.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  if (featured) {
    return (
      <Link href={`/actualites/${article.slug}`} className="group block">
        <div className="relative h-72 md:h-96 overflow-hidden bg-navy">
          {article.coverImage ? (
            <Image src={article.coverImage} alt={article.title} fill className="object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-light" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {article.category && (
              <span className="inline-block bg-gold text-white text-xs font-semibold px-3 py-1 mb-3 uppercase tracking-wide">{article.category}</span>
            )}
            <h2 className="font-serif text-2xl md:text-3xl text-white font-semibold leading-tight mb-2 group-hover:text-gold-light transition-colors">
              {article.title}
            </h2>
            {article.excerpt && <p className="text-gray-300 text-sm line-clamp-2 mb-3">{article.excerpt}</p>}
            <time className="text-gray-400 text-xs">{date}</time>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/actualites/${article.slug}`} className="group card block">
      {article.coverImage && (
        <div className="relative h-44 overflow-hidden">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className={`p-5 ${!article.coverImage ? 'border-t-4 border-gold' : ''}`}>
        {article.category && (
          <span className="text-xs font-semibold text-gold uppercase tracking-wide">{article.category}</span>
        )}
        <h3 className="font-serif text-lg text-navy font-semibold leading-snug mt-1 mb-2 group-hover:text-gold transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>}
        <div className="flex items-center justify-between">
          <time className="text-xs text-gray-400">{date}</time>
          <span className="text-xs text-navy font-semibold group-hover:text-gold transition-colors">Lire →</span>
        </div>
      </div>
    </Link>
  )
}
