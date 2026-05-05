import { NextResponse } from 'next/server'

export const revalidate = 86400 // Vercel caches 24h — same image for every user all day

const THEMES = [
  'fé e confiança em Deus',
  'graça e redenção divina',
  'luz celestial e esperança eterna',
  'sabedoria e palavra de Deus',
  'paz e providência divina',
  'glória de Cristo ressurreto',
  'amor eterno de Deus',
  'santificação pelo Espírito',
  'soberania de Deus sobre tudo',
  'oração e comunhão com Deus',
  'perseverança na fé',
  'chuva de bênçãos divinas',
  'proteção divina nas tribulações',
  'evangelização e missão',
  'glorificação futura dos santos',
  'eleição e graça irresistível',
  'união com Cristo na cruz',
  'criação e majestade de Deus',
  'redenção e perdão dos pecados',
  'segunda vinda de Cristo glorioso',
  'montanhas sagradas e fé',
]

function getDayOfYear() {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

export async function GET() {
  const day = getDayOfYear()
  const theme = THEMES[day % THEMES.length]
  const prompt = encodeURIComponent(
    `${theme}, cena bíblica épica majestosa, pintura a óleo estilo Rembrandt, luz divina dourada, sem texto sem letras sem marcas`
  )
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1080&seed=${day}&nologo=true&model=flux`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 BibleApp/1.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) return NextResponse.json({ error: `Pollinations ${res.status}` }, { status: 502 })

    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Timeout' }, { status: 504 })
  }
}
