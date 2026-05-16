'use client'
import { useState, useRef } from 'react'

export default function ImageUpload({
  value,
  onChange,
  label = 'Image de couverture',
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(value || null)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/'))
      return setError('Le fichier doit être une image.')
    if (file.size > 5 * 1024 * 1024)
      return setError('Image trop lourde (max 5MB).')

    setError(null)
    setUploading(true)
    setPreview(URL.createObjectURL(file)) // aperçu local immédiat

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur upload')
      setPreview(data.url)
      onChange(data.url) // envoie l'URL au formulaire parent
    } catch (e) {
      setError(e.message)
      setPreview(value || null)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    setPreview(null)
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
        {label}
      </label>

      {/* Zone de drop / preview */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-200 hover:border-navy transition-colors relative"
      >
        {preview ? (
          /* Preview de l'image */
          <div className="relative">
            <img
              src={preview}
              alt="preview"
              className="w-full h-48 object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-navy font-medium">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Upload en cours...
                </div>
              </div>
            )}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Supprimer"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          /* Zone vide - clic ou drag */
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full py-10 flex flex-col items-center gap-3 text-gray-400 hover:text-navy transition-colors disabled:opacity-50"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="text-sm font-medium">
              {uploading
                ? 'Upload en cours...'
                : 'Cliquer ou glisser une image'}
            </span>
            <span className="text-xs">PNG, JPG, WebP — max 5MB</span>
          </button>
        )}
      </div>

      {/* URL manuelle en fallback */}
      <div className="mt-2 flex gap-2 items-center">
        <input
          type="url"
          placeholder="Ou coller une URL d'image..."
          value={preview && preview.startsWith('http') ? preview : ''}
          onChange={(e) => {
            setPreview(e.target.value)
            onChange(e.target.value)
          }}
          className="flex-1 border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-navy transition-colors"
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {/* Input file caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
