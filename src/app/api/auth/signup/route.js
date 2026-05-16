// import { NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'
// import { prisma } from '@/lib/prisma'

// export async function POST(req) {

//   try {
//     const { name, email, password } = await req.json()
//     if (!name || !email || !password)
//       return NextResponse.json(
//         { message: 'Tous les champs sont requis' },
//         { status: 400 },
//       )
//     if (password.length < 8)
//       return NextResponse.json(
//         { message: 'Mot de passe trop court (min. 8 caractères)' },
//         { status: 400 },
//       )
//     const existing = await prisma.user.findUnique({
//       where: { email: email.toLowerCase() },
//     })
//     if (existing)
//       return NextResponse.json(
//         { message: 'Un compte existe déjà avec cet email' },
//         { status: 400 },
//       )
//     const hashedPassword = await bcrypt.hash(password, 12)
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email: email.toLowerCase(),
//         hashPassword: hashedPassword,
//         role: 'admin',
//       },
//       select: { id: true, name: true, email: true, role: true },
//     })
//     return NextResponse.json({ message: 'Compte créé', user }, { status: 201 })
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    // 1. Vérifier que tous les champs sont présents
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 },
      )
    }

    // 2. Vérifier que c'est l'email autorisé
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      return NextResponse.json(
        { message: 'Inscription non autorisée.' },
        { status: 403 },
      )
    }

    // 3. Vérifier la longueur du mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Mot de passe trop court (min. 8 caractères)' },
        { status: 400 },
      )
    }

    // 4. Vérifier si le compte existe déjà
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (existing) {
      return NextResponse.json(
        { message: 'Un compte existe déjà avec cet email' },
        { status: 400 },
      )
    }

    // 5. Créer le compte
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashPassword: hashedPassword,
        role: 'admin',
      },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ message: 'Compte créé', user }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
