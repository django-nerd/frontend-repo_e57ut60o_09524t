import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function Rates() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rates, setRates] = useState(null)
  const [amount, setAmount] = useState('1000')
  const [dir, setDir] = useState('USDT_TO_BRL')

  useEffect(() => {
    let active = true
    async function fetchRates() {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`${API}/rates`)
        if (!res.ok) throw new Error('Failed to load rates')
        const data = await res.json()
        if (active) setRates(data)
      } catch (e) {
        setError('Unable to fetch live rates right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchRates()
    const id = setInterval(fetchRates, 15000)
    return () => { active = false; clearInterval(id) }
  }, [])

  const converted = () => {
    const n = parseFloat(amount || '0')
    if (!rates || Number.isNaN(n)) return '—'
    if (dir === 'USDT_TO_BRL') return `R$ ${(n * rates.usdt_to_brl).toFixed(2)}`
    return `$ ${(n * rates.brl_to_usdt).toFixed(2)}`
  }

  return (
    <section id="rates" className="relative z-10 bg-black py-20 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_100%_0%,rgba(255,85,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Live Rates</h2>
            <p className="mt-2 text-white/70">Indicative quotes for USDT ⇄ BRL. Contact us for firm pricing and size.</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {loading && <p className="text-white/70">Loading latest quotes…</p>}
          {error && <p className="text-rose-300">{error}</p>}
          {rates && (
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <div className="text-sm text-white/60">USDT → BRL</div>
                  <div className="mt-1 text-3xl font-semibold">R$ {rates.usdt_to_brl.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">BRL → USDT</div>
                  <div className="mt-1 text-3xl font-semibold">$ {rates.brl_to_usdt.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Spread</div>
                  <div className="mt-1 text-3xl font-semibold">{rates.spread_bps} bps</div>
                </div>
              </div>

              <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <input value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#FF5500]" placeholder="Amount" />
                <select value={dir} onChange={(e) => setDir(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#FF5500]">
                  <option value="USDT_TO_BRL">USDT → BRL</option>
                  <option value="BRL_TO_USDT">BRL → USDT</option>
                </select>
                <div className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white/90">{converted()}</div>
              </div>

              <div className="text-xs text-white/50">Last updated: {new Date(rates.timestamp).toLocaleTimeString()}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
