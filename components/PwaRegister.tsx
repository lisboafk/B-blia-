'use client'
import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      const dismissed = localStorage.getItem('pwa-dismissed')
      if (!dismissed) setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!installPrompt) return
    const prompt = installPrompt as BeforeInstallPromptEvent
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
  }

  const dismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  if (!showBanner) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-4 z-[200]">
      <div className="rounded-2xl bg-obsidian-light border border-gold/40 overflow-hidden shadow-2xl">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="p-2 rounded-xl bg-gold/15 flex-shrink-0">
            <Download size={18} className="text-gold" />
          </div>
          <div className="flex-1">
            <p className="text-parchment text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
              Instalar o App
            </p>
            <p className="text-parchment/50 text-xs">Adicionar à tela inicial — funciona offline</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-xl bg-gold text-obsidian text-xs font-bold active:scale-95 transition-transform"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Instalar
            </button>
            <button onClick={dismiss} className="p-1 text-parchment/40 hover:text-parchment/70">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
