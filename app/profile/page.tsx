'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, BookOpen, Bell, Trash2, Settings, RefreshCw } from 'lucide-react'
import Navigation from '@/components/Navigation'

const BOOK_LABELS: Record<string, { name: string; chapters: number }> = {
  genesis: { name: 'Gênesis', chapters: 50 }, exodo: { name: 'Êxodo', chapters: 40 },
  salmos: { name: 'Salmos', chapters: 150 }, mateus: { name: 'Mateus', chapters: 28 },
  marcos: { name: 'Marcos', chapters: 16 }, lucas: { name: 'Lucas', chapters: 24 },
  joao: { name: 'João', chapters: 21 }, atos: { name: 'Atos', chapters: 28 },
  romanos: { name: 'Romanos', chapters: 16 }, apocalipse: { name: 'Apocalipse', chapters: 22 },
  isaias: { name: 'Isaías', chapters: 66 }, jeremias: { name: 'Jeremias', chapters: 52 },
  efesios: { name: 'Efésios', chapters: 6 }, filipenses: { name: 'Filipenses', chapters: 4 },
  colossenses: { name: 'Colossenses', chapters: 4 }, hebreus: { name: 'Hebreus', chapters: 13 },
}

function getBookProgress(bookId: string, readChapters: Set<string>): { read: number; total: number } {
  const info = BOOK_LABELS[bookId]
  if (!info) return { read: 0, total: 1 }
  let read = 0
  for (let c = 1; c <= info.chapters; c++) {
    if (readChapters.has(`${bookId}-${c}`)) read++
  }
  return { read, total: info.chapters }
}

export default function ProfilePage() {
  const [favCount, setFavCount] = useState(0)
  const [prayerCount, setPrayerCount] = useState(0)
  const [readMinutes, setReadMinutes] = useState(0)
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set())
  const [recentBooks, setRecentBooks] = useState<string[]>([])
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavCount(favs.length)
    setPrayerCount(parseInt(localStorage.getItem('prayer-opens') || '0', 10))
    setReadMinutes(parseInt(localStorage.getItem('read-minutes') || '0', 10))

    const raw: string[] = JSON.parse(localStorage.getItem('read-chapters') || '[]')
    setReadChapters(new Set(raw))

    const books: string[] = []
    const seen = new Set<string>()
    raw.forEach((key: string) => {
      const parts = key.split('-')
      const book = parts.slice(0, -1).join('-')
      if (!seen.has(book) && BOOK_LABELS[book]) { seen.add(book); books.push(book) }
    })
    setRecentBooks(books.slice(0, 2))
  }, [])

  const clearCache = () => {
    localStorage.removeItem('read-chapters')
    localStorage.removeItem('read-minutes')
    setReadChapters(new Set()); setReadMinutes(0)
    setCleared(true); setTimeout(() => setCleared(false), 2000)
  }

  const booksToShow = recentBooks.length > 0 ? recentBooks : ['lucas', 'isaias']

  return (
    <div className="min-h-screen bg-[#111] pb-28">

      {/* Header */}
      <div className="px-4 pt-12 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">Bíblia Sagrada</h1>
          <p className="text-white/40 text-sm">Reformada</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center">
          <BookOpen size={22} className="text-white/50" />
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* Tempo conectado */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm mb-3">Tempo conectado com Deus</p>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3a2a8a] flex items-center justify-center">
                  <span className="text-xl">🙏</span>
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-none">{prayerCount}</p>
                  <p className="text-white/40 text-xs mt-0.5">Orações</p>
                </div>
              </div>
              <div className="w-px h-10 bg-[#333]" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a3a10] flex items-center justify-center">
                  <span className="text-xl">📖</span>
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-none">{readMinutes}<span className="text-xs font-normal text-white/40 ml-1">min</span></p>
                  <p className="text-white/40 text-xs mt-0.5">Leitura</p>
                </div>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/20 ml-2 shrink-0" />
        </div>

        {/* Marcas */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <h2 className="text-white font-semibold text-base mb-3">Marcas</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Destaques', emoji: '✏️', href: '/favorites' },
              { label: 'Notas', emoji: '📝', href: '/favorites' },
              { label: 'Marcadores', emoji: '🔖', href: '/favorites' },
              { label: 'Favoritos', emoji: '💙', href: '/favorites' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-2.5 bg-[#111] rounded-xl p-3 active:bg-[#252525] transition-colors">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-white/80 text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-base">Progresso</h2>
            <Link href="/bible" className="text-white/30">
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {booksToShow.map(bookId => {
              const info = BOOK_LABELS[bookId] || { name: bookId, chapters: 1 }
              const { read, total } = getBookProgress(bookId, readChapters)
              return (
                <Link key={bookId} href={`/bible/${bookId}/1`}
                  className="bg-[#111] rounded-xl p-3 block active:bg-[#252525] transition-colors">
                  <p className="text-white font-semibold text-sm mb-2">{info.name}</p>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-1.5 mb-1.5">
                    <div className="bg-[#4ade80] h-1.5 rounded-full transition-all"
                      style={{ width: `${total > 0 ? Math.max(2, (read / total) * 100) : 2}%` }} />
                  </div>
                  <p className="text-white/40 text-xs">{read}/{total} capítulos</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Favoritos quick count */}
        <Link href="/favorites"
          className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-3 active:bg-[#252525] transition-colors">
          <span className="text-2xl">⭐</span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Meus Favoritos</p>
            <p className="text-white/40 text-xs">{favCount} versículo{favCount !== 1 ? 's' : ''} salvo{favCount !== 1 ? 's' : ''}</p>
          </div>
          <ChevronRight size={18} className="text-white/30" />
        </Link>

        {/* Mais Recursos */}
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
          <h2 className="text-white font-semibold text-base px-4 pt-4 pb-2">Mais Recursos</h2>

          {[
            { icon: <Bell size={18} className="text-white/50" />, label: 'Notificações' },
            { icon: <RefreshCw size={18} className="text-white/50" />, label: 'Sincronizar dados' },
            { icon: <Settings size={18} className="text-white/50" />, label: 'Definições' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3.5 border-t border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-white/70 text-sm">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </div>
          ))}

          <button onClick={clearCache}
            className="flex items-center gap-3 w-full px-4 py-3.5 border-t border-[#2a2a2a] active:bg-[#2a2a2a] transition-colors">
            <Trash2 size={18} className="text-white/50" />
            <span className="text-white/70 text-sm">{cleared ? '✓ Cache limpo' : 'Limpar Cache'}</span>
          </button>
        </div>

      </div>

      <Navigation />
    </div>
  )
}
