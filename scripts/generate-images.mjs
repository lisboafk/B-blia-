#!/usr/bin/env node
/**
 * Prebuild: baixa backgrounds para os cards de versículo
 * Usa fotos Creative Commons do Unsplash CDN (sem chave de API)
 * Salva em public/bg/theme-{0-6}.jpg
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'bg')

// Fotos Unsplash CC0 — IDs estáveis, sem autenticação
const PHOTOS = [
  { name: 'aurora',    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&q=80&fm=jpg' },
  { name: 'night',     url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1024&q=80&fm=jpg' },
  { name: 'sunset',    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1024&q=80&fm=jpg' },
  { name: 'hills',     url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1024&q=80&fm=jpg' },
  { name: 'borealis',  url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1024&q=80&fm=jpg' },
  { name: 'forest',    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1024&q=80&fm=jpg' },
  { name: 'desert',    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1024&q=80&fm=jpg' },
]

async function downloadPhoto(photo, index) {
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 30000)
  try {
    const res = await fetch(photo.url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 BibleApp/1.0' }
    })
    clearTimeout(timeout)
    if (!res.ok) { console.warn(`  ⚠️  Tema ${index} (${photo.name}): HTTP ${res.status}`); return false }
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('image')) { console.warn(`  ⚠️  Tema ${index}: não é imagem`); return false }
    const buf = Buffer.from(await res.arrayBuffer())
    writeFileSync(join(OUT_DIR, `theme-${index}.jpg`), buf)
    console.log(`  ✅ Tema ${index} (${photo.name}) — ${(buf.length / 1024).toFixed(0)}KB`)
    return true
  } catch (e) {
    clearTimeout(timeout)
    console.warn(`  ⚠️  Tema ${index} (${photo.name}): ${e.message}`)
    return false
  }
}

async function main() {
  console.log('🖼️  Baixando backgrounds (Unsplash CC0)...')
  mkdirSync(OUT_DIR, { recursive: true })

  const toDownload = PHOTOS
    .map((p, i) => ({ photo: p, index: i, exists: existsSync(join(OUT_DIR, `theme-${i}.jpg`)) }))
    .filter(t => !t.exists)

  if (toDownload.length === 0) {
    console.log('✅ Todos os backgrounds já existem — pulando download')
    return
  }

  let downloaded = 0
  for (const { photo, index } of toDownload) {
    const ok = await downloadPhoto(photo, index)
    if (ok) downloaded++
  }

  if (downloaded > 0) {
    console.log(`✅ ${downloaded}/${toDownload.length} backgrounds baixados!`)
  } else {
    console.log('ℹ️  Download falhou — o app usará gradientes CSS como fallback')
  }
}

main().catch(e => { console.error('Erro:', e.message); process.exit(0) })
