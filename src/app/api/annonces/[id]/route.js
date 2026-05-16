// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// export async function PUT(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
//     const body = await request.json()
//     return NextResponse.json(await prisma.annonce.update({ where: { id: params.id }, data: body }))
//   } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
// }

// export async function DELETE(request, { params }) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
//     await prisma.annonce.delete({ where: { id: params.id } })
//     return NextResponse.json({ success: true })
//   } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
// }

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request, context) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const updatedAnnonce = await prisma.annonce.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(updatedAnnonce)
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

    await prisma.annonce.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
