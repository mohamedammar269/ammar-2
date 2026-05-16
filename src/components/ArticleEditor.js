'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ArticleEditor({ article }) {
  const router = useRouter()
  const isEdit = !!article
  const [form, setForm] = useState({
    title: article?.title || '', excerpt: article?.excerpt || '',
    content: article?.content || '', category: article?.category || '',
    tags: article?.tags || '', published: article?.published ?? false,
    coverImage: article?.coverImage || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(publishState) {
    setLoading(true); setError(null)
    const data = { ...form, published: publishState ?? form.published }
    const url = isEdit ? `/api/articles/${article.id}` : '/api/articles'
    try {
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error((await res.json()).error)
      router.push('/admin/articles'); router.refresh()
    } catch (e) { setError(e.message); setLoading(false) }
  }

  async function handleDelete() {
    if (!confirm('Supprimer cet article ?')) return
    setLoading(true)
    await fetch(`/api/articles/${article.id}`, { method: 'DELETE' })
    router.push('/admin/articles'); router.refresh()
  }

  const inputCls = "w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors"
  const labelCls = "block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5"

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-navy font-bold">{isEdit ? 'Modifier l\'article' : 'Nouvel article'}</h1>
        <div className="flex gap-3">
          <button onClick={() => setPreview(p => !p)} className="text-sm text-navy border border-navy px-4 py-2 hover:bg-navy hover:text-white transition-colors">
            {preview ? '✎ Éditer' : '◉ Aperçu'}
          </button>
          {isEdit && <button onClick={handleDelete} disabled={loading} className="text-sm text-red-500 hover:text-red-700">Supprimer</button>}
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-4">{error}</div>}

      {preview ? (
        <div className="bg-white shadow p-8">
          {form.category && <span className="text-xs text-gold font-semibold uppercase">{form.category}</span>}
          <h2 className="font-serif text-4xl text-navy font-bold mt-2 mb-4">{form.title || 'Sans titre'}</h2>
          {form.excerpt && <p className="text-gray-500 text-lg italic mb-6 pb-6 border-b">{form.excerpt}</p>}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: form.content }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white shadow p-6 space-y-4">
            <div><label className={labelCls}>Titre *</label><input className={inputCls + ' text-base font-serif'} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Titre de l'article" /></div>
            <div><label className={labelCls}>Extrait</label><textarea className={inputCls + ' resize-none'} rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Courte description..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Catégorie</label><input className={inputCls} value={form.category} onChange={e => set('category', e.target.value)} placeholder="IA, Comores, Tech..." /></div>
              <div><label className={labelCls}>Tags (virgule)</label><input className={inputCls} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="BERT, NLP, Python" /></div>
            </div>
            <div><label className={labelCls}>Image de couverture (URL)</label><input className={inputCls} value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." /></div>
          </div>
          <div className="bg-white shadow p-6">
            <label className={labelCls}>Contenu * (HTML supporté)</label>
            <textarea className={inputCls + ' resize-y font-mono text-xs'} rows={20} value={form.content} onChange={e => set('content', e.target.value)} placeholder="<p>Votre contenu ici...</p>" />
            <p className="text-xs text-gray-400 mt-2">Balises supportées : &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;blockquote&gt;, &lt;code&gt;…</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6 items-center">
        <button onClick={() => handleSubmit(true)} disabled={loading || !form.title || !form.content} className="btn-navy text-sm disabled:opacity-40">
          {loading ? '...' : (form.published ? 'Mettre à jour' : 'Publier')}
        </button>
        {!form.published && (
          <button onClick={() => handleSubmit(false)} disabled={loading} className="btn-outline text-sm">Brouillon</button>
        )}
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-navy ml-2">Annuler</button>
      </div>
    </div>
  )
}
