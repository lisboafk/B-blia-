import { NextRequest, NextResponse } from 'next/server'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function POST(req: NextRequest) {
  const { prompt, seed = 42 } = await req.json()

  const scene = (prompt || 'cena bíblica épica luz divina').trim()
  const fullPrompt = `${scene}, oil painting style, Rembrandt chiaroscuro, divine light, no text no letters no watermark`
  const encoded = encodeURIComponent(fullPrompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1080&height=1350&seed=${seed}&nologo=true&model=flux`

  const delays = [0, 3000, 6000] // 3 attempts: immediate, +3s, +6s

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await sleep(delays[attempt])

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 BibleApp/1.0' },
        signal: AbortSignal.timeout(35000),
      })

      if (res.status === 429) continue // rate limited — retry

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
      if (attempt === delays.length - 1) {
        return NextResponse.json({ error: 'Timeout ao gerar imagem. Tente novamente.' }, { status: 504 })
      }
    }
  }

  return NextResponse.json({ error: 'Pollinations indisponível no momento. Tente em alguns segundos.' }, { status: 503 })
}
