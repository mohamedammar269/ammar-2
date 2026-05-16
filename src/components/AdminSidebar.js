'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/articles', label: 'Actualités', icon: '✦' },
  { href: '/admin/projets', label: 'Projets', icon: '◈' },
  { href: '/admin/annonces', label: 'Annonces', icon: '◉' },
]

export default function AdminSidebar({ user }) {
  const pathname = usePathname()
  return (
    <aside className="w-56 bg-navy text-white flex flex-col min-h-screen shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="text-xs text-gray-400 hover:text-gold transition-colors">← Site public</Link>
        <p className="font-serif text-lg text-white mt-2 font-semibold">Administration</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(l => {
          const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href))
          return (
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${active ? 'bg-gold text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-3">
          {user?.image && <Image src={user.image} alt="" width={28} height={28} className="rounded-full" />}
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-300 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs text-gray-500 hover:text-gold transition-colors">Déconnexion →</button>
      </div>
    </aside>
  )
}
