import { NextRequest, NextResponse } from 'next/server'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function POST(req: NextRequest) {
  const { prompt, seed = 42 } = await req.json()

  const scene = (prompt || 'cena bíblica épica luz divina').trim()
  const fullPrompt = `${scene}, oil painting style, Rembrandt chiaroscuro, divine light, no text no letters no watermark`
  const encoded = encodeURIComponent(fullPrompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1080&height=1350&seed=${seed}&nologo=true&model=flux`

  // 2 attempts: immediate then +2s — stays within Vercel 10s hobby timeout
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await sleep(2000)

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 BibleApp/1.0' },
        signal: AbortSignal.timeout(6000),
      })

      if (res.status === 429) continue // rate limited — retry once

      if (!res.ok) {
        return NextResponse.json({ error: `Pollinations ${res.status}` }, { status: 502 })
      }

      const contentType = res.headers.get('content-type') || 'image/jpeg'
      const buf = await res.arrayBuffer()

      return new NextResponse(buf, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'X-Image-Url': url,
        },
      })
    } catch {
      // timeout or network error — retry if first attempt
    }
  }

  return NextResponse.json(
    { error: 'Pollinations indisponível. Aguarde alguns segundos e tente novamente.' },
    { status: 503 }
  )
}
