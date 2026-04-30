'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Moon, Sun, BookOpen, Bell, Trash2, Settings, RefreshCw } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useTheme } from '@/components/ThemeProvider'

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
  const { theme, toggle } = useTheme()
  const [favCount, setFavCount] = useState(0)
  const [prayerCount, setPrayerCount] = useState(0)
  const [readMinutes, setReadMinutes] = useState(0)
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set())
  const [recentBooks, setRecentBooks] = useState<string[]>([])
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavCount(favs.length)
    const prayers = parseInt(localStorage.getItem('prayer-opens') || '0', 10)
    setPrayerCount(prayers)
    const mins = parseInt(localStorage.getItem('read-minutes') || '0', 10)
    setReadMinutes(mins)

    const raw = JSON.parse(localStorage.getItem('read-chapters') || '[]')
    const set = new Set<string>(raw)
    setReadChapters(set)

    // Deduce recent books from read-chapters keys
    const books: string[] = []
    const seen = new Set<string>()
    raw.forEach((key: string) => {
      const book = key.split('-').slice(0, -1).join('-')
      if (!seen.has(book) && BOOK_LABELS[book]) { seen.add(book); books.push(book) }
    })
    setRecentBooks(books.slice(0, 4))
  }, [])

  const clearCache = () => {
    localStorage.removeItem('read-chapters')
    localStorage.removeItem('read-minutes')
    setReadChapters(new Set())
    setReadMinutes(0)
    setCleared(true)
    setTimeout(() => setCleared(false), 2000)
  }

  const booksToShow = recentBooks.length > 0
    ? recentBooks
    : ['lucas', 'isaias']

  return (
    <div className="min-h-screen bg-[#111] pb-28">

      {/* Header */}
      <div className="px-4 pt-12 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">Por favor, conecte-se</h1>
          <p className="text-parchment/40 text-sm">Bem vindo à Bíblia Sagrada</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center">
          <BookOpen size={22} className="text-parchment/60" />
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* Tempo conectado */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm mb-3">Tempo conectado com Deus</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3a2a8a] flex items-center justify-center">
                  <span className="text-xl">🙏</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{prayerCount}</p>
                  <p className="text-parchment/40 text-xs">Orações</p>
                </div>
              </div>
              <div className="w-px h-10 bg-[#333]" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7a3a10] flex items-center justify-center">
                  <span className="text-xl">📖</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{readMinutes}<span className="text-xs font-normal text-parchment/40 ml-1">mins</span></p>
                  <p className="text-parchment/40 text-xs">Tempo</p>
                </div>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-parchment/30 ml-2" />
        </div>

        {/* Achievement */}
        <div className="bg-[#1a1a00] border border-[#c9a84c]/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center">
              <span className="text-xl">✝️</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#1a1a00]" />
          </div>
          <p className="text-[#c9a84c] font-semibold text-sm">Realização pela Fé</p>
        </div>

        {/* Marcas */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <h2 className="text-white font-semibold text-base mb-3">Marcas</h2>
          <div className="grid grid-cols-2 gap-px bg-[#2a2a2a] rounded-xl overflow-hidden">
            {[
              { label: 'Destaques', emoji: '✏️', color: '#3a2a00', href: '/favorites' },
              { label: 'Notas', emoji: '📝', color: '#002a10', href: '/favorites' },
              { label: 'Marcadores', emoji: '🔖', color: '#001a3a', href: '/favorites' },
              { label: 'Favoritos', emoji: '💙', color: '#00102a', href: '/favorites' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-2.5 p-3.5 bg-[#1a1a1a] active:bg-[#2a2a2a] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.color }}>
                  <span className="text-base">{item.emoji}</span>
                </div>
                <span className="text-parchment/80 text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-base">Progresso</h2>
            <ChevronRight size={18} className="text-parchment/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {booksToShow.slice(0, 2).map(bookId => {
              const info = BOOK_LABELS[bookId] || { name: bookId, chapters: 1 }
              const { read, total } = getBookProgress(bookId, readChapters)
              return (
                <Link key={bookId} href={`/bible/${bookId}/1`}
                  className="bg-[#111] rounded-xl p-3 block">
                  <p className="text-white font-semibold text-sm mb-2">{info.name}</p>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-1 mb-1">
                    <div className="bg-[#4ade80] h-1 rounded-full transition-all"
                      style={{ width: `${total > 0 ? (read / total) * 100 : 0}%` }} />
                  </div>
                  <p className="text-parchment/40 text-xs">{read}/{total}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mais Recursos */}
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
          <h2 className="text-white font-semibold text-base px-4 pt-4 pb-2">Mais Recursos</h2>

          {/* Dark mode toggle */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-parchment/50" />
              <span className="text-parchment/80 text-sm">Modo Escuro</span>
            </div>
            <button onClick={toggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-[#4ade80]' : 'bg-[#3a3a3a]'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {[
            { icon: <Bell size={18} className="text-parchment/50" />, label: 'Versículo', arrow: true },
            { icon: <RefreshCw size={18} className="text-parchment/50" />, label: 'Sincronizar dados', arrow: true },
            { icon: <Settings size={18} className="text-parchment/50" />, label: 'Definições', arrow: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-parchment/80 text-sm">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-parchment/30" />
            </div>
          ))}

          <button onClick={clearCache}
            className="flex items-center gap-3 w-full px-4 py-3 active:bg-[#2a2a2a] transition-colors">
            <Trash2 size={18} className="text-parchment/50" />
            <span className="text-parchment/80 text-sm">{cleared ? 'Cache limpo!' : 'Limpar Cache'}</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xl">⭐</span>
            <span className="text-parchment/80 text-sm">Favoritos</span>
            <span className="ml-auto text-parchment/40 text-sm">{favCount}</span>
          </div>
        </div>

      </div>

      <Navigation />
    </div>
  )
}
