'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, BookOpen, Heart, Star, ChevronRight, Flame } from 'lucide-react'
import Navigation from '@/components/Navigation'
import GoldDivider from '@/components/GoldDivider'
import { DEVOTIONALS } from '@/data/daily-devotionals'

const SOLAS = [
  { label: 'Sola Scriptura', desc: 'Somente a Escritura' },
  { label: 'Sola Fide', desc: 'Somente pela Fé' },
  { label: 'Sola Gratia', desc: 'Somente pela Graça' },
  { label: 'Solus Christus', desc: 'Somente Cristo' },
  { label: 'Soli Deo Gloria', desc: 'Somente a Glória a Deus' },
]

export default function ProfilePage() {
  const [favCount, setFavCount] = useState(0)
  const [prayer, setPrayer] = useState('')
  const todayDev = DEVOTIONALS[new Date().getDay()]

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavCount(favs.length)
    const saved = localStorage.getItem('prayer-note')
    if (saved) setPrayer(saved)
  }, [])

  const savePrayer = (val: string) => {
    setPrayer(val)
    localStorage.setItem('prayer-note', val)
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Header with avatar */}
      <div className="pt-12 px-4 pb-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-fire/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-3 sacred-glow">
          <User size={32} className="text-gold" />
        </div>
        <h1 className="title-cinzel text-gold text-lg tracking-wider">MEU PERFIL</h1>
        <p className="text-parchment/40 text-xs italic mt-1">Discípulo da Palavra</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="parchment-card p-4 rounded-xl text-center">
            <Heart size={20} className="text-fire mx-auto mb-1" />
            <p className="text-gold text-2xl font-bold title-cinzel">{favCount}</p>
            <p className="text-parchment/40 text-xs">Favoritos</p>
          </div>
          <div className="parchment-card p-4 rounded-xl text-center">
            <Flame size={20} className="text-fire mx-auto mb-1 animate-flame" />
            <p className="text-gold text-2xl font-bold title-cinzel">7</p>
            <p className="text-parchment/40 text-xs">Dias de leitura</p>
          </div>
        </div>

        {/* Today's Devotional Summary */}
        <div className="parchment-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 bg-gradient-to-r from-fire/15 to-transparent px-4 py-2.5">
            <Flame size={12} className="text-fire" />
            <span className="text-fire text-[11px] tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Devocional de Hoje
            </span>
          </div>
          <div className="px-4 py-3">
            <h3 className="title-display text-parchment text-base mb-0.5">{todayDev.title}</h3>
            <p className="text-gold text-xs mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{todayDev.reference}</p>
            <p className="text-parchment/60 text-sm leading-relaxed line-clamp-2">{todayDev.reflection}</p>
            <Link href={`/bible/${todayDev.book}/${todayDev.chapter}`}
              className="flex items-center gap-1 mt-2 text-gold text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
              Ler passagem <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* Prayer Note */}
        <div className="parchment-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-gold" />
            <span className="text-gold text-xs tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Caderno de Oração
            </span>
          </div>
          <textarea
            value={prayer}
            onChange={e => savePrayer(e.target.value)}
            placeholder="Escreva suas orações e intenções..."
            className="w-full bg-obsidian/50 rounded-lg p-3 text-parchment/80 text-sm leading-relaxed outline-none border border-gold/15 focus:border-gold/40 transition-colors resize-none placeholder:text-parchment/20"
            rows={4}
            style={{ fontFamily: 'Crimson Text, serif' }}
          />
        </div>

        <GoldDivider label="As 5 Solas da Reforma" />

        {/* 5 Solas */}
        <div className="space-y-2">
          {SOLAS.map(s => (
            <div key={s.label} className="flex items-center justify-between parchment-card p-3 rounded-xl">
              <div>
                <p className="text-gold text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>{s.label}</p>
                <p className="text-parchment/40 text-xs italic">{s.desc}</p>
              </div>
              <BookOpen size={14} className="text-gold/30" />
            </div>
          ))}
        </div>

        {/* Quick links */}
        <GoldDivider />
        <Link href="/favorites"
          className="flex items-center justify-between parchment-card p-3 rounded-xl active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-fire" />
            <span className="text-parchment text-sm" style={{ fontFamily: 'Cinzel, serif' }}>Meus Favoritos</span>
          </div>
          <ChevronRight size={16} className="text-gold/40" />
        </Link>
      </div>

      <Navigation />
    </div>
  )
}
