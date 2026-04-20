'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, ChevronRight } from 'lucide-react'

interface Props {
  book: string
  bookName: string
  totalChapters: number
  currentChapter: number
  currentVerses: number
  onClose: () => void
}

export default function NavigationPicker({ book, bookName, totalChapters, currentChapter, currentVerses, onClose }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<'chapter' | 'verse'>('chapter')
  const [selectedChapter, setSelectedChapter] = useState(currentChapter)
  const [verseCount, setVerseCount] = useState(currentVerses)
  const [loadingVerses, setLoadingVerses] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const pickChapter = async (ch: number) => {
    setSelectedChapter(ch)
    setLoadingVerses(true)
    setStep('verse')

    // If same chapter, we already know verse count
    if (ch === currentChapter) {
      setVerseCount(currentVerses)
      setLoadingVerses(false)
      return
    }

    // Navigate to chapter first, then show verse picker
    // We estimate verse count from the API or use a generous default
    try {
      const res = await fetch(`https://bible-api.com/${book}+${ch}?translation=almeida`)
      const data = await res.json()
      setVerseCount(data.verses?.length || 30)
    } catch {
      setVerseCount(30)
    }
    setLoadingVerses(false)
  }

  const pickVerse = (v: number) => {
    onClose()
    if (selectedChapter === currentChapter) {
      setTimeout(() => {
        document.getElementById(`verse-${v}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } else {
      sessionStorage.setItem('scrollToVerse', String(v))
      router.push(`/bible/${book}/${selectedChapter}`)
    }
  }

  const skipVerse = () => {
    onClose()
    if (selectedChapter !== currentChapter) {
      router.push(`/bible/${book}/${selectedChapter}`)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[430px] mx-auto rounded-t-3xl bg-obsidian-light border-t border-x border-gold/30 overflow-hidden"
        style={{ maxHeight: '75vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>
        <div className="h-px mx-4 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        {/* Header with breadcrumb */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {step === 'verse' && (
              <button
                onClick={() => setStep('chapter')}
                className="text-gold/60 text-xs flex items-center gap-1 hover:text-gold transition-colors"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                ← Capítulos
              </button>
            )}
            {step === 'chapter' && (
              <div>
                <h3 className="text-gold text-sm font-bold tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  {bookName}
                </h3>
                <p className="text-parchment/40 text-xs">{totalChapters} capítulos</p>
              </div>
            )}
            {step === 'verse' && (
              <div>
                <h3 className="text-gold text-sm font-bold tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  {bookName} {selectedChapter}
                </h3>
                <p className="text-parchment/40 text-xs">{loadingVerses ? 'Carregando...' : `${verseCount} versículos`}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step === 'verse' && (
              <button
                onClick={skipVerse}
                className="text-xs px-3 py-1.5 rounded-lg border border-gold/30 text-gold"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Ir ao cap.
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-full bg-gold/10">
              <X size={16} className="text-parchment/60" />
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 px-4 mb-3">
          <div className={`h-1 rounded-full flex-1 transition-all ${step === 'chapter' ? 'bg-gold' : 'bg-gold/30'}`} />
          <ChevronRight size={10} className="text-parchment/30" />
          <div className={`h-1 rounded-full flex-1 transition-all ${step === 'verse' ? 'bg-fire' : 'bg-parchment/10'}`} />
        </div>

        {/* Grid */}
        <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: 'calc(75vh - 140px)' }}>
          {step === 'chapter' && (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map(ch => (
                <button
                  key={ch}
                  onClick={() => pickChapter(ch)}
                  className={`aspect-square rounded-xl text-sm font-bold transition-all active:scale-90 flex flex-col items-center justify-center gap-0.5 ${
                    ch === currentChapter
                      ? 'bg-gold text-obsidian shadow-[0_0_12px_rgba(201,168,76,0.5)]'
                      : 'parchment-card text-parchment/70 hover:text-gold hover:border-gold/40'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {ch}
                  {ch === currentChapter && (
                    <span className="text-[8px] text-obsidian/60 leading-none">atual</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 'verse' && (
            loadingVerses ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-fire/30 border-t-fire rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: verseCount }, (_, i) => i + 1).map(v => (
                  <button
                    key={v}
                    onClick={() => pickVerse(v)}
                    className="aspect-square rounded-xl text-sm font-bold parchment-card text-parchment/70 hover:text-fire hover:border-fire/40 active:scale-90 transition-all"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
