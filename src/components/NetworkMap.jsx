import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Static geometry + identity
const GEO_HUBS = [
  { id: 'saopaulo', name: 'São Paulo', country: 'Brasil', pos: { x: 0.36, y: 0.72 }, pairs: ['USDT ⇄ BRL'] },
  { id: 'newyork', name: 'New York', country: 'EUA', pos: { x: 0.30, y: 0.42 }, pairs: ['USDT ⇄ USD'] },
  { id: 'lisbon', name: 'Lisboa', country: 'Portugal', pos: { x: 0.50, y: 0.43 }, pairs: ['USDT ⇄ EUR'] },
  { id: 'dubai', name: 'Dubai', country: 'EAU', pos: { x: 0.63, y: 0.50 }, pairs: ['USDT ⇄ AED'] },
  { id: 'singapore', name: 'Singapura', country: 'Singapura', pos: { x: 0.78, y: 0.66 }, pairs: ['USDT ⇄ SGD'] },
]

function formatBRL(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
}

export default function NetworkMap() {
  const [hubs, setHubs] = useState(
    GEO_HUBS.map((h) => ({ ...h, volume24h: null, latencyMs: null, status: '—' }))
  )
  const [activeId, setActiveId] = useState(null)

  // Build arc connections São Paulo -> others
  const lines = useMemo(() => {
    const sp = GEO_HUBS[0]
    return GEO_HUBS.slice(1).map((h) => ({ from: sp, to: h }))
  }, [])

  // Fetch dynamic metrics from backend and merge by id
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_URL
    let mounted = true

    const mergeMetrics = (payload) => {
      if (!payload?.hubs) return
      const next = GEO_HUBS.map((geo) => {
        const snap = payload.hubs.find((x) => x.id === geo.id)
        return {
          ...geo,
          volume24h: snap?.volume24h ?? null,
          latencyMs: snap?.latencyMs ?? null,
          status: snap?.status ?? '—',
        }
      })
      if (mounted) setHubs(next)
    }

    const load = async () => {
      if (!base) return
      try {
        const res = await fetch(`${base}/hubs`)
        const json = await res.json()
        mergeMetrics(json)
      } catch {
        // keep existing values as graceful fallback
      }
    }

    load()
    const id = setInterval(load, 25000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  const active = useMemo(() => hubs.find((h) => h.id === activeId) || null, [hubs, activeId])

  return (
    <section className="relative z-10 bg-black py-16 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_100%_0%,rgba(255,85,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Mapa de Liquidez Global</h2>
          <p className="mt-2 text-white/70">Clique nos hubs para ver volumes, pares e latência do desk.</p>
        </div>

        <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
          {/* map grid overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(255,85,0,0.08),transparent_40%)]" />

          <svg viewBox="0 0 1000 562" className="h-full w-full" style={{ touchAction: 'manipulation' }}>
            {/* Subtle graticule */}
            {[...Array(12)].map((_, i) => (
              <line key={`v${i}`} x1={(i + 1) * (1000 / 13)} y1={0} x2={(i + 1) * (1000 / 13)} y2={562} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
            {[...Array(5)].map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(i + 1) * (562 / 6)} x2={1000} y2={(i + 1) * (562 / 6)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* arcs */}
            {lines.map(({ from, to }, idx) => {
              const x1 = from.pos.x * 1000
              const y1 = from.pos.y * 562
              const x2 = to.pos.x * 1000
              const y2 = to.pos.y * 562
              const cx = (x1 + x2) / 2
              const cy = Math.min(y1, y2) - 80
              const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
              return (
                <g key={idx} pointerEvents="none">
                  <path d={path} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                  <motion.circle r={3} fill="#FF7733">
                    <animateMotion dur={`${6 + idx}s`} repeatCount="indefinite" path={path} />
                    <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
                  </motion.circle>
                </g>
              )
            })}

            {/* hubs */}
            {hubs.map((h) => {
              const x = h.pos.x * 1000
              const y = h.pos.y * 562
              const isActive = active?.id === h.id
              const onSelect = () => setActiveId(h.id)
              return (
                <g
                  key={h.id}
                  onClick={onSelect}
                  onPointerDown={onSelect}
                  className="cursor-pointer"
                  style={{ pointerEvents: 'all' }}
                  role="button"
                  tabIndex={0}
                >
                  <circle cx={x} cy={y} r={10} fill="#FF5500" opacity={0.95} />
                  <circle cx={x} cy={y} r={18} fill="url(#glow)" opacity={0.35} />
                  <text x={x + 12} y={y - 10} fill="white" opacity={0.9} fontSize={12} style={{ pointerEvents: 'none' }}>
                    {h.name}
                  </text>
                  {isActive && (
                    <>
                      <circle cx={x} cy={y} r={24} fill="none" stroke="rgba(255,85,0,0.7)" strokeWidth={1} />
                      <circle cx={x} cy={y} r={32} fill="none" stroke="rgba(255,85,0,0.35)" strokeWidth={1} />
                    </>
                  )}
                </g>
              )
            })}

            <defs>
              <radialGradient id="glow">
                <stop offset="0%" stopColor="rgba(255,85,0,0.6)" />
                <stop offset="100%" stopColor="rgba(255,85,0,0)" />
              </radialGradient>
            </defs>
          </svg>

          {/* side panel */}
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="pointer-events-auto absolute right-4 top-4 w-[320px] rounded-2xl border border-white/10 bg-black/70 p-4 text-white/90 backdrop-blur"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{active.name}</h3>
                    <p className="text-xs text-white/60">{active.country}</p>
                  </div>
                  <button
                    onClick={() => setActiveId(null)}
                    className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white/70 hover:text-white hover:bg-white/5"
                  >
                    Fechar
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Volume 24h</div>
                    <div className="text-white">{formatBRL(active.volume24h)}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Latência</div>
                    <div className="text-white">{active.latencyMs != null ? `${active.latencyMs} ms` : '—'}</div>
                  </div>
                  <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Pares</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {active.pairs.map((p) => (
                        <span key={p} className="rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Status</div>
                    <div className="mt-1 text-white">{active.status}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* hint */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/70">
            Dica: clique nos pontos laranja
          </div>
        </div>
      </div>
    </section>
  )
}
