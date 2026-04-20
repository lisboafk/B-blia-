'use client'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="fixed top-3 right-4 z-50 p-2 rounded-xl bg-obsidian-light border border-gold/25 active:scale-90 transition-transform"
      title={theme === 'dark' ? 'Modo Pergaminho' : 'Modo Escuro'}
    >
      {theme === 'dark'
        ? <Sun size={16} className="text-gold/70" />
        : <Moon size={16} className="text-gold/70" />
      }
    </button>
  )
}
