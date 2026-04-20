import { NextRequest, NextResponse } from 'next/server'

const BOOK_ID_MAP: Record<string, string> = {
  genesis: 'genesis', exodo: 'exodus', levitico: 'leviticus', numeros: 'numbers',
  deuteronomio: 'deuteronomy', josue: 'joshua', juizes: 'judges', rute: 'ruth',
  '1samuel': '1+samuel', '2samuel': '2+samuel', '1reis': '1+kings', '2reis': '2+kings',
  '1cronicas': '1+chronicles', '2cronicas': '2+chronicles', esdras: 'ezra',
  neemias: 'nehemiah', ester: 'esther', jo: 'job', salmos: 'psalms',
  proverbios: 'proverbs', eclesiastes: 'ecclesiastes', cantares: 'song+of+solomon',
  isaias: 'isaiah', jeremias: 'jeremiah', lamentacoes: 'lamentations',
  ezequiel: 'ezekiel', daniel: 'daniel', oseias: 'hosea', joel: 'joel',
  amos: 'amos', abdias: 'obadiah', jonas: 'jonah', miqueias: 'micah',
  naum: 'nahum', habacuque: 'habakkuk', sofonias: 'zephaniah', ageu: 'haggai',
  zacarias: 'zechariah', malaquias: 'malachi', mateus: 'matthew', marcos: 'mark',
  lucas: 'luke', joao: 'john', atos: 'acts', romanos: 'romans',
  '1corintios': '1+corinthians', '2corintios': '2+corinthians', galatas: 'galatians',
  efesios: 'ephesians', filipenses: 'philippians', colossenses: 'colossians',
  '1tessalonicenses': '1+thessalonians', '2tessalonicenses': '2+thessalonians',
  '1timoteo': '1+timothy', '2timoteo': '2+timothy', tito: 'titus',
  filemom: 'philemon', hebreus: 'hebrews', tiago: 'james',
  '1pedro': '1+peter', '2pedro': '2+peter', '1joao': '1+john',
  '2joao': '2+john', '3joao': '3+john', judas: 'jude', apocalipse: 'revelation',
}

// getbible.net uses canonical book numbers 1-66
const BOOK_NR_MAP: Record<string, number> = {
  genesis: 1, exodo: 2, levitico: 3, numeros: 4, deuteronomio: 5,
  josue: 6, juizes: 7, rute: 8, '1samuel': 9, '2samuel': 10,
  '1reis': 11, '2reis': 12, '1cronicas': 13, '2cronicas': 14, esdras: 15,
  neemias: 16, ester: 17, jo: 18, salmos: 19, proverbios: 20,
  eclesiastes: 21, cantares: 22, isaias: 23, jeremias: 24, lamentacoes: 25,
  ezequiel: 26, daniel: 27, oseias: 28, joel: 29, amos: 30,
  abdias: 31, jonas: 32, miqueias: 33, naum: 34, habacuque: 35,
  sofonias: 36, ageu: 37, zacarias: 38, malaquias: 39,
  mateus: 40, marcos: 41, lucas: 42, joao: 43, atos: 44,
  romanos: 45, '1corintios': 46, '2corintios': 47, galatas: 48,
  efesios: 49, filipenses: 50, colossenses: 51, '1tessalonicenses': 52,
  '2tessalonicenses': 53, '1timoteo': 54, '2timoteo': 55, tito: 56,
  filemom: 57, hebreus: 58, tiago: 59, '1pedro': 60, '2pedro': 61,
  '1joao': 62, '2joao': 63, '3joao': 64, judas: 65, apocalipse: 66,
}

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; BibleStudyApp/1.0; +https://bibliadafamilia.vercel.app)',
  'Accept': 'application/json',
}

async function fetchWithTimeout(url: string, ms: number) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: HEADERS, next: { revalidate: 86400 } })
    return res
  } finally {
    clearTimeout(t)
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get('book') || ''
  const chapter = searchParams.get('chapter') || '1'

  // --- Source 1: bible-api.com ---
  try {
    const apiBook = BOOK_ID_MAP[bookId] || bookId
    const url = `https://bible-api.com/${apiBook}+${chapter}?translation=almeida`
    const res = await fetchWithTimeout(url, 10000)
    if (res.ok) {
      const data = await res.json()
      const verses = (data.verses || []).map((v: { verse: number; text: string }) => ({
        verse: v.verse, text: v.text.trim(),
      }))
      if (verses.length > 0) {
        return NextResponse.json({ verses, source: 'Almeida (Domínio Público)' }, {
          headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
        })
      }
    }
  } catch { /* fall through to source 2 */ }

  // --- Source 2: getbible.net CDN ---
  try {
    const bookNr = BOOK_NR_MAP[bookId]
    if (bookNr) {
      const url = `https://cdn.getbible.net/v2/almeida/${bookNr}/${chapter}.json`
      const res = await fetchWithTimeout(url, 10000)
      if (res.ok) {
        const data = await res.json()
        // getbible.net format: { chapter: { "1": { verse, text }, ... } }
        const raw = data.chapter || data
        const verses = Object.values(raw)
          .filter((v): v is { verse: number; text: string } => typeof v === 'object' && v !== null && 'verse' in v)
          .sort((a, b) => a.verse - b.verse)
          .map(v => ({ verse: v.verse, text: v.text.trim() }))
        if (verses.length > 0) {
          return NextResponse.json({ verses, source: 'Almeida (Domínio Público)' }, {
            headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
          })
        }
      }
    }
  } catch { /* fall through to error */ }

  return NextResponse.json({ error: 'unavailable' }, { status: 503 })
}
