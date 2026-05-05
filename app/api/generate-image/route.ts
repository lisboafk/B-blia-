import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt, seed = 42 } = await req.json()

  const scene = (prompt || 'cena bíblica épica luz divina').trim()
  const fullPrompt = `${scene}, oil painting style, Rembrandt chiaroscuro, divine light, no text no letters no watermark`
  const encoded = encodeURIComponent(fullPrompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1080&height=1350&seed=${seed}&nologo=true&model=flux`

  try {
    // Fetch from server-side (no CORS restriction) and pipe back as blob
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 BibleApp/1.0' },
      signal: AbortSignal.timeout(30000),
    })

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
      }
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Timeout' }, { status: 504 })
  }
}
