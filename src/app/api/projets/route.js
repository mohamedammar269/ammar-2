import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET() {
  try {
    const projets = await prisma.projet.findMany({ where: { published: true }, orderBy: [{ featured: 'desc' }, { order: 'asc' }] })
    return NextResponse.json(projets)
  } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const body = await request.json()
    const base = slugify(body.title, { lower: true, strict: true, locale: 'fr' })
    let slug = base, c = 1
    while (await prisma.projet.findUnique({ where: { slug } })) slug = `${base}-${c++}`
    const projet = await prisma.projet.create({ data: { ...body, slug } })
    return NextResponse.json(projet, { status: 201 })
  } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
}
