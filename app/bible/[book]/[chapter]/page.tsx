'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Loader, CheckSquare, X } from 'lucide-react'
import Navigation from '@/components/Navigation'
import VerseCard from '@/components/VerseCard'
import RevelationMode from '@/components/RevelationMode'
import NavigationPicker from '@/components/NavigationPicker'
import SelectionBar from '@/components/SelectionBar'
import { fetchChapter, BibleChapter } from '@/lib/bible-api'
import { getBookById } from '@/data/bible-structure'

interface Props {
  params: { book: string; chapter: string }
}

const COLOR_MAP: Record<string, string> = {
  gold: 'verse-highlight-gold',
  fire: 'verse-highlight-fire',
  blue: 'verse-highlight-blue',
  green: 'verse-highlight-green',
}

export default function ChapterPage({ params }: Props) {
  const { book, chapter } = params
  const chapterNum = parseInt(chapter, 10)
  const bookData = getBookById(book)

  const [data, setData] = useState<BibleChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [revelation, setRevelation] = useState<{ verse: number; text: string } | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  // Selection mode
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set())
  const [verseColors, setVerseColors] = useState<Record<number, string>>({})

  useEffect(() => {
    setLoading(true)
    setData(null)
    setRevealed(false)
    setSelectionMode(false)
    setSelectedVerses(new Set())

    fetchChapter(book, chapterNum).then(d => {
      setData(d)
      setLoading(false)
      setTimeout(() => setRevealed(true), 80)

      const target = sessionStorage.getItem('scrollToVerse')
      if (target) {
        sessionStorage.removeItem('scrollToVerse')
        setTimeout(() => {
          document.getElementById(`verse-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 500)
      }
    })
  }, [book, chapterNum])

  const toggleSelect = (v: number) => {
    setSelectedVerses(prev => {
      const next = new Set(prev)
      if (next.has(v)) next.delete(v); else next.add(v)
      return next
    })
  }

  const applyColor = (colorKey: string) => {
    const updates: Record<number, string> = { ...verseColors }
    selectedVerses.forEach(v => { updates[v] = colorKey })
    setVerseColors(updates)
    setSelectedVerses(new Set())
    setSelectionMode(false)
  }

  const favoriteAll = () => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    selectedVerses.forEach(v => {
      const verse = data?.verses.find(x => x.verse === v)
      if (!verse) return
      const exists = favs.some((f: { book: string; chapter: number; verse: number }) =>
        f.book === book && f.chapter === chapterNum && f.verse === v)
      if (!exists) favs.push({ book, chapter: chapterNum, verse: v, text: verse.text })
      localStorage.setItem(`fav-${book}-${chapterNum}-${v}`, '1')
    })
    localStorage.setItem('favorites', JSON.stringify(favs))
    setSelectedVerses(new Set())
    setSelectionMode(false)
  }

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null
  const nextChapter = bookData && chapterNum < bookData.chapters ? chapterNum + 1 : null

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-obsidian/95 backdrop-blur-sm border-b border-gold/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/bible" className="p-2 rounded-lg hover:bg-gold/10 transition-colors flex-shrink-0">
            <ChevronLeft size={20} className="text-gold" />
          </Link>

          {/* Chapter card */}
          <button
            onClick={() => setShowPicker(true)}
            className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold/15 border border-gold/35 flex items-center justify-center active:scale-95 transition-all sacred-glow"
          >
            <span className="text-gold-light text-2xl font-bold leading-none" style={{ fontFamily: 'Cinzel, serif' }}>
              {chapterNum}
            </span>
          </button>

          <button onClick={() => setShowPicker(true)} className="flex flex-col items-start active:opacity-70 transition-opacity flex-1">
            <h2 className="text-gold text-base font-bold tracking-wider leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              {bookData?.name || book}
            </h2>
            <span className="text-parchment/40 text-xs mt-0.5">Toque para navegar</span>
          </button>

          {/* Selection mode toggle */}
          {data && (
            selectionMode ? (
              <button onClick={() => { setSelectionMode(false); setSelectedVerses(new Set()) }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-fire/20 border border-fire/30 text-fire text-xs"
                style={{ fontFamily: 'Cinzel, serif' }}>
                <X size={12} /> Cancelar
              </button>
            ) : (
              <button onClick={() => setSelectionMode(true)}
                className="p-2 rounded-xl hover:bg-gold/10 transition-colors"
                title="Selecionar versículos">
                <CheckSquare size={18} className="text-gold/50" />
              </button>
            )
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Book opening animation + chapter number */}
      {!loading && (
        <div className="text-center py-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-xl bg-gold/10 rounded-full scale-150" />
            <span
              key={`ch-${chapterNum}`}
              className="relative chapter-glow-in text-[80px] font-bold leading-none"
              style={{
                fontFamily: 'Cinzel, serif',
                display: 'inline-block',
                background: 'linear-gradient(180deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.03) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              {chapterNum}
            </span>
          </div>
          <div
            key={`line-${chapterNum}`}
            className="h-px mx-auto bg-gradient-to-r from-transparent via-gold/50 to-transparent unfurl-line"
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
            <div className="absolute inset-0 blur-md bg-gold/10 rounded-full" />
          </div>
          <p className="text-parchment/40 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>Carregando a Palavra...</p>
        </div>
      )}

      {/* Verses with staggered reveal */}
      {data && (
        <div className="pb-4">
          {data.verses.map((v, idx) => (
            <div
              key={`${chapterNum}-${v.verse}`}
              className="verse-reveal"
              style={{ animationDelay: `${Math.min(idx * 40, 800)}ms` }}
            >
              <VerseCard
                book={book}
                chapter={chapterNum}
                verse={v.verse}
                text={v.text}
                fontSize={22}
                selectionMode={selectionMode}
                selected={selectedVerses.has(v.verse)}
                externalHighlight={verseColors[v.verse] ?? null}
                onReveal={(verse, text) => setRevelation({ verse, text })}
                onSelect={toggleSelect}
              />
            </div>
          ))}
          <p className="text-center text-parchment/20 text-[10px] mt-6 tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
            {data.source}
          </p>
        </div>
      )}

      {/* Chapter prev/next */}
      {!selectionMode && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pointer-events-none">
          <div className="flex justify-between pointer-events-auto">
            {prevChapter ? (
              <Link href={`/bible/${book}/${prevChapter}`}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-obsidian/90 border border-gold/20 text-gold text-xs backdrop-blur"
                style={{ fontFamily: 'Cinzel, serif' }}>
                <ChevronLeft size={14} /> Cap. {prevChapter}
              </Link>
            ) : <div />}
            {nextChapter ? (
              <Link href={`/bible/${book}/${nextChapter}`}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-obsidian/90 border border-gold/20 text-gold text-xs backdrop-blur"
                style={{ fontFamily: 'Cinzel, serif' }}>
                Cap. {nextChapter} <ChevronRight size={14} />
              </Link>
            ) : <div />}
          </div>
        </div>
      )}

      {/* Selection bar */}
      {selectionMode && (
        <SelectionBar
          selectedCount={selectedVerses.size}
          onApplyColor={applyColor}
          onFavoriteAll={favoriteAll}
          onCancel={() => { setSelectionMode(false); setSelectedVerses(new Set()) }}
        />
      )}

      {/* Pickers & modals */}
      {showPicker && bookData && data && (
        <NavigationPicker book={book} bookName={bookData.name} totalChapters={bookData.chapters}
          currentChapter={chapterNum} currentVerses={data.verses.length} onClose={() => setShowPicker(false)} />
      )}
      {revelation && (
        <RevelationMode book={book} chapter={chapterNum} verse={revelation.verse}
          text={revelation.text} onClose={() => setRevelation(null)} />
      )}

      <Navigation />
    </div>
  )
}
