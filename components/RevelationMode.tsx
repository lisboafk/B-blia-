'use client'
import { useEffect } from 'react'
import { X, BookOpen, Flame, Link2, Target } from 'lucide-react'
import { getCommentary } from '@/data/reformed-commentary'
import GoldDivider from './GoldDivider'

interface Props {
  book: string; chapter: number; verse: number; text: string
  onClose: () => void
}

export default function RevelationMode({ book, chapter, verse, text, onClose }: Props) {
  const commentary = getCommentary(book, chapter, verse)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!commentary) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[430px] mx-auto rounded-t-3xl bg-obsidian-light border-t border-x border-gold/30 overflow-hidden animate-revelation"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>

        {/* Gold top border */}
        <div className="h-px mx-4 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-fire animate-flame" />
            <span className="text-gold text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Modo Revelação
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors">
            <X size={16} className="text-parchment/60" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {/* Verse */}
          <div className="parchment-card p-4 rounded-xl mb-4 border-l-2 border-gold/50">
            <p className="text-parchment/40 text-xs mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
              {commentary.book.charAt(0).toUpperCase() + commentary.book.slice(1)} {commentary.chapter}:{commentary.verse}
            </p>
            <p className="verse-text italic leading-relaxed">"{text}"</p>
          </div>

          {/* Theme badge */}
          <div className="flex gap-2 flex-wrap mb-4">
            {commentary.theme.split(' | ').map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20"
                style={{ fontFamily: 'Cinzel, serif' }}>
                {t}
              </span>
            ))}
          </div>

          {/* Reformed Commentary */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-gold" />
              <h3 className="text-gold text-xs tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Comentário Reformado
              </h3>
            </div>
            <p className="text-parchment/80 text-sm leading-relaxed">{commentary.reformedNote}</p>
          </div>

          {/* Historical Context */}
          {commentary.historicalContext && (
            <>
              <GoldDivider />
              <div className="mb-4">
                <h3 className="text-gold/70 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  Contexto Histórico
                </h3>
                <p className="text-parchment/60 text-sm leading-relaxed">{commentary.historicalContext}</p>
              </div>
            </>
          )}

          <GoldDivider />

          {/* Cross References */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Link2 size={14} className="text-gold/60" />
              <h3 className="text-gold/70 text-xs tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Referências Cruzadas
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {commentary.crossRefs.map(ref => (
                <span key={ref} className="text-xs px-2 py-1 rounded-lg bg-obsidian border border-gold/20 text-parchment/70">
                  {ref}
                </span>
              ))}
            </div>
          </div>

          <GoldDivider />

          {/* Application */}
          <div className="parchment-card p-4 rounded-xl border-l-2 border-fire/50">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-fire" />
              <h3 className="text-fire text-xs tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Aplicação Prática
              </h3>
            </div>
            <p className="text-parchment/80 text-sm leading-relaxed">{commentary.application}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
