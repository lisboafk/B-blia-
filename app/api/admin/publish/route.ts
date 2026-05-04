import { NextRequest, NextResponse } from 'next/server'
import { publishContent } from '@/lib/supabase'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'lisboafk@gmail.com'

function validateToken(token: string): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [email, ts] = decoded.split(':')
    const age = Date.now() - parseInt(ts || '0', 10)
    return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && age < 86400000
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || ''
  if (!validateToken(token)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { type, data, scheduledFor } = await req.json()
    if (!type || !data) {
      return NextResponse.json({ error: 'type e data são obrigatórios' }, { status: 400 })
    }

    const result = await publishContent(type, data, scheduledFor)
    if ('error' in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 503 })
    }
    return NextResponse.json({ ok: true, scheduledFor: scheduledFor || new Date().toISOString().slice(0, 10) })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
