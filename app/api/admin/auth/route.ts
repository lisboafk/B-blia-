import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'lisboafk@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '050597'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true, token: Buffer.from(`${email}:${Date.now()}`).toString('base64') })
    }
    return NextResponse.json({ ok: false, error: 'Credenciais inválidas' }, { status: 401 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || ''
  if (!token) return NextResponse.json({ ok: false }, { status: 401 })
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [email, ts] = decoded.split(':')
    const age = Date.now() - parseInt(ts || '0', 10)
    if (email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && age < 86400000) {
      return NextResponse.json({ ok: true })
    }
  } catch {}
  return NextResponse.json({ ok: false }, { status: 401 })
}
