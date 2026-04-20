'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface Props {
  book: string
  bookName: string
  totalChapters: number
  currentChapter: number
  totalVerses: number
  onClose: () => void
}

export default function NavigationPicker({ book, bookName, totalChapters, currentChapter, totalVerses, onClose }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'cap' | 'vers'>('cap')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const goChapter = (ch: number) => {
    onClose()
    router.push(`/bible/${book}/${ch}`)
  }

  const goVerse = (v: number) => {
    onClose()
    setTimeout(() => {
      document.getElementById(`verse-${v}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[430px] mx-auto rounded-t-3xl bg-obsidian-light border-t border-x border-gold/30 overflow-hidden"
        style={{ maxHeight: '72vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>
        <div className="h-px mx-4 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-gold text-sm font-bold tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            {bookName}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gold/10">
            <X size={16} className="text-parchment/60" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-3">
          <div className="flex parchment-card rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab('cap')}
              className={`flex-1 py-2 rounded-lg text-xs tracking-widest uppercase transition-all ${
                tab === 'cap' ? 'bg-gold/20 text-gold-light' : 'text-parchment/50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {totalChapters} Capítulos
            </button>
            <button
              onClick={() => setTab('vers')}
              className={`flex-1 py-2 rounded-lg text-xs tracking-widest uppercase transition-all ${
                tab === 'vers' ? 'bg-fire/20 text-fire' : 'text-parchment/50'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {totalVerses} Versículos
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: 'calc(72vh - 150px)' }}>
          {tab === 'cap' ? (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map(ch => (
                <button
                  key={ch}
                  onClick={() => goChapter(ch)}
                  className={`aspect-square rounded-xl text-sm font-bold transition-all active:scale-90 ${
                    ch === currentChapter
                      ? 'bg-gold text-obsidian shadow-[0_0_12px_rgba(201,168,76,0.5)]'
                      : 'parchment-card text-parchment/70 hover:text-gold'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {ch}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: totalVerses }, (_, i) => i + 1).map(v => (
                <button
                  key={v}
                  onClick={() => goVerse(v)}
                  className="aspect-square rounded-xl text-sm font-bold parchment-card text-parchment/70 hover:text-fire active:scale-90 transition-all"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
