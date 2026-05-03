'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Sun, Moon, Trash2, Plus, ChevronLeft, Check, RefreshCw, Download } from 'lucide-react'

interface GeneratedItem {
  id: string
  type: 'devotional' | 'verse' | 'prayer'
  data: Record<string, unknown>
  generatedAt: string
}

type ContentType = 'devotional' | 'verse' | 'prayer'

export default function AdminPage() {
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-12">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5">
        <Link href="/"><ChevronLeft size={24} className="text-white/50" /></Link>
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg leading-none">Painel Admin</h1>
          <p className="text-white/40 text-xs mt-0.5">Gerar conteúdo com Gemini AI</p>
        </div>
        <button onClick={exportJSON}
          className="flex items-center gap-1.5 text-[#c9a84c] text-xs border border-[#c9a84c]/30 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
          <Download size={12} /> Exportar
        </button>
      </div>

      {/* Generator */}
      <div className="px-4 mb-5">
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-[#c9a84c]" />
            <h2 className="text-white font-semibold text-sm">Gerar com Gemini AI</h2>
          </div>

          {/* Type selector */}
          <div className="flex gap-2 mb-3">
            {(['devotional','verse','prayer'] as ContentType[]).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${type === t ? 'bg-[#c9a84c] text-[#111]' : 'bg-[#2a2a2a] text-white/50'}`}>
                {t === 'devotional' ? 'Devocional' : t === 'verse' ? 'Versículo' : 'Oração'}
              </button>
            ))}
          </div>

          {/* Period (only for prayer) */}
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
            placeholder="Tema (ex: Graça, Fé, Esperança, Soberania…)"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-3 transition-colors"
          />

          <button onClick={generate} disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-[#111] flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity active:scale-[0.98]"
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
              <p className="text-white/50 text-sm leading-relaxed line-clamp-4">{String(preview.content || '')}</p>
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
              className="mt-4 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#4ade80]/15 border border-[#4ade80]/40 text-[#4ade80] active:scale-[0.98] transition-transform">
              <Check size={15}/> Aprovar e salvar
            </button>
          </div>
        </div>
      )}

      {/* Saved list */}
      <div className="px-4">
        <p className="text-white/40 text-xs mb-3">{saved.length} itens salvos</p>
        {saved.length === 0 && (
          <div className="text-center py-12">
            <Plus size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/20 text-sm">Gere conteúdo para ver aqui</p>
          </div>
        )}
        <div className="space-y-2">
          {saved.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${
                item.type === 'devotional' ? 'bg-[#c9a84c]/15' : item.type === 'prayer' ? 'bg-blue-500/15' : 'bg-green-500/15'
              }`}>
                {item.type === 'devotional' ? '📖' : item.type === 'prayer' ? '🙏' : '✨'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {String(item.data.title || item.data.reference || item.type)}
                </p>
                <p className="text-white/30 text-xs">{new Date(item.generatedAt).toLocaleDateString('pt-BR')}</p>
              </div>
              <button onClick={() => remove(item.id)} className="text-white/20 p-1 active:text-red-400 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
