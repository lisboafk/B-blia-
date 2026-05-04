'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Share2, Heart, BookOpen, Volume2, VolumeX } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { getTodayDevotional } from '@/data/daily-devotionals'
import { getMorningPrayer, getEveningPrayer } from '@/data/daily-prayers'
const PT_MONTHS = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

// ─── AI image via Pollinations (free, no key needed) ───────────────────────
const BOOK_THEMES: Record<string, string> = {
  genesis:          'creation of the universe and Garden of Eden, Adam and Eve surrounded by divine golden light rays',
  exodo:            'Moses parting the Red Sea, burning bush on Mount Sinai, pillar of fire in desert',
  levitico:         'ancient Hebrew tabernacle with sacred fire altar, high priest in golden robes',
  numeros:          'twelve tribes of Israel wandering the desert, pillar of cloud and fire guiding them',
  deuteronomio:     'Moses on mountain overlooking the Promised Land at golden sunset',
  josue:            'walls of Jericho dramatically collapsing, Israelites crossing the Jordan River',
  juizes:           'Samson toppling temple pillars, Gideon with a torch and clay jar at night',
  rute:             'Ruth gleaning golden wheat in ancient fields, Bethlehem harvest scene',
  '1samuel':        'young Samuel kneeling in temple at night, David slinging a stone at Goliath',
  '2samuel':        'King David dancing before the Ark of the Covenant in Jerusalem',
  '1reis':          "Solomon's magnificent golden temple in Jerusalem, Queen of Sheba visiting",
  '2reis':          'Elijah ascending in a chariot of fire, Elisha performing miracles',
  '1cronicas':      'King David bringing the Ark of the Covenant to Jerusalem in procession',
  '2cronicas':      'Temple of Solomon at its zenith, sacred fire from heaven consuming sacrifice',
  esdras:           'Jewish exiles joyfully returning to Jerusalem, rebuilding the temple',
  neemias:          'Nehemiah rebuilding Jerusalem walls at night by torchlight',
  ester:            'Queen Esther in Persian palace before King Ahasuerus, royal court',
  jo:               'Job in suffering surrounded by divine whirlwind, God speaking from storm',
  salmos:           'King David playing the harp under a star-filled sky, moonlit Jerusalem temple',
  proverbios:       'divine Wisdom as a radiant woman calling from ancient city gates',
  eclesiastes:      'ancient philosopher meditating at sunrise, vanity of earthly pursuits',
  cantares:         'lush garden vineyard at golden sunset, beloved searching for her lover',
  isaias:           'seraphim with six burning wings in God throne room, Isaiah receiving coal',
  jeremias:         'weeping prophet Jeremiah before the destroyed walls of Jerusalem',
  lamentacoes:      'ruins of ancient Jerusalem at twilight, mourning over fallen city',
  ezequiel:         'four majestic living creatures with wheels of fire, divine chariot vision',
  daniel:           'Daniel unharmed in the lions den with an angel, fiery furnace with three men',
  oseias:           'prophet Hosea reaching out to a wayward woman, divine redeeming love',
  joel:             'Pentecost fire tongues descending from heaven, locust plague turning to blessing',
  amos:             'shepherd prophet Amos under fig tree, divine plumb line over ancient city',
  abdias:           'mountaintop with divine judgment, Edom kingdom falling',
  jonas:            'great whale rising from stormy sea swallowing Jonah, Nineveh repentance',
  miqueias:         'Bethlehem village at night with a prophetic star, justice flowing like water',
  naum:             'Nineveh city crumbling under divine judgment, Nahum prophesying',
  habacuque:        'prophet on watchtower watching, righteous man living by faith in darkness',
  sofonias:         'day of the Lord with celestial fire, faithful remnant being gathered',
  ageu:             'second temple being rebuilt by returned exiles, divine glory filling it',
  zacarias:         'visions of horsemen among myrtle trees, Messiah entering Jerusalem on donkey',
  malaquias:        'sun of righteousness rising with healing wings, Elijah returning to earth',
  mateus:           'Jesus delivering the Sermon on the Mount at golden hour, multitudes listening',
  marcos:           'Jesus healing a blind man, disciples in a storm-tossed boat on Sea of Galilee',
  lucas:            'father embracing the prodigal son, Good Samaritan helping a wounded man',
  joao:             'Jesus the light of the world walking on water, resurrection of Lazarus',
  atos:             'Pentecost fire tongues descending on the apostles, early church spreading',
  romanos:          'broken chains of sin, cross on a hill at sunrise, divine justification light',
  '1corintios':     'love as a golden thread connecting hearts, spiritual gifts as flames',
  '2corintios':     'Paul in chains with divine glory shining through prison bars',
  galatas:          'breaking free from chains of religious law, fruit of the Spirit blooming',
  efesios:          'full armor of God gleaming, warrior praying in heavenly places',
  filipenses:       'Paul singing in prison, peace surpassing understanding as golden light',
  colossenses:      'Christ above all creation, universe held together by divine wisdom',
  '1tessalonicenses':'second coming of Christ with clouds, faithful believers looking upward',
  '2tessalonicenses':'perseverance under persecution, divine glory overcoming lawlessness',
  '1timoteo':       'young Timothy being mentored, church gathering in ancient home',
  '2timoteo':       'Paul writing final letter in prison, crown of righteousness awaiting',
  tito:             'island of Crete with ancient harbor, sound doctrine spreading to nations',
  filemom:          'slave Onesimus returning reconciled to Philemon, divine forgiveness',
  hebreus:          'high priest entering the holy of holies, cloud of witnesses surrounding runner',
  tiago:            'wisdom from above as golden light, faith and works as two hands building',
  '1pedro':         'living stones building a spiritual temple, Peter the fisherman transformed',
  '2pedro':         'Mount of Transfiguration with dazzling light, disciples falling to ground',
  '1joao':          'God is love, children walking in divine light, overcoming the world',
  '2joao':          'ancient elder writing an epistle, truth and love intertwined',
  '3joao':          'hospitality to strangers as angels, faithful elder Gaius',
  judas:            'contending for the faith, fallen angels in chains, divine judgment coming',
  apocalipse:       'heavenly throne room with rainbow, Lamb opening seven seals, New Jerusalem descending from heaven surrounded by crystal sea and golden light',
}

function getVerseImageUrl(book: string, chapter: number, verseNum: number): string {
  const theme = BOOK_THEMES[book] || 'ancient sacred biblical scene with divine golden light and scripture scrolls'
  const prompt = `${theme}, Gustave Doré biblical engraving style reimagined as photorealistic oil painting, extreme Rembrandt chiaroscuro with blinding divine light piercing deep shadows, overwhelming sense of the holy and transcendent, rich Renaissance pigments gold and crimson and midnight blue, faces filled with awe and reverence, hyper-detailed museum masterpiece, cinematic wide angle, no text no letters no watermark`
  const seed = chapter * 97 + verseNum * 13
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1350&seed=${seed}&nologo=true&model=flux`
}

// ─── Helpers ───────────────────────────────────────────────────────────────
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

async function shareVerseAsImage(text: string, reference: string, imageUrl: string, caption: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080; canvas.height = 1080
  const ctx = canvas.getContext('2d')!

  let photoLoaded = false
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = imageUrl
    })
    const scale = Math.max(1080 / img.naturalWidth, 1080 / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (1080 - w) / 2, (1080 - h) / 2, w, h)
    photoLoaded = true
  } catch { /* fallback */ }

  if (!photoLoaded) {
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
    grad.addColorStop(0, '#0a1628'); grad.addColorStop(0.5, '#1a3a5c'); grad.addColorStop(1, '#0a0a1a')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1080)
  }

  const overlay = ctx.createLinearGradient(0, 0, 0, 1080)
  overlay.addColorStop(0, 'rgba(0,0,0,0.35)')
  overlay.addColorStop(0.5, 'rgba(0,0,0,0.58)')
  overlay.addColorStop(1, 'rgba(0,0,0,0.78)')
  ctx.fillStyle = overlay; ctx.fillRect(0, 0, 1080, 1080)

  ctx.textAlign = 'center'
  const fontSize = text.length > 120 ? 58 : text.length > 80 ? 66 : 74
  ctx.font = `bold italic ${fontSize}px Georgia,serif`
  const lines = wrapText(ctx, `"${text}"`, 940)
  const lineH = fontSize * 1.38
  const startY = (1080 - lines.length * lineH - 140) / 2 + lineH

  ctx.lineJoin = 'round'
  lines.forEach((line, i) => {
    const y = startY + i * lineH
    ctx.strokeStyle = 'rgba(0,0,0,0.95)'; ctx.lineWidth = 14
    ctx.strokeText(line, 540, y)
    ctx.fillStyle = '#ffffff'; ctx.fillText(line, 540, y)
  })

  const refY = startY + lines.length * lineH + 70
  ctx.font = `bold italic ${Math.min(72, fontSize + 4)}px Georgia,serif`
  ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 10
  ctx.strokeText(reference, 540, refY)
  ctx.fillStyle = '#f5d060'; ctx.fillText(reference, 540, refY)

  const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/jpeg', 0.93))
  const file = new File([blob], 'versiculo.jpg', { type: 'image/jpeg' })
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], text: `${caption}\n\n— ${reference}` })
  } else {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'versiculo.jpg'; a.click()
  }
}

// ─── Splash ────────────────────────────────────────────────────────────────
function SplashOverlay({ onDismiss }: { onDismiss: () => void }) {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDate()
  const month = PT_MONTHS[now.getMonth()]
  const isNight = hour >= 18 || hour < 5
  const devotional = getTodayDevotional()
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2200)
    const t2 = setTimeout(() => onDismiss(), 2900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDismiss])

  const dismiss = () => { setFading(true); setTimeout(onDismiss, 700) }

  const skyBg = isNight
    ? { background: 'linear-gradient(180deg, #0a0a1a 0%, #0f1535 40%, #1a2050 100%)' }
    : hour < 12
      ? { background: 'linear-gradient(180deg, #ffc870 0%, #ff8c40 30%, #ffb86c 60%, #87ceeb 100%)' }
      : { background: 'linear-gradient(180deg, #87ceeb 0%, #b0d8f0 50%, #e0f0ff 100%)' }

  return (
    <div onClick={dismiss}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden transition-opacity duration-700"
      style={{ ...skyBg, opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}
      role="dialog" aria-modal="true" aria-label="Tela de abertura">
      {isNight && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: i%5===0?3:i%3===0?2:1, height: i%5===0?3:i%3===0?2:1,
                left:`${(i*37+13)%95}%`, top:`${(i*23+7)%60}%`, opacity:0.5 }} />
          ))}
        </div>
      )}
      {!isNight && (
        <>
          <div className="absolute top-[15%] left-[5%] w-32 h-12 rounded-full bg-white/60 blur-sm" />
          <div className="absolute top-[12%] left-[12%] w-20 h-8 rounded-full bg-white/50 blur-sm" />
          <div className="absolute top-[18%] right-[8%] w-28 h-10 rounded-full bg-white/55 blur-sm" />
        </>
      )}
      {isNight ? (
        <div className="absolute top-[14%] right-[22%] w-16 h-16 rounded-full"
          style={{ background: 'radial-gradient(circle, #fffde0 60%, #ffd060 100%)', boxShadow: '0 0 30px 10px rgba(255,240,80,0.25)' }} />
      ) : (
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
          style={{ background: 'radial-gradient(circle, #fff0c0 0%, #ffb84a 50%, #e88020 100%)', boxShadow: '0 0 40px 15px rgba(255,140,30,0.35)' }} />
      )}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 120" preserveAspectRatio="none">
        <path d="M0,120 L0,80 L60,35 L110,65 L160,20 L220,60 L270,30 L320,55 L370,25 L400,50 L400,120 Z"
          fill={isNight ? '#0f1a30' : '#2a6a4a'} opacity="0.9" />
        <path d="M0,120 L0,95 L50,70 L100,85 L150,60 L200,75 L250,55 L310,80 L360,65 L400,75 L400,120 Z"
          fill={isNight ? '#0a1220' : '#1a4a2a'} opacity="0.85" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: isNight ? 'linear-gradient(180deg,#0d2040,#091530)' : 'linear-gradient(180deg,#4ab8d8,#1a6a98)' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ top: '28%' }}>
        <h1 className="font-black tracking-tight mb-3"
          style={{ fontSize: 'clamp(2.5rem,10vw,4rem)', color: isNight ? '#e0e8ff' : '#1a2a1a',
            textShadow: isNight ? '0 2px 12px rgba(0,0,50,0.8)' : '0 2px 8px rgba(255,255,255,0.6)' }}>
          {month} {day}
        </h1>
        <p className="text-lg font-semibold leading-snug max-w-xs mb-2"
          style={{ color: isNight ? '#7ab0ff' : '#d46010',
            textShadow: isNight ? '0 1px 8px rgba(0,0,40,0.9)' : '0 1px 6px rgba(255,255,255,0.7)' }}>
          {devotional.title}
        </p>
        <p className="text-sm max-w-sm leading-relaxed"
          style={{ color: isNight ? '#a0b8e0' : '#2a4a2a', opacity: 0.85,
            textShadow: isNight ? '0 1px 8px rgba(0,0,40,0.9)' : '0 1px 4px rgba(255,255,255,0.6)' }}>
          {devotional.verseText.length > 80 ? devotional.verseText.slice(0, 80) + '…' : devotional.verseText}
        </p>
      </div>
      <div className="absolute bottom-24 w-full text-center">
        <p className="text-xs opacity-40" style={{ color: isNight ? '#a0b8e0' : '#1a3a1a' }}>toque para continuar</p>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function HojePage() {
  const now = new Date()
  const hour = now.getHours()
  const isMorning = hour >= 5 && hour < 18
  const bgIndex = getDayOfYear() % 7

  // Static fallback content (used immediately while AI content loads)
  const staticDevotional = getTodayDevotional()
  const staticPrayer = isMorning ? getMorningPrayer() : getEveningPrayer()

  // AI-generated content state (replaces static when available)
  const [aiContent, setAiContent] = useState<{
    devotional: typeof staticDevotional & { reflection: string }
    morningPrayer: { title: string; prayer: string }
    eveningPrayer: { title: string; prayer: string }
  } | null>(null)

  const devotional = aiContent?.devotional ?? staticDevotional
  const prayer = aiContent ? (isMorning ? aiContent.morningPrayer : aiContent.eveningPrayer) : staticPrayer

  // Verse data comes from today's devotional so Inspiração always explains the displayed verse
  const verseId = devotional.id ?? staticDevotional.id
  const verseText = devotional.verseText
  const verseReference = devotional.reference
  const verseBook = devotional.book
  const verseChapter = devotional.chapter
  const verseVerse = devotional.verse

  const [showSplash, setShowSplash] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  // Deterministic AI image URL for this verse
  const verseImageUrl = useMemo(
    () => getVerseImageUrl(verseBook, verseChapter, verseVerse || 1),
    [verseBook, verseChapter, verseVerse]
  )

  // Gradient fallback colors (shown while AI image loads)
  const GRADS = [
    ['#0a1628','#1a3a5c'],['#1a0800','#5c2200'],
    ['#0a0020','#2a0060'],['#001a14','#005a40'],
    ['#180a00','#4a2200'],['#020814','#0e2755'],
    ['#12001a','#3a0860'],
  ]
  const [g1, g2] = GRADS[bgIndex % GRADS.length]

  // Fetch AI-generated daily content (cached 12h on Vercel)
  useEffect(() => {
    const cacheKey = `ai-content-day-${getDayOfYear()}-${isMorning ? 'm' : 'n'}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try { setAiContent(JSON.parse(cached)); return } catch {}
    }
    fetch('/api/daily-content')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.devotional) {
          setAiContent(data)
          sessionStorage.setItem(cacheKey, JSON.stringify(data))
        }
      })
      .catch(() => {}) // silently fall back to static content
  }, [isMorning])

  useEffect(() => {
    const shown = sessionStorage.getItem('splash-shown')
    if (!shown) {
      setShowSplash(true)
      sessionStorage.setItem('splash-shown', '1')
    }
    const key = `like-${verseId}`
    setLiked(localStorage.getItem(key) === '1')
    setLikeCount(parseInt(localStorage.getItem(`${key}-count`) || '127', 10))
    setShareCount(parseInt(localStorage.getItem(`share-${verseId}`) || '89', 10))
  }, [verseId])

  const toggleLike = () => {
    const key = `like-${verseId}`
    const next = !liked
    const count = likeCount + (next ? 1 : -1)
    setLiked(next); setLikeCount(count)
    localStorage.setItem(key, next ? '1' : '0')
    localStorage.setItem(`${key}-count`, String(count))
  }

  const handleShare = async () => {
    await shareVerseAsImage(verseText, verseReference, verseImageUrl, devotional.reflection)
    const next = shareCount + 1
    setShareCount(next)
    localStorage.setItem(`share-${verseId}`, String(next))
  }

  const speakVerse = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const u = new SpeechSynthesisUtterance(`${verseText}. ${verseReference}`)
    u.lang = 'pt-BR'
    u.rate = 0.85
    const voices = window.speechSynthesis.getVoices()
    const ptVoice = voices.find(v => v.lang.startsWith('pt'))
    if (ptVoice) u.voice = ptVoice
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const speakPrayer = () => {
    const text = `${prayer.title}. ${prayer.prayer}`
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'pt-BR'
    u.rate = 0.85
    const voices = window.speechSynthesis.getVoices()
    const ptVoice = voices.find(v => v.lang.startsWith('pt'))
    if (ptVoice) u.voice = ptVoice
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  return (
    <>
      {showSplash && <SplashOverlay onDismiss={() => setShowSplash(false)} />}

      <div className="min-h-screen pb-24 bg-[#111]">

        {/* Header */}
        <div className="px-4 pt-12 pb-2">
          <h1 className="text-white font-bold text-xl">Versículo de hoje</h1>
        </div>

        {/* Verse card — AI image */}
        <div className="px-4 pt-3">
          <div className="relative rounded-2xl overflow-hidden mb-3" style={{ minHeight: 300 }}>

            {/* Gradient fallback (always present, fades out when AI image loads) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`}
              style={{ background: `linear-gradient(160deg, ${g1}, ${g2})` }} />

            {/* Shimmer while loading */}
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            )}

            {/* AI-generated verse image */}
            {!imgError && (
              <img
                src={verseImageUrl}
                alt={`Ilustração bíblica para ${verseReference}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.70) 100%)' }} />

            {/* Verse text */}
            <div className="relative px-5 pt-8 pb-6 flex flex-col justify-center items-center" style={{ minHeight: 320 }}>
              <p className="text-white font-bold italic text-center leading-tight mb-5"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: verseText.length > 130
                    ? 'clamp(1.2rem,4.8vw,1.45rem)'
                    : verseText.length > 80
                      ? 'clamp(1.4rem,5.5vw,1.75rem)'
                      : 'clamp(1.6rem,6.5vw,2rem)',
                  textShadow: '2px 3px 8px rgba(0,0,0,1), -1px -1px 6px rgba(0,0,0,0.9)',
                }}>
                "{verseText}"
              </p>
              <p className="font-bold italic text-center"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(1.4rem,5.5vw,1.7rem)',
                  color: '#f5d060',
                  textShadow: '2px 2px 8px rgba(0,0,0,1)',
                }}>
                {verseReference}
              </p>
            </div>

            {/* AI badge (top-right) */}
            {imgLoaded && (
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                <span className="text-[10px] text-white/50">✦ IA</span>
              </div>
            )}
          </div>

          {/* Actions bar */}
          <div className="flex gap-5 items-center px-1 mb-6">
            <button onClick={handleShare} aria-label="Compartilhar versículo"
              className="flex items-center gap-2 text-parchment/60 active:scale-95 transition-transform">
              <Share2 size={18} />
              <span className="text-sm">{shareCount.toLocaleString('pt-BR')}</span>
            </button>
            <button onClick={toggleLike} aria-label={liked ? 'Remover curtida' : 'Curtir versículo'}
              className={`flex items-center gap-2 transition-all active:scale-95 ${liked ? 'text-red-400' : 'text-parchment/60'}`}>
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm">{likeCount.toLocaleString('pt-BR')}</span>
            </button>
            <button onClick={speakVerse} aria-label={speaking ? 'Parar leitura' : 'Ouvir versículo'}
              className={`flex items-center gap-1.5 transition-all active:scale-95 ${speaking ? 'text-[#c9a84c]' : 'text-parchment/60'}`}>
              {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span className="text-xs">{speaking ? 'parar' : 'ouvir'}</span>
            </button>
            <Link href={`/bible/${verseBook}/${verseChapter}`} aria-label="Ler capítulo completo"
              className="ml-auto flex items-center gap-1.5 text-[#4ade80] text-sm">
              <BookOpen size={15} />
              Ler capítulo
            </Link>
          </div>
        </div>

        {/* Inspiração */}
        <div className="px-4">
          <div className="mb-4">
            <h3 className="text-white font-bold text-2xl mb-3">Inspiração</h3>
            <p className="text-parchment/70 text-xl leading-relaxed">
              {devotional.reflection}
            </p>
          </div>

          {/* Oração */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">{isMorning ? '☀️' : '🌙'}</span>
                <h3 className="text-white font-bold text-2xl">{isMorning ? 'Oração da Manhã' : 'Oração da Noite'}</h3>
              </div>
              <button onClick={speakPrayer} aria-label="Ouvir oração"
                className="p-2 rounded-xl border border-[#c9a84c]/30 text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/60 transition-all active:scale-90">
                <Volume2 size={16} />
              </button>
            </div>
            <p className="text-parchment/80 text-xl leading-relaxed italic">
              {prayer.prayer}
            </p>
          </div>
        </div>

      </div>

      <Navigation />
    </>
  )
}
