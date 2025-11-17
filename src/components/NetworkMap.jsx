import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Static geometry + identity + lat/lon for 3D globe
const GEO_HUBS = [
  { id: 'saopaulo', name: 'São Paulo', country: 'Brasil', pos: { x: 0.36, y: 0.72 }, lat: -23.55, lon: -46.63, pairs: ['USDT ⇄ BRL'] },
  { id: 'newyork', name: 'New York', country: 'EUA', pos: { x: 0.30, y: 0.42 }, lat: 40.71, lon: -74.01, pairs: ['USDT ⇄ USD'] },
  { id: 'lisbon', name: 'Lisboa', country: 'Portugal', pos: { x: 0.50, y: 0.43 }, lat: 38.72, lon: -9.14, pairs: ['USDT ⇄ EUR'] },
  { id: 'dubai', name: 'Dubai', country: 'EAU', pos: { x: 0.63, y: 0.50 }, lat: 25.20, lon: 55.27, pairs: ['USDT ⇄ AED'] },
  { id: 'singapore', name: 'Singapura', country: 'Singapura', pos: { x: 0.78, y: 0.66 }, lat: 1.35, lon: 103.82, pairs: ['USDT ⇄ SGD'] },
]

function formatBRL(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
}

// 3D helpers
function latLonToXYZ(lat, lon, r = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -r * Math.sin(phi) * Math.cos(theta)
  const z = r * Math.sin(phi) * Math.sin(theta)
  const y = r * Math.cos(phi)
  return [x, y, z]
}

function GlowPoint({ position, strength = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const s = 0.8 + 0.25 * Math.sin(t * 2 + position[0] * 5)
    if (ref.current) ref.current.scale.setScalar(s * (1 + strength * 0.8))
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.01 + 0.02 * strength, 16, 16]} />
      <meshBasicMaterial color={'#FF7733'} transparent opacity={0.95} />
    </mesh>
  )
}

function Globe3D({ hubs, onSelect }) {
  return (
    <Canvas camera={{ position: [0, 0, 2.1], fov: 50 }} className="absolute inset-0">
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={0.8} />

      {/* Sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#0b0b0b" metalness={0.2} roughness={0.85} />
      </mesh>

      {/* Subtle latitude/longitude grid lines */}
      <mesh>
        <sphereGeometry args={[1.001, 64, 64]} />
        <meshBasicMaterial color="white" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Hubs */}
      {hubs.map((h) => {
        const [x, y, z] = latLonToXYZ(h.lat, h.lon, 1.01)
        const strength = h.volume24h ? Math.min(1, h.volume24h / Math.max(1, Math.max(...hubs.map(x => x.volume24h || 1)))) : 0.2
        return (
          <group key={h.id} position={[x, y, z]} onClick={() => onSelect(h.id)}>
            <GlowPoint position={[0, 0, 0]} strength={strength} />
          </group>
        )
      })}

      <OrbitControls enablePan={false} minDistance={1.6} maxDistance={3.4} rotateSpeed={0.6} zoomSpeed={0.6} />
    </Canvas>
  )
}

export default function NetworkMap() {
  const [hubs, setHubs] = useState(
    GEO_HUBS.map((h) => ({ ...h, volume24h: null, latencyMs: null, status: '—' }))
  )
  const [activeId, setActiveId] = useState(null)
  const [mode, setMode] = useState('2d') // '2d' | '3d'

  // Pan & Zoom state for 2D SVG
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startOffX: 0, startOffY: 0 })

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

  // Heatmap helpers
  const maxVol = useMemo(() => Math.max(1, ...hubs.map((h) => h.volume24h || 0)), [hubs])
  const volNorm = (v) => Math.min(1, Math.max(0, (v || 0) / maxVol))

  // 2D interaction handlers
  const onWheel = (e) => {
    e.preventDefault()
    const delta = -e.deltaY
    const zoomIntensity = 0.0015
    const newScale = Math.min(3.5, Math.max(0.8, scale * (1 + delta * zoomIntensity)))

    // Zoom towards cursor
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = (e.clientX - rect.left) - offset.x
    const cy = (e.clientY - rect.top) - offset.y
    const sx = (newScale / scale)
    const nx = e.clientX - rect.left - cx * sx
    const ny = e.clientY - rect.top - cy * sx

    setScale(newScale)
    setOffset({ x: nx, y: ny })
  }

  const onPointerDown = (e) => {
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startOffX: offset.x, startOffY: offset.y }
  }
  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setOffset({ x: dragRef.current.startOffX + dx, y: dragRef.current.startOffY + dy })
  }
  const onPointerUp = () => {
    dragRef.current.dragging = false
  }

  return (
    <section className="relative z-10 bg-black py-16 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_100%_0%,rgba(255,85,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-semibold sm:text-4xl">Mapa de Liquidez Global</h2>
            <p className="mt-1 text-white/70">Clique nos hubs / arraste para navegar • zoom com scroll • alterne 2D/3D</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMode('2d')} className={`rounded-xl px-3 py-2 text-sm border ${mode==='2d'?'border-[#FF7733] bg-[#FF7733]/10 text-white':'border-white/15 text-white/70 hover:text-white hover:bg-white/5'}`}>Visão 2D</button>
            <button onClick={() => setMode('3d')} className={`rounded-xl px-3 py-2 text-sm border ${mode==='3d'?'border-[#FF7733] bg-[#FF7733]/10 text-white':'border-white/15 text-white/70 hover:text-white hover:bg-white/5'}`}>Globo 3D</button>
          </div>
        </div>

        <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
          {mode === '2d' ? (
            <div
              className="h-full w-full"
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {/* map grid overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(255,85,0,0.08),transparent_40%)]" />

              <svg viewBox="0 0 1000 562" className="h-full w-full" style={{ touchAction: 'none' }}>
                <g transform={`translate(${offset.x},${offset.y}) scale(${scale})`}>
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

                  {/* heatmap spots based on volume */}
                  {hubs.map((h) => {
                    const x = h.pos.x * 1000
                    const y = h.pos.y * 562
                    const inten = volNorm(h.volume24h)
                    const r = 80 + 120 * inten
                    const opacity = 0.10 + 0.25 * inten
                    return (
                      <g key={`heat-${h.id}`} pointerEvents="none">
                        <radialGradient id={`g-${h.id}`}>
                          <stop offset="0%" stopColor={`rgba(255,119,51,${0.45 * opacity})`} />
                          <stop offset="100%" stopColor="rgba(255,119,51,0)" />
                        </radialGradient>
                        <circle cx={x} cy={y} r={r} fill={`url(#g-${h.id})`} />
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
                        onPointerDown={(e) => { e.stopPropagation(); onSelect() }}
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
                </g>
              </svg>
            </div>
          ) : (
            <Globe3D hubs={hubs} onSelect={setActiveId} />
          )}

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
            {mode==='2d' ? 'Dica: arraste para mover • scroll para zoom • clique nos pontos' : 'Dica: arraste para rotacionar • scroll para zoom • clique nos pontos'}
          </div>
        </div>
      </div>
    </section>
  )
}
