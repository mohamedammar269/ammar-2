'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm)
      return setError('Les mots de passe ne correspondent pas.')
    if (form.password.length < 8)
      return setError('Le mot de passe doit contenir au moins 8 caractères.')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Erreur lors de la création du compte.')
        setLoading(false)
        return
      }
      // Auto-login
      const login = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      })
      if (login?.error) {
        router.push('/login')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Une erreur est survenue.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="mb-8 text-sm text-gray-400 hover:text-navy transition-colors"
      >
        ← Retour au site
      </Link>
      <div className="w-full max-w-md">
        <div className="bg-navy px-8 py-6 text-center">
          <h1 className="font-serif text-2xl text-white font-bold">
            Créer un compte
          </h1>
          <p className="text-gray-400 text-sm mt-1">Accès administration</p>
        </div>
        <div className="bg-white shadow-md px-8 py-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Soilahoudine Mohamed Ali"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="votre@email.com"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min. 8 caractères"
                  className="w-full border border-gray-200 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-navy transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
                Confirmer
              </label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => set('confirm', e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white py-3 text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">
            Déjà un compte ?{' '}
            <Link
              href="/login"
              className="text-navy font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
