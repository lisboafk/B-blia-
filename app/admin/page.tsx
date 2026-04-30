'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, Sparkles, BookOpen, Sun, Moon, Trash2, Plus, ChevronLeft, Check, RefreshCw } from 'lucide-react'

const ADMIN_PIN = '1234' // Change this PIN

interface GeneratedItem {
  id: string
  type: 'devotional' | 'verse' | 'prayer'
  data: Record<string, unknown>
  approved: boolean
  generatedAt: string
}

type ContentType = 'devotional' | 'verse' | 'prayer'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)

  const [type, setType] = useState<ContentType>('devotional')
  const [theme, setTheme] = useState('')
  const [period, setPeriod] = useState<'manha' | 'noite'>('manha')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null)
  const [saved, setSaved] = useState<GeneratedItem[]>([])

  useEffect(() => {
    if (sessionStorage.getItem('admin-auth') === '1') setAuthed(true)
    const raw = localStorage.getItem('admin-content')
    if (raw) { try { setSaved(JSON.parse(raw)) } catch {} }
  }, [])

  const handlePin = () => {
    if (pin === ADMIN_PIN) {
      setAuthed(true)
      sessionStorage.setItem('admin-auth', '1')
    } else {
      setPinError(true)
      setPin('')
      setTimeout(() => setPinError(false), 1500)
    }
  }

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
      approved: true,
      generatedAt: new Date().toISOString()
    }
    const next = [item, ...saved].slice(0, 50)
    setSaved(next)
    localStorage.setItem('admin-content', JSON.stringify(next))
    setPreview(null)
    setTheme('')
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

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/20 flex items-center justify-center mb-6">
          <Lock size={28} className="text-[#c9a84c]" />
        </div>
        <h1 className="text-white font-bold text-xl mb-1">Painel Admin</h1>
        <p className="text-parchment/40 text-sm mb-8">Acesso restrito</p>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePin()}
          placeholder="PIN de acesso"
          className={`w-full max-w-xs text-center text-2xl tracking-widest bg-[#1a1a1a] border-2 rounded-xl py-4 px-6 text-white outline-none transition-colors ${pinError ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#c9a84c]'}`}
          maxLength={8}
        />
        {pinError && <p className="text-red-400 text-sm mt-2">PIN incorreto</p>}
        <button onClick={handlePin}
          className="mt-4 w-full max-w-xs py-3 rounded-xl font-bold text-[#111]"
          style={{ background: 'linear-gradient(90deg,#c9a84c,#e8c870)' }}>
          Entrar
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <Link href="/profile" className="text-parchment/50">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-white font-bold text-lg">Painel Admin</h1>
          <p className="text-parchment/40 text-xs">Geração de conteúdo com IA</p>
        </div>
        <button onClick={exportJSON}
          className="ml-auto text-[#c9a84c] text-xs border border-[#c9a84c]/30 px-3 py-1.5 rounded-lg">
          Exportar JSON
        </button>
      </div>

      {/* Generator */}
      <div className="px-4 mb-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#c9a84c]" />
            <h2 className="text-white font-semibold text-sm">Gerar com Gemini</h2>
          </div>

          {/* Type selector */}
          <div className="flex gap-2 mb-4">
            {(['devotional','verse','prayer'] as ContentType[]).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${type === t ? 'bg-[#c9a84c] text-[#111]' : 'bg-[#2a2a2a] text-parchment/60'}`}>
                {t === 'devotional' ? 'Devocional' : t === 'verse' ? 'Versículo' : 'Oração'}
              </button>
            ))}
          </div>

          {/* Period (only for prayer) */}
          {type === 'prayer' && (
            <div className="flex gap-2 mb-3">
              <button onClick={() => setPeriod('manha')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs ${period === 'manha' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-[#2a2a2a] text-parchment/50'}`}>
                <Sun size={13} /> Manhã
              </button>
              <button onClick={() => setPeriod('noite')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs ${period === 'noite' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-[#2a2a2a] text-parchment/50'}`}>
                <Moon size={13} /> Noite
              </button>
            </div>
          )}

          {/* Theme input */}
          <input
            value={theme}
            onChange={e => setTheme(e.target.value)}
            placeholder={type === 'prayer' ? 'Tema opcional (ex: Paz)' : 'Tema (ex: Graça Irresistível)'}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#c9a84c]/50 transition-colors mb-3"
          />

          <button onClick={generate} disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-[#111] flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg,#c9a84c,#e8c870)' }}>
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Gerando...' : 'Gerar'}
          </button>

          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="px-4 mb-6">
          <div className="bg-[#1a1a00] border border-[#c9a84c]/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#c9a84c] font-semibold text-sm">Prévia gerada</h3>
              <button onClick={() => setPreview(null)} className="text-parchment/40 text-xs">Descartar</button>
            </div>

            {type === 'devotional' && (
              <>
                <p className="text-white font-bold text-base mb-1">{String(preview.title || '')}</p>
                <p className="text-[#c9a84c] text-xs mb-2">{String(preview.reference || '')} · {String(preview.theme || '')}</p>
                <p className="text-parchment/70 text-sm italic mb-3 leading-relaxed">"{String(preview.verse || '')}"</p>
                <p className="text-parchment/60 text-sm leading-relaxed line-clamp-4">{String(preview.content || '')}</p>
              </>
            )}
            {type === 'verse' && (
              <>
                <p className="text-[#c9a84c] font-bold text-sm mb-2">{String(preview.reference || '')}</p>
                <p className="text-white text-base italic leading-relaxed">"{String(preview.text || '')}"</p>
              </>
            )}
            {type === 'prayer' && (
              <>
                <p className="text-white font-bold text-sm mb-1">{String(preview.title || '')}</p>
                <p className="text-[#c9a84c] text-xs mb-2">{String(preview.reference || '')}</p>
                <p className="text-parchment/70 text-sm italic leading-relaxed">{String(preview.prayer || '')}</p>
              </>
            )}

            <button onClick={approve}
              className="mt-4 w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 bg-[#4ade80]/20 border border-[#4ade80]/40 text-[#4ade80]">
              <Check size={16} /> Aprovar e salvar
            </button>
          </div>
        </div>
      )}

      {/* Saved items */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-sm">Conteúdo salvo ({saved.length})</h2>
        </div>
        {saved.length === 0 && (
          <p className="text-parchment/30 text-sm text-center py-6">Nenhum conteúdo salvo ainda</p>
        )}
        <div className="space-y-3">
          {saved.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] rounded-xl p-4 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                item.type === 'devotional' ? 'bg-[#c9a84c]/20' :
                item.type === 'verse' ? 'bg-blue-500/20' : 'bg-green-500/20'
              }`}>
                {item.type === 'devotional' ? <BookOpen size={14} className="text-[#c9a84c]" /> :
                 item.type === 'verse' ? <Plus size={14} className="text-blue-400" /> :
                 <Sun size={14} className="text-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {String(item.data.title || item.data.reference || 'Item')}
                </p>
                <p className="text-parchment/40 text-xs capitalize">{item.type}</p>
              </div>
              <button onClick={() => remove(item.id)} className="text-parchment/30 p-1">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
