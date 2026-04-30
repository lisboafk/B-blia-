#!/usr/bin/env node
/**
 * Gerador de conteúdo via Gemini API
 * Roda 2x/dia via GitHub Actions (6h = manhã, 18h = noite)
 * Appenda novos itens em data/generated.json
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_FILE = join(ROOT, 'data', 'generated.json')
const GEMINI_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_KEY) {
  console.error('❌  GEMINI_API_KEY não definida')
  process.exit(1)
}

const PERIOD = process.env.PERIOD || (new Date().getUTCHours() < 12 ? 'manha' : 'noite')
console.log(`🕐 Período: ${PERIOD}`)

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini HTTP ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function parseJSON(raw) {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/)
  if (match) {
    try { return JSON.parse(match[1].trim()) } catch {}
  }
  try { return JSON.parse(raw.trim()) } catch {}
  return null
}

async function generateDevotional() {
  const themes = [
    'Graça Irresistível', 'Perseverança dos Santos', 'Providência Divina',
    'Justificação pela Fé', 'Soberania de Deus', 'União com Cristo',
    'Santificação pelo Espírito', 'Segurança da Salvação', 'Eleição Incondicional',
    'Expiação Definida', 'Regeneração Precedendo a Fé', 'Glorificação Futura'
  ]
  const theme = themes[Math.floor(Math.random() * themes.length)]
  const prompt = `Você é um teólogo reformado. Crie um devocional bíblico em português brasileiro sobre o tema: "${theme}".

Responda SOMENTE com JSON válido, sem texto extra:
{
  "title": "título do devocional (máx 6 palavras)",
  "theme": "${theme}",
  "reference": "Livro capítulo:versículo",
  "book": "identificador do livro em minúsculas sem acentos (ex: joao, genesis, salmos)",
  "chapter": 1,
  "verseNum": 1,
  "verse": "texto do versículo em português (Almeida Revista e Corrigida)",
  "content": "texto devocional de 3 parágrafos curtos (total ~200 palavras), reformado, que exalte a glória de Deus e aplique ao cristão moderno",
  "prayer": "oração curta (3-4 linhas) baseada no texto"
}`

  const raw = await callGemini(prompt)
  const obj = parseJSON(raw)
  if (!obj || !obj.title || !obj.content) throw new Error('JSON inválido: ' + raw.slice(0, 200))
  return {
    id: `gen-d-${Date.now()}`,
    title: String(obj.title),
    theme: String(obj.theme || theme),
    reference: String(obj.reference || ''),
    book: String(obj.book || ''),
    chapter: Number(obj.chapter) || 1,
    verseNum: Number(obj.verseNum) || 1,
    verse: String(obj.verse || ''),
    content: String(obj.content),
    prayer: String(obj.prayer || ''),
    generatedAt: new Date().toISOString()
  }
}

async function generateVerse() {
  const prompt = `Você é um especialista na Bíblia reformada. Sugira um versículo bíblico inspirador em português.

Responda SOMENTE com JSON válido:
{
  "reference": "Livro capítulo:versículo (ex: João 3:16)",
  "text": "texto completo do versículo em português (Almeida Revista e Corrigida)",
  "book": "identificador do livro em minúsculas sem acentos (ex: joao, genesis, salmos)",
  "chapter": 3,
  "verse": 16
}`

  const raw = await callGemini(prompt)
  const obj = parseJSON(raw)
  if (!obj || !obj.text || !obj.reference) throw new Error('JSON inválido: ' + raw.slice(0, 200))
  return {
    id: `gen-v-${Date.now()}`,
    reference: String(obj.reference),
    text: String(obj.text),
    book: String(obj.book || ''),
    chapter: Number(obj.chapter) || 1,
    verse: Number(obj.verse) || 1,
    generatedAt: new Date().toISOString()
  }
}

async function generatePrayer(period) {
  const periodLabel = period === 'manha' ? 'manhã' : 'noite'
  const verseHint = period === 'manha'
    ? 'Salmos 5:3, Lamentações 3:22-23, Josué 1:9'
    : 'Salmos 4:8, Filipenses 4:7, João 14:27'

  const prompt = `Você é um pastor reformado. Crie uma oração de ${periodLabel} para o cristão.

Responda SOMENTE com JSON válido:
{
  "title": "Oração da ${period === 'manha' ? 'Manhã' : 'Noite'}",
  "reference": "versículo bíblico de referência (escolha próximo de: ${verseHint})",
  "book": "identificador do livro em minúsculas sem acentos",
  "chapter": 1,
  "prayer": "texto da oração (4-6 linhas, intimista, reformada, terminando com Amém)"
}`

  const raw = await callGemini(prompt)
  const obj = parseJSON(raw)
  if (!obj || !obj.prayer) throw new Error('JSON inválido: ' + raw.slice(0, 200))
  return {
    id: `gen-p-${period[0]}-${Date.now()}`,
    period,
    title: String(obj.title || `Oração da ${period === 'manha' ? 'Manhã' : 'Noite'}`),
    reference: String(obj.reference || ''),
    book: String(obj.book || 'salmos'),
    chapter: Number(obj.chapter) || 1,
    prayer: String(obj.prayer),
    generatedAt: new Date().toISOString()
  }
}

async function main() {
  console.log('🤖 Gerando conteúdo com Gemini...')

  const generated = JSON.parse(readFileSync(DATA_FILE, 'utf8'))

  const tasks = []

  if (PERIOD === 'manha') {
    // Manhã: devocional + versículo + oração da manhã
    tasks.push(
      generateDevotional().then(d => { generated.devotionals.push(d); console.log(`  ✅ Devocional: ${d.title}`) }),
      generateVerse().then(v => { generated.verses.push(v); console.log(`  ✅ Versículo: ${v.reference}`) }),
      generatePrayer('manha').then(p => { generated.morningPrayers.push(p); console.log(`  ✅ Oração da manhã: ${p.reference}`) })
    )
  } else {
    // Noite: oração da noite + versículo extra
    tasks.push(
      generatePrayer('noite').then(p => { generated.eveningPrayers.push(p); console.log(`  ✅ Oração da noite: ${p.reference}`) }),
      generateVerse().then(v => { generated.verses.push(v); console.log(`  ✅ Versículo: ${v.reference}`) })
    )
  }

  const results = await Promise.allSettled(tasks)
  results.forEach(r => { if (r.status === 'rejected') console.warn(`  ⚠️  ${r.reason.message}`) })

  // Manter no máximo 100 itens de cada tipo (evitar crescimento infinito do arquivo)
  const MAX = 100
  generated.devotionals = generated.devotionals.slice(-MAX)
  generated.verses = generated.verses.slice(-MAX)
  generated.morningPrayers = generated.morningPrayers.slice(-MAX)
  generated.eveningPrayers = generated.eveningPrayers.slice(-MAX)

  writeFileSync(DATA_FILE, JSON.stringify(generated, null, 2))
  console.log(`✅ data/generated.json atualizado (${generated.devotionals.length} devocionais, ${generated.verses.length} versículos, ${generated.morningPrayers.length} orações manhã, ${generated.eveningPrayers.length} orações noite)`)
}

main().catch(e => { console.error('❌ Erro:', e.message); process.exit(1) })
