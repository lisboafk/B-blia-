'use client'
import { useState, useCallback } from 'react'
import { Heart, Copy, Volume2, ChevronDown, Check } from 'lucide-react'
import { getCommentary } from '@/data/reformed-commentary'

interface VerseCardProps {
  book: string; chapter: number; verse: number; text: string
  fontSize?: number
  selectionMode?: boolean
  selected?: boolean
  externalHighlight?: string | null
  speakingVerse?: boolean
  onReveal: (verse: number, text: string) => void
  onSelect?: (verse: number) => void
}

const COLORS = [
  { key: 'gold',  cls: 'verse-highlight-gold',  bg: 'bg-gold',       border: 'border-gold' },
  { key: 'fire',  cls: 'verse-highlight-fire',  bg: 'bg-fire',       border: 'border-fire' },
  { key: 'blue',  cls: 'verse-highlight-blue',  bg: 'bg-blue-400',   border: 'border-blue-400' },
  { key: 'green', cls: 'verse-highlight-green', bg: 'bg-green-400',  border: 'border-green-400' },
]

const hlKey = (b: string, c: number, v: number) => `hl-${b}-${c}-${v}`

export default function VerseCard({
  book, chapter, verse, text, fontSize = 22,
  selectionMode = false, selected = false,
  externalHighlight = null, speakingVerse = false,
  onReveal, onSelect,
}: VerseCardProps) {
  const [highlight, setHighlight] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(hlKey(book, chapter, verse))
  })
  const [favorite, setFavorite] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(`fav-${book}-${chapter}-${verse}`) === '1'
  })
  const [showTools, setShowTools] = useState(false)
  const [copied, setCopied] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const hasCommentary = !!getCommentary(book, chapter, verse)

  const activeHighlight = externalHighlight ?? highlight

  const toggleFav = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorite(v => {
      const next = !v
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
      if (next) {
        const exists = favs.some((f: { book: string; chapter: number; verse: number }) =>
          f.book === book && f.chapter === chapter && f.verse === verse)
        if (!exists) favs.push({ book, chapter, verse, text })
      } else {
        const i = favs.findIndex((f: { book: string; chapter: number; verse: number }) =>
          f.book === book && f.chapter === chapter && f.verse === verse)
        if (i > -1) favs.splice(i, 1)
      }
      localStorage.setItem('favorites', JSON.stringify(favs))
      localStorage.setItem(`fav-${book}-${chapter}-${verse}`, next ? '1' : '0')
      return next
    })
  }, [book, chapter, verse, text])

  const applyHighlight = useCallback((e: React.MouseEvent, colorKey: string) => {
    e.stopPropagation()
    setHighlight(prev => {
      const next = prev === colorKey ? null : colorKey
      if (next) localStorage.setItem(hlKey(book, chapter, verse), next)
      else localStorage.removeItem(hlKey(book, chapter, verse))
      return next
    })
  }, [book, chapter, verse])

  const copyVerse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const bookLabel = book.charAt(0).toUpperCase() + book.slice(1)
    navigator.clipboard.writeText(`"${text}" — ${bookLabel} ${chapter}:${verse}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [text, book, chapter, verse])

  const speakVerse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const u = new SpeechSynthesisUtterance(`Versículo ${verse}. ${text}`)
    u.lang = 'pt-BR'
    u.rate = 0.85
    const voices = window.speechSynthesis.getVoices()
    const ptVoice = voices.find(v => v.lang.startsWith('pt'))
    if (ptVoice) u.voice = ptVoice
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [verse, text, speaking])

  const handleClick = () => {
    if (selectionMode) { onSelect?.(verse); return }
    if (hasCommentary) onReveal(verse, text)
    else setShowTools(v => !v)
  }

  return (
    <div
      id={`verse-${verse}`}
      role="article"
      aria-label={`Versículo ${verse}`}
      className={`relative px-4 py-2.5 cursor-pointer transition-all duration-150 rounded-lg mx-2 my-0.5 ${
        speakingVerse
          ? 'bg-gold/10 ring-1 ring-gold/50 border-l-2 border-gold'
          : selected
            ? 'bg-gold/20 border-l-2 border-gold ring-1 ring-gold/30'
            : activeHighlight
              ? COLORS.find(c => c.key === activeHighlight)?.cls
              : 'hover:bg-white/5'
      } ${!selectionMode && hasCommentary && !speakingVerse ? 'border-l-2 border-gold/0 hover:border-gold/30' : ''}`}
      onClick={handleClick}
      onContextMenu={e => { e.preventDefault(); setShowTools(v => !v) }}
    >
      {selectionMode && (
        <div
          role="checkbox"
          aria-checked={selected}
          aria-label={`Selecionar versículo ${verse}`}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selected ? 'bg-gold border-gold' : 'border-parchment/30 bg-transparent'
          }`}
        >
          {selected && <Check size={11} className="text-obsidian" strokeWidth={3} />}
        </div>
      )}

      <p className={`verse-text transition-all ${selectionMode ? 'pl-6' : ''}`} style={{ fontSize }}>
        <span className="verse-number">{verse}</span>
        {text}
        {!selectionMode && hasCommentary && (
          <span className="inline-block ml-1 w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" aria-hidden="true" />
        )}
      </p>

      {!selectionMode && (
        <div
          className={`flex items-center gap-2 mt-2 transition-all duration-200 flex-wrap ${
            showTools ? 'opacity-100 max-h-16' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
          role="toolbar"
          aria-label={`Ferramentas do versículo ${verse}`}
        >
          <button onClick={toggleFav} aria-label={favorite ? 'Remover favorito' : 'Favoritar versículo'}
            className="p-1.5 rounded-lg bg-obsidian/80 border border-gold/20 active:scale-90">
            <Heart size={12} className={favorite ? 'text-fire fill-fire' : 'text-parchment/50'} />
          </button>

          {COLORS.map(c => (
            <button key={c.key} onClick={e => applyHighlight(e, c.key)}
              aria-label={`Destacar em ${c.key}`} aria-pressed={highlight === c.key}
              className={`w-5 h-5 rounded-full border-2 transition-all ${c.bg} ${c.border} ${
                highlight === c.key ? 'scale-125 opacity-100' : 'opacity-60'
              }`}
            />
          ))}

          {hasCommentary && (
            <button onClick={e => { e.stopPropagation(); onReveal(verse, text) }}
              aria-label="Abrir comentário reformado"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gold/10 border border-gold/30 text-gold text-[10px]"
              style={{ fontFamily: 'Cinzel, serif' }}>
              <ChevronDown size={10} /> Revelação
            </button>
          )}

          <button onClick={speakVerse} aria-label={speaking ? 'Parar leitura' : 'Ouvir versículo'}
            className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
              speaking ? 'bg-gold/20 border-gold text-gold' : 'bg-obsidian/80 border-gold/20 text-parchment/50'
            }`}>
            <Volume2 size={12} />
          </button>

          <button onClick={copyVerse} aria-label="Copiar versículo"
            className={`p-1.5 rounded-lg border transition-all active:scale-90 ${
              copied ? 'bg-green-400/20 border-green-400 text-green-400' : 'bg-obsidian/80 border-gold/20 text-parchment/50'
            }`}>
            <Copy size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
