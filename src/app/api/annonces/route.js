import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    return NextResponse.json(await prisma.annonce.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }))
  } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const body = await request.json()
    const annonce = await prisma.annonce.create({ data: { ...body, authorId: session.user.id } })
    return NextResponse.json(annonce, { status: 201 })
  } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
}
