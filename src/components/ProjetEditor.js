'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProjetEditor({ projet }) {
  const router = useRouter()
  const isEdit = !!projet
  const [form, setForm] = useState({
    title: projet?.title || '', description: projet?.description || '',
    content: projet?.content || '', category: projet?.category || '',
    tags: projet?.tags || '', liveUrl: projet?.liveUrl || '',
    githubUrl: projet?.githubUrl || '', coverImage: projet?.coverImage || '',
    featured: projet?.featured ?? false, order: projet?.order ?? 0, published: projet?.published ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit() {
    setLoading(true); setError(null)
    const url = isEdit ? `/api/projets/${projet.id}` : '/api/projets'
    try {
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error((await res.json()).error)
      router.push('/admin/projets'); router.refresh()
    } catch (e) { setError(e.message); setLoading(false) }
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce projet ?')) return
    await fetch(`/api/projets/${projet.id}`, { method: 'DELETE' })
    router.push('/admin/projets'); router.refresh()
  }

  const inputCls = "w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors"
  const labelCls = "block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5"

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-navy font-bold">{isEdit ? 'Modifier le projet' : 'Nouveau projet'}</h1>
        {isEdit && <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700">Supprimer</button>}
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-4">{error}</div>}
      <div className="bg-white shadow p-6 space-y-4">
        <div><label className={labelCls}>Titre *</label><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nom du projet" /></div>
        <div><label className={labelCls}>Description courte *</label><textarea className={inputCls + ' resize-none'} rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></div>
        <div><label className={labelCls}>Contenu détaillé (HTML)</label><textarea className={inputCls + ' resize-y font-mono text-xs'} rows={6} value={form.content} onChange={e => set('content', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Catégorie</label><input className={inputCls} value={form.category} onChange={e => set('category', e.target.value)} /></div>
          <div><label className={labelCls}>Tags</label><input className={inputCls} value={form.tags} onChange={e => set('tags', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>URL site</label><input className={inputCls} value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://..." /></div>
          <div><label className={labelCls}>GitHub</label><input className={inputCls} value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} placeholder="https://github.com/..." /></div>
        </div>
        <div><label className={labelCls}>Image de couverture</label><input className={inputCls} value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." /></div>
        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-navy" />Mis en avant
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 accent-navy" />Visible
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSubmit} disabled={loading || !form.title || !form.description} className="btn-navy text-sm disabled:opacity-40">
          {loading ? '...' : (isEdit ? 'Mettre à jour' : 'Créer')}
        </button>
        <button onClick={() => router.back()} className="btn-outline text-sm">Annuler</button>
      </div>
    </div>
  )
}
