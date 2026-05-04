#!/usr/bin/env node
/**
 * Prebuild: baixa backgrounds para os cards de versículo
 * Usa fotos Creative Commons do Unsplash CDN (gratuito)
 * Salva em public/bg/theme-{0-6}.jpg
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'bg')

const UNSPLASH_PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1024&q=80&fm=jpg',
]

async function downloadUnsplash(url, index) {
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 30000)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 BibleApp/1.0' }
    })
    clearTimeout(timeout)
    if (!res.ok) { console.warn(`  ⚠️  Unsplash ${index}: HTTP ${res.status}`); return false }
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('image')) { console.warn(`  ⚠️  Unsplash ${index}: não é imagem`); return false }
    const buf = Buffer.from(await res.arrayBuffer())
    writeFileSync(join(OUT_DIR, `theme-${index}.jpg`), buf)
    console.log(`  ✅ Tema ${index} — ${(buf.length / 1024).toFixed(0)}KB`)
    return true
  } catch (e) {
    clearTimeout(timeout)
    console.warn(`  ⚠️  Unsplash ${index}: ${e.message}`)
    return false
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const toDownload = UNSPLASH_PHOTOS
    .map((_, i) => i)
    .filter(i => !existsSync(join(OUT_DIR, `theme-${i}.jpg`)))

  if (toDownload.length === 0) {
    console.log('✅ Todos os backgrounds já existem — pulando download')
    return
  }

  console.log(`🖼️  Baixando ${toDownload.length} backgrounds (Unsplash CC0)...`)
  let ok = 0
  for (const i of toDownload) {
    const success = await downloadUnsplash(UNSPLASH_PHOTOS[i], i)
    if (success) ok++
  }
  if (ok === 0) console.log('ℹ️  Download falhou — o app usará gradientes CSS como fallback')
  else console.log(`✅ ${ok}/${toDownload.length} backgrounds baixados!`)
}

main().catch(e => { console.error('Erro:', e.message); process.exit(0) })

