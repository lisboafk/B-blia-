'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Sparkles, Sun, Moon, Trash2, ChevronLeft, Check, Download,
  BarChart2, MessageSquare, Calendar, LogOut, Heart, Share2,
  BookOpen, Send, Loader, ExternalLink, PenLine, Upload, Clock
} from 'lucide-react'

type Tab = 'painel' | 'gerar' | 'chat' | 'temas'
type ContentType = 'devotional' | 'verse' | 'prayer' | 'image'

interface GeneratedItem {
  id: string; type: ContentType; data: Record<string, unknown>; generatedAt: string
}
interface ChatMsg { role: 'user' | 'ai'; text: string }
interface Stats { likes: number; shares: number; prayerOpens: number; readMinutes: number; favorites: number }

const THEMES = [
  'Graça Irresistível','Perseverança dos Santos','Providência Divina',
  'Justificação pela Fé','Soberania de Deus','União com Cristo',
  'Santificação pelo Espírito','Segurança da Salvação','Eleição Incondicional',
  'Expiação Definida','Regeneração pela Fé','Glorificação Futura',
  'Oração e Dependência','O Evangelho da Graça','Fidelidade de Deus',
  'Cristo nossa Justiça','A Palavra de Deus','Comunhão com o Espírito',
  'O Amor de Deus','Confiança na Tribulação','A Igreja de Cristo',
]

function useAdminAuth() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    const loginTime = parseInt(localStorage.getItem('admin-login-time') || '0', 10)
    if (!token || Date.now() - loginTime > 86400000) {
      router.replace('/admin/login')
    } else {
      setReady(true)
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-login-time')
    router.replace('/admin/login')
  }

  return { ready, logout }
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${color}`}>{icon}</div>
      <p className="text-white font-bold text-2xl leading-none">{value.toLocaleString('pt-BR')}</p>
      <p className="text-white/40 text-xs mt-1">{label}</p>
    </div>
  )
}

function PainelTab({ stats, onGenerate }: { stats: Stats; onGenerate: () => void }) {
  const now = new Date()
  return (
    <div className="space-y-5">
      <div>
        <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">Estatísticas</p>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Heart size={16} className="text-red-400"/>} label="Curtidas" value={stats.likes} color="bg-red-500/15"/>
          <StatCard icon={<Share2 size={16} className="text-blue-400"/>} label="Compartilhamentos" value={stats.shares} color="bg-blue-500/15"/>
          <StatCard icon={<BookOpen size={16} className="text-[#c9a84c]"/>} label="Min. leitura" value={stats.readMinutes} color="bg-[#c9a84c]/15"/>
          <StatCard icon={<span className="text-base">🙏</span>} label="Orações abertas" value={stats.prayerOpens} color="bg-purple-500/15"/>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-4">
        <p className="text-white font-semibold text-sm mb-0.5">
          {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <p className="text-white/30 text-xs mb-4">Controle de missão ativo</p>
        <button onClick={onGenerate}
          className="w-full py-3 rounded-xl font-bold text-sm text-[#111] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(90deg,#c9a84c,#e8c870)' }}>
          <Sparkles size={15}/> Gerar conteúdo agora
        </button>
      </div>

      <div className="bg-blue-500/8 border border-blue-500/15 rounded-2xl p-4">
        <p className="text-blue-300 font-semibold text-sm mb-1">📊 Analytics multiusuário</p>
        <p className="text-blue-300/50 text-xs leading-relaxed">
          Para curtidas e compartilhamentos reais entre todos os usuários, configure no Vercel:
        </p>
        <p className="text-blue-300/40 text-[11px] mt-2 font-mono">NEXT_PUBLIC_SUPABASE_URL<br/>NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
      </div>
    </div>
  )
}

function GerarTab() {
  const [type, setType] = useState<ContentType>('devotional')
  const [theme, setTheme] = useState('')
  const [period, setPeriod] = useState<'manha' | 'noite'>('manha')
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageVerseText, setImageVerseText] = useState('')
  const [imageReference, setImageReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [publishMsg, setPublishMsg] = useState('')
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null)
  const [imgUrl, setImgUrl] = useState('')
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualText, setManualText] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [published, setPublished] = useState<GeneratedItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('admin-published')
    if (raw) { try { setPublished(JSON.parse(raw)) } catch {} }
  }, [])

  const generate = async () => {
    setLoading(true); setError(''); setPreview(null); setImgUrl(''); setImgLoaded(false); setImgError(false)
    try {
      if (type === 'image') {
        const scene = imagePrompt.trim() || 'cena bíblica épica Gustave Doré chiaroscuro luz divina'
        const seed = Date.now() % 99999
        // Proxy through server to avoid CORS — server fetches Pollinations and returns blob
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: scene, seed })
        })
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          setError((json as Record<string,string>).error || 'Erro ao gerar imagem'); return
        }
        // Blob URL for display + original Pollinations URL for publishing
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const originalUrl = res.headers.get('X-Image-Url') || blobUrl
        setImgUrl(blobUrl)
        setPreview({ imageUrl: originalUrl, blobUrl, prompt: scene, verseText: imageVerseText.trim(), reference: imageReference.trim() })
        setLoading(false); return
      }
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, theme: theme.trim() || undefined, period })
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Erro ao gerar'); return }
      setPreview(json.data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }

  const buildManualPreview = (): Record<string, unknown> | null => {
    const text = manualText.trim()
    if (!text) return null
    if (type === 'devotional') {
      const lines = text.split('\n')
      return { id: `manual-d-${Date.now()}`, title: lines[0] || 'Devocional', content: text, prayer: '', generatedAt: new Date().toISOString() }
    }
    if (type === 'verse') return { id: `manual-v-${Date.now()}`, text, reference: theme || '', generatedAt: new Date().toISOString() }
    if (type === 'prayer') return { id: `manual-p-${Date.now()}`, prayer: text, period, title: `Oração da ${period === 'manha' ? 'Manhã' : 'Noite'}`, generatedAt: new Date().toISOString() }
    return null
  }

  const doPublish = async (scheduledFor?: string) => {
    const data = manualMode ? buildManualPreview() : preview
    if (!data) return
    setPublishing(true); setError(''); setPublishMsg('')
    try {
      const publishType = type === 'prayer' ? `prayer_${period}` : type
      const token = localStorage.getItem('admin-token') || ''
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ type: publishType, data, scheduledFor })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Erro ao publicar')
        return
      }
      const item: GeneratedItem = { id: String(data.id || Date.now()), type, data, generatedAt: new Date().toISOString() }
      const next = [item, ...published].slice(0, 30)
      setPublished(next); localStorage.setItem('admin-published', JSON.stringify(next))
      setPublishMsg(scheduledFor ? `Agendado para ${scheduledFor}` : 'Publicado para todos os usuários!')
      setPreview(null); setTheme(''); setManualText(''); setShowSchedule(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setPublishing(false)
    }
  }

  const activePreview = manualMode ? buildManualPreview() : preview

  const downloadImageWithText = async () => {
    if (!imgUrl || !activePreview) return
    const canvas = document.createElement('canvas')
    canvas.width = 1080; canvas.height = 1350
    const ctx = canvas.getContext('2d')!

    // Draw background image
    const img = new Image()
    img.src = imgUrl
    await new Promise<void>(resolve => { img.onload = () => resolve() })
    ctx.drawImage(img, 0, 0, 1080, 1350)

    // Dark gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 0, 1350)
    grad.addColorStop(0, 'rgba(0,0,0,0.15)')
    grad.addColorStop(1, 'rgba(0,0,0,0.78)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1080, 1350)

    // Helper: wrap text
    const wrapText = (text: string, x: number, y: number, maxW: number, lineH: number) => {
      const words = text.split(' ')
      let line = ''
      let cy = y
      for (const word of words) {
        const test = line ? `${line} ${word}` : word
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, x, cy); line = word; cy += lineH
        } else { line = test }
      }
      if (line) { ctx.fillText(line, x, cy); cy += lineH }
      return cy
    }

    const verseText = String(activePreview.verseText || '')
    const ref = String(activePreview.reference || '')

    if (verseText) {
      ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = 14
      ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.font = 'bold italic 62px Georgia, serif'
      const endY = wrapText(`"${verseText}"`, 540, 900, 920, 82)
      if (ref) {
        ctx.font = 'bold italic 52px Georgia, serif'; ctx.fillStyle = '#f5d060'
        ctx.fillText(ref, 540, endY + 30)
      }
    } else if (ref) {
      ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = 14
      ctx.fillStyle = '#f5d060'; ctx.textAlign = 'center'; ctx.font = 'bold italic 58px Georgia, serif'
      ctx.fillText(ref, 540, 1200)
    }

    canvas.toBlob(blob => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `versiculo-${Date.now()}.jpg`
      a.click()
    }, 'image/jpeg', 0.95)
  }

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4">
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {(['devotional','verse','prayer','image'] as ContentType[]).map(t => (
            <button key={t} onClick={() => { setType(t); setPreview(null); setManualText('') }}
              className={`py-2 rounded-xl text-[11px] font-semibold transition-colors ${type === t ? 'bg-[#c9a84c] text-[#111]' : 'bg-[#2a2a2a] text-white/50'}`}>
              {t === 'devotional' ? 'Devoc.' : t === 'verse' ? 'Versíc.' : t === 'prayer' ? 'Oração' : 'Imagem'}
            </button>
          ))}
        </div>

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

        {/* Manual mode toggle */}
        {type !== 'image' && (
          <div className="flex gap-1.5 mb-3">
            <button onClick={() => setManualMode(false)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${!manualMode ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30' : 'bg-[#2a2a2a] text-white/40'}`}>
              <Sparkles size={12}/> Gerar com IA
            </button>
            <button onClick={() => setManualMode(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${manualMode ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-[#2a2a2a] text-white/40'}`}>
              <PenLine size={12}/> Escrever manual
            </button>
          </div>
        )}

        {/* Image inputs: scene + verse text separately */}
        {type === 'image' && (
          <>
            <p className="text-white/40 text-[11px] mb-1.5 uppercase tracking-wider">Cena de fundo</p>
            <textarea
              value={imagePrompt}
              onChange={e => setImagePrompt(e.target.value)}
              placeholder="Descreva a cena bíblica...&#10;Ex: Davi tocando harpa ao entardecer, luz dourada, estilo Rembrandt"
              rows={2}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-2 resize-none transition-colors"
            />
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['Criação do mundo — Gênesis','Moisés no Sinai','Davi e Golias','Nascimento de Jesus','Ressurreição — túmulo vazio','Pentecostes — fogo'].map(s => (
                <button key={s} onClick={() => setImagePrompt(s)}
                  className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${imagePrompt === s ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30' : 'bg-[#2a2a2a] text-white/40'}`}>
                  {s}
                </button>
              ))}
            </div>
            <p className="text-white/40 text-[11px] mb-1.5 uppercase tracking-wider">Texto do versículo (exibido sobre a imagem)</p>
            <textarea
              value={imageVerseText}
              onChange={e => setImageVerseText(e.target.value)}
              placeholder="Ex: No princípio criou Deus os céus e a terra."
              rows={2}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-2 resize-none transition-colors"
            />
            <input
              value={imageReference}
              onChange={e => setImageReference(e.target.value)}
              placeholder="Referência — Ex: Gênesis 1:1"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-3 transition-colors"
            />
          </>
        )}

        {/* Manual writing mode */}
        {type !== 'image' && manualMode && (
          <>
            {type !== 'prayer' && (
              <input value={theme} onChange={e => setTheme(e.target.value)}
                placeholder={type === 'devotional' ? 'Título do devocional' : 'Referência bíblica (ex: João 3:16)'}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-2 transition-colors"/>
            )}
            <textarea
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder={
                type === 'devotional' ? 'Escreva o conteúdo do devocional...\n(1ª linha será o título)'
                : type === 'verse' ? 'Texto completo do versículo...'
                : 'Texto da oração... (termine com Amém.)'
              }
              rows={6}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 resize-none transition-colors"
            />
          </>
        )}

        {/* AI mode inputs */}
        {type !== 'image' && !manualMode && (
          <>
            <input value={theme} onChange={e => setTheme(e.target.value)}
              placeholder="Tema (ou escolha abaixo)"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-2 transition-colors"/>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {THEMES.slice(0, 7).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${theme === t ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30' : 'bg-[#2a2a2a] text-white/40'}`}>
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Action button */}
        {(!manualMode || type === 'image') && (
          <button onClick={generate} disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-[#111] flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(90deg,#c9a84c,#e8c870)' }}>
            {loading ? <Loader size={15} className="animate-spin"/> : <Sparkles size={15}/>}
            {loading ? 'Gerando...' : 'Gerar com IA'}
          </button>
        )}

        {error && <p className="text-red-400 text-xs mt-2 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
        {publishMsg && <p className="text-green-400 text-xs mt-2 bg-green-500/10 rounded-lg px-3 py-2">✓ {publishMsg}</p>}
      </div>

      {/* Preview */}
      {(activePreview || imgUrl) && (
        <div className="bg-[#1a1a00] border border-[#c9a84c]/40 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[#c9a84c] font-semibold text-sm">Prévia</p>
            <button onClick={() => { setPreview(null); setImgUrl(''); setManualText('') }} className="text-white/30 text-xs">Descartar</button>
          </div>

          {type === 'image' && imgUrl && (
            <div className="mb-3">
              {/* Card preview — same layout as home page verse card */}
              <div className="relative rounded-xl overflow-hidden" style={{ minHeight: 260 }}>
                {/* Placeholder while loading */}
                {!imgLoaded && !imgError && (
                  <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                    <Loader size={20} className="text-[#c9a84c] animate-spin"/>
                  </div>
                )}
                {/* Fallback gradient if image fails */}
                {imgError && (
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#1a0a00,#3a1500,#0a0a1a)' }}/>
                )}
                <img
                  src={imgUrl}
                  alt=""
                  onLoad={() => setImgLoaded(true)}
                  onError={() => { setImgError(true); setImgLoaded(true) }}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${imgLoaded && !imgError ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.75) 100%)' }}/>
                {/* Verse text overlay — same style as home */}
                <div className="relative px-5 pt-6 pb-5 flex flex-col justify-end items-center" style={{ minHeight: 260 }}>
                  {activePreview?.verseText ? (
                    <p className="text-white font-bold italic text-center leading-snug mb-3"
                      style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(1rem,4vw,1.25rem)', textShadow: '2px 3px 8px rgba(0,0,0,1)' }}>
                      &ldquo;{String(activePreview.verseText)}&rdquo;
                    </p>
                  ) : null}
                  {activePreview?.reference ? (
                    <p className="font-bold italic text-center"
                      style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(0.9rem,3.5vw,1.1rem)', color: '#f5d060', textShadow: '2px 2px 8px rgba(0,0,0,1)' }}>
                      {String(activePreview.reference)}
                    </p>
                  ) : null}
                  {!activePreview?.verseText && !activePreview?.reference && (
                    <p className="text-white/40 text-xs italic text-center">Preencha o texto do versículo acima para ver como ficará</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex gap-4">
                <button onClick={downloadImageWithText}
                  className="flex items-center gap-1 text-[#4ade80] text-xs font-semibold">
                  <Download size={12}/> Baixar com texto
                </button>
                <button onClick={() => { const a = document.createElement('a'); a.href = imgUrl; a.target='_blank'; a.click() }}
                  className="flex items-center gap-1 text-[#c9a84c] text-xs">
                  <ExternalLink size={12}/> Abrir original
                </button>
              </div>
            </div>
          )}

          {type === 'devotional' && activePreview && <>
            <p className="text-white font-bold mb-1">{String(activePreview.title || '')}</p>
            {activePreview.reference && <p className="text-[#c9a84c] text-xs mb-2">{String(activePreview.reference)}</p>}
            {activePreview.verse && <p className="text-white/60 text-xs italic mb-2">"{String(activePreview.verse)}"</p>}
            <p className="text-white/60 text-sm leading-relaxed line-clamp-5">{String(activePreview.content || '')}</p>
          </>}
          {type === 'verse' && activePreview && (
            <p className="text-white italic leading-relaxed">
              &ldquo;{String(activePreview.text || '')}&rdquo;
              {activePreview.reference ? <span className="text-[#c9a84c] not-italic ml-1">— {String(activePreview.reference)}</span> : null}
            </p>
          )}
          {type === 'prayer' && activePreview && (
            <p className="text-white/80 text-sm italic leading-relaxed whitespace-pre-line">{String(activePreview.prayer || '')}</p>
          )}

          {/* Publish buttons */}
          <div className="flex gap-2 mt-4">
            <button onClick={() => doPublish()} disabled={publishing}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#4ade80]/15 border border-[#4ade80]/40 text-[#4ade80] active:scale-[0.98] disabled:opacity-50">
              {publishing ? <Loader size={13} className="animate-spin"/> : <Upload size={13}/>}
              Publicar agora
            </button>
            <button onClick={() => setShowSchedule(s => !s)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 active:scale-[0.98]">
              <Clock size={13}/> Agendar
            </button>
          </div>

          {showSchedule && (
            <div className="mt-3 flex gap-2 items-center">
              <input
                type="date"
                value={scheduleDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={e => setScheduleDate(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500/50"
              />
              <button onClick={() => scheduleDate && doPublish(scheduleDate)} disabled={!scheduleDate || publishing}
                className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-semibold disabled:opacity-40 active:scale-[0.98]">
                OK
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual publish button (when manual mode and has text) */}
      {manualMode && manualText.trim() && type !== 'image' && !activePreview && (
        <div className="bg-[#1a1a00] border border-[#c9a84c]/40 rounded-2xl p-4">
          <p className="text-[#c9a84c] font-semibold text-sm mb-3">Prévia</p>
          {type === 'devotional' && <p className="text-white font-bold mb-2">{manualText.split('\n')[0]}</p>}
          <p className="text-white/60 text-sm leading-relaxed line-clamp-4 whitespace-pre-line">
            {type === 'devotional' ? manualText.split('\n').slice(1).join('\n') : manualText}
          </p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => doPublish()} disabled={publishing}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#4ade80]/15 border border-[#4ade80]/40 text-[#4ade80] active:scale-[0.98] disabled:opacity-50">
              {publishing ? <Loader size={13} className="animate-spin"/> : <Upload size={13}/>}
              Publicar agora
            </button>
            <button onClick={() => setShowSchedule(s => !s)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 active:scale-[0.98]">
              <Clock size={13}/> Agendar
            </button>
          </div>
          {showSchedule && (
            <div className="mt-3 flex gap-2 items-center">
              <input type="date" value={scheduleDate} min={new Date().toISOString().slice(0, 10)}
                onChange={e => setScheduleDate(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none"/>
              <button onClick={() => scheduleDate && doPublish(scheduleDate)} disabled={!scheduleDate || publishing}
                className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-semibold disabled:opacity-40">
                OK
              </button>
            </div>
          )}
        </div>
      )}

      {/* Published history */}
      {published.length > 0 && (
        <div>
          <p className="text-white/40 text-xs mb-2">{published.length} itens publicados</p>
          <div className="space-y-2">
            {published.map(item => (
              <div key={item.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                <span>{item.type === 'devotional' ? '📖' : item.type === 'prayer' ? '🙏' : item.type === 'image' ? '🖼️' : '✨'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{String(item.data.title || item.data.reference || item.data.text || item.type)}</p>
                  <p className="text-[#4ade80] text-xs flex items-center gap-1"><Check size={10}/> Publicado {new Date(item.generatedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ChatTab() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'ai', text: 'Olá! Sou seu assistente reformado. Posso gerar devocionais, orações, versículos, responder perguntas teológicas ou planejar temas. O que precisa?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const QUICK = [
    'Sugira 5 temas bíblicos para esta semana',
    'Crie uma oração de consolo',
    'Gere um devocional sobre Salmo 23',
    'Explique a eleição irresistível',
    'Versículo sobre perseverança',
  ]

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: text.trim() }])
    setInput('')
    setLoading(true)
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', message: text.trim() })
      })
      const data = await res.json()
      const reply = data.data?.response || data.data?.content || data.error || 'Não foi possível responder.'
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Erro de conexão. Verifique a API key no Vercel.' }])
    } finally {
      setLoading(false)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
        {QUICK.map(p => (
          <button key={p} onClick={() => sendMessage(p)}
            className="shrink-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white/50 text-xs active:bg-[#2a2a2a] whitespace-nowrap">
            {p}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-[#c9a84c] text-[#111]' : 'bg-[#1a1a1a] text-white/80'
            }`}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] rounded-2xl px-4 py-3 flex gap-1">
              {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }}/>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
          placeholder="Pergunte ou peça conteúdo…"
          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#c9a84c]/50"/>
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-30 active:scale-90"
          style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c870)' }}>
          <Send size={18} className="text-[#111]"/>
        </button>
      </div>
    </div>
  )
}

function TemasTab() {
  const [customThemes, setCustomThemes] = useState<Record<string, string>>({})
  const [editDay, setEditDay] = useState<string | null>(null)
  const [editTheme, setEditTheme] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem('custom-themes')
    if (raw) { try { setCustomThemes(JSON.parse(raw)) } catch {} }
  }, [])

  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    const doy = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
    return { key, date: d, defaultTheme: THEMES[doy % THEMES.length], custom: customThemes[key] }
  })

  const saveTheme = () => {
    if (!editDay) return
    const next = { ...customThemes }
    if (editTheme.trim()) next[editDay] = editTheme.trim()
    else delete next[editDay]
    setCustomThemes(next)
    localStorage.setItem('custom-themes', JSON.stringify(next))
    setEditDay(null); setEditTheme('')
  }

  return (
    <div className="space-y-2">
      <p className="text-white/30 text-xs mb-3">Próximos 14 dias — toque para personalizar</p>
      {days.map(({ key, date, defaultTheme, custom }) => {
        const isToday = key === today.toISOString().slice(0, 10)
        return (
          <button key={key} onClick={() => { setEditDay(key); setEditTheme(custom || defaultTheme) }}
            className={`w-full text-left bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3 active:bg-[#252525] transition-colors ${isToday ? 'border border-[#c9a84c]/30' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${isToday ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-[#2a2a2a] text-white/25'}`}>
              {date.getDate()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[11px]">{date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
              <p className={`text-sm font-medium truncate ${custom ? 'text-[#c9a84c]' : 'text-white/70'}`}>{custom || defaultTheme}</p>
            </div>
            {custom && <span className="text-[10px] bg-[#c9a84c]/15 text-[#c9a84c] px-2 py-0.5 rounded-full shrink-0">Custom</span>}
          </button>
        )
      })}

      {editDay && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setEditDay(null)}>
          <div className="bg-[#1a1a1a] rounded-t-2xl p-5 w-full" onClick={e => e.stopPropagation()}>
            <p className="text-white font-semibold mb-3">Tema para {new Date(editDay + 'T12:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
            <input value={editTheme} onChange={e => setEditTheme(e.target.value)}
              placeholder="Tema personalizado…"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#c9a84c]/50 mb-3"/>
            <div className="flex gap-2">
              <button onClick={() => setEditDay(null)} className="flex-1 py-3 rounded-xl bg-[#2a2a2a] text-white/60 text-sm">Cancelar</button>
              <button onClick={saveTheme} className="flex-1 py-3 rounded-xl bg-[#c9a84c] text-[#111] font-bold text-sm">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const { ready, logout } = useAdminAuth()
  const [tab, setTab] = useState<Tab>('painel')
  const [stats, setStats] = useState<Stats>({ likes: 0, shares: 0, prayerOpens: 0, readMinutes: 0, favorites: 0 })

  useEffect(() => {
    if (!ready) return
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    // Aggregate like/share counts from localStorage
    let likes = 0, shares = 0
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || ''
      if (k.endsWith('-count') && k.startsWith('like-')) likes += parseInt(localStorage.getItem(k) || '0', 10)
      if (k.startsWith('share-')) shares += parseInt(localStorage.getItem(k) || '0', 10)
    }
    setStats({
      likes,
      shares,
      prayerOpens: parseInt(localStorage.getItem('prayer-opens') || '0', 10),
      readMinutes: parseInt(localStorage.getItem('read-minutes') || '0', 10),
      favorites: favs.length,
    })
  }, [ready])

  if (!ready) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin"/>
    </div>
  )

  const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'painel', icon: <BarChart2 size={15}/>, label: 'Painel' },
    { id: 'gerar', icon: <Sparkles size={15}/>, label: 'Gerar' },
    { id: 'chat', icon: <MessageSquare size={15}/>, label: 'Chat IA' },
    { id: 'temas', icon: <Calendar size={15}/>, label: 'Temas' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-12">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <Link href="/"><ChevronLeft size={22} className="text-white/50"/></Link>
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg leading-none">🎛️ Controle de Missão</h1>
          <p className="text-white/25 text-xs mt-0.5">Admin · Bíblia Sagrada Reformada</p>
        </div>
        <button onClick={logout} className="p-2 rounded-xl text-white/25 active:text-red-400 transition-colors">
          <LogOut size={18}/>
        </button>
      </div>

      <div className="flex gap-1.5 px-4 mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-xl text-[11px] font-semibold gap-1 transition-colors ${
              tab === t.id ? 'bg-[#c9a84c] text-[#111]' : 'bg-[#1a1a1a] text-white/40'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {tab === 'painel' && <PainelTab stats={stats} onGenerate={() => setTab('gerar')}/>}
        {tab === 'gerar' && <GerarTab/>}
        {tab === 'chat' && <ChatTab/>}
        {tab === 'temas' && <TemasTab/>}
      </div>
    </div>
  )
}
