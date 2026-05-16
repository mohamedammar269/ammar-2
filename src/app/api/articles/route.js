import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const articles = await prisma.article.findMany({
      where: { ...(published !== null ? { published: published === 'true' } : {}) },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    })
    return NextResponse.json(articles)
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const body = await request.json()
    const { title, excerpt, content, category, tags, published, coverImage } = body
    if (!title || !content) return NextResponse.json({ error: 'Titre et contenu requis' }, { status: 400 })
    const baseSlug = slugify(title, { lower: true, strict: true, locale: 'fr' })
    let slug = baseSlug, counter = 1
    while (await prisma.article.findUnique({ where: { slug } })) slug = `${baseSlug}-${counter++}`
    const article = await prisma.article.create({
      data: { title, slug, excerpt, content, category, tags, published: published ?? false, coverImage, authorId: session.user.id },
    })
    return NextResponse.json(article, { status: 201 })
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
