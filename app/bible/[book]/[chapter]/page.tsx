'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import Navigation from '@/components/Navigation'
import VerseCard from '@/components/VerseCard'
import RevelationMode from '@/components/RevelationMode'
import NavigationPicker from '@/components/NavigationPicker'
import { fetchChapter, BibleChapter } from '@/lib/bible-api'
import { getBookById } from '@/data/bible-structure'

interface Props {
  params: { book: string; chapter: string }
}

export default function ChapterPage({ params }: Props) {
  const { book, chapter } = params
  const chapterNum = parseInt(chapter, 10)
  const bookData = getBookById(book)

  const [data, setData] = useState<BibleChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [revelation, setRevelation] = useState<{ verse: number; text: string } | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    setLoading(true)
    setData(null)
    fetchChapter(book, chapterNum).then(d => { setData(d); setLoading(false) })
  }, [book, chapterNum])

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

          {/* Chapter number card — big, left of book name */}
          <button
            onClick={() => setShowPicker(true)}
            className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold/15 border border-gold/35 flex items-center justify-center active:scale-95 transition-all sacred-glow"
          >
            <span className="text-gold-light text-2xl font-bold leading-none" style={{ fontFamily: 'Cinzel, serif' }}>
              {chapterNum}
            </span>
          </button>

          {/* Book name + subtitle */}
          <button onClick={() => setShowPicker(true)} className="flex flex-col items-start active:opacity-70 transition-opacity">
            <h2 className="text-gold text-base font-bold tracking-wider leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              {bookData?.name || book}
            </h2>
            <span className="text-parchment/40 text-xs mt-0.5">
              Toque para navegar
            </span>
          </button>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Chapter number display */}
      <div className="text-center py-6">
        <span
          className="text-[80px] font-bold leading-none"
          style={{
            fontFamily: 'Cinzel, serif',
            background: 'linear-gradient(180deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.03) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {chapterNum}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader size={28} className="text-gold animate-spin" />
          <p className="text-parchment/40 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
            Carregando a Palavra...
          </p>
        </div>
      )}

      {/* Verses */}
      {data && (
        <div className="pb-4">
          {data.verses.map(v => (
            <VerseCard
              key={v.verse}
              book={book}
              chapter={chapterNum}
              verse={v.verse}
              text={v.text}
              fontSize={22}
              onReveal={(verse, text) => setRevelation({ verse, text })}
            />
          ))}
          <p className="text-center text-parchment/20 text-[10px] mt-6 tracking-widest"
            style={{ fontFamily: 'Cinzel, serif' }}>
            {data.source}
          </p>
        </div>
      )}

      {/* Chapter Navigation — clean prev/next only */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pointer-events-none">
        <div className="flex justify-between pointer-events-auto">
          {prevChapter ? (
            <Link
              href={`/bible/${book}/${prevChapter}`}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-obsidian/90 border border-gold/20 text-gold text-xs backdrop-blur"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <ChevronLeft size={14} /> Cap. {prevChapter}
            </Link>
          ) : <div />}
          {nextChapter ? (
            <Link
              href={`/bible/${book}/${nextChapter}`}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-obsidian/90 border border-gold/20 text-gold text-xs backdrop-blur"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Cap. {nextChapter} <ChevronRight size={14} />
            </Link>
          ) : <div />}
        </div>
      </div>

      {/* Unified Navigation Picker */}
      {showPicker && bookData && data && (
        <NavigationPicker
          book={book}
          bookName={bookData.name}
          totalChapters={bookData.chapters}
          currentChapter={chapterNum}
          currentVerses={data.verses.length}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Revelation Mode */}
      {revelation && (
        <RevelationMode
          book={book}
          chapter={chapterNum}
          verse={revelation.verse}
          text={revelation.text}
          onClose={() => setRevelation(null)}
        />
      )}

      <Navigation />
    </div>
  )
}
