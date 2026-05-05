import { NextResponse } from 'next/server'
import { getLatestPublished } from '@/lib/supabase'

export const revalidate = 43200 // 12 hours — regenerates at 6h and 18h UTC naturally

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
        generationConfig: { temperature: 0.88, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 } }
      })
    }
  )
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function parseJSON(raw: string) {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/)
  if (match) { try { return JSON.parse(match[1].trim()) } catch {} }
  try { return JSON.parse(raw.trim()) } catch {}
  return null
}

function dayOfYear() {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

async function generateDevotional() {
  const themes = [
    'Graça Irresistível', 'Perseverança dos Santos', 'Providência Divina',
    'Justificação pela Fé', 'Soberania de Deus', 'União com Cristo',
    'Santificação pelo Espírito', 'Segurança da Salvação', 'Eleição Incondicional',
    'Expiação Definida', 'Regeneração pela Fé', 'Glorificação Futura',
    'Oração e Dependência de Deus', 'O Evangelho da Graça', 'Fidelidade de Deus',
    'Cristo nossa Justiça', 'A Palavra de Deus', 'Comunhão com o Espírito Santo',
    'O Amor de Deus', 'Confiança na Tribulação', 'A Igreja de Cristo',
  ]
  const theme = themes[dayOfYear() % themes.length]
  const raw = await callGemini(`Crie um devocional bíblico reformado em português sobre: "${theme}".
ATENÇÃO: Responda EXCLUSIVAMENTE com JSON válido. Sem markdown.

REGRA CRÍTICA para o campo "reflection": ESCREVA EXATAMENTE 2 FRASES CURTAS. Não mais. Máximo absoluto de 40 palavras.

{
  "title": "título (máx 6 palavras)",
  "theme": "${theme}",
  "reference": "Livro capítulo:versículo",
  "book": "identificador minúsculas sem acentos",
  "chapter": 1,
  "verseNum": 1,
  "verseText": "texto do versículo (Almeida Revista e Corrigida)",
  "reflection": "APENAS 2 FRASES CURTAS sobre o tema. Máximo 40 palavras. Nada mais.",
  "prayer": "oração de 3 linhas terminando com Amém."
}`)
  const obj = parseJSON(raw)
  if (!obj?.title || !obj?.reflection) throw new Error('Devotional JSON inválido')

  // Hard cap: truncate to first 2 sentences if model ignores the word limit
  const truncateToSentences = (text: string, max: number) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    let result = ''
    for (const s of sentences) {
      if ((result + s).split(' ').length > max) break
      result += s
    }
    return result.trim() || text.split(' ').slice(0, max).join(' ')
  }

  return {
    id: `ai-d-${dayOfYear()}`,
    title: String(obj.title),
    theme: String(obj.theme || theme),
    reference: String(obj.reference || ''),
    book: String(obj.book || 'salmos'),
    chapter: Number(obj.chapter) || 1,
    verse: Number(obj.verseNum) || 1,
    verseText: String(obj.verseText || ''),
    reflection: truncateToSentences(String(obj.reflection), 50),
    prayer: String(obj.prayer || ''),
  }
}

async function generatePrayer(period: 'manha' | 'noite') {
  const label = period === 'manha' ? 'manhã' : 'noite'
  const hints = period === 'manha'
    ? 'Salmos 5:3, Lamentações 3:22-23, Josué 1:9'
    : 'Salmos 4:8, Filipenses 4:7, João 14:27'
  const raw = await callGemini(`Você é um pastor reformado. Escreva uma oração de ${label} em português brasileiro para um cristão.
A oração deve ser intimista, confessional, cheia de Deus, terminando com "Amém."
Inspire-se (sem citar) em: ${hints}
Responda SOMENTE com JSON válido:
{
  "title": "Oração da ${period === 'manha' ? 'Manhã' : 'Noite'}",
  "prayer": "texto da oração com 5-7 linhas, íntimo e profundo, terminando com Amém."
}`)
  const obj = parseJSON(raw)
  if (!obj?.prayer) throw new Error('Prayer JSON inválido')
  return {
    period,
    title: String(obj.title || `Oração da ${period === 'manha' ? 'Manhã' : 'Noite'}`),
    prayer: String(obj.prayer),
  }
}

export async function GET() {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })
  }

  const todayStr = new Date().toISOString().slice(0, 10)

  try {
    // Check Supabase for admin-published content first
    const [publishedDevotional, publishedMorning, publishedEvening] = await Promise.all([
      getLatestPublished('devotional', todayStr),
      getLatestPublished('prayer_manha', todayStr),
      getLatestPublished('prayer_noite', todayStr),
    ])

    const [devotional, morningPrayer, eveningPrayer] = await Promise.all([
      publishedDevotional ? Promise.resolve(publishedDevotional.data) : generateDevotional(),
      publishedMorning ? Promise.resolve(publishedMorning.data) : generatePrayer('manha'),
      publishedEvening ? Promise.resolve(publishedEvening.data) : generatePrayer('noite'),
    ])

    return NextResponse.json({
      devotional,
      morningPrayer,
      eveningPrayer,
      generatedAt: new Date().toISOString(),
      day: dayOfYear(),
      sources: {
        devotional: publishedDevotional ? 'admin' : 'ai',
        morningPrayer: publishedMorning ? 'admin' : 'ai',
        eveningPrayer: publishedEvening ? 'admin' : 'ai',
      }
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
