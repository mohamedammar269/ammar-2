import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET(request, { params }) {
  try {
    const article = await prisma.article.findUnique({ where: { id: params.id } })
    if (!article) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json(article)
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const body = await request.json()
    const existing = await prisma.article.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    let slug = existing.slug
    if (body.title && body.title !== existing.title) {
      const base = slugify(body.title, { lower: true, strict: true, locale: 'fr' })
      slug = base; let c = 1
      while (await prisma.article.findFirst({ where: { slug, NOT: { id: params.id } } })) slug = `${base}-${c++}`
    }
    const article = await prisma.article.update({ where: { id: params.id }, data: { ...body, slug } })
    return NextResponse.json(article)
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    await prisma.article.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
