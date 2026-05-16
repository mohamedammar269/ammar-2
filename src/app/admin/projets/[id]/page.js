import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProjetEditor from '@/components/ProjetEditor'

export default async function EditProjet({ params }) {
  let projet
  try { projet = await prisma.projet.findUnique({ where: { id: params.id } }) } catch {}
  if (!projet) notFound()
  return <ProjetEditor projet={{ ...projet, createdAt: projet.createdAt.toISOString(), updatedAt: projet.updatedAt.toISOString() }} />
}
