'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import GoldDivider from '@/components/GoldDivider'
import { BIBLE_BOOKS, AT_CATEGORIES, NT_CATEGORIES, getBooksByCategory } from '@/data/bible-structure'

export default function BiblePage() {
  const [tab, setTab] = useState<'AT' | 'NT'>('AT')
  const [search, setSearch] = useState('')
  const categories = tab === 'AT' ? AT_CATEGORIES : NT_CATEGORIES

  const filtered = search
    ? BIBLE_BOOKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.abbr.toLowerCase().includes(search.toLowerCase()))
    : null

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="pt-12 px-4 pb-4">
        <h1 className="title-cinzel text-gold text-xl tracking-wider mb-1">BÍBLIA SAGRADA</h1>
        <p className="text-parchment/40 text-xs italic">Almeida — Domínio Público</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 parchment-card rounded-xl px-3 py-2.5">
          <Search size={16} className="text-gold/60 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar livro..."
            className="bg-transparent flex-1 text-parchment text-sm outline-none placeholder:text-parchment/30"
            style={{ fontFamily: 'Cinzel, serif' }}
          />
        </div>
      </div>

      {/* Search results */}
      {filtered ? (
        <div className="px-4 space-y-2">
          {filtered.map(book => (
            <Link key={book.id} href={`/bible/${book.id}/1`}
              className="flex items-center justify-between parchment-card p-3 rounded-xl active:scale-[0.98] transition-transform">
              <div>
                <span className="text-gold text-xs mr-2" style={{ fontFamily: 'Cinzel, serif' }}>{book.abbr}</span>
                <span className="text-parchment text-sm">{book.name}</span>
                <p className="text-parchment/40 text-xs mt-0.5">{book.category}</p>
              </div>
              <ChevronRight size={16} className="text-gold/40" />
            </Link>
          ))}
        </div>
      ) : (
        <>
          {/* Testament Tabs */}
          <div className="px-4 mb-4">
            <div className="flex parchment-card rounded-xl p-1 gap-1">
              {(['AT', 'NT'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-xs tracking-widest uppercase transition-all duration-200 ${
                    tab === t
                      ? 'bg-gold/20 text-gold-light shadow-[0_0_8px_rgba(201,168,76,0.3)]'
                      : 'text-parchment/50'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {t === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}
                </button>
              ))}
            </div>
          </div>

          {/* Books by Category */}
          <div className="px-4 space-y-1">
            {categories.map((cat, ci) => {
              const books = getBooksByCategory(cat).filter(b => b.testament === tab)
              return (
                <div key={cat}>
                  <GoldDivider label={cat} />
                  <div className="grid grid-cols-2 gap-2">
                    {books.map(book => (
                      <Link
                        key={book.id}
                        href={`/bible/${book.id}/1`}
                        className="parchment-card p-3 rounded-xl active:scale-95 transition-transform group"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-gold text-[10px] font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                            {book.abbr}
                          </span>
                          <span className="text-parchment/30 text-[10px]">{book.chapters}cap</span>
                        </div>
                        <p className="text-parchment text-sm leading-tight">{book.name}</p>
                        <p className="text-parchment/30 text-[10px] mt-1 leading-tight line-clamp-2">{book.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <Navigation />
    </div>
  )
}
