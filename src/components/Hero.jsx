import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Simple canvas animation: animated network arcs simulating money moving across the globe
function NetworkCanvas() {
  const ref = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(dpr, dpr)

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.scale(dpr, dpr)
    }

    window.addEventListener('resize', resize)

    // Points roughly mapped to canvas percents
    const hubs = [
      { name: 'São Paulo', x: 0.32, y: 0.62 },
      { name: 'New York', x: 0.25, y: 0.35 },
      { name: 'Lisbon', x: 0.47, y: 0.38 },
      { name: 'Dubai', x: 0.64, y: 0.47 },
      { name: 'Singapore', x: 0.80, y: 0.66 },
      { name: 'Buenos Aires', x: 0.30, y: 0.70 },
    ]

    function bezierPoint(t, p0, p1, p2) {
      // Quadratic bezier interpolation
      const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
      const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
      return { x, y }
    }

    // Create moving packets along arcs between hubs
    const routes = []
    for (let i = 0; i < 24; i++) {
      const a = hubs[Math.floor(Math.random() * hubs.length)]
      let b = hubs[Math.floor(Math.random() * hubs.length)]
      if (b === a) b = hubs[(hubs.indexOf(a) + 1) % hubs.length]
      const mid = {
        x: (a.x + b.x) / 2 + (Math.random() * 0.15 - 0.075),
        y: (a.y + b.y) / 2 - 0.12 - Math.random() * 0.06, // lift curve upward to simulate arc over globe
      }
      routes.push({
        from: a,
        to: b,
        ctrl: mid,
        t: Math.random(),
        speed: 0.0008 + Math.random() * 0.0018,
        hue: 20 + Math.random() * 20, // orange hues
      })
    }

    // Ambient starfield
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * 1,
      y: Math.random() * 1,
      a: 0.3 + Math.random() * 0.6,
      r: Math.random() * 1.2 + 0.4,
      s: Math.random() * 0.003 + 0.001,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Subtle vignette background
      const grd = ctx.createRadialGradient(width / 2, height * 0.9, 10, width / 2, height * 0.9, Math.max(width, height))
      grd.addColorStop(0, 'rgba(255,85,0,0.10)')
      grd.addColorStop(1, 'rgba(0,0,0,0.0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      // Starfield
      for (const s of stars) {
        s.a += s.s
        const alpha = 0.25 + 0.25 * Math.sin(s.a)
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Radar rings at center-bottom
      const cx = width / 2
      const cy = height * 0.85
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (i + 1) * 140, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,85,0,0.08)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw faint hubs
      for (const h of hubs) {
        const x = h.x * width
        const y = h.y * height
        ctx.beginPath()
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw arcs
      ctx.lineWidth = 1
      for (const r of routes) {
        // Path
        ctx.beginPath()
        ctx.moveTo(r.from.x * width, r.from.y * height)
        ctx.quadraticCurveTo(r.ctrl.x * width, r.ctrl.y * height, r.to.x * width, r.to.y * height)
        ctx.strokeStyle = 'rgba(255,255,255,0.07)'
        ctx.stroke()

        // Moving packet
        r.t += r.speed
        if (r.t > 1) r.t = 0
        const p = bezierPoint(r.t, { x: r.from.x * width, y: r.from.y * height }, { x: r.ctrl.x * width, y: r.ctrl.y * height }, { x: r.to.x * width, y: r.to.y * height })

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20)
        glow.addColorStop(0, `rgba(255,85,0,0.45)`)
        glow.addColorStop(1, 'rgba(255,85,0,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = `hsl(${r.hue}, 100%, 60%)`
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black text-white">
      {/* Animated blockchain network background */}
      <div className="absolute inset-0">
        <NetworkCanvas />
      </div>

      {/* Orange neon grids and vignette overlays */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_40%_at_50%_0%,rgba(255,85,0,0.12),transparent_60%),radial-gradient(40%_30%_at_0%_100%,rgba(255,85,0,0.10),transparent_60%),radial-gradient(40%_30%_at_100%_100%,rgba(255,85,0,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6))]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/70 backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF5500]" />
            Desk global em tempo real
          </div>
          <h1 className="text-balance bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Liquidez crypto para USDT ⇄ BRL, com alcance mundial
          </h1>
          <p className="mt-4 text-pretty text-base text-white/80 sm:text-lg">
            Envie e receba dinheiro através do mundo em minutos. Trilhas blockchain visíveis, execução transparente, spreads competitivos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a href="#contact" className="pointer-events-auto inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7733] px-6 py-3 font-semibold text-black shadow-[0_12px_40px_rgba(255,85,0,0.35)] transition-transform hover:scale-[1.02] active:scale-95">
            Começar agora
          </a>
          <a href="#rates" className="pointer-events-auto inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-medium text-white/90 backdrop-blur transition hover:bg-white/10">
            Ver cotações ao vivo
          </a>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            'OTC regulado',
            'P2P Desk',
            'Settlement instantâneo',
            'Best execution',
          ].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/80 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom glow */}
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,85,0,0.35),transparent_70%)] blur-3xl" />
    </section>
  )
}
