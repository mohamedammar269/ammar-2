import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import VisualCreator from '@/components/VisualCreator'
import { authOptions } from '@/lib/auth'

export const metadata = {
  title: 'Créateur de visuels',
  description: 'Générateur de visuels pour les réseaux sociaux.',
}

export default async function CreatorPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login?callbackUrl=/createur')

  return <VisualCreator />
}