'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface Props {
  book: string
  bookName: string
  totalChapters: number
  currentChapter: number
  onClose: () => void
}

export default function ChapterPicker({ book, bookName, totalChapters, currentChapter, onClose }: Props) {
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const go = (ch: number) => {
    onClose()
    router.push(`/bible/${book}/${ch}`)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[430px] mx-auto rounded-t-3xl bg-obsidian-light border-t border-x border-gold/30 overflow-hidden"
        style={{ maxHeight: '70vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>
        <div className="h-px mx-4 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h3 className="text-gold text-sm font-bold tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
              {bookName}
            </h3>
            <p className="text-parchment/40 text-xs">{totalChapters} capítulos</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gold/10">
            <X size={16} className="text-parchment/60" />
          </button>
        </div>

        {/* Chapter grid */}
        <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: 'calc(70vh - 100px)' }}>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map(ch => (
              <button
                key={ch}
                onClick={() => go(ch)}
                className={`aspect-square rounded-xl text-sm font-bold transition-all active:scale-90 ${
                  ch === currentChapter
                    ? 'bg-gold text-obsidian shadow-[0_0_12px_rgba(201,168,76,0.5)]'
                    : 'parchment-card text-parchment/70 hover:border-gold/40 hover:text-gold'
                }`}
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
