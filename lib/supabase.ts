import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = url && key ? createClient(url, key) : null

export const isSupabaseEnabled = () => !!supabase

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
