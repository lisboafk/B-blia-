'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Share2, Heart, BookOpen, Flame, Sun, Moon } from 'lucide-react'
import SplashScreen from '@/components/SplashScreen'
import Navigation from '@/components/Navigation'
import { DAILY_VERSES } from '@/data/key-verses'
import { getTodayDevotional } from '@/data/daily-devotionals'
import { getMorningPrayer, getEveningPrayer } from '@/data/daily-prayers'

// 7 visual themes for verse cards
const THEMES = [
  { bg: 'linear-gradient(160deg, #0f1a06 0%, #1a3a0a 25%, #2d6b1a 50%, #5a9e3a 75%, #8fd45a 100%)', accent: '#c8f5a0' },
  { bg: 'linear-gradient(160deg, #020814 0%, #081630 25%, #0e2755 55%, #1a4a9f 80%, #3070e0 100%)', accent: '#a0c4ff' },
  { bg: 'linear-gradient(160deg, #1a0800 0%, #5c1f00 25%, #a83e00 50%, #d4782a 75%, #f5b870 100%)', accent: '#ffddb0' },
  { bg: 'linear-gradient(160deg, #12001a 0%, #3a0860 25%, #6b1a9f 55%, #9e3ad4 80%, #c87af5 100%)', accent: '#e8c0ff' },
  { bg: 'linear-gradient(160deg, #001518 0%, #012e34 25%, #025a65 55%, #03919e 80%, #05c8da 100%)', accent: '#a0f0ff' },
  { bg: 'linear-gradient(160deg, #180a00 0%, #4a2200 25%, #8b4500 55%, #c47a0a 80%, #e8b830 100%)', accent: '#fff0a0' },
  { bg: 'linear-gradient(160deg, #001a14 0%, #003a28 25%, #005a40 55%, #009e70 80%, #20d4a0 100%)', accent: '#a0ffe0' },
]

function getDayOfYear(): number {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

async function shareVerseAsImage(text: string, reference: string, themeIndex: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1080
  const ctx = canvas.getContext('2d')!
  const theme = THEMES[themeIndex % THEMES.length]

  const grad = ctx.createLinearGradient(0, 0, 600, 1080)
  grad.addColorStop(0, '#0a0200')
  grad.addColorStop(0.4, theme.bg.match(/#[0-9a-f]{6}/gi)?.[2] || '#1a2a40')
  grad.addColorStop(1, theme.bg.match(/#[0-9a-f]{6}/gi)?.[4] || '#3a6a90')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1080)

  ctx.fillStyle = `${theme.accent}22`
  ctx.beginPath(); ctx.arc(540, 300, 400, 0, Math.PI * 2); ctx.fill()

  ctx.textAlign = 'center'
  ctx.fillStyle = theme.accent
  ctx.font = 'italic 38px Georgia, serif'
  ctx.fillText(reference, 540, 200)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 52px Georgia, serif'
  const lines = wrapText(ctx, `"${text}"`, 880)
  const totalH = lines.length * 64
  let y = 540 - totalH / 2
  for (const line of lines) {
    ctx.fillText(line, 540, y)
    y += 64
  }

  ctx.fillStyle = `${theme.accent}80`
  ctx.font = '28px Georgia, serif'
  ctx.fillText('Bíblia Sagrada Reformada', 540, 980)

  const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'))
  const file = new File([blob], 'versiculo.png', { type: 'image/png' })
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: `"${text}" — ${reference}` })
      return
    }
  } catch { /* fallback */ }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'versiculo.png'; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [visible, setVisible] = useState(false)
  const [cardTab, setCardTab] = useState<'versiculo' | 'devocao'>('versiculo')
  const [verseIndex, setVerseIndex] = useState(getDayOfYear() % DAILY_VERSES.length)
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [shares, setShares] = useState<Record<string, number>>({})
  const touchStartX = useRef(0)
  const devotional = getTodayDevotional()
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 18
  const prayer = isMorning ? getMorningPrayer() : getEveningPrayer()

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('verse-likes') || '{}')
    const savedLiked = JSON.parse(localStorage.getItem('verse-liked') || '{}')
    const savedShares = JSON.parse(localStorage.getItem('verse-shares') || '{}')
    setLikes(savedLikes); setLiked(savedLiked); setShares(savedShares)
  }, [])

  const verse = DAILY_VERSES[verseIndex]
  const themeIndex = verseIndex % THEMES.length
  const theme = THEMES[themeIndex]
  const verseKey = verse.id

  const prev = () => setVerseIndex(i => (i - 1 + DAILY_VERSES.length) % DAILY_VERSES.length)
  const next = () => setVerseIndex(i => (i + 1) % DAILY_VERSES.length)

  const handleLike = () => {
    if (liked[verseKey]) return
    const newLikes = { ...likes, [verseKey]: (likes[verseKey] || 0) + 1 }
    const newLiked = { ...liked, [verseKey]: true }
    setLikes(newLikes); setLiked(newLiked)
    localStorage.setItem('verse-likes', JSON.stringify(newLikes))
    localStorage.setItem('verse-liked', JSON.stringify(newLiked))
  }

  const handleShare = async () => {
    await shareVerseAsImage(verse.text, verse.reference, themeIndex)
    const newShares = { ...shares, [verseKey]: (shares[verseKey] || 0) + 1 }
    setShares(newShares)
    localStorage.setItem('verse-shares', JSON.stringify(newShares))
  }

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => { setShowSplash(false); setTimeout(() => setVisible(true), 100) }} />}

      <div className={`min-h-screen pb-28 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

        {/* Header */}
        <div className="pt-12 px-4 pb-3 flex items-center justify-between">
          <div>
            <p className="text-gold/50 text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>Soli Deo Gloria</p>
            <h1 className="text-shimmer text-xl font-bold title-cinzel tracking-wider">PALAVRA VIVA</h1>
          </div>
          <Link href="/bible" className="p-2 rounded-xl bg-gold/10 border border-gold/20">
            <BookOpen size={18} className="text-gold/70" />
          </Link>
        </div>

        {/* Verse Card Carousel */}
        <div className="px-4 mb-4">
          {/* Tabs */}
          <div className="flex mb-2 gap-4 px-1">
            {(['versiculo', 'devocao'] as const).map(t => (
              <button key={t} onClick={() => setCardTab(t)}
                className={`text-xs pb-1 transition-all ${cardTab === t ? 'text-white border-b-2' : 'text-white/40'}`}
                style={{ borderColor: cardTab === t ? theme.accent : 'transparent', fontFamily: 'Cinzel, serif' }}>
                {t === 'versiculo' ? 'Versículo' : 'Devoção'}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="relative rounded-3xl overflow-hidden select-none"
            style={{ height: '340px', background: theme.bg }}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

            {/* AI-generated background image (generated at build time by Gemini Imagen) */}
            <img
              src={`/bg/theme-${themeIndex}.jpg`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {/* Dark overlay so text is always readable */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Glow orb (visible when no image) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full opacity-10 blur-3xl"
                style={{ background: theme.accent }} />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              {cardTab === 'versiculo' ? (
                <>
                  <p className="text-xs italic mb-4 opacity-70" style={{ color: theme.accent, fontFamily: 'Cinzel, serif' }}>
                    {verse.reference}
                  </p>
                  <p className="text-white text-lg leading-relaxed font-bold" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
                    "{verse.text}"
                  </p>
                  <div className="mt-4 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase"
                    style={{ background: `${theme.accent}25`, color: theme.accent, fontFamily: 'Cinzel, serif' }}>
                    {verse.theme}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs italic mb-3 opacity-70" style={{ color: theme.accent, fontFamily: 'Cinzel, serif' }}>
                    {devotional.reference}
                  </p>
                  <h3 className="text-white text-base font-bold mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                    {devotional.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-5" style={{ fontFamily: 'Georgia, serif' }}>
                    {devotional.reflection}
                  </p>
                </>
              )}
            </div>

            {/* Nav arrows */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 flex items-center justify-center active:scale-90 transition-transform">
              <ChevronLeft size={16} className="text-white/80" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 flex items-center justify-center active:scale-90 transition-transform">
              <ChevronRight size={16} className="text-white/80" />
            </button>

            {/* Watermark + stats */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <p className="text-[10px] opacity-30 text-white" style={{ fontFamily: 'Cinzel, serif' }}>Bíblia Reformada</p>
              <div className="flex items-center gap-3">
                <button onClick={handleShare} className="flex items-center gap-1 text-white/60 text-xs active:scale-90 transition-transform">
                  <Share2 size={13} /> {shares[verseKey] || 0}
                </button>
                <button onClick={handleLike}
                  className={`flex items-center gap-1 text-xs active:scale-90 transition-all ${liked[verseKey] ? 'text-red-400 scale-110' : 'text-white/60'}`}>
                  <Heart size={13} fill={liked[verseKey] ? 'currentColor' : 'none'} /> {likes[verseKey] || 0}
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute top-3 left-0 right-0 flex justify-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const dotIdx = (verseIndex - 3 + i + DAILY_VERSES.length) % DAILY_VERSES.length
                return (
                  <div key={i} onClick={() => setVerseIndex(dotIdx)}
                    className={`rounded-full transition-all cursor-pointer ${i === 3 ? 'w-4 h-1.5' : 'w-1.5 h-1.5 opacity-40'}`}
                    style={{ background: i === 3 ? theme.accent : '#fff' }} />
                )
              })}
            </div>
          </div>
        </div>

        {/* Morning / Evening Prayer */}
        <div className="mx-4 mb-4 rounded-2xl overflow-hidden border"
          style={{ borderColor: isMorning ? '#f59e0b40' : '#60a5fa40', background: isMorning ? 'rgba(251,191,36,0.06)' : 'rgba(96,165,250,0.06)' }}>
          <div className="px-4 pt-3 pb-2 flex items-center gap-2">
            {isMorning
              ? <Sun size={15} className="text-amber-400" />
              : <Moon size={15} className="text-blue-400" />}
            <span className={`text-xs font-semibold tracking-wide ${isMorning ? 'text-amber-400' : 'text-blue-400'}`}
              style={{ fontFamily: 'Cinzel, serif' }}>
              {prayer.title}
            </span>
          </div>
          <div className="px-4 pb-3">
            <p className="text-parchment/70 text-sm leading-relaxed">{prayer.prayer}</p>
            <p className={`text-xs mt-1.5 ${isMorning ? 'text-amber-500/70' : 'text-blue-400/70'}`}
              style={{ fontFamily: 'Cinzel, serif' }}>
              {prayer.reference}
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-4">
          <Link href="/bible" className="parchment-card p-4 rounded-xl flex items-center gap-3 active:scale-95 transition-transform">
            <div className="p-2 bg-gold/15 rounded-lg">
              <BookOpen size={20} className="text-gold" />
            </div>
            <div>
              <p className="text-parchment text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>Bíblia</p>
              <p className="text-parchment/40 text-[11px]">66 livros</p>
            </div>
          </Link>
          <Link href="/study" className="parchment-card p-4 rounded-xl flex items-center gap-3 active:scale-95 transition-transform">
            <div className="p-2 bg-fire/15 rounded-lg">
              <Flame size={20} className="text-fire" />
            </div>
            <div>
              <p className="text-parchment text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>Estudo</p>
              <p className="text-parchment/40 text-[11px]">Reformado</p>
            </div>
          </Link>
        </div>

        {/* Today's Devotional preview */}
        <div className="mx-4 parchment-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gold/20 to-transparent px-4 py-2.5 flex items-center gap-2">
            <Flame size={12} className="text-fire" />
            <span className="text-gold text-[11px] tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Devocional da Semana
            </span>
          </div>
          <div className="px-4 py-3">
            <h3 className="title-display text-parchment text-base mb-1">{devotional.title}</h3>
            <p className="text-gold text-xs mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{devotional.reference}</p>
            <p className="text-parchment/60 text-xs italic mb-2 leading-relaxed line-clamp-2">"{devotional.verseText}"</p>
            <Link href={`/bible/${devotional.book}/${devotional.chapter}`}
              className="flex items-center gap-1 text-gold text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
              Ler passagem <ChevronRight size={12} />
            </Link>
          </div>
        </div>

      </div>
      <Navigation />
    </>
  )
}
