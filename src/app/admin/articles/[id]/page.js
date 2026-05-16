import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ArticleEditor from '@/components/ArticleEditor'

export default async function EditArticle({ params }) {
  let article
  try { article = await prisma.article.findUnique({ where: { id: params.id } }) } catch {}
  if (!article) notFound()
  return <ArticleEditor article={{ ...article, createdAt: article.createdAt.toISOString(), updatedAt: article.updatedAt.toISOString() }} />
}
