import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash'

async function callGemini(prompt: string, temperature = 0.7): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 } }
      })
    }
  )
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function parseJSON(raw: string) {
  const block = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (block) { try { return JSON.parse(block[1].trim()) } catch {} }
  const obj = raw.match(/\{[\s\S]*\}/)
  if (obj) {
    try { return JSON.parse(obj[0]) } catch {}
    try { return JSON.parse(obj[0].replace(/,\s*([}\]])/g, '$1').replace(/[\x00-\x1F\x7F]/g, ' ')) } catch {}
  }
  try { return JSON.parse(raw.trim()) } catch {}
  return null
}

export async function POST(req: NextRequest) {
  if (!GEMINI_KEY) return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 500 })

  const { type, theme, period, message } = await req.json()

  try {
    // ── Devocional ────────────────────────────────────────────────────────────
    if (type === 'devotional') {
      const t = (theme || 'Graça Soberana de Deus').trim()
      const raw = await callGemini(
        `Crie um devocional bíblico reformado em português sobre: "${t}".
ATENÇÃO: Responda EXCLUSIVAMENTE com JSON válido. Sem texto antes, sem markdown.

REGRA CRÍTICA para "content": EXATAMENTE 2 FRASES CURTAS. Máximo absoluto de 40 palavras. Não escreva mais.

{
  "title": "Título de até 6 palavras",
  "theme": "${t}",
  "reference": "Livro Capítulo:Versículo",
  "book": "identificador-minusculo-sem-acento",
  "chapter": 1,
  "verseNum": 1,
  "verse": "Texto completo do versículo (Almeida Revista e Corrigida)",
  "content": "APENAS 2 FRASES sobre o tema. Máximo 40 palavras. Nada mais.",
  "prayer": "Oração de 3 linhas terminando com Amém."
}`,
        0.7
      )
      const obj = parseJSON(raw)
      if (!obj?.title || !obj?.content) {
        return NextResponse.json({ error: `Gemini retornou formato inválido. Tente novamente.` }, { status: 422 })
      }

      const truncateToSentences = (text: string, max: number) => {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
        let result = ''
        for (const s of sentences) {
          if ((result + s).split(' ').length > max) break
          result += s
        }
        return result.trim() || text.split(' ').slice(0, max).join(' ')
      }

      return NextResponse.json({
        type: 'devotional',
        data: {
          id: `gen-d-${Date.now()}`,
          title: String(obj.title),
          theme: String(obj.theme || t),
          reference: String(obj.reference || ''),
          book: String(obj.book || 'salmos'),
          chapter: Number(obj.chapter) || 1,
          verseNum: Number(obj.verseNum) || 1,
          verse: String(obj.verse || ''),
          content: truncateToSentences(String(obj.content || ''), 50),
          prayer: String(obj.prayer || ''),
          generatedAt: new Date().toISOString(),
        }
      })
    }

    // ── Versículo ─────────────────────────────────────────────────────────────
    if (type === 'verse') {
      const t = (theme || '').trim()
      const raw = await callGemini(
        `Indique um versículo bíblico inspirador em português${t ? ` sobre: "${t}"` : ''}.
ATENÇÃO: Responda EXCLUSIVAMENTE com JSON válido. Sem texto antes, sem markdown.

{"reference":"Livro Capítulo:Versículo","book":"identificador-sem-acento","chapter":1,"verse":1,"text":"Texto completo do versículo (ARC)"}`,
        0.6
      )
      const obj = parseJSON(raw)
      if (!obj?.text) return NextResponse.json({ error: 'Formato inválido. Tente novamente.' }, { status: 422 })
      return NextResponse.json({ type: 'verse', data: { id: `gen-v-${Date.now()}`, ...obj, generatedAt: new Date().toISOString() } })
    }

    // ── Oração ────────────────────────────────────────────────────────────────
    if (type === 'prayer') {
      const p = period || 'manha'
      const label = p === 'manha' ? 'manhã' : 'noite'
      const t = (theme || '').trim()
      const themeHint = t ? ` O tema central da oração deve ser: "${t}".` : ''
      const raw = await callGemini(
        `Escreva uma oração de ${label} em português brasileiro para um cristão reformado.${themeHint}
A oração deve ser íntima, confessional, bíblica, terminando com "Amém."
ATENÇÃO: Responda EXCLUSIVAMENTE com JSON válido. Sem texto antes, sem markdown.

{"title":"Oração da ${p === 'manha' ? 'Manhã' : 'Noite'}","prayer":"Texto da oração com 5-6 linhas terminando com Amém."}`,
        0.8
      )
      const obj = parseJSON(raw)
      if (!obj?.prayer) return NextResponse.json({ error: 'Formato inválido. Tente novamente.' }, { status: 422 })
      return NextResponse.json({
        type: 'prayer',
        data: {
          id: `gen-p-${p[0]}-${Date.now()}`,
          period: p,
          title: String(obj.title || `Oração da ${p === 'manha' ? 'Manhã' : 'Noite'}`),
          prayer: String(obj.prayer),
          theme: t || undefined,
          generatedAt: new Date().toISOString(),
        }
      })
    }

    // ── Chat IA ───────────────────────────────────────────────────────────────
    if (type === 'chat') {
      const raw = await callGemini(
        `Você é o assistente de conteúdo do app "Bíblia Sagrada Reformada". Sua função é ajudar o admin a criar e planejar conteúdo para o app: devocionais, orações, versículos e temas. Responda de forma direta, prática e objetiva. Evite discursos longos.

Mensagem do admin: "${message || ''}"`,
        0.8
      )
      return NextResponse.json({ type: 'chat', data: { response: raw } })
    }

    return NextResponse.json({ error: 'type inválido' }, { status: 400 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
