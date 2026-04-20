'use client'
import { useEffect, useState } from 'react'
import { Download, X, Share, Plus } from 'lucide-react'

type Platform = 'android' | 'ios' | 'other'

function getPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

export default function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [platform, setPlatform] = useState<Platform>('other')

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    if (isInStandaloneMode()) return // already installed
    if (localStorage.getItem('pwa-dismissed')) return

    const p = getPlatform()
    setPlatform(p)

    if (p === 'ios') {
      setTimeout(() => setShowBanner(true), 3000)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (platform === 'ios') { setShowIosGuide(true); setShowBanner(false); return }
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
  }

  const dismiss = () => {
    setShowBanner(false)
    setShowIosGuide(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  return (
    <>
      {/* Install banner */}
      {showBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-4 z-[200] animate-slide-up">
          <div className="rounded-2xl bg-obsidian-light border border-gold/40 shadow-2xl overflow-hidden">
            <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="p-2 rounded-xl bg-gold/15 flex-shrink-0">
                <Download size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-parchment text-sm font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                  Instalar na Tela Inicial
                </p>
                <p className="text-parchment/50 text-xs truncate">
                  {platform === 'ios' ? 'Toque em Compartilhar → Adicionar' : 'Acesse offline como app nativo'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={install}
                  className="px-3 py-1.5 rounded-xl bg-gold text-obsidian text-xs font-bold active:scale-95 transition-transform"
                  style={{ fontFamily: 'Cinzel, serif' }}>
                  Instalar
                </button>
                <button onClick={dismiss} className="p-1 text-parchment/40">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS guide */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[200] flex items-end modal-backdrop" onClick={dismiss}>
          <div className="w-full max-w-[430px] mx-auto rounded-t-3xl bg-obsidian-light border-t border-x border-gold/30 pb-10"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gold/30" />
            </div>
            <div className="px-6 py-4">
              <h3 className="text-gold text-base font-bold mb-4 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                Instalar no iPhone / iPad
              </h3>
              <div className="space-y-4">
                {[
                  { icon: <Share size={20} className="text-gold" />, text: 'Toque no botão Compartilhar (□↑) na barra do Safari' },
                  { icon: <Plus size={20} className="text-gold" />, text: 'Selecione "Adicionar à Tela de Início"' },
                  { icon: <Download size={20} className="text-gold" />, text: 'Toque em "Adicionar" — pronto!' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 parchment-card p-3 rounded-xl">
                    <div className="p-1.5 bg-gold/10 rounded-lg flex-shrink-0">{s.icon}</div>
                    <p className="text-parchment/80 text-sm leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
              <button onClick={dismiss}
                className="w-full mt-5 py-3 rounded-xl border border-gold/30 text-gold text-sm"
                style={{ fontFamily: 'Cinzel, serif' }}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
