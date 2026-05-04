'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Loader, CheckSquare, X, Volume2, VolumeX } from 'lucide-react'
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

export default function ChapterPage({ params }: Props) {
  const { book, chapter } = params
  const chapterNum = parseInt(chapter, 10)
  const bookData = getBookById(book)

  const [data, setData] = useState<BibleChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [revelation, setRevelation] = useState<{ verse: number; text: string } | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  // Selection mode
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set())
  const [verseColors, setVerseColors] = useState<Record<number, string>>({})

  // TTS audio
  const [ttsPlaying, setTtsPlaying] = useState(false)
  const [ttsCurrent, setTtsCurrent] = useState<number | null>(null)
  const ttsRef = useRef(false)

  useEffect(() => {
    setLoading(true)
    setData(null)
    setRevealed(false)
    setSelectionMode(false)
    setSelectedVerses(new Set())
    setVerseColors({})
    setTtsPlaying(false)
    setTtsCurrent(null)
    ttsRef.current = false
    window.speechSynthesis?.cancel()

    fetchChapter(book, chapterNum).then(d => {
      setData(d)
      setLoading(false)
      setTimeout(() => setRevealed(true), 80)

      if (d) {
        const saved: Record<number, string> = {}
        d.verses.forEach(v => {
          const hl = localStorage.getItem(`hl-${book}-${chapterNum}-${v.verse}`)
          if (hl) saved[v.verse] = hl
        })
        if (Object.keys(saved).length > 0) setVerseColors(saved)
      }

      const readKey = 'read-chapters'
      const readChapters: string[] = JSON.parse(localStorage.getItem(readKey) || '[]')
      const entry = `${book}-${chapterNum}`
      if (!readChapters.includes(entry)) {
        readChapters.push(entry)
        localStorage.setItem(readKey, JSON.stringify(readChapters))
      }

      const target = sessionStorage.getItem('scrollToVerse')
      if (target) {
        sessionStorage.removeItem('scrollToVerse')
        setTimeout(() => {
          document.getElementById(`verse-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 500)
      }
    })
  }, [book, chapterNum, retryKey])

  useEffect(() => {
    if (ttsCurrent !== null) {
      document.getElementById(`verse-${ttsCurrent}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [ttsCurrent])

  useEffect(() => {
    return () => { ttsRef.current = false; window.speechSynthesis?.cancel() }
  }, [])

  const playChapter = () => {
    if (!data) return
    if (ttsRef.current) {
      window.speechSynthesis.cancel()
      ttsRef.current = false
      setTtsPlaying(false)
      setTtsCurrent(null)
      return
    }

    const verses = data.verses
    let i = 0
    ttsRef.current = true
    setTtsPlaying(true)

    const getVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      return voices.find(v => v.lang.startsWith('pt')) ?? null
    }

    const speakNext = () => {
      if (!ttsRef.current || i >= verses.length) {
        ttsRef.current = false
        setTtsPlaying(false)
        setTtsCurrent(null)
        return
      }
      const v = verses[i]
      setTtsCurrent(v.verse)
      const u = new SpeechSynthesisUtterance(v.text)
      u.lang = 'pt-BR'
      u.rate = 0.9
      const voice = getVoice()
      if (voice) u.voice = voice
      u.onend = () => { i++; speakNext() }
      u.onerror = () => { ttsRef.current = false; setTtsPlaying(false); setTtsCurrent(null) }
      window.speechSynthesis.speak(u)
    }

    window.speechSynthesis.cancel()
    setTimeout(speakNext, 150)
  }

  const toggleSelect = (v: number) => {
    setSelectedVerses(prev => {
      const next = new Set(prev)
      if (next.has(v)) next.delete(v); else next.add(v)
      return next
    })
  }

  const applyColor = (colorKey: string) => {
    const updates: Record<number, string> = { ...verseColors }
    selectedVerses.forEach(v => {
      updates[v] = colorKey
      localStorage.setItem(`hl-${book}-${chapterNum}-${v}`, colorKey)
    })
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

  const shareSelected = () => {
    if (!data) return
    const sorted = Array.from(selectedVerses).sort((a, b) => a - b)
    const verses = sorted
      .map(v => data.verses.find(x => x.verse === v))
      .filter(Boolean) as { verse: number; text: string }[]
    if (verses.length === 0) return

    const bookLabel = bookData?.name || (book.charAt(0).toUpperCase() + book.slice(1))
    const textBody = verses.map(v => `${v.verse} ${v.text}`).join('\n')
    const ref = verses.length === 1
      ? `${bookLabel} ${chapterNum}:${verses[0].verse}`
      : `${bookLabel} ${chapterNum}:${verses[0].verse}-${verses[verses.length - 1].verse}`
    const content = `"${textBody}"\n— ${ref}`

    if (navigator.share) {
      navigator.share({ text: content }).catch(() => {})
    } else {
      navigator.clipboard.writeText(content)
    }
    setSelectedVerses(new Set())
    setSelectionMode(false)
  }

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null
  const nextChapter = bookData && chapterNum < bookData.chapters ? chapterNum + 1 : null

  // Header height: py-3 (24px) + h-14 button (56px) + 1px divider ≈ 81px
  const HEADER_H = 81

  return (
    <div className="min-h-screen pb-32 select-none">

      {/* Header — fixed so it stays visible while scrolling */}
      <div className="fixed top-0 inset-x-0 z-40 bg-obsidian/95 backdrop-blur-sm border-b border-gold/10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-[430px] mx-auto">
          <Link href="/bible" aria-label="Voltar à lista de livros"
            className="p-2 rounded-lg hover:bg-gold/10 transition-colors flex-shrink-0">
            <ChevronLeft size={20} className="text-gold" />
          </Link>

          <button
            onClick={() => setShowPicker(true)}
            aria-label={`Capítulo ${chapterNum}, toque para navegar`}
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

          {/* TTS play button */}
          {data && !selectionMode && (
            <button
              onClick={playChapter}
              aria-label={ttsPlaying ? 'Parar leitura' : 'Ouvir capítulo'}
              className={`p-2 rounded-xl border transition-all active:scale-90 ${
                ttsPlaying
                  ? 'bg-gold/20 border-gold/60 text-gold'
                  : 'bg-transparent border-gold/20 text-gold/50 hover:border-gold/40 hover:text-gold/70'
              }`}
            >
              {ttsPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}

          {/* Selection mode toggle */}
          {data && (
            selectionMode ? (
              <button onClick={() => { setSelectionMode(false); setSelectedVerses(new Set()) }}
                aria-label="Cancelar seleção"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-fire/20 border border-fire/30 text-fire text-xs"
                style={{ fontFamily: 'Cinzel, serif' }}>
                <X size={12} /> Cancelar
              </button>
            ) : (
              <button onClick={() => setSelectionMode(true)}
                aria-label="Selecionar versículos"
                className="p-2 rounded-xl hover:bg-gold/10 transition-colors">
                <CheckSquare size={18} className="text-gold/50" />
              </button>
            )
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: HEADER_H }} />

      {/* TTS indicator bar */}
      {ttsPlaying && (
        <div className="sticky top-[81px] z-30 bg-gold/10 border-b border-gold/20 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <span key={i} className="w-1 rounded-full bg-gold animate-bounce"
                style={{ height: 14, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <span className="text-gold text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
            Lendo versículo {ttsCurrent}…
          </span>
          <button onClick={playChapter} className="ml-auto text-gold/60 text-xs">parar</button>
        </div>
      )}

      {/* Book opening animation */}
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
          <div key={`line-${chapterNum}`}
            className="h-px mx-auto bg-gradient-to-r from-transparent via-gold/50 to-transparent unfurl-line" />
        </div>
      )}

      {/* Error state */}
      {!loading && data?.error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 px-8">
          <p className="text-parchment/40 text-sm text-center" style={{ fontFamily: 'Cinzel, serif' }}>
            Não foi possível carregar este capítulo.
          </p>
          <button onClick={() => setRetryKey(k => k + 1)}
            className="px-5 py-2.5 rounded-xl bg-gold/20 border border-gold/40 text-gold text-sm active:scale-95 transition-transform"
            style={{ fontFamily: 'Cinzel, serif' }}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4" aria-live="polite" aria-label="Carregando capítulo">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
            <div className="absolute inset-0 blur-md bg-gold/10 rounded-full" />
          </div>
          <p className="text-parchment/40 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>Carregando a Palavra…</p>
        </div>
      )}

      {/* Verses */}
      {data && (
        <div className="pb-4" role="main" aria-label={`${bookData?.name || book} capítulo ${chapterNum}`}>
          {data.verses.map((v, idx) => (
            <div key={`${chapterNum}-${v.verse}`} className="verse-reveal"
              style={{ animationDelay: `${Math.min(idx * 40, 800)}ms` }}>
              <VerseCard
                book={book}
                chapter={chapterNum}
                verse={v.verse}
                text={v.text}
                fontSize={22}
                selectionMode={selectionMode}
                selected={selectedVerses.has(v.verse)}
                externalHighlight={verseColors[v.verse] ?? null}
                speakingVerse={ttsCurrent === v.verse}
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

      {/* Prev/Next chapter */}
      {!selectionMode && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pointer-events-none">
          <div className="flex justify-between pointer-events-auto">
            {prevChapter ? (
              <Link href={`/bible/${book}/${prevChapter}`} aria-label={`Capítulo anterior: ${prevChapter}`}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-obsidian/90 border border-gold/20 text-gold text-xs backdrop-blur"
                style={{ fontFamily: 'Cinzel, serif' }}>
                <ChevronLeft size={14} /> Cap. {prevChapter}
              </Link>
            ) : <div />}
            {nextChapter ? (
              <Link href={`/bible/${book}/${nextChapter}`} aria-label={`Próximo capítulo: ${nextChapter}`}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-obsidian/90 border border-gold/20 text-gold text-xs backdrop-blur"
                style={{ fontFamily: 'Cinzel, serif' }}>
                Cap. {nextChapter} <ChevronRight size={14} />
              </Link>
            ) : <div />}
          </div>
        </div>
      )}

      {selectionMode && (
        <SelectionBar
          selectedCount={selectedVerses.size}
          onApplyColor={applyColor}
          onFavoriteAll={favoriteAll}
          onShareAll={shareSelected}
          onCancel={() => { setSelectionMode(false); setSelectedVerses(new Set()) }}
        />
      )}

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
