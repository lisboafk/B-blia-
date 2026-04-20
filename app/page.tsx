'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Flame, Star, Clock } from 'lucide-react'
import SplashScreen from '@/components/SplashScreen'
import Navigation from '@/components/Navigation'
import GoldDivider from '@/components/GoldDivider'
import FireParticles from '@/components/FireParticles'
import { getTodayVerse } from '@/data/key-verses'
import { getTodayDevotional } from '@/data/daily-devotionals'
import { HIGHLIGHTED_PASSAGES } from '@/data/key-verses'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [visible, setVisible] = useState(false)
  const todayVerse = getTodayVerse()
  const devotional = getTodayDevotional()

  useEffect(() => {
    const seen = sessionStorage.getItem('splash-shown')
    if (seen) { setShowSplash(false); setVisible(true) }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('splash-shown', '1')
    setShowSplash(false)
    setTimeout(() => setVisible(true), 100)
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <div className={`min-h-screen pb-28 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header with fire */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.2) 0%, transparent 70%)' }} />
          <FireParticles count={14} className="absolute bottom-0 left-0 right-0 h-full opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            <p className="text-gold/60 text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
              Soli Deo Gloria
            </p>
            <h1 className="text-shimmer text-2xl font-bold title-cinzel tracking-wider">
              PALAVRA VIVA
            </h1>
            <div className="h-px w-24 mt-2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>
        </div>

        <div className="px-4 space-y-4 -mt-4">
          {/* Daily Verse Card */}
          <div className="parchment-card sacred-glow p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-fire animate-flame" />
              <span className="text-gold text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Versículo do Dia
              </span>
            </div>
            <p className="verse-text text-parchment leading-relaxed mb-3">
              "{todayVerse.text}"
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gold text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                {todayVerse.reference}
              </span>
              <span className="text-parchment/40 text-xs bg-gold/10 px-2 py-0.5 rounded-full">
                {todayVerse.theme}
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/bible" className="parchment-card p-4 rounded-xl flex items-center gap-3 active:scale-95 transition-transform">
              <div className="p-2 bg-gold/15 rounded-lg">
                <BookOpen size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-parchment text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>Bíblia</p>
                <p className="text-parchment/40 text-[11px]">66 livros</p>
              </div>
            </Link>
            <Link href="/study" className="parchment-card p-4 rounded-xl flex items-center gap-3 active:scale-95 transition-transform">
              <div className="p-2 bg-fire/15 rounded-lg">
                <Flame size={20} className="text-fire" />
              </div>
              <div>
                <p className="text-parchment text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>Estudo</p>
                <p className="text-parchment/40 text-[11px]">Reformado</p>
              </div>
            </Link>
          </div>

          {/* Daily Devotional */}
          <div className="parchment-card rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gold/20 to-transparent px-4 py-3 flex items-center gap-2">
              <Clock size={14} className="text-gold" />
              <span className="text-gold text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Devocional de {devotional.day}
              </span>
            </div>
            <div className="px-4 py-3">
              <h3 className="title-display text-parchment text-lg mb-1">{devotional.title}</h3>
              <p className="text-gold text-xs mb-2" style={{ fontFamily: 'Cinzel, serif' }}>{devotional.reference}</p>
              <p className="text-parchment/70 text-sm leading-relaxed line-clamp-3">{devotional.reflection}</p>
              <Link href={`/bible/${devotional.book}/${devotional.chapter}`}
                className="flex items-center gap-1 mt-3 text-gold text-xs"
                style={{ fontFamily: 'Cinzel, serif' }}>
                Ler passagem <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          <GoldDivider label="Passagens Destacadas" />

          {/* Highlighted Passages */}
          <div className="space-y-2">
            {HIGHLIGHTED_PASSAGES.slice(0, 6).map((p) => (
              <Link
                key={p.reference}
                href={`/bible/${p.book}/${p.chapter}`}
                className="flex items-center justify-between p-3 parchment-card rounded-xl active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <Star size={14} className="text-gold/60 flex-shrink-0" />
                  <div>
                    <p className="text-parchment text-sm" style={{ fontFamily: 'Cinzel, serif' }}>{p.label}</p>
                    <p className="text-parchment/40 text-xs">{p.reference}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gold/40" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Navigation />
    </>
  )
}
