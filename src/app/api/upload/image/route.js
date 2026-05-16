// app/api/upload/image/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { v2 as cloudinary } from 'cloudinary'
import { authOptions } from '@/lib/auth'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * POST /api/upload/image
 * Upload une image générique (Flash Info, profils, etc.)
 *
 * ✅ Accessible à TOUS les utilisateurs connectés
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    // Vérifier que l'utilisateur est connecté (pas besoin d'être admin)
    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 },
      )
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 },
      )
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "L'image ne doit pas dépasser 5MB" },
        { status: 400 },
      )
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload sur Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'km-news/uploads', // Dossier générique
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, // Limiter la taille
            { quality: 'auto:good' }, // Optimiser la qualité
            { fetch_format: 'auto' }, // Format optimal (WebP si supporté)
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      message: 'Image uploadée avec succès',
    })
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'image" },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/upload/image?publicId=xxx
 * Supprimer une image de Cloudinary
 *
 * ✅ Accessible à TOUS les utilisateurs connectés (leurs propres images)
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({ error: 'publicId requis' }, { status: 400 })
    }

    // Supprimer de Cloudinary
    await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({
      success: true,
      message: 'Image supprimée avec succès',
    })
  } catch (error) {
    console.error('Erreur suppression Cloudinary:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 },
    )
  }
}
