import { NextResponse } from 'next/server'

// Reliable biblical scene backgrounds — picsum seeded (same image per day, no rate limit)
function getDayOfYear() {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

// Curated picsum seeds that look like landscapes/nature (good biblical feel)
const PICSUM_SEEDS = [
  'faith', 'biblical', 'heaven', 'divine', 'sacred', 'holy', 'grace',
  'mercy', 'glory', 'eternal', 'covenant', 'psalm', 'gospel', 'prayer',
  'light', 'truth', 'hope', 'peace', 'wisdom', 'creation',
]

const THEMES = [
  'fé e confiança em Deus', 'graça e redenção divina', 'luz celestial e esperança eterna',
  'sabedoria e palavra de Deus', 'paz e providência divina', 'glória de Cristo ressurreto',
  'amor eterno de Deus', 'santificação pelo Espírito', 'soberania de Deus sobre tudo',
  'oração e comunhão com Deus', 'perseverança na fé', 'chuva de bênçãos divinas',
  'proteção divina nas tribulações', 'evangelização e missão', 'glorificação futura dos santos',
  'eleição e graça irresistível', 'união com Cristo na cruz', 'criação e majestade de Deus',
  'redenção e perdão dos pecados', 'segunda vinda de Cristo glorioso',
]

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function tryPollinations(day: number): Promise<Response | null> {
  const theme = THEMES[day % THEMES.length]
  const prompt = encodeURIComponent(
    `${theme}, epic biblical scene, Rembrandt oil painting style, divine golden light, no text no letters`
  )
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1080&seed=${day}&nologo=true&model=flux`

  for (let i = 0; i < 2; i++) {
    if (i > 0) await sleep(2000)
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 BibleApp/1.0' },
        signal: AbortSignal.timeout(8000), // short timeout so fallback kicks in fast
      })
      if (res.ok) return res
      if (res.status !== 429) return null // non-retryable error
    } catch {}
  }
  return null
}

async function getPicsumFallback(day: number): Promise<Response> {
  const seed = PICSUM_SEEDS[day % PICSUM_SEEDS.length]
  const url = `https://picsum.photos/seed/${seed}/1080/1080`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  return res
}

export async function GET() {
  const day = getDayOfYear()

  // Try Pollinations AI first, fall back to picsum landscape photo
  const pollinationsRes = await tryPollinations(day)
  const source = pollinationsRes ?? await getPicsumFallback(day)

  if (!source.ok) {
    return NextResponse.json({ error: 'Imagem indisponível' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const contentType = source.headers.get('content-type') || 'image/jpeg'
  const buf = await source.arrayBuffer()

  return new NextResponse(buf, {
    headers: {
      'Content-Type': contentType,
      // Cache successful response for 24h on CDN — all users share one cached image
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
}
