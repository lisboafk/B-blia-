'use client'
import { useState, useCallback } from 'react'
import { Heart, MessageSquare, ChevronDown, Check } from 'lucide-react'
import { getCommentary } from '@/data/reformed-commentary'

interface VerseCardProps {
  book: string; chapter: number; verse: number; text: string
  fontSize?: number
  selectionMode?: boolean
  selected?: boolean
  externalHighlight?: string | null
  onReveal: (verse: number, text: string) => void
  onSelect?: (verse: number) => void
}

const COLORS = [
  { key: 'gold', cls: 'verse-highlight-gold', bg: 'bg-gold' },
  { key: 'fire', cls: 'verse-highlight-fire', bg: 'bg-fire' },
  { key: 'blue', cls: 'verse-highlight-blue', bg: 'bg-blue-400' },
  { key: 'green', cls: 'verse-highlight-green', bg: 'bg-green-400' },
]

export default function VerseCard({
  book, chapter, verse, text, fontSize = 22,
  selectionMode = false, selected = false,
  externalHighlight = null,
  onReveal, onSelect,
}: VerseCardProps) {
  const [highlight, setHighlight] = useState<string | null>(null)
  const [favorite, setFavorite] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(`fav-${book}-${chapter}-${verse}`) === '1'
  })
  const [showTools, setShowTools] = useState(false)
  const hasCommentary = !!getCommentary(book, chapter, verse)

  const activeHighlight = externalHighlight ?? highlight

  const toggleFav = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorite(v => {
      const next = !v
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
      if (next) { favs.push({ book, chapter, verse, text }) }
      else {
        const i = favs.findIndex((f: { book: string; chapter: number; verse: number }) =>
          f.book === book && f.chapter === chapter && f.verse === verse)
        if (i > -1) favs.splice(i, 1)
      }
      localStorage.setItem('favorites', JSON.stringify(favs))
      localStorage.setItem(`fav-${book}-${chapter}-${verse}`, next ? '1' : '0')
      return next
    })
  }, [book, chapter, verse, text])

  const handleClick = () => {
    if (selectionMode) { onSelect?.(verse); return }
    if (hasCommentary) onReveal(verse, text)
    else setShowTools(v => !v)
  }

  return (
    <div
      id={`verse-${verse}`}
      className={`relative px-4 py-2.5 cursor-pointer transition-all duration-150 rounded-lg mx-2 my-0.5 ${
        selected
          ? 'bg-gold/20 border-l-2 border-gold ring-1 ring-gold/30'
          : activeHighlight
            ? COLORS.find(c => c.key === activeHighlight)?.cls
            : 'hover:bg-white/5'
      } ${!selectionMode && hasCommentary ? 'border-l-2 border-gold/0 hover:border-gold/30' : ''}`}
      onClick={handleClick}
      onContextMenu={(e) => { e.preventDefault(); setShowTools(v => !v) }}
    >
      {/* Selection checkbox */}
      {selectionMode && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          selected ? 'bg-gold border-gold' : 'border-parchment/30 bg-transparent'
        }`}>
          {selected && <Check size={11} className="text-obsidian" strokeWidth={3} />}
        </div>
      )}

      <p className={`verse-text transition-all ${selectionMode ? 'pl-6' : ''}`} style={{ fontSize }}>
        <span className="verse-number">{verse}</span>
        {text}
        {!selectionMode && hasCommentary && (
          <span className="inline-block ml-1 w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" />
        )}
      </p>

      {/* Quick tools (non-selection mode) */}
      {!selectionMode && (
        <div className={`flex items-center gap-2 mt-2 transition-all duration-200 ${
          showTools ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <button onClick={toggleFav} className="p-1.5 rounded-lg bg-obsidian/80 border border-gold/20">
            <Heart size={12} className={favorite ? 'text-fire fill-fire' : 'text-parchment/50'} />
          </button>
          {COLORS.map(c => (
            <button
              key={c.key}
              onClick={(e) => { e.stopPropagation(); setHighlight(v => v === c.key ? null : c.key) }}
              className={`w-5 h-5 rounded-full border-2 transition-all ${c.bg} ${
                highlight === c.key ? 'scale-125 opacity-100' : 'opacity-60'
              } ${c.key === 'gold' ? 'border-gold' : c.key === 'fire' ? 'border-fire' : c.key === 'blue' ? 'border-blue-400' : 'border-green-400'}`}
            />
          ))}
          {hasCommentary && (
            <button
              onClick={(e) => { e.stopPropagation(); onReveal(verse, text) }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gold/10 border border-gold/30 text-gold text-[10px]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <ChevronDown size={10} /> Revelação
            </button>
          )}
          <button className="p-1.5 rounded-lg bg-obsidian/80 border border-gold/20">
            <MessageSquare size={12} className="text-parchment/50" />
          </button>
        </div>
      )}
    </div>
  )
}
