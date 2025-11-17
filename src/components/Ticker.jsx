import { useEffect, useMemo, useState } from 'react'

function number(value, opts = {}) {
  if (value == null || isNaN(value)) return '—'
  try {
    return new Intl.NumberFormat('pt-BR', opts).format(value)
  } catch {
    return String(value)
  }
}

export default function Ticker() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const fallback = useMemo(
    () => [
      { label: 'USDT/BRL', value: '5,01', change: '+0,2%' },
      { label: 'BTC', value: 'R$ 360.420', change: '+1,4%' },
      { label: 'ETH', value: 'R$ 18.950', change: '+0,8%' },
      { label: 'Gas (ETH)', value: '14 gwei', change: 'OK' },
      { label: 'Polygon', value: '12 gwei', change: 'Stable' },
      { label: 'Latência', value: '~120ms', change: 'Desk online' },
    ],
    []
  )

  useEffect(() => {
    let mounted = true
    const base = import.meta.env.VITE_BACKEND_URL

    const load = async () => {
      if (!base) return
      try {
        const res = await fetch(`${base}/ticker`)
        const json = await res.json()
        if (!mounted) return
        setData(json)
        setError(null)
      } catch (e) {
        if (!mounted) return
        setError('offline')
      }
    }

    load()
    const id = setInterval(load, 20000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  const items = useMemo(() => {
    if (!data) return fallback
    const list = []
    const usdtbrl = data?.prices?.USDTBRL
    const btcbrl = data?.prices?.BTCBRL
    const ethbrl = data?.prices?.ETHBRL
    const ethGas = data?.gas?.ETH_gwei
    const polyGas = data?.gas?.Polygon_gwei
    const latency = data?.status?.latency_ms

    list.push({ label: 'USDT/BRL', value: number(usdtbrl, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), change: 'ao vivo' })
    list.push({ label: 'BTC', value: `R$ ${number(btcbrl, { maximumFractionDigits: 0 })}`, change: 'spot' })
    list.push({ label: 'ETH', value: `R$ ${number(ethbrl, { maximumFractionDigits: 0 })}`, change: 'spot' })
    list.push({ label: 'Gas (ETH)', value: `${number(ethGas, { maximumFractionDigits: 0 })} gwei`, change: ethGas ? 'OK' : '—' })
    list.push({ label: 'Gas (Polygon)', value: `${number(polyGas, { maximumFractionDigits: 0 })} gwei`, change: polyGas ? 'OK' : '—' })
    list.push({ label: 'Latência', value: `${number(latency)} ms`, change: data?.status?.desk || '—' })

    return list
  }, [data, fallback])

  return (
    <div className="relative z-40 mt-[88px] border-y border-white/10 bg-black/60 text-white/80 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,85,0,0.10)_0%,transparent_10%,transparent_90%,rgba(255,85,0,0.10)_100%)]" />
      <div className="overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-8 py-3 [--tw:100%]">
          {[...items, ...items].map((it, idx) => (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
              <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/80">{it.label}</span>
              <span className="text-sm text-white">{it.value}</span>
              {it.change && (
                <span className={`text-xs ${it.change.includes('-') ? 'text-rose-300' : 'text-emerald-300'}`}>{it.change}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
