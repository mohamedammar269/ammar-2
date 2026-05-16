import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminArticles() {
  let articles = []
  try { articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } }) } catch {}

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-navy font-bold">Actualités</h1>
        <Link href="/admin/articles/new" className="btn-navy text-sm">+ Nouvel article</Link>
      </div>
      <div className="bg-white shadow">
        {articles.length === 0
          ? <div className="py-16 text-center"><p className="font-serif text-xl text-gray-400">Aucun article.</p><Link href="/admin/articles/new" className="text-gold text-sm font-semibold mt-3 inline-block hover:underline">Créer le premier →</Link></div>
          : articles.map((a, i) => (
            <div key={a.id} className={`flex items-center gap-4 px-6 py-4 ${i < articles.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate font-medium">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.category || '—'} · {new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 font-medium shrink-0 ${a.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {a.published ? 'Publié' : 'Brouillon'}
              </span>
              <div className="flex gap-3 shrink-0">
                {a.published && <Link href={`/actualites/${a.slug}`} target="_blank" className="text-xs text-gray-400 hover:text-navy">Voir</Link>}
                <Link href={`/admin/articles/${a.id}`} className="text-xs text-navy hover:text-gold font-semibold">Modifier</Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
