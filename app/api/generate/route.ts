import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash'

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 2048 }
      })
    }
  )
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function parseJSON(raw: string) {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/)
  if (match) { try { return JSON.parse(match[1].trim()) } catch {} }
  try { return JSON.parse(raw.trim()) } catch {}
  return null
}

export async function POST(req: NextRequest) {
  if (!GEMINI_KEY) return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 })

  const { type, theme, period, message } = await req.json()

  try {
    if (type === 'devotional') {
      const t = theme || 'Graça Soberana de Deus'
      const raw = await callGemini(`Você é um teólogo reformado. Crie um devocional bíblico em português sobre: "${t}".
Responda SOMENTE com JSON:
{"title":"título (máx 6 palavras)","theme":"${t}","reference":"Livro cap:ver","book":"livro-sem-acento","chapter":1,"verseNum":1,"verse":"texto ARC","content":"3 parágrafos ~200 palavras reformados","prayer":"oração 3-4 linhas terminando em Amém"}`)
      const obj = parseJSON(raw)
      if (!obj) return NextResponse.json({ error: 'JSON inválido', raw }, { status: 422 })
      return NextResponse.json({ type: 'devotional', data: { id: `gen-d-${Date.now()}`, ...obj, generatedAt: new Date().toISOString() } })
    }

    if (type === 'verse') {
      const t = theme || ''
      const raw = await callGemini(`Sugira um versículo bíblico inspirador em português${t ? ` sobre o tema: "${t}"` : ''}.
Responda SOMENTE com JSON:
{"reference":"Livro cap:ver","book":"livro-sem-acento","chapter":1,"verse":1,"text":"texto completo ARC"}`)
      const obj = parseJSON(raw)
      if (!obj) return NextResponse.json({ error: 'JSON inválido', raw }, { status: 422 })
      return NextResponse.json({ type: 'verse', data: { id: `gen-v-${Date.now()}`, ...obj, generatedAt: new Date().toISOString() } })
    }

    if (type === 'prayer') {
      const p = period || 'manha'
      const label = p === 'manha' ? 'manhã' : 'noite'
      const raw = await callGemini(`Crie uma oração de ${label} reformada em português.
Responda SOMENTE com JSON:
{"title":"Oração da ${p === 'manha' ? 'Manhã' : 'Noite'}","reference":"ref bíblica","book":"livro-sem-acento","chapter":1,"prayer":"oração 4-6 linhas terminando em Amém"}`)
      const obj = parseJSON(raw)
      if (!obj) return NextResponse.json({ error: 'JSON inválido', raw }, { status: 422 })
      return NextResponse.json({ type: 'prayer', data: { id: `gen-p-${p[0]}-${Date.now()}`, period: p, ...obj, generatedAt: new Date().toISOString() } })
    }

    if (type === 'chat') {
      const raw = await callGemini(`Você é um teólogo reformado e assistente bíblico em português brasileiro. Responda de forma clara, profunda e prática a esta mensagem do admin:\n\n"${message || ''}"\n\nResponda em texto livre (não JSON). Seja conciso mas completo.`)
      return NextResponse.json({ type: 'chat', data: { response: raw } })
    }

    return NextResponse.json({ error: 'type inválido' }, { status: 400 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
