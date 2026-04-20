'use client'
import { Heart, X, Check } from 'lucide-react'

const COLORS = [
  { key: 'gold', label: 'Dourado', bg: 'bg-gold', border: 'border-gold', cls: 'verse-highlight-gold' },
  { key: 'fire', label: 'Fogo', bg: 'bg-fire', border: 'border-fire', cls: 'verse-highlight-fire' },
  { key: 'blue', label: 'Azul', bg: 'bg-blue-400', border: 'border-blue-400', cls: 'verse-highlight-blue' },
  { key: 'green', label: 'Verde', bg: 'bg-green-400', border: 'border-green-400', cls: 'verse-highlight-green' },
]

interface Props {
  selectedCount: number
  onApplyColor: (colorKey: string) => void
  onFavoriteAll: () => void
  onCancel: () => void
}

export default function SelectionBar({ selectedCount, onApplyColor, onFavoriteAll, onCancel }: Props) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-3 z-50 pointer-events-none">
      <div className="pointer-events-auto rounded-2xl bg-obsidian-light border border-gold/30 backdrop-blur-xl overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gold text-xs tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
              {selectedCount} versículo{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
            </span>
            <button onClick={onCancel} className="p-1 rounded-full hover:bg-gold/10">
              <X size={16} className="text-parchment/50" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {COLORS.map(c => (
              <button
                key={c.key}
                onClick={() => onApplyColor(c.key)}
                disabled={selectedCount === 0}
                className={`flex-1 py-2.5 rounded-xl ${c.bg} flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-30`}
              >
                <Check size={14} className="text-obsidian font-bold" strokeWidth={3} />
              </button>
            ))}
            <button
              onClick={onFavoriteAll}
              disabled={selectedCount === 0}
              className="flex-1 py-2.5 rounded-xl bg-fire/20 border border-fire/30 flex items-center justify-center active:scale-95 transition-all disabled:opacity-30"
            >
              <Heart size={14} className="text-fire" />
            </button>
          </div>
          <div className="flex justify-between mt-1 px-1">
            {['Dourado','Fogo','Azul','Verde','Favorito'].map(l => (
              <span key={l} className="text-parchment/30 text-[9px] text-center" style={{ fontFamily: 'Cinzel, serif' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
