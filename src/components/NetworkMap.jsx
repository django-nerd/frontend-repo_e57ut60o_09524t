import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const hubs = [
  {
    id: 'saopaulo',
    name: 'São Paulo',
    country: 'Brasil',
    pos: { x: 0.36, y: 0.72 },
    volume24h: 18_500_000,
    pairs: ['USDT ⇄ BRL'],
    latencyMs: 95,
    status: 'Online',
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'EUA',
    pos: { x: 0.30, y: 0.42 },
    volume24h: 12_900_000,
    pairs: ['USDT ⇄ USD'],
    latencyMs: 120,
    status: 'Online',
  },
  {
    id: 'lisbon',
    name: 'Lisboa',
    country: 'Portugal',
    pos: { x: 0.50, y: 0.43 },
    volume24h: 6_300_000,
    pairs: ['USDT ⇄ EUR'],
    latencyMs: 150,
    status: 'Janela Europeia',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'EAU',
    pos: { x: 0.63, y: 0.50 },
    volume24h: 9_800_000,
    pairs: ['USDT ⇄ AED'],
    latencyMs: 170,
    status: 'Online',
  },
  {
    id: 'singapore',
    name: 'Singapura',
    country: 'Singapura',
    pos: { x: 0.78, y: 0.66 },
    volume24h: 7_400_000,
    pairs: ['USDT ⇄ SGD'],
    latencyMs: 210,
    status: 'APAC',
  },
]

function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
}

export default function NetworkMap() {
  const [active, setActive] = useState(null)

  const lines = useMemo(() => {
    // Create arcs between São Paulo and other hubs
    const sp = hubs[0]
    return hubs.slice(1).map((h) => ({ from: sp, to: h }))
  }, [])

  return (
    <section className="relative z-10 bg-black py-16 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_100%_0%,rgba(255,85,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Mapa de Liquidez Global</h2>
          <p className="mt-2 text-white/70">Clique nos hubs para ver volumes, pares e latência do desk.</p>
        </div>

        <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
          {/* map grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,85,0,0.08),transparent_40%)]" />
          <svg viewBox="0 0 1000 562" className="h-full w-full">
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
              const cy = Math.min(y1, y2) - 80 // raise control point
              const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
              return (
                <g key={idx}>
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
              return (
                <g key={h.id} onClick={() => setActive(h)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={6} fill="#FF5500" />
                  <circle cx={x} cy={y} r={14} fill="url(#glow)" opacity={0.28} />
                  <text x={x + 10} y={y - 10} fill="white" opacity={0.9} fontSize={12}>
                    {h.name}
                  </text>
                  {isActive && (
                    <>
                      <circle cx={x} cy={y} r={20} fill="none" stroke="rgba(255,85,0,0.6)" strokeWidth={1} />
                      <circle cx={x} cy={y} r={28} fill="none" stroke="rgba(255,85,0,0.3)" strokeWidth={1} />
                    </>
                  )}
                </g>
              )
            })}

            <defs>
              <radialGradient id="glow">
                <stop offset="0%" stopColor="rgba(255,85,0,0.5)" />
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
                    onClick={() => setActive(null)}
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
                    <div className="text-white">{active.latencyMs} ms</div>
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
