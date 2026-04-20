'use client'
import { useEffect, useState } from 'react'
import FireParticles from './FireParticles'

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'ark' | 'light' | 'text' | 'done'>('ark')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('light'), 1600)
    const t2 = setTimeout(() => setPhase('text'), 3000)
    const t3 = setTimeout(() => { setPhase('done'); onComplete() }, 5200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian transition-opacity duration-700 ${
        phase === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        phase !== 'ark' ? 'opacity-100' : 'opacity-0'
      }`}
        style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(201,168,76,0.15) 0%, transparent 70%)' }}
      />

      {/* Fire particles */}
      {phase !== 'ark' && (
        <FireParticles count={24} className="absolute bottom-0 left-0 right-0 h-80 opacity-60" />
      )}

      {/* Ark icon */}
      <div className={`relative transition-all duration-700 ${
        phase === 'ark' ? 'scale-100 opacity-100' : 'scale-110 opacity-80'
      }`}>
        {/* Cherubim wings (SVG arc representation) */}
        <svg width="160" height="120" viewBox="0 0 160 120" className={`transition-all duration-700 ${
          phase !== 'ark' ? 'filter drop-shadow-[0_0_20px_rgba(201,168,76,0.8)]' : ''
        }`}>
          {/* Ark base */}
          <rect x="20" y="70" width="120" height="35" rx="4" fill="none" stroke="#c9a84c" strokeWidth="2" />
          <rect x="28" y="78" width="104" height="19" rx="2" fill="rgba(201,168,76,0.1)" stroke="#c9a84c" strokeWidth="1" strokeDasharray="4 2" />
          {/* Mercy seat top */}
          <rect x="15" y="62" width="130" height="12" rx="3" fill="none" stroke="#f0c040" strokeWidth="2.5" />
          {/* Left cherub wing */}
          <path d="M 75 62 Q 40 30 20 45 Q 35 20 70 40 Z" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.5" />
          <path d="M 75 62 Q 30 50 15 38" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 2" />
          {/* Right cherub wing */}
          <path d="M 85 62 Q 120 30 140 45 Q 125 20 90 40 Z" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.5" />
          <path d="M 85 62 Q 130 50 145 38" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 2" />
          {/* Shekinah glow center */}
          {phase !== 'ark' && (
            <ellipse cx="80" cy="55" rx="12" ry="10" fill="rgba(255,215,0,0.3)" className="animate-pulse" />
          )}
          {/* Carrying poles */}
          <line x1="35" y1="105" x2="35" y2="120" stroke="#c9a84c" strokeWidth="3" />
          <line x1="125" y1="105" x2="125" y2="120" stroke="#c9a84c" strokeWidth="3" />
        </svg>

        {/* Glow ring */}
        <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
          phase !== 'ark' ? 'animate-ark-glow opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Text */}
      <div className={`mt-8 text-center transition-all duration-700 ${
        phase === 'text' || phase === 'done' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="title-cinzel text-gold-light text-xl tracking-[0.3em] font-bold">
          BÍBLIA SAGRADA
        </h1>
        <p className="title-display text-parchment/60 text-sm mt-1 tracking-[0.15em] italic">
          Estudo Reformado
        </p>
        <div className="mt-3 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <p className="text-parchment/40 text-xs mt-3 tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
          Soli Deo Gloria
        </p>
      </div>
    </div>
  )
}
