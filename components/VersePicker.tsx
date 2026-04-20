'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  bookName: string
  chapter: number
  totalVerses: number
  onClose: () => void
}

export default function VersePicker({ bookName, chapter, totalVerses, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const goToVerse = (v: number) => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById(`verse-${v}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[430px] mx-auto rounded-t-3xl bg-obsidian-light border-t border-x border-gold/30 overflow-hidden"
        style={{ maxHeight: '60vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>
        <div className="h-px mx-4 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h3 className="text-gold text-sm font-bold tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
              {bookName} {chapter}
            </h3>
            <p className="text-parchment/40 text-xs">{totalVerses} versículos</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gold/10">
            <X size={16} className="text-parchment/60" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: 'calc(60vh - 100px)' }}>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: totalVerses }, (_, i) => i + 1).map(v => (
              <button
                key={v}
                onClick={() => goToVerse(v)}
                className="aspect-square rounded-xl text-sm font-bold parchment-card text-parchment/70 hover:text-gold hover:border-gold/40 active:scale-90 transition-all"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
