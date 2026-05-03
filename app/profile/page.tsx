'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { ChevronRight, BookOpen, Bell, Trash2, Settings, RefreshCw, Shield } from 'lucide-react'
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

function LoginScreen() {
  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center px-8 text-center pb-28">
      <div className="w-24 h-24 rounded-3xl bg-[#c9a84c]/15 flex items-center justify-center mx-auto mb-6">
        <span className="text-5xl">✝️</span>
      </div>
      <h1 className="text-white font-bold text-2xl mb-2">Bíblia Sagrada</h1>
      <p className="text-white/40 text-sm max-w-xs mb-10">
        Entre com sua conta Google para salvar seu progresso e favoritos.
      </p>
      <button
        onClick={() => signIn('google', { callbackUrl: '/profile' })}
        className="flex items-center gap-3 bg-white text-[#111] font-semibold px-6 py-4 rounded-2xl text-sm active:scale-95 transition-transform w-full max-w-xs justify-center mb-5"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Entrar com Google
      </button>
      <Link href="/" className="text-white/30 text-sm">Continuar sem login</Link>
      <Navigation />
    </div>
  )
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin === true

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <RefreshCw size={24} className="text-[#c9a84c] animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <LoginScreen />
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

        {/* Admin button — visible only for admin */}
        {isAdmin && (
          <Link href="/admin"
            className="flex items-center gap-3 bg-[#c9a84c]/10 border border-[#c9a84c]/40 rounded-2xl p-4 active:bg-[#c9a84c]/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-[#c9a84c]" />
            </div>
            <div className="flex-1">
              <p className="text-[#c9a84c] font-semibold text-sm">Painel Admin</p>
              <p className="text-white/40 text-xs">Gerar conteúdo com IA</p>
            </div>
            <ChevronRight size={18} className="text-[#c9a84c]/50" />
          </Link>
        )}

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
