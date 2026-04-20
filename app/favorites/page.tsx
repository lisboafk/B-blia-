'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Trash2, ChevronRight, BookOpen } from 'lucide-react'
import Navigation from '@/components/Navigation'
import GoldDivider from '@/components/GoldDivider'

interface FavoriteVerse {
  book: string; chapter: number; verse: number; text: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) setFavorites(JSON.parse(stored))
  }, [])

  const remove = (idx: number) => {
    const next = favorites.filter((_, i) => i !== idx)
    setFavorites(next)
    localStorage.setItem('favorites', JSON.stringify(next))
  }

  const BOOK_NAMES: Record<string, string> = {
    genesis: 'Gênesis', joao: 'João', romanos: 'Romanos', salmos: 'Salmos',
    efesios: 'Efésios', hebreus: 'Hebreus', apocalipse: 'Apocalipse',
    mateus: 'Mateus', lucas: 'Lucas', marcos: 'Marcos', atos: 'Atos',
    galatas: 'Gálatas', filipenses: 'Filipenses', colossenses: 'Colossenses',
    isaias: 'Isaías', jeremias: 'Jeremias', daniel: 'Daniel',
  }
  const bookName = (id: string) => BOOK_NAMES[id] || id

  return (
    <div className="min-h-screen pb-28">
      <div className="pt-12 px-4 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={18} className="text-fire" />
          <h1 className="title-cinzel text-gold text-xl tracking-wider">FAVORITOS</h1>
        </div>
        <p className="text-parchment/40 text-xs italic">Versículos que marcaram sua alma</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <Heart size={48} className="text-gold/20 mb-4" />
          <h2 className="title-display text-parchment/40 text-lg mb-2">Nenhum favorito ainda</h2>
          <p className="text-parchment/30 text-sm leading-relaxed mb-6">
            Ao ler um capítulo, pressione o versículo e toque no ❤ para salvá-lo aqui.
          </p>
          <Link href="/bible"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold/30 text-gold text-sm"
            style={{ fontFamily: 'Cinzel, serif' }}>
            <BookOpen size={14} /> Abrir a Bíblia
          </Link>
        </div>
      ) : (
        <div className="px-4">
          <GoldDivider label={`${favorites.length} versículo${favorites.length > 1 ? 's' : ''}`} />
          <div className="space-y-3">
            {favorites.map((fav, idx) => (
              <div key={idx} className="parchment-card rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-gold/10 to-transparent">
                  <Link href={`/bible/${fav.book}/${fav.chapter}`}
                    className="flex items-center gap-1.5 text-gold text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
                    <BookOpen size={11} />
                    {bookName(fav.book)} {fav.chapter}:{fav.verse}
                    <ChevronRight size={11} />
                  </Link>
                  <button onClick={() => remove(idx)} className="p-1 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} className="text-parchment/30 hover:text-red-400" />
                  </button>
                </div>
                <div className="px-3 py-3">
                  <p className="verse-text text-sm leading-relaxed">
                    <span className="verse-number">{fav.verse}</span>
                    {fav.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Navigation />
    </div>
  )
}
