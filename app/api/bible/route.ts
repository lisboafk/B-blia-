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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get('book') || ''
  const chapter = searchParams.get('chapter') || '1'

  const apiBook = BOOK_ID_MAP[bookId] || bookId
  const url = `https://bible-api.com/${apiBook}+${chapter}?translation=almeida`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    })
    clearTimeout(timeout)

    if (!res.ok) throw new Error(`API ${res.status}`)
    const data = await res.json()

    const verses = (data.verses || []).map((v: { verse: number; text: string }) => ({
      verse: v.verse,
      text: v.text.trim(),
    }))

    return NextResponse.json({ verses, source: 'Almeida (Domínio Público)' }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    })
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }
}
