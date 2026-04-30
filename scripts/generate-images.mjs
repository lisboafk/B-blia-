#!/usr/bin/env node
/**
 * Prebuild: gera backgrounds para os cards de versículo
 * - Se GEMINI_API_KEY disponível: usa Imagen 4 (paisagens bíblicas)
 * - Fallback: fotos Creative Commons do Unsplash CDN
 * Salva em public/bg/theme-{0-6}.jpg
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'bg')

const GEMINI_KEY = process.env.GEMINI_API_KEY

// Prompts para Imagen 4 — paisagens que evocam temas bíblicos
const IMAGEN_PROMPTS = [
  'Breathtaking aurora borealis over snow-capped mountains, deep purple and green sky, majestic, cinematic, no text',
  'Starry night sky over desert dunes, milky way, warm golden sand, peaceful, cinematic photography, no text',
  'Golden sunset over Mediterranean sea, dramatic orange and pink clouds, ancient cliffs, no text',
  'Misty green hills at dawn, rays of sunlight through clouds, lush valley, cinematic, no text',
  'Northern lights reflected in calm lake, deep blue and green, serene landscape, no text',
  'Ancient forest with sunbeams through tall trees, mist, golden light, spiritual atmosphere, no text',
  'Desert sunrise over rocky canyon, warm red and orange tones, vast landscape, cinematic, no text',
]

// Fotos Unsplash CC0 — fallback
const UNSPLASH_PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1024&q=80&fm=jpg',
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1024&q=80&fm=jpg',
]

async function generateWithImagen(prompt, index) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${GEMINI_KEY}`
  const body = {
    instances: [{ prompt }],
    parameters: { sampleCount: 1, aspectRatio: '1:1' }
  }
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 60000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal
    })
    clearTimeout(timeout)
    if (!res.ok) {
      const err = await res.text()
      console.warn(`  ⚠️  Imagen ${index}: HTTP ${res.status} — ${err.slice(0, 120)}`)
      return false
    }
    const data = await res.json()
    const b64 = data.predictions?.[0]?.bytesBase64Encoded
    if (!b64) { console.warn(`  ⚠️  Imagen ${index}: sem imagem na resposta`); return false }
    const buf = Buffer.from(b64, 'base64')
    writeFileSync(join(OUT_DIR, `theme-${index}.jpg`), buf)
    console.log(`  ✅ Tema ${index} (Imagen 4) — ${(buf.length / 1024).toFixed(0)}KB`)
    return true
  } catch (e) {
    clearTimeout(timeout)
    console.warn(`  ⚠️  Imagen ${index}: ${e.message}`)
    return false
  }
}

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
    console.log(`  ✅ Tema ${index} (Unsplash) — ${(buf.length / 1024).toFixed(0)}KB`)
    return true
  } catch (e) {
    clearTimeout(timeout)
    console.warn(`  ⚠️  Unsplash ${index}: ${e.message}`)
    return false
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const toDownload = IMAGEN_PROMPTS
    .map((_, i) => i)
    .filter(i => !existsSync(join(OUT_DIR, `theme-${i}.jpg`)))

  if (toDownload.length === 0) {
    console.log('✅ Todos os backgrounds já existem — pulando download')
    return
  }

  if (GEMINI_KEY) {
    console.log(`🎨 Gerando ${toDownload.length} backgrounds com Imagen 4...`)
    let ok = 0
    for (const i of toDownload) {
      const success = await generateWithImagen(IMAGEN_PROMPTS[i], i)
      if (success) { ok++; continue }
      // fallback para Unsplash
      console.log(`  🔄 Fallback Unsplash para tema ${i}...`)
      await downloadUnsplash(UNSPLASH_PHOTOS[i], i)
    }
    console.log(`✅ ${ok}/${toDownload.length} gerados com Imagen 4`)
  } else {
    console.log(`🖼️  Baixando ${toDownload.length} backgrounds (Unsplash CC0)...`)
    let ok = 0
    for (const i of toDownload) {
      const success = await downloadUnsplash(UNSPLASH_PHOTOS[i], i)
      if (success) ok++
    }
    if (ok === 0) console.log('ℹ️  Download falhou — o app usará gradientes CSS como fallback')
    else console.log(`✅ ${ok}/${toDownload.length} backgrounds baixados!`)
  }
}

main().catch(e => { console.error('Erro:', e.message); process.exit(0) })
