import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminProjets() {
  let projets = []
  try { projets = await prisma.projet.findMany({ orderBy: [{ featured: 'desc' }, { order: 'asc' }] }) } catch {}

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-navy font-bold">Projets</h1>
        <Link href="/admin/projets/new" className="btn-navy text-sm">+ Nouveau projet</Link>
      </div>
      <div className="bg-white shadow">
        {projets.length === 0
          ? <div className="py-16 text-center"><p className="font-serif text-xl text-gray-400">Aucun projet.</p><Link href="/admin/projets/new" className="text-gold text-sm font-semibold mt-3 inline-block">Ajouter →</Link></div>
          : projets.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-4 px-6 py-4 ${i < projets.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-800 font-medium truncate">{p.title}</p>
                  {p.featured && <span className="text-xs bg-gold/20 text-gold-dark px-1.5 py-0.5 font-semibold">★</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{p.category || '—'}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 font-medium shrink-0 ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {p.published ? 'Visible' : 'Masqué'}
              </span>
              <Link href={`/admin/projets/${p.id}`} className="text-xs text-navy hover:text-gold font-semibold shrink-0">Modifier</Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}
