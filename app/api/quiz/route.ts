import { NextResponse } from 'next/server'

export const revalidate = 86400 // 24 hours — one new quiz per day

const GEMINI_KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-2.5-flash'

interface Question { q: string; options: string[]; correct: number }

export async function GET() {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Você é um especialista em Bíblia Sagrada com perspectiva reformada. Crie 5 perguntas de trivia bíblica únicas em português brasileiro. Varie os temas: personagens, geografia bíblica, profecia, epístolas, história do povo de Israel, teologia. Evite perguntas muito básicas (ex: quantos livros tem a Bíblia).
Responda SOMENTE com JSON válido — um array de exatamente 5 objetos:
[
  {"q": "texto da pergunta?", "options": ["opção A", "opção B", "opção C", "opção D"], "correct": 2},
  {"q": "texto da pergunta?", "options": ["opção A", "opção B", "opção C", "opção D"], "correct": 0}
]
"correct" é o índice (0-3) da resposta correta.`
            }]
          }],
          generationConfig: { temperature: 0.92, maxOutputTokens: 1024 }
        })
      }
    )

    if (!res.ok) throw new Error(`Gemini ${res.status}`)
    const data = await res.json()
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let questions: Question[] = []
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/(\[[\s\S]*\])/)
    if (match) {
      try { questions = JSON.parse(match[1].trim()) } catch {}
    }
    if (!questions.length) {
      try { questions = JSON.parse(raw.trim()) } catch {}
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Quiz JSON inválido')
    }

    return NextResponse.json({
      questions: questions.slice(0, 5),
      generatedAt: new Date().toISOString(),
    })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
