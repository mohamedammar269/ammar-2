'use client'
import { useState, useEffect } from 'react'

export default function AdminAnnonces() {
  const [annonces, setAnnonces] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', content: '', type: 'info' })
  const [submitting, setSubmitting] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const load = async () => {
    try { const r = await fetch('/api/annonces'); setAnnonces(await r.json()) } catch {}
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function handleCreate() {
    if (!form.title || !form.content) return
    setSubmitting(true)
    await fetch('/api/annonces', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ title: '', content: '', type: 'info' }); await load(); setSubmitting(false)
  }

  async function toggle(a) {
    await fetch(`/api/annonces/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !a.active }) })
    await load()
  }

  async function del(id) {
    if (!confirm('Supprimer ?')) return
    await fetch(`/api/annonces/${id}`, { method: 'DELETE' }); await load()
  }

  const inputCls = "w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy"
  const labelCls = "block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5"

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-navy font-bold mb-2">Annonces</h1>
      <p className="text-gray-500 text-sm mb-6">Affichées sur la page d'accueil.</p>

      <div className="bg-white shadow p-6 mb-6">
        <h2 className="font-serif text-lg text-navy font-semibold mb-4">Nouvelle annonce</h2>
        <div className="space-y-3">
          <div><label className={labelCls}>Titre *</label><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="ex: Nouveau projet lancé !" /></div>
          <div><label className={labelCls}>Contenu *</label><textarea className={inputCls + ' resize-none'} rows={3} value={form.content} onChange={e => set('content', e.target.value)} /></div>
          <div>
            <label className={labelCls}>Type</label>
            <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="info">Info</option>
              <option value="success">Succès</option>
              <option value="warning">Important</option>
            </select>
          </div>
          <button onClick={handleCreate} disabled={submitting || !form.title || !form.content} className="btn-navy text-sm disabled:opacity-40">
            {submitting ? '...' : 'Publier l\'annonce'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-serif text-lg text-navy font-semibold">Toutes les annonces</h2></div>
        {loading ? <p className="px-6 py-8 text-center text-gray-400 text-sm">Chargement...</p>
          : annonces.length === 0 ? <p className="px-6 py-8 text-center text-gray-400 text-sm italic">Aucune annonce.</p>
          : annonces.map((a, i) => (
            <div key={a.id} className={`px-6 py-4 ${i < annonces.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 font-medium ${a.type === 'success' ? 'bg-green-100 text-green-700' : a.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{a.type}</span>
                  </div>
                  <p className="text-xs text-gray-500">{a.content}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => toggle(a)} className={`text-xs font-semibold px-2 py-0.5 ${a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.active ? '● Actif' : '○ Inactif'}
                  </button>
                  <button onClick={() => del(a.id)} className="text-xs text-red-400 hover:text-red-600">Suppr.</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
