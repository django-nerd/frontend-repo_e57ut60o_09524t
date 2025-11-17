import { useMemo } from 'react'

export default function Ticker() {
  const items = useMemo(
    () => [
      { label: 'USDT/BRL', value: '5.01', change: '+0.2%' },
      { label: 'BTC', value: 'R$ 360.420', change: '+1.4%' },
      { label: 'ETH', value: 'R$ 18.950', change: '+0.8%' },
      { label: 'Gas (gwei)', value: '14', change: 'OK' },
      { label: 'Polygon', value: '12 TPS', change: 'Stable' },
      { label: 'TRON', value: '24 TPS', change: 'Stable' },
      { label: 'Latência', value: '~120ms', change: 'Desk online' },
    ],
    []
  )

  return (
    <div className="relative z-40 mt-[88px] border-y border-white/10 bg-black/60 text-white/80 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,85,0,0.10)_0%,transparent_10%,transparent_90%,rgba(255,85,0,0.10)_100%)]" />
      <div className="overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-8 py-3 [--tw:100%]">
          {[...items, ...items].map((it, idx) => (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
              <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/80">{it.label}</span>
              <span className="text-sm text-white">{it.value}</span>
              <span className={`text-xs ${it.change.includes('-') ? 'text-rose-300' : 'text-emerald-300'}`}>{it.change}</span>
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
