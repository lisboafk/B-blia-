'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, BookOpen, ChevronRight, Flame } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { THEOLOGICAL_THEMES } from '@/data/reformed-commentary'
import { DEVOTIONALS } from '@/data/daily-devotionals'

const THEME_VERSES: Record<string, { ref: string; book: string; ch: number }[]> = {
  'Soberania de Deus': [{ ref: 'Romanos 9:15-16', book: 'romanos', ch: 9 }, { ref: 'Efésios 1:11', book: 'efesios', ch: 1 }, { ref: 'Salmos 115:3', book: 'salmos', ch: 115 }],
  'Graça': [{ ref: 'Efésios 2:8-9', book: 'efesios', ch: 2 }, { ref: 'Tito 2:11', book: 'tito', ch: 2 }, { ref: 'Romanos 3:24', book: 'romanos', ch: 3 }],
  'Justificação': [{ ref: 'Romanos 5:1', book: 'romanos', ch: 5 }, { ref: 'Gálatas 2:16', book: 'galatas', ch: 2 }, { ref: 'Filipenses 3:9', book: 'filipenses', ch: 3 }],
  'Sola Fide': [{ ref: 'Romanos 3:28', book: 'romanos', ch: 3 }, { ref: 'Gálatas 3:11', book: 'galatas', ch: 3 }, { ref: 'Habacuque 2:4', book: 'habacuque', ch: 2 }],
  'Sola Gratia': [{ ref: 'Efésios 2:8-9', book: 'efesios', ch: 2 }, { ref: 'Romanos 11:6', book: 'romanos', ch: 11 }, { ref: '2 Timóteo 1:9', book: '2timoteo', ch: 1 }],
  'Eleição': [{ ref: 'Efésios 1:4-5', book: 'efesios', ch: 1 }, { ref: 'João 15:16', book: 'joao', ch: 15 }, { ref: 'Romanos 8:29-30', book: 'romanos', ch: 8 }],
  'Providência': [{ ref: 'Romanos 8:28', book: 'romanos', ch: 8 }, { ref: 'Salmos 23:1-6', book: 'salmos', ch: 23 }, { ref: 'Mateus 10:29-31', book: 'mateus', ch: 10 }],
  'Redenção': [{ ref: 'Efésios 1:7', book: 'efesios', ch: 1 }, { ref: 'Colossenses 1:14', book: 'colossenses', ch: 1 }, { ref: 'Hebreus 9:12', book: 'hebreus', ch: 9 }],
  'Messias': [{ ref: 'Isaías 53:1-12', book: 'isaias', ch: 53 }, { ref: 'Lucas 4:18-19', book: 'lucas', ch: 4 }, { ref: 'Gênesis 3:15', book: 'genesis', ch: 3 }],
  'Encarnação': [{ ref: 'João 1:14', book: 'joao', ch: 1 }, { ref: 'Filipenses 2:6-8', book: 'filipenses', ch: 2 }, { ref: 'Hebreus 2:14', book: 'hebreus', ch: 2 }],
  'Divindade de Cristo': [{ ref: 'João 1:1-3', book: 'joao', ch: 1 }, { ref: 'Colossenses 2:9', book: 'colossenses', ch: 2 }, { ref: 'Hebreus 1:3', book: 'hebreus', ch: 1 }],
  'Depravação': [{ ref: 'Romanos 3:10-12', book: 'romanos', ch: 3 }, { ref: 'Jeremias 17:9', book: 'jeremias', ch: 17 }, { ref: 'Efésios 2:1-3', book: 'efesios', ch: 2 }],
  'Perseverança': [{ ref: 'Romanos 8:38-39', book: 'romanos', ch: 8 }, { ref: 'João 10:28-29', book: 'joao', ch: 10 }, { ref: 'Filipenses 1:6', book: 'filipenses', ch: 1 }],
  'Esperança': [{ ref: 'Romanos 8:24-25', book: 'romanos', ch: 8 }, { ref: 'Hebreus 6:19', book: 'hebreus', ch: 6 }, { ref: 'Apocalipse 21:4', book: 'apocalipse', ch: 21 }],
  'Fé': [{ ref: 'Hebreus 11:1', book: 'hebreus', ch: 11 }, { ref: 'Romanos 10:17', book: 'romanos', ch: 10 }, { ref: 'Efésios 2:8', book: 'efesios', ch: 2 }],
}

const BOOK_NAME: Record<string, string> = {
  genesis: 'Gênesis', exodo: 'Êxodo', levitico: 'Levítico', numeros: 'Números', deuteronomio: 'Deuteronômio',
  josue: 'Josué', juizes: 'Juízes', rute: 'Rute', '1samuel': '1 Samuel', '2samuel': '2 Samuel',
  '1reis': '1 Reis', '2reis': '2 Reis', '1cronicas': '1 Crônicas', '2cronicas': '2 Crônicas',
  esdras: 'Esdras', neemias: 'Neemias', ester: 'Ester', jo: 'Jó', salmos: 'Salmos',
  proverbios: 'Provérbios', eclesiastes: 'Eclesiastes', cantares: 'Cânticos', isaias: 'Isaías',
  jeremias: 'Jeremias', lamentacoes: 'Lamentações', ezequiel: 'Ezequiel', daniel: 'Daniel',
  oseias: 'Oseias', joel: 'Joel', amos: 'Amós', abdias: 'Abdias', jonas: 'Jonas',
  miqueias: 'Miquéias', naum: 'Naum', habacuque: 'Habacuque', sofonias: 'Sofonias',
  ageu: 'Ageu', zacarias: 'Zacarias', malaquias: 'Malaquias', mateus: 'Mateus', marcos: 'Marcos',
  lucas: 'Lucas', joao: 'João', atos: 'Atos', romanos: 'Romanos', '1corintios': '1 Coríntios',
  '2corintios': '2 Coríntios', galatas: 'Gálatas', efesios: 'Efésios', filipenses: 'Filipenses',
  colossenses: 'Colossenses', '1tessalonicenses': '1 Tessalonicenses', '2tessalonicenses': '2 Tessalonicenses',
  '1timoteo': '1 Timóteo', '2timoteo': '2 Timóteo', tito: 'Tito', filemom: 'Filemom',
  hebreus: 'Hebreus', tiago: 'Tiago', '1pedro': '1 Pedro', '2pedro': '2 Pedro',
  '1joao': '1 João', '2joao': '2 João', '3joao': '3 João', judas: 'Judas', apocalipse: 'Apocalipse',
}

function normalizeText(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

let _verseIndex: [string, number, number, string][] | null = null

type VerseResult = { id: string; ch: number; v: number; text: string }

export default function StudyPage() {
  const [search, setSearch] = useState('')
  const [activeTheme, setActiveTheme] = useState<string | null>(null)
  const [tab, setTab] = useState<'temas' | 'devocionais' | 'busca'>('temas')

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<VerseResult[]>([])
  const [indexReady, setIndexReady] = useState(_verseIndex !== null)
  const [indexLoading, setIndexLoading] = useState(false)
  const [indexErr, setIndexErr] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (tab !== 'busca' || _verseIndex !== null || indexLoading) return
    setIndexLoading(true)
    fetch('/bible/all-verses.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { _verseIndex = data; setIndexReady(true) })
      .catch(() => setIndexErr(true))
      .finally(() => setIndexLoading(false))
  }, [tab])

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (searchQuery.length < 3 || !_verseIndex) { setResults([]); return }
    searchTimer.current = setTimeout(() => {
      const q = normalizeText(searchQuery)
      const found: VerseResult[] = []
      for (const [id, ch, v, text] of _verseIndex!) {
        if (normalizeText(text).includes(q)) {
          found.push({ id, ch, v, text })
          if (found.length >= 30) break
        }
      }
      setResults(found)
    }, 200)
  }, [searchQuery, indexReady])

  const filteredThemes = THEOLOGICAL_THEMES.filter(t =>
    t.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-28">
      <div className="pt-12 px-4 pb-4">
        <h1 className="title-cinzel text-gold text-xl tracking-wider mb-1">ESTUDO REFORMADO</h1>
        <p className="text-parchment/40 text-xs italic">Teologia que transforma</p>
      </div>

      <div className="px-4 mb-4">
        <div className="flex parchment-card rounded-xl p-1 gap-1">
          {(['temas', 'devocionais', 'busca'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] tracking-widest uppercase transition-all ${
                tab === t ? 'bg-gold/20 text-gold-light' : 'text-parchment/50'
              }`} style={{ fontFamily: 'Cinzel, serif' }}>
              {t === 'temas' ? 'Temas' : t === 'devocionais' ? 'Devocional' : 'Busca'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'temas' && (
        <div className="px-4">
          <div className="flex items-center gap-2 parchment-card rounded-xl px-3 py-2.5 mb-4">
            <Search size={14} className="text-gold/60" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tema teológico..."
              className="bg-transparent flex-1 text-parchment text-sm outline-none placeholder:text-parchment/30" />
          </div>

          {activeTheme ? (
            <div>
              <button onClick={() => setActiveTheme(null)}
                className="flex items-center gap-1 text-gold text-xs mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                ← Todos os temas
              </button>
              <h2 className="title-display text-parchment text-lg mb-4">{activeTheme}</h2>
              <div className="space-y-2">
                {(THEME_VERSES[activeTheme] || []).map(v => (
                  <Link key={v.ref} href={`/bible/${v.book}/${v.ch}`}
                    className="flex items-center justify-between parchment-card p-3 rounded-xl active:scale-[0.98] transition-transform">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-gold/60" />
                      <span className="text-parchment text-sm">{v.ref}</span>
                    </div>
                    <ChevronRight size={14} className="text-gold/40" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredThemes.map(theme => (
                <button key={theme} onClick={() => setActiveTheme(theme)}
                  className="px-3 py-1.5 rounded-full border border-gold/25 bg-gold/8 text-parchment/70 text-xs active:scale-95 transition-transform hover:border-gold/50 hover:text-gold"
                  style={{ fontFamily: 'Cinzel, serif' }}>
                  {theme}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'devocionais' && (
        <div className="px-4 space-y-3">
          {DEVOTIONALS.map(d => (
            <div key={d.id} className="parchment-card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 bg-gradient-to-r from-gold/15 to-transparent px-4 py-2.5">
                <Flame size={12} className="text-fire" />
                <span className="text-gold text-[11px] tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>{d.day}</span>
              </div>
              <div className="px-4 py-3">
                <h3 className="title-display text-parchment text-base mb-1">{d.title}</h3>
                <p className="text-gold text-xs mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{d.reference}</p>
                <p className="text-parchment/60 text-xs italic mb-2 leading-relaxed">"{d.verseText}"</p>
                <p className="text-parchment/70 text-sm leading-relaxed line-clamp-3">{d.reflection}</p>
                <Link href={`/bible/${d.book}/${d.chapter}`}
                  className="flex items-center gap-1 mt-2 text-gold text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
                  Ler capítulo <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'busca' && (
        <div className="px-4">
          <div className="flex items-center gap-2 parchment-card rounded-xl px-3 py-2.5 mb-4">
            <Search size={14} className="text-gold/60" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar palavra ou frase..."
              className="bg-transparent flex-1 text-parchment text-sm outline-none placeholder:text-parchment/30"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <button onClick={() => { setSearchQuery(''); setResults([]) }}
                className="text-parchment/30 text-xs px-1">✕</button>
            )}
          </div>

          {indexLoading && (
            <p className="text-center text-parchment/30 text-sm mt-8">Carregando índice bíblico...</p>
          )}
          {indexErr && (
            <p className="text-center text-parchment/30 text-sm mt-8">Índice indisponível — faça um novo deploy.</p>
          )}
          {!indexLoading && !indexErr && searchQuery.length < 3 && (
            <p className="text-center text-parchment/30 text-sm mt-8 italic">
              Digite ao menos 3 letras para buscar em toda a Bíblia
            </p>
          )}

          {results.length > 0 && (
            <>
              <p className="text-parchment/30 text-xs mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                {results.length} resultado{results.length !== 1 ? 's' : ''}{results.length === 30 ? ' (primeiros 30)' : ''}
              </p>
              <div className="space-y-2">
                {results.map(r => (
                  <Link key={`${r.id}-${r.ch}-${r.v}`} href={`/bible/${r.id}/${r.ch}`}
                    className="block parchment-card p-3 rounded-xl active:scale-[0.98] transition-transform">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={12} className="text-gold/60 shrink-0" />
                      <span className="text-gold text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
                        {BOOK_NAME[r.id] || r.id} {r.ch}:{r.v}
                      </span>
                    </div>
                    <p className="text-parchment/70 text-sm leading-relaxed line-clamp-2">{r.text}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!indexLoading && indexReady && searchQuery.length >= 3 && results.length === 0 && (
            <p className="text-center text-parchment/30 text-sm mt-8 italic">
              Nenhum versículo encontrado para "{searchQuery}"
            </p>
          )}
        </div>
      )}

      <Navigation />
    </div>
  )
}
