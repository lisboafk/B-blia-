#!/usr/bin/env node
/**
 * Prebuild: baixa a Bíblia ARC (domínio público) e salva em public/bible/{bookId}.json
 * Tenta múltiplas fontes. Se todas falharem, o app usa fallback embutido.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'bible')

// IDs em ordem canônica (índice 0-65 conforme fontes JSON)
const BOOK_IDS = [
  'genesis','exodo','levitico','numeros','deuteronomio',
  'josue','juizes','rute','1samuel','2samuel',
  '1reis','2reis','1cronicas','2cronicas','esdras',
  'neemias','ester','jo','salmos','proverbios',
  'eclesiastes','cantares','isaias','jeremias','lamentacoes',
  'ezequiel','daniel','oseias','joel','amos',
  'abdias','jonas','miqueias','naum','habacuque',
  'sofonias','ageu','zacarias','malaquias',
  'mateus','marcos','lucas','joao','atos',
  'romanos','1corintios','2corintios','galatas','efesios',
  'filipenses','colossenses','1tessalonicenses','2tessalonicenses',
  '1timoteo','2timoteo','tito','filemom','hebreus',
  'tiago','1pedro','2pedro','1joao','2joao','3joao','judas','apocalipse',
]

// Números canônicos para getbible.net (1-based)
const BOOK_NR = Object.fromEntries(BOOK_IDS.map((id, i) => [id, i + 1]))

async function tryFetch(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 20000)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    return res.ok ? res : null
  } catch {
    clearTimeout(t)
    return null
  }
}

// Fonte 1: JSON único com todos os livros (formato thiagobodruk/biblia)
// chapters = array de arrays de strings  [chapterIdx][verseIdx]
async function tryBatchSource(url) {
  console.log(`  Tentando: ${url}`)
  const res = await tryFetch(url)
  if (!res) return false
  const data = await res.json()
  if (!Array.isArray(data) || data.length < 66) return false
  mkdirSync(OUT_DIR, { recursive: true })
  let saved = 0
  const allVerses = []
  for (let i = 0; i < 66; i++) {
    const book = data[i]
    if (!book?.chapters) continue
    const bookId = BOOK_IDS[i]
    const chapters = {}
    book.chapters.forEach((verses, ci) => {
      chapters[String(ci + 1)] = verses.map((t, vi) => {
        const text = String(t).trim()
        allVerses.push([bookId, ci + 1, vi + 1, text])
        return { v: vi + 1, t: text }
      })
    })
    writeFileSync(join(OUT_DIR, `${bookId}.json`), JSON.stringify({ chapters }))
    saved++
  }
  writeFileSync(join(OUT_DIR, 'all-verses.json'), JSON.stringify(allVerses))
  console.log(`  ✅ ${saved}/66 livros + índice de busca`)
  return saved >= 60
}

// Fonte 2: getbible.net por livro (formato: { chapters: { "1": { "1": {verse,text}, ... } } })
async function tryGetbibleBook(bookId, bookNr) {
  const url = `https://cdn.getbible.net/v2/almeida/${bookNr}.json`
  const res = await tryFetch(url)
  if (!res) return null
  try {
    const data = await res.json()
    // formato getbible.net: { chapters: { "1": { "1": { text }, "2": { text }, ... } } }
    const rawChapters = data.chapters || data
    if (typeof rawChapters !== 'object') return null
    const chapters = {}
    for (const [chKey, chData] of Object.entries(rawChapters)) {
      if (typeof chData !== 'object') continue
      chapters[chKey] = Object.entries(chData)
        .filter(([, v]) => v && v.text)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, v]) => ({ v: Number(v.verse || v.verse_nr || 1), t: String(v.text).trim() }))
    }
    if (Object.keys(chapters).length === 0) return null
    return chapters
  } catch {
    return null
  }
}

async function main() {
  console.log('📖 Baixando Bíblia ARC (domínio público)...')

  // Fonte 1: tentar arquivos batch do GitHub
  const batchSources = [
    'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/arc.json',
    'https://raw.githubusercontent.com/thiagobodruk/biblia/main/json/arc.json',
    'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/aa.json',
    'https://raw.githubusercontent.com/thiagobodruk/biblia/main/json/aa.json',
    'https://raw.githubusercontent.com/acbr/biblia-sagrada-json/master/data/arc.json',
    'https://raw.githubusercontent.com/acbr/biblia-sagrada-json/main/data/arc.json',
  ]

  for (const url of batchSources) {
    if (await tryBatchSource(url)) {
      console.log('✅ Bíblia baixada com sucesso!')
      return
    }
  }

  // Fonte 2: getbible.net por livro (66 requests em paralelo em lotes de 10)
  console.log('  GitHub falhou. Tentando getbible.net por livro...')
  mkdirSync(OUT_DIR, { recursive: true })
  let saved = 0

  for (let batch = 0; batch < 66; batch += 10) {
    const slice = BOOK_IDS.slice(batch, batch + 10)
    await Promise.all(slice.map(async (bookId) => {
      const bookNr = BOOK_NR[bookId]
      const chapters = await tryGetbibleBook(bookId, bookNr)
      if (chapters) {
        writeFileSync(join(OUT_DIR, `${bookId}.json`), JSON.stringify({ chapters }))
        saved++
      }
    }))
  }

  if (saved > 0) {
    console.log(`✅ ${saved}/66 livros via getbible.net`)
  } else {
    console.warn('⚠️  Nenhuma fonte funcionou. O app usará fallback embutido.')
  }
}

main().catch(e => {
  console.error('Erro no fetch-bible:', e.message)
  process.exit(0) // não bloquear o build
})
