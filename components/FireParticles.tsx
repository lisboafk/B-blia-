'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; size: number; color: string
}

const COLORS = ['#ff6b35', '#ff4500', '#ffd700', '#ff8c00', '#c9a84c']

export default function FireParticles({ count = 18, className = '' }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (): Particle => ({
      x: canvas.width * (0.3 + Math.random() * 0.4),
      y: canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(1.5 + Math.random() * 2),
      life: 0,
      maxLife: 60 + Math.random() * 40,
      size: 2 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })

    while (particles.current.length < count) {
      const p = spawn()
      p.life = Math.random() * p.maxLife
      particles.current.push(p)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current.forEach((p, i) => {
        p.life++
        p.x += p.vx + Math.sin(p.life * 0.1) * 0.3
        p.y += p.vy
        p.vy *= 0.99

        if (p.life >= p.maxLife) {
          particles.current[i] = spawn()
          return
        }

        const alpha = 1 - p.life / p.maxLife
        const r = p.size * (1 - p.life / p.maxLife * 0.5)
        ctx.save()
        ctx.globalAlpha = alpha * 0.7
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ display: 'block' }}
    />
  )
}
