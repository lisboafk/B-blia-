'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, HelpCircle, User } from 'lucide-react'

function CalendarIcon({ day, active }: { day: number; active: boolean }) {
  return (
    <div className={`relative w-6 h-6 rounded-md border-2 flex flex-col overflow-hidden transition-colors ${
      active ? 'border-[#4ade80] bg-[#4ade80]/10' : 'border-parchment/30 bg-transparent'
    }`}>
      <div className={`h-1.5 w-full ${active ? 'bg-[#4ade80]' : 'bg-parchment/30'}`} />
      <div className="flex-1 flex items-center justify-center">
        <span className={`text-[9px] font-bold leading-none ${active ? 'text-[#4ade80]' : 'text-parchment/50'}`}>
          {day}
        </span>
      </div>
    </div>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const day = new Date().getDate()

  const TABS = [
    { href: '/', label: 'Hoje', icon: null },
    { href: '/bible', label: 'Bíblia', icon: BookOpen },
    { href: '/quiz', label: 'Questionário', icon: HelpCircle },
    { href: '/profile', label: 'Eu', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="bg-[#111] border-t border-white/8 flex items-center justify-around px-2 py-2 pb-safe">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              {href === '/'
                ? <CalendarIcon day={day} active={active} />
                : Icon
                  ? <Icon
                      size={22}
                      className={`transition-colors ${active ? 'text-[#4ade80]' : 'text-parchment/40'}`}
                      strokeWidth={active ? 2 : 1.5}
                    />
                  : null
              }
              <span className={`text-[10px] transition-colors ${active ? 'text-[#4ade80]' : 'text-parchment/40'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
