'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Sparkles, BookOpen, Sun, Moon, Trash2, Plus, ChevronLeft, Check, RefreshCw, LogOut } from 'lucide-react'

interface GeneratedItem {
  id: string
  type: 'devotional' | 'verse' | 'prayer'
  data: Record<string, unknown>
  generatedAt: string
}

type ContentType = 'devotional' | 'verse' | 'prayer'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin === true

  const [type, setType] = useState<ContentType>('devotional')
  const [theme, setTheme] = useState('')
  const [period, setPeriod] = useState<'manha' | 'noite'>('manha')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null)
  const [saved, setSaved] = useState<GeneratedItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('admin-content')
    if (raw) { try { setSaved(JSON.parse(raw)) } catch {} }
  }, [])

  const generate = async () => {
    setLoading(true); setError(''); setPreview(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, theme: theme.trim() || undefined, period })
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Erro desconhecido'); return }
      setPreview(json.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  const approve = () => {
    if (!preview) return
    const item: GeneratedItem = {
      id: String(preview.id || Date.now()),
      type,
      data: preview,
      generatedAt: new Date().toISOString()
    }
    const next = [item, ...saved].slice(0, 50)
    setSaved(next)
    localStorage.setItem('admin-content', JSON.stringify(next))
    setPreview(null); setTheme('')
  }

  const remove = (id: string) => {
    const next = saved.filter(s => s.id !== id)
    setSaved(next)
    localStorage.setItem('admin-content', JSON.stringify(next))
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'admin-content.json'; a.click()
  }

  // Loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <RefreshCw size={24} className="text-[#c9a84c] animate-spin" />
      </div>
    )
  }

  // Not signed in
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#c9a84c]/15 flex items-center justify-center mb-6">
          <span className="text-4xl">✝️</span>
        </div>
        <h1 className="text-white font-bold text-2xl mb-2">Painel Admin</h1>
        <p className="text-white/40 text-sm mb-8 max-w-xs">
          Acesso exclusivo para administradores.<br />Entre com sua conta Google.
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="flex items-center gap-3 bg-white text-[#111] font-semibold px-6 py-3.5 rounded-2xl text-sm active:scale-95 transition-transform"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>
        <Link href="/" className="mt-6 text-white/30 text-sm">← Voltar ao app</Link>
      </div>
    )
  }

  // Signed in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-8 text-center">
        <span className="text-5xl mb-4">🚫</span>
        <h1 className="text-white font-bold text-xl mb-2">Acesso negado</h1>
        <p className="text-white/50 text-sm mb-6">
          Logado como <strong className="text-white">{session.user?.email}</strong><br/>
          Esta conta não tem permissão de administrador.
        </p>
        <button onClick={() => signOut({ callbackUrl: '/admin' })}
          className="flex items-center gap-2 text-red-400 border border-red-400/30 px-4 py-2.5 rounded-xl text-sm">
          <LogOut size={15} /> Sair
        </button>
        <Link href="/" className="mt-4 text-white/30 text-sm">← Voltar ao app</Link>
      </div>
    )
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-12">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5">
        <Link href="/profile"><ChevronLeft size={24} className="text-white/50" /></Link>
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg leading-none">Painel Admin</h1>
          <p className="text-white/40 text-xs mt-0.5">{session.user?.email}</p>
        </div>
        <button onClick={exportJSON}
          className="text-[#c9a84c] text-xs border border-[#c9a84c]/30 px-3 py-1.5 rounded-lg">
          Exportar
        </button>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="text-white/40 p-1.5">
          <LogOut size={18} />
        </button>
      </div>

      {/* Generator */}
      <div className="px-4 mb-5">
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-[#c9a84c]" />
            <h2 className="text-white font-semibold text-sm">Gerar com Gemini AI</h2>
          </div>

          {/* Type */}
          <div className="flex gap-2 mb-3">
            {(['devotional','verse','prayer'] as ContentType[]).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${type === t ? 'bg-[#c9a84c] text-[#111]' : 'bg-[#2a2a2a] text-white/50'}`}>
                {t === 'devotional' ? 'Devocional' : t === 'verse' ? 'Versículo' : 'Oração'}
              </button>
            ))}
          </div>

          {/* Period */}
          {type === 'prayer' && (
            <div className="flex gap-2 mb-3">
              {(['manha','noite'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs ${
                    period === p
                      ? p === 'manha' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-[#2a2a2a] text-white/40'
                  }`}>
                  {p === 'manha' ? <><Sun size={12}/> Manhã</> : <><Moon size={12}/> Noite</>}
                </button>
              ))}
            </div>
          )}

          <input value={theme} onChange={e => setTheme(e.target.value)}
            placeholder="Tema (ex: Graça Irresistível, Fé, Esperança…)"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-3 transition-colors"
          />

          <button onClick={generate} disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-[#111] flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
            style={{ background: 'linear-gradient(90deg,#c9a84c,#e8c870)' }}>
            {loading ? <RefreshCw size={15} className="animate-spin"/> : <Sparkles size={15}/>}
            {loading ? 'Gerando...' : 'Gerar conteúdo'}
          </button>

          {error && <p className="text-red-400 text-xs mt-3 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="px-4 mb-5">
          <div className="bg-[#1a1a00] border border-[#c9a84c]/40 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[#c9a84c] font-semibold text-sm">Prévia</p>
              <button onClick={() => setPreview(null)} className="text-white/30 text-xs">Descartar</button>
            </div>
            {type === 'devotional' && <>
              <p className="text-white font-bold mb-1">{String(preview.title || '')}</p>
              <p className="text-[#c9a84c] text-xs mb-2">{String(preview.reference || '')} · {String(preview.theme || '')}</p>
              <p className="text-white/60 text-sm italic mb-2 leading-relaxed">"{String(preview.verse || '')}"</p>
              <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{String(preview.content || '')}</p>
            </>}
            {type === 'verse' && <>
              <p className="text-[#c9a84c] font-bold text-sm mb-2">{String(preview.reference || '')}</p>
              <p className="text-white text-base italic leading-relaxed">"{String(preview.text || '')}"</p>
            </>}
            {type === 'prayer' && <>
              <p className="text-white font-bold text-sm mb-1">{String(preview.title || '')}</p>
              <p className="text-[#c9a84c] text-xs mb-2">{String(preview.reference || '')}</p>
              <p className="text-white/70 text-sm italic leading-relaxed">{String(preview.prayer || '')}</p>
            </>}
            <button onClick={approve}
              className="mt-4 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#4ade80]/15 border border-[#4ade80]/40 text-[#4ade80]">
              <Check size={15}/> Aprovar e salvar
            </button>
          </div>
        </div>
      )}

      {/* Saved list */}
      <div className="px-4">
        <p className="text-white/40 text-xs mb-3">Conteúdo salvo — {saved.length} itens</p>
        {saved.length === 0 && <p className="text-white/20 text-sm text-center py-8">Nenhum item ainda</p>}
        <div className="space-y-2">
          {saved.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                item.type === 'devotional' ? 'bg-[#c9a84c]/15' : item.type === 'verse' ? 'bg-blue-500/15' : 'bg-green-500/15'
              }`}>
                {item.type === 'devotional' ? <BookOpen size={13} className="text-[#c9a84c]"/> :
                 item.type === 'verse' ? <Plus size={13} className="text-blue-400"/> :
                 <Sun size={13} className="text-green-400"/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{String(item.data.title || item.data.reference || '—')}</p>
                <p className="text-white/30 text-xs capitalize">{item.type}</p>
              </div>
              <button onClick={() => remove(item.id)} className="text-white/20 p-1">
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
