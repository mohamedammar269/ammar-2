// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import slugify from 'slugify'

// export async function PUT(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
//     const body = await request.json()
//     const existing = await prisma.projet.findUnique({ where: { id: params.id } })
//     if (!existing) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
//     let slug = existing.slug
//     if (body.title && body.title !== existing.title) {
//       const base = slugify(body.title, { lower: true, strict: true, locale: 'fr' })
//       slug = base; let c = 1
//       while (await prisma.projet.findFirst({ where: { slug, NOT: { id: params.id } } })) slug = `${base}-${c++}`
//     }
//     const projet = await prisma.projet.update({ where: { id: params.id }, data: { ...body, slug } })
//     return NextResponse.json(projet)
//   } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
// }

// export async function DELETE(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
//     await prisma.projet.delete({ where: { id: params.id } })
//     return NextResponse.json({ success: true })
//   } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
// }

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function PUT(request, context) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const existing = await prisma.projet.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    }

    let slug = existing.slug

    if (body.title && body.title !== existing.title) {
      const base = slugify(body.title, {
        lower: true,
        strict: true,
        locale: 'fr',
      })

      slug = base
      let c = 1

      while (
        await prisma.projet.findFirst({
          where: {
            slug,
            NOT: { id },
          },
        })
      ) {
        slug = `${base}-${c++}`
      }
    }

    const projet = await prisma.projet.update({
      where: { id },
      data: {
        ...body,
        slug,
      },
    })

    return NextResponse.json(projet)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await context.params

    await prisma.projet.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
