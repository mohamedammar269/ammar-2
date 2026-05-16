import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata = { title: 'Admin — Soilahoudine' }

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar user={session.user} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
