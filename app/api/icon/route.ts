import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const size = parseInt(searchParams.get('size') || '192', 10)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a1208"/>
      <stop offset="100%" stop-color="#0a0807"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#glow)"/>
  <!-- Ark base -->
  <rect x="${size*0.18}" y="${size*0.58}" width="${size*0.64}" height="${size*0.22}" rx="${size*0.03}" fill="none" stroke="#c9a84c" stroke-width="${size*0.025}"/>
  <!-- Mercy seat -->
  <rect x="${size*0.14}" y="${size*0.5}" width="${size*0.72}" height="${size*0.1}" rx="${size*0.025}" fill="none" stroke="#f0c040" stroke-width="${size*0.03}"/>
  <!-- Left wing -->
  <path d="M ${size*0.45} ${size*0.5} Q ${size*0.25} ${size*0.28} ${size*0.15} ${size*0.38} Q ${size*0.22} ${size*0.18} ${size*0.42} ${size*0.32} Z" fill="#c9a84c" fill-opacity="0.25" stroke="#c9a84c" stroke-width="${size*0.018}"/>
  <!-- Right wing -->
  <path d="M ${size*0.55} ${size*0.5} Q ${size*0.75} ${size*0.28} ${size*0.85} ${size*0.38} Q ${size*0.78} ${size*0.18} ${size*0.58} ${size*0.32} Z" fill="#c9a84c" fill-opacity="0.25" stroke="#c9a84c" stroke-width="${size*0.018}"/>
  <!-- Shekinah glow -->
  <ellipse cx="${size*0.5}" cy="${size*0.46}" rx="${size*0.1}" ry="${size*0.08}" fill="#ffd700" fill-opacity="0.4"/>
  <!-- Poles -->
  <line x1="${size*0.28}" y1="${size*0.8}" x2="${size*0.28}" y2="${size*0.95}" stroke="#c9a84c" stroke-width="${size*0.035}" stroke-linecap="round"/>
  <line x1="${size*0.72}" y1="${size*0.8}" x2="${size*0.72}" y2="${size*0.95}" stroke="#c9a84c" stroke-width="${size*0.035}" stroke-linecap="round"/>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
