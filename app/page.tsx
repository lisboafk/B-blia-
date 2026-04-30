'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Share2, Heart, ChevronDown, BookOpen } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { getTodayVerse } from '@/data/key-verses'
import { getTodayDevotional } from '@/data/daily-devotionals'
import { getMorningPrayer, getEveningPrayer } from '@/data/daily-prayers'

const PT_MONTHS = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

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
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word }
    else line = test
  }
  if (line) lines.push(line)
  return lines
}

async function shareVerseAsImage(text: string, reference: string, bgIndex: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080; canvas.height = 1080
  const ctx = canvas.getContext('2d')!
  const GRADS = [
    ['#0a1628','#1a3a5c','#2a6a9c'],['#1a0800','#5c1f00','#c47a0a'],
    ['#0a0020','#2a0060','#6a20c0'],['#001a14','#005a40','#20d4a0'],
    ['#180a00','#4a2200','#c47a0a'],['#020814','#0e2755','#3070e0'],
    ['#12001a','#3a0860','#9e3ad4'],
  ]
  const colors = GRADS[bgIndex % GRADS.length]
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
  grad.addColorStop(0, colors[0]); grad.addColorStop(0.5, colors[1]); grad.addColorStop(1, colors[2])
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1080)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.arc(540, 360, 380, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'italic 52px Georgia,serif'; ctx.textAlign = 'center'
  const lines = wrapText(ctx, `"${text}"`, 860)
  const startY = 540 - (lines.length - 1) * 34
  lines.forEach((l, i) => ctx.fillText(l, 540, startY + i * 68))
  ctx.fillStyle = 'rgba(201,168,76,0.9)'; ctx.font = 'bold 36px Georgia,serif'
  ctx.fillText(reference, 540, startY + lines.length * 68 + 40)
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '24px Cinzel,serif'
  ctx.fillText('Bíblia Sagrada Reformada', 540, 1030)
  const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/jpeg', 0.9))
  const file = new File([blob], 'versiculo.jpg', { type: 'image/jpeg' })
  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], text: `${text}\n— ${reference}` })
  } else {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'versiculo.jpg'; a.click()
  }
}

export default function HojePage() {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDate()
  const month = PT_MONTHS[now.getMonth()]
  const isNight = hour >= 18 || hour < 5
  const isMorning = hour >= 5 && hour < 12

  const verse = getTodayVerse()
  const devotional = getTodayDevotional()
  const prayer = isMorning || (!isNight && hour < 18) ? getMorningPrayer() : getEveningPrayer()

  const bgIndex = getDayOfYear() % 7
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [imgError, setImgError] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const key = `like-${verse.id}`
    setLiked(localStorage.getItem(key) === '1')
    setLikeCount(parseInt(localStorage.getItem(`${key}-count`) || '127', 10))
    setShareCount(parseInt(localStorage.getItem(`share-${verse.id}`) || '89', 10))
  }, [verse.id])

  const toggleLike = () => {
    const key = `like-${verse.id}`
    const next = !liked
    const count = likeCount + (next ? 1 : -1)
    setLiked(next); setLikeCount(count)
    localStorage.setItem(key, next ? '1' : '0')
    localStorage.setItem(`${key}-count`, String(count))
  }

  const handleShare = async () => {
    await shareVerseAsImage(verse.text, verse.reference, bgIndex)
    const next = shareCount + 1
    setShareCount(next)
    localStorage.setItem(`share-${verse.id}`, String(next))
  }

  // Sky gradients that change with time of day
  const skyGrad = isNight
    ? 'from-[#0a0a1a] via-[#0f1535] to-[#1a2050]'
    : isMorning
      ? 'from-[#ffd4a0] via-[#ffa060] to-[#87ceeb]'
      : 'from-[#87ceeb] via-[#b0d8f0] to-[#e0f0ff]'

  const skyBg = isNight
    ? { background: 'linear-gradient(180deg, #0a0a1a 0%, #0f1535 40%, #1a2050 100%)' }
    : isMorning
      ? { background: 'linear-gradient(180deg, #ffc870 0%, #ff8c40 30%, #ffb86c 60%, #87ceeb 100%)' }
      : { background: 'linear-gradient(180deg, #87ceeb 0%, #b0d8f0 50%, #e0f0ff 100%)' }

  return (
    <div className="min-h-screen pb-24 bg-[#111]">

      {/* HERO — full-screen illustrated */}
      <div className="relative h-[100svh] flex flex-col overflow-hidden" style={skyBg}>

        {/* Stars (night only) */}
        {isNight && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white"
                style={{ width: i%5===0?3:i%3===0?2:1, height: i%5===0?3:i%3===0?2:1,
                  left:`${(i*37+13)%95}%`, top:`${(i*23+7)%60}%`,
                  opacity: 0.4+Math.random()*0.6 }} />
            ))}
          </div>
        )}

        {/* Clouds (day only) */}
        {!isNight && (
          <>
            <div className="absolute top-[15%] left-[5%] w-32 h-12 rounded-full bg-white/60 blur-sm" />
            <div className="absolute top-[12%] left-[12%] w-20 h-8 rounded-full bg-white/50 blur-sm" />
            <div className="absolute top-[18%] right-[8%] w-28 h-10 rounded-full bg-white/55 blur-sm" />
          </>
        )}

        {/* Sun / Moon */}
        {isNight ? (
          <div className="absolute top-[14%] right-[20%] w-16 h-16 rounded-full"
            style={{ background: 'radial-gradient(circle, #fffde0 60%, #ffd060 100%)', boxShadow: '0 0 30px 10px rgba(255,240,80,0.25)' }} />
        ) : (
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
            style={{ background: 'radial-gradient(circle, #fff0c0 0%, #ffb84a 50%, #e88020 100%)', boxShadow: '0 0 40px 15px rgba(255,140,30,0.35)' }} />
        )}

        {/* Mountains silhouette */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 120" preserveAspectRatio="none">
          <path d="M0,120 L0,80 L60,35 L110,65 L160,20 L220,60 L270,30 L320,55 L370,25 L400,50 L400,120 Z"
            fill={isNight ? '#0f1a30' : '#2a6a4a'} opacity="0.9" />
          <path d="M0,120 L0,95 L50,70 L100,85 L150,60 L200,75 L250,55 L310,80 L360,65 L400,75 L400,120 Z"
            fill={isNight ? '#0a1220' : '#1a4a2a'} opacity="0.85" />
        </svg>

        {/* Water / shore */}
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: isNight
            ? 'linear-gradient(180deg, #0d2040 0%, #091530 100%)'
            : 'linear-gradient(180deg, #4ab8d8 0%, #2a90b8 50%, #1a6a98 100%)' }} />

        {/* Date & message */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ top: '30%' }}>
          <h1 className="font-black tracking-tight mb-3"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', color: isNight ? '#e0e8ff' : '#1a2a1a',
              textShadow: isNight ? '0 2px 12px rgba(0,0,50,0.8)' : '0 2px 8px rgba(255,255,255,0.6)' }}>
            {month} {day}
          </h1>
          <p className="text-lg font-semibold leading-snug max-w-xs"
            style={{ color: isNight ? '#7ab0ff' : '#d46010',
              textShadow: isNight ? '0 1px 8px rgba(0,0,40,0.9)' : '0 1px 6px rgba(255,255,255,0.7)' }}>
            {devotional.title}
          </p>
          <p className="mt-2 text-sm opacity-80 max-w-sm leading-relaxed"
            style={{ color: isNight ? '#a0b8e0' : '#2a4a2a',
              textShadow: isNight ? '0 1px 8px rgba(0,0,40,0.9)' : '0 1px 4px rgba(255,255,255,0.6)' }}>
            {verse.text.length > 80 ? verse.text.slice(0, 80) + '…' : verse.text}
          </p>
        </div>

        {/* Scroll hint */}
        <button onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <span className="text-xs" style={{ color: isNight ? '#a0b8e0' : '#1a3a1a' }}>deslize para baixo</span>
          <ChevronDown size={20} className={isNight ? 'text-blue-300' : 'text-green-900'} />
        </button>
      </div>

      {/* SCROLL CONTENT */}
      <div ref={scrollRef} className="bg-[#111]">

        {/* Versículo de hoje */}
        <div className="px-4 pt-6">
          <h2 className="text-white font-bold text-lg mb-3">Versículo de hoje</h2>

          {/* Verse card */}
          <div className="relative rounded-2xl overflow-hidden mb-3" style={{ minHeight: 200 }}>
            {!imgError && (
              <img src={`/bg/theme-${bgIndex}.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover"
                onError={() => setImgError(true)} />
            )}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)' }} />
            <div className="relative p-5 flex flex-col justify-center" style={{ minHeight: 200 }}>
              <p className="text-white text-lg italic leading-relaxed text-center font-serif mb-4">
                "{verse.text}"
              </p>
              <p className="text-[#c9a84c] text-sm font-semibold text-center tracking-wide">
                {verse.reference}
              </p>
            </div>
          </div>

          {/* Share & like row */}
          <div className="flex gap-6 items-center px-1 mb-6">
            <button onClick={handleShare} className="flex items-center gap-2 text-parchment/60 active:scale-95 transition-transform">
              <Share2 size={18} />
              <span className="text-sm">{shareCount.toLocaleString('pt-BR')}</span>
            </button>
            <button onClick={toggleLike} className={`flex items-center gap-2 transition-all active:scale-95 ${liked ? 'text-red-400' : 'text-parchment/60'}`}>
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm">{likeCount.toLocaleString('pt-BR')}</span>
            </button>
            <Link href={`/bible/${verse.book}/${verse.chapter}`}
              className="ml-auto flex items-center gap-1.5 text-[#4ade80] text-sm">
              <BookOpen size={15} />
              Ler capítulo
            </Link>
          </div>
        </div>

        {/* Prayer section */}
        <div className="px-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{prayer.period === 'manha' ? '☀️' : '🌙'}</span>
              <h3 className="text-white font-semibold text-base">{prayer.title}</h3>
            </div>
            <p className="text-parchment/80 text-base leading-relaxed mb-3">
              {verse.text}
            </p>
            <Link href={`/bible/${prayer.book}/${prayer.chapter}`}
              className="text-[#4ade80] text-sm">
              {prayer.reference}
            </Link>
          </div>

          {/* Inspiração */}
          <div className="mb-4">
            <h3 className="text-white font-bold text-lg mb-3">Inspiração</h3>
            <p className="text-parchment/70 text-base leading-relaxed">
              {devotional.reflection}
            </p>
          </div>

          {/* Oração */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-6">
            <h3 className="text-white font-bold text-lg mb-3">Oração</h3>
            <p className="text-parchment/80 text-base leading-relaxed italic">
              {prayer.prayer}
            </p>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
