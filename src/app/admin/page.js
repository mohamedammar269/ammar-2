import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  try {
    const [articles, drafts, projets, annonces] = await Promise.all([
      prisma.article.count({ where: { published: true } }),
      prisma.article.count({ where: { published: false } }),
      prisma.projet.count({ where: { published: true } }),
      prisma.annonce.count({ where: { active: true } }),
    ])
    return { articles, drafts, projets, annonces }
  } catch { return { articles: 0, drafts: 0, projets: 0, annonces: 0 } }
}

async function getRecent() {
  try {
    return await prisma.article.findMany({ orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, title: true, published: true, createdAt: true, category: true } })
  } catch { return [] }
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecent()])

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-navy font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenue dans l'espace d'administration.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Articles publiés', val: stats.articles, href: '/admin/articles', color: 'border-t-4 border-navy' },
          { label: 'Brouillons', val: stats.drafts, href: '/admin/articles', color: 'border-t-4 border-yellow-400' },
          { label: 'Projets', val: stats.projets, href: '/admin/projets', color: 'border-t-4 border-gold' },
          { label: 'Annonces actives', val: stats.annonces, href: '/admin/annonces', color: 'border-t-4 border-green-500' },
        ].map(c => (
          <Link key={c.label} href={c.href} className={`bg-white shadow p-5 hover:shadow-md transition-shadow ${c.color}`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{c.label}</p>
            <p className="font-serif text-4xl text-navy font-bold">{c.val}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/admin/articles/new" className="btn-navy text-sm">+ Nouvel article</Link>
        <Link href="/admin/projets/new" className="btn-outline text-sm">+ Nouveau projet</Link>
        <Link href="/admin/annonces" className="btn-outline text-sm">Gérer annonces</Link>
      </div>

      <div className="bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-serif text-lg text-navy font-semibold">Derniers articles</h2>
          <Link href="/admin/articles" className="text-xs text-gold font-semibold hover:underline">Voir tout →</Link>
        </div>
        {recent.length === 0
          ? <p className="px-6 py-8 text-gray-400 text-sm text-center">Aucun article.</p>
          : recent.map(a => (
            <div key={a.id} className="flex items-center justify-between px-6 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
              <div>
                <p className="text-sm text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.category || '—'} · {new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 font-medium ${a.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {a.published ? 'Publié' : 'Brouillon'}
                </span>
                <Link href={`/admin/articles/${a.id}`} className="text-xs text-navy hover:text-gold font-medium">Modifier</Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
