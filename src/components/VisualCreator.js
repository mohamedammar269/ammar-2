'use client'

import { useRef, useState } from 'react'

const defaultImage =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2400&auto=format&fit=crop'

const initialContent = {
  tag: 'INTELLIGENCE ARTIFICIELLE',
  title: "OpenAI lance GPT-5 : Une avancée majeure pour l'automatisation industrielle",
  subtitle:
    "Les premiers tests indiquent un raisonnement logique inédit et une intégration native des agents autonomes.",
  date: '27 août 2026',
  source: 'Tech & Data Insights',
  author: 'Soilahoudine Mohamed',
  accent: '#C9A84C',
  scale: 100,
  positionY: 50,
  overlay: 10,
}

const templates = {
  edith: { label: 'Actu Pressep', detail: 'Style Edith Brou', icon: '📰' },
  km: { label: 'KM Modern', detail: 'Card & Badge', icon: '▱' },
  darktech: { label: 'Cyber Dark', detail: 'Style Soilahoudine', icon: '◈' },
}

function Field({ label, children }) {
  return (
    <label className="block text-xs text-slate-300">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  )
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const loadedImage = new Image()
    loadedImage.crossOrigin = 'anonymous'
    loadedImage.onload = () => resolve(loadedImage)
    loadedImage.onerror = reject
    loadedImage.src = source
  })
}

export default function VisualCreator() {
  const [content, setContent] = useState(initialContent)
  const [template, setTemplate] = useState('edith')
  const [image, setImage] = useState(defaultImage)
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef(null)

  const update = (key, value) => setContent((current) => ({ ...current, [key]: value }))

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  const exportImage = async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const imageElement = cardRef.current.querySelector('[data-creator-image]')
      if (imageElement?.decode) await imageElement.decode()

      const sourceImage = await loadImage(image)
      const exportScale = 2
      const exportWidth = 480
      const imageHeight = template === 'edith' ? 560 * 0.52 : template === 'km' ? 560 * 0.48 : 560 * 0.45
      const imageCanvas = document.createElement('canvas')
      imageCanvas.width = exportWidth * exportScale
      imageCanvas.height = imageHeight * exportScale
      const imageContext = imageCanvas.getContext('2d')
      imageContext.imageSmoothingEnabled = true
      imageContext.imageSmoothingQuality = 'high'

      const zoom = Number(content.scale) / 100
      const positionY = Number(content.positionY) / 100
      const sourceScale = Math.max(
        imageCanvas.width / sourceImage.naturalWidth,
        imageCanvas.height / sourceImage.naturalHeight,
      ) * zoom
      const drawnWidth = sourceImage.naturalWidth * sourceScale
      const drawnHeight = sourceImage.naturalHeight * sourceScale
      const offsetX = (imageCanvas.width - drawnWidth) / 2
      const offsetY = (imageCanvas.height - drawnHeight) * positionY
      imageContext.drawImage(sourceImage, offsetX, offsetY, drawnWidth, drawnHeight)
      const preparedImage = imageCanvas.toDataURL('image/png')

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: exportScale,
        useCORS: true,
        logging: false,
        onclone: (clonedDocument) => {
          const clonedCard = clonedDocument.querySelector('[data-visual-card]')
          const clonedImage = clonedDocument.querySelector('[data-creator-image]')
          if (clonedCard) {
            clonedCard.style.width = '480px'
            clonedCard.style.height = '560px'
          }
          if (clonedImage) {
            clonedImage.src = preparedImage
            clonedImage.style.transform = 'none'
            clonedImage.style.objectFit = 'fill'
            clonedImage.style.objectPosition = 'center'
          }
        },
      })
      const link = document.createElement('a')
      link.download = `Tech-News-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png', 1)
      link.click()
    } catch (error) {
      console.error(error)
      window.alert("Impossible de générer l'image. Réessaie avec une autre image.")
    } finally {
      setExporting(false)
    }
  }

  const isLight = template === 'km'
  const isCyber = template === 'darktech'
  const cardText = isLight ? 'text-slate-900' : 'text-white'
  const cardBackground = isLight ? 'bg-slate-100' : isCyber ? 'bg-slate-950' : 'bg-slate-900'

  return (
    <div className="creator-shell min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100 lg:flex">
      <aside className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto border-r border-slate-800 bg-slate-900 p-6 lg:max-h-screen lg:w-[450px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-xl shadow-lg shadow-blue-500/20">▦</div>
            <div>
              <h1 className="font-display text-lg font-bold text-white">Tech News Creator</h1>
              <p className="text-xs text-slate-400">Générateur de visuels IA & Tech</p>
            </div>
          </div>
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 font-mono text-xs text-blue-400">v1.0</span>
        </div>

        <section>
          <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Style & Mise en page</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(templates).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTemplate(key)}
                className={`flex flex-col gap-1 rounded-xl border p-3 text-left text-xs font-medium transition ${template === key ? 'border-blue-500 bg-slate-800 text-white' : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'}`}
              >
                <span className="text-sm text-blue-400">{item.icon}</span>
                <span>{item.label}</span>
                <span className="text-[10px] font-normal text-slate-400">{item.detail}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">▧ &nbsp; Image d&apos;illustration</p>
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="creator-image" />
          <label htmlFor="creator-image" className="block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-center text-sm font-medium text-slate-200 transition hover:bg-slate-700">↥ &nbsp; Choisir une photo</label>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Field label="Cadrage / Zoom"><input type="range" min="100" max="200" value={content.scale} onChange={(e) => update('scale', e.target.value)} className="w-full accent-blue-500" /></Field>
            <Field label="Position Y"><input type="range" min="0" max="100" value={content.positionY} onChange={(e) => update('positionY', e.target.value)} className="w-full accent-blue-500" /></Field>
          </div>
          <Field label="Assombrissement Image (%)"><input type="range" min="0" max="80" value={content.overlay} onChange={(e) => update('overlay', e.target.value)} className="w-full accent-blue-500" /></Field>
        </section>

        <section className="space-y-4">
          <p className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Contenu du Visuel</p>
          <Field label="Catégorie / Tag"><input value={content.tag} onChange={(e) => update('tag', e.target.value)} className="creator-input" /></Field>
          <Field label="Titre Principal / Accroche"><textarea rows="3" value={content.title} onChange={(e) => update('title', e.target.value)} className="creator-input leading-snug" /></Field>
          <Field label="Sous-titre / Résumé rapide"><textarea rows="2" value={content.subtitle} onChange={(e) => update('subtitle', e.target.value)} className="creator-input text-xs" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input value={content.date} onChange={(e) => update('date', e.target.value)} className="creator-input" /></Field>
            <Field label="Source / Note"><input value={content.source} onChange={(e) => update('source', e.target.value)} className="creator-input" /></Field>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">♙ &nbsp; Identité Auteur / Marque</p>
          <Field label="Nom / Signature"><input value={content.author} onChange={(e) => update('author', e.target.value)} className="creator-input" /></Field>
          <Field label="Couleur Principale d'Accent">
            <div className="flex items-center gap-2"><input type="color" value={content.accent} onChange={(e) => update('accent', e.target.value)} className="h-9 w-10 cursor-pointer rounded border-0 bg-transparent" /><span className="font-mono text-xs text-slate-400">{content.accent}</span></div>
          </Field>
        </section>

        <button type="button" disabled={exporting} onClick={exportImage} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
          {exporting ? '◌ Génération HD...' : '↓ Télécharger le Visuel (PNG HD)'}
        </button>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-slate-950 p-4 lg:p-8">
        <p className="mb-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Aperçu en direct (Format 480 x 560 — Instagram / LinkedIn)</p>
        <div ref={cardRef} data-visual-card className="relative flex h-[560px] w-[min(480px,calc(100vw-2rem))] flex-col overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,.4)]" style={{ '--accent': content.accent }}>
          <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(59,130,246,.15), transparent 50%)' }} />
          <div className={`relative z-10 w-full overflow-hidden border-b border-slate-800 bg-slate-950 ${isCyber ? 'h-[45%]' : isLight ? 'h-[48%]' : 'h-[52%]'}`}>
            <img data-creator-image src={image} alt="" crossOrigin="anonymous" decoding="sync" className="absolute inset-0 h-full w-full object-cover transition-transform" style={{ objectPosition: `center ${content.positionY}%`, transform: `scale(${content.scale / 100})` }} />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${content.overlay / 100})` }} />
            {isLight && <div className="absolute left-5 top-4 rounded-full px-3 py-1 font-tech text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg" style={{ backgroundColor: content.accent }}>KM-NEWS</div>}
          </div>
          <div className={`relative z-10 flex flex-1 flex-col justify-between p-6 ${cardBackground} ${cardText}`}>
            {!isLight && <div className="absolute left-0 right-0 top-0 h-[3px]" style={{ backgroundColor: content.accent }} />}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2"><span className="font-tech text-xs font-bold uppercase tracking-wider" style={{ color: content.accent }}>{content.tag}</span><span className="font-mono text-xs text-slate-400">{content.date}</span></div>
              <h2 className={`mb-2 font-display text-xl font-bold leading-tight sm:text-2xl ${isLight ? 'text-slate-900' : isCyber ? 'text-blue-100 font-tech' : 'text-white'}`}>{content.title}</h2>
              <p className={`mb-4 text-xs leading-relaxed ${isLight ? 'text-slate-600' : isCyber ? 'text-slate-400' : 'text-slate-300'}`}>{content.subtitle}</p>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-slate-800/80 pt-3">
              <div className="flex h-6 items-center gap-2"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-tech text-[10px] font-black leading-none text-slate-950" style={{ backgroundColor: content.accent }}><span className="relative -top-1 block">IA</span></div><span className="relative -top-1 flex h-6 items-center text-xs font-semibold leading-none text-slate-200">{content.author}</span></div>
              <span className="text-[10px] text-slate-400">{content.source}</span>
            </div>
          </div>
          {template === 'edith' && <div className="z-20 w-full py-1.5 text-center font-tech text-xs font-bold uppercase tracking-widest text-slate-950" style={{ backgroundColor: content.accent }}>{content.author}</div>}
        </div>
        <p className="mt-6 max-w-md text-center text-xs text-slate-500">ⓘ Ce visuel respecte une hiérarchie lisible sur mobile et un branding clair.</p>
      </main>
    </div>
  )
}