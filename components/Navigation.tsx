'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Search, Heart, User, Home } from 'lucide-react'

const TABS = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/bible', icon: BookOpen, label: 'Bíblia' },
  { href: '/study', icon: Search, label: 'Estudar' },
  { href: '/favorites', icon: Heart, label: 'Favoritos' },
  { href: '/profile', icon: User, label: 'Perfil' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bottom-nav">
      <div className="mx-3 mb-3 rounded-2xl border border-gold/20 bg-obsidian/95 backdrop-blur-xl overflow-hidden">
        {/* Gold top line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="flex items-center justify-around px-2 py-2">
          {TABS.map(({ href, icon: Icon, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 group"
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-gold/20 shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                    : 'group-active:bg-gold/10'
                }`}>
                  <Icon
                    size={20}
                    className={`transition-colors duration-200 ${
                      active ? 'text-gold-light' : 'text-parchment/50'
                    }`}
                    strokeWidth={active ? 2 : 1.5}
                  />
                </div>
                <span className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  active ? 'text-gold' : 'text-parchment/40'
                }`} style={{ fontFamily: 'Cinzel, serif' }}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
