#!/usr/bin/env node
/**
 * Gerador de conteúdo via Gemini API
 * Roda 2x/dia via GitHub Actions (6h = manhã, 18h = noite)
 * Appenda novos itens em data/generated.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_FILE = join(ROOT, 'data', 'generated.json')
const GEMINI_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_KEY) {
  console.error('❌ GEMINI_API_KEY não definida — adicione o secret no GitHub Actions')
  process.exit(1)
}

const PERIOD = process.env.PERIOD || (new Date().getUTCHours() < 12 ? 'manha' : 'noite')
console.log(`🕐 Período: ${PERIOD}`)

const API = 'https://generativelanguage.googleapis.com/v1beta'
let TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || ''
let IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || ''

// Testa a chave e escolhe os modelos atuais disponíveis para ela
async function discoverModels() {
  const res = await fetch(`${API}/models?pageSize=1000&key=${GEMINI_KEY}`)
  if (!res.ok) throw new Error(`Chave Gemini recusada (HTTP ${res.status}): ${(await res.text()).slice(0, 300)}`)
  const { models = [] } = await res.json()
  const names = models
    .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map(m => m.name.replace('models/', ''))
  const ver = n => parseFloat((n.match(/gemini-(\d+(?:\.\d+)?)/) || [])[1] || 0)
  const stable = n => !/preview|exp|latest|tts|audio|live|embedding|thinking/.test(n)
  const pick = list => list.sort((a, b) => ver(b) - ver(a) || a.length - b.length)[0]
  if (!TEXT_MODEL) TEXT_MODEL = pick(names.filter(n => /^gemini-[\d.]+-flash(-\d+)?$/.test(n) && stable(n)))
  if (!IMAGE_MODEL) IMAGE_MODEL = pick(names.filter(n => /^gemini-.*image/.test(n) && !/preview/.test(n)))
    || pick(names.filter(n => /^gemini-.*image/.test(n)))
  console.log('🔑 Chave Gemini OK')
  console.log(`🧠 Modelo de texto: ${TEXT_MODEL}`)
  console.log(`🎨 Modelo de imagem: ${IMAGE_MODEL || '(nenhum disponível)'}`)
  if (!TEXT_MODEL) throw new Error('Nenhum modelo de texto Gemini disponível para esta chave')
}

async function callGemini(prompt) {
  const url = `${API}/models/${TEXT_MODEL}:generateContent?key=${GEMINI_KEY}`
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: 4096, responseMimeType: 'application/json' }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini HTTP ${res.status}: ${err.slice(0, 300)}`)
  }
  const data = await res.json()
  return (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('')
}

// ─── Imagem do devocional ───────────────────────────────────────────────────
const IMAGE_STYLE = `Fine-art sacred painting, symbolic and contemplative, in the spirit of Dutch Golden Age still life and luminous romantic landscape painting. Rich oil texture, warm gold, deep crimson and midnight blue palette, soft dramatic light. Vertical composition with calm empty space in the upper third for a text overlay. Strictly no people, no human figures, no faces, no hands, no depictions of Jesus, God or angels. No text, letters, numbers, logos or watermark.`

async function writeImagePrompt(dev) {
  const prompt = `You are an art director for a Reformed Christian devotional app. Read this devotional and describe ONE single image that captures its central idea through SYMBOLS and NATURE only (e.g. landscapes, light, sky, water, wheat, bread, a cup, a lamb grazing, an open ancient scroll, a seal of wax, an empty tomb's stone, a lamp, a path, a rock). One clear focal subject, not a collage. Never people, faces, hands, angels or depictions of Christ.

Reference: ${dev.reference}
Verse: ${dev.verse}
Theme: ${dev.theme}
Devotional: ${dev.content}

Respond ONLY with JSON: {"subject": "one-sentence English description of the scene (max 45 words)"}`
  const obj = parseJSON(await callGemini(prompt))
  if (!obj?.subject) throw new Error('Não consegui gerar o prompt da imagem')
  return String(obj.subject)
}

async function generateImage(dev, period) {
  if (!IMAGE_MODEL) throw new Error('Sem modelo de imagem disponível')
  const subject = await writeImagePrompt(dev)
  const fullPrompt = `${subject}\n\n${IMAGE_STYLE}`
  console.log(`  🖌️  Cena: ${subject}`)
  const res = await fetch(`${API}/models/${IMAGE_MODEL}:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '4:5' } }
    })
  })
  if (!res.ok) throw new Error(`Imagem HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const part = (data.candidates?.[0]?.content?.parts || []).find(p => p.inlineData?.data)
  if (!part) throw new Error('Modelo não devolveu imagem: ' + JSON.stringify(data).slice(0, 300))
  const ext = (part.inlineData.mimeType || 'image/png').includes('jpeg') ? 'jpg' : 'png'
  const date = new Date().toISOString().slice(0, 10)
  const dir = join(ROOT, 'public', 'daily')
  mkdirSync(dir, { recursive: true })
  const file = `${date}-${period}.${ext}`
  writeFileSync(join(dir, file), Buffer.from(part.inlineData.data, 'base64'))
  console.log(`  🖼️  Imagem salva: public/daily/${file}`)
  return { image: `/daily/${file}`, imagePrompt: subject }
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
  await discoverModels()
  let failures = 0

  const generated = JSON.parse(readFileSync(DATA_FILE, 'utf8'))

  const tasks = []

  if (PERIOD === 'manha') {
    // Manhã: devocional + versículo + oração da manhã
    tasks.push(
      generateDevotional().then(async d => {
        console.log(`  ✅ Devocional: ${d.title} (${d.reference})`)
        try { Object.assign(d, await generateImage(d, PERIOD)) }
        catch (e) { console.warn(`  ⚠️  Imagem: ${e.message}`); failures++ }
        generated.devotionals.push(d)
      }),
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
  results.forEach(r => { if (r.status === 'rejected') { console.warn(`  ⚠️  ${r.reason.message}`); failures++ } })

  // Manter no máximo 100 itens de cada tipo (evitar crescimento infinito do arquivo)
  const MAX = 100
  generated.devotionals = generated.devotionals.slice(-MAX)
  generated.verses = generated.verses.slice(-MAX)
  generated.morningPrayers = generated.morningPrayers.slice(-MAX)
  generated.eveningPrayers = generated.eveningPrayers.slice(-MAX)

  writeFileSync(DATA_FILE, JSON.stringify(generated, null, 2))
  if (failures) { console.error(`❌ ${failures} etapa(s) falharam — veja os avisos acima`); process.exitCode = 1 }
  console.log(`✅ data/generated.json atualizado (${generated.devotionals.length} devocionais, ${generated.verses.length} versículos, ${generated.morningPrayers.length} orações manhã, ${generated.eveningPrayers.length} orações noite)`)
}

main().catch(e => { console.error('❌ Erro:', e.message); process.exit(1) })
