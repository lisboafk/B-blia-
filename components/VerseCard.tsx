'use client'
import { useState, useCallback } from 'react'
import { Heart, Highlighter, MessageSquare, ChevronDown } from 'lucide-react'
import { getCommentary } from '@/data/reformed-commentary'

interface VerseCardProps {
  book: string; chapter: number; verse: number; text: string
  fontSize?: number
  onReveal: (verse: number, text: string) => void
}

const COLORS = [
  { key: 'gold', label: 'Dourado', cls: 'verse-highlight-gold' },
  { key: 'fire', label: 'Fogo', cls: 'verse-highlight-fire' },
  { key: 'blue', label: 'Azul', cls: 'verse-highlight-blue' },
  { key: 'green', label: 'Verde', cls: 'verse-highlight-green' },
]

export default function VerseCard({ book, chapter, verse, text, fontSize = 17, onReveal }: VerseCardProps) {
  const [highlight, setHighlight] = useState<string | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const hasCommentary = !!getCommentary(book, chapter, verse)

  const toggleFav = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorite(v => {
      const next = !v
      const key = `fav-${book}-${chapter}-${verse}`
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
      if (next) { favs.push({ book, chapter, verse, text }); }
      else { const i = favs.findIndex((f: { book: string; chapter: number; verse: number }) => f.book === book && f.chapter === chapter && f.verse === verse); if (i > -1) favs.splice(i, 1) }
      localStorage.setItem('favorites', JSON.stringify(favs))
      localStorage.setItem(key, next ? '1' : '0')
      return next
    })
  }, [book, chapter, verse, text])

  const handleLongPress = useCallback(() => setShowTools(v => !v), [])

  return (
    <div
      className={`group relative px-4 py-2.5 cursor-pointer transition-all duration-200 rounded-lg mx-2 my-0.5 ${
        highlight ? COLORS.find(c => c.key === highlight)?.cls : 'hover:bg-white/5'
      } ${hasCommentary ? 'border-l-2 border-gold/0 hover:border-gold/30' : ''}`}
      onClick={() => hasCommentary && onReveal(verse, text)}
      onContextMenu={(e) => { e.preventDefault(); handleLongPress() }}
    >
      <p className="verse-text" style={{ fontSize }}>
        <span className="verse-number">{verse}</span>
        {text}
        {hasCommentary && (
          <span className="inline-block ml-1 w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" title="Tem comentário reformado" />
        )}
      </p>

      {/* Quick actions (visible on hover/tap) */}
      <div className={`flex items-center gap-2 mt-2 transition-all duration-200 ${
        showTools ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-12'
      }`}>
        <button onClick={toggleFav} className="p-1.5 rounded-lg bg-obsidian/80 border border-gold/20">
          <Heart size={12} className={favorite ? 'text-fire fill-fire' : 'text-parchment/50'} />
        </button>
        {COLORS.map(c => (
          <button
            key={c.key}
            onClick={(e) => { e.stopPropagation(); setHighlight(v => v === c.key ? null : c.key) }}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              highlight === c.key ? 'scale-125' : 'opacity-60'
            } ${c.key === 'gold' ? 'bg-gold border-gold' : c.key === 'fire' ? 'bg-fire border-fire' : c.key === 'blue' ? 'bg-blue-400 border-blue-400' : 'bg-green-400 border-green-400'}`}
            title={c.label}
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
    </div>
  )
}
