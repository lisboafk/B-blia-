'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LogIn } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })
      const data = await res.json()
      if (data.ok) {
        localStorage.setItem('admin-token', data.token)
        localStorage.setItem('admin-login-time', String(Date.now()))
        router.push('/admin')
      } else {
        setError(data.error || 'Credenciais inválidas')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-[#c9a84c]" />
          </div>
          <h1 className="text-white font-bold text-2xl">Controle de Missão</h1>
          <p className="text-white/30 text-sm mt-1">Bíblia Sagrada Reformada</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-mail"
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-[#c9a84c]/50 transition-colors"
          />
          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-[#111] flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(90deg,#c9a84c,#e8c870)' }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
            ) : (
              <><LogIn size={16} /> Entrar</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
