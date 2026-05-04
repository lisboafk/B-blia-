import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const isSupabaseEnabled = () => !!supabase

function getServiceClient() {
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

// Track an event (like, share, view) — no-op if Supabase not configured
export async function trackEvent(type: 'like' | 'share' | 'view', verseKey?: string) {
  if (!supabase) return
  await supabase.from('events').insert({ type, verse_key: verseKey || null }).then(() => {})
}

// Get aggregate stats
export async function getStats() {
  if (!supabase) return null
  const [likes, shares, views] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'like'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'share'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'view'),
  ])
  return {
    likes: likes.count ?? 0,
    shares: shares.count ?? 0,
    views: views.count ?? 0,
  }
}

export async function publishContent(
  type: string,
  data: Record<string, unknown>,
  scheduledFor?: string
) {
  const client = getServiceClient()
  if (!client) return { error: 'SUPABASE_SERVICE_ROLE_KEY não configurada' }
  const { error } = await client.from('published_content').insert({
    type,
    data,
    scheduled_for: scheduledFor || new Date().toISOString().slice(0, 10),
    published_at: scheduledFor ? null : new Date().toISOString(),
    status: scheduledFor ? 'scheduled' : 'published',
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function getPublishedContent(dateStr: string) {
  if (!supabase) return []
  const { data } = await supabase
    .from('published_content')
    .select('*')
    .eq('scheduled_for', dateStr)
    .in('status', ['published', 'scheduled'])
    .order('created_at', { ascending: false })
  return data || []
}

export async function getLatestPublished(type: string, dateStr: string) {
  if (!supabase) return null
  const { data } = await supabase
    .from('published_content')
    .select('*')
    .eq('type', type)
    .lte('scheduled_for', dateStr)
    .in('status', ['published', 'scheduled'])
    .order('scheduled_for', { ascending: false })
    .limit(1)
  return data?.[0] ?? null
}
