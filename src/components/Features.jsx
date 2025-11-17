import { ShieldCheck, ArrowLeftRight, Rocket, Wallet } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Security first',
    desc: 'Institutional-grade controls, KYB/KYC flows, and robust monitoring across every transfer.',
  },
  {
    icon: ArrowLeftRight,
    title: 'USDT ⇄ BRL liquidity',
    desc: 'Deep OTC and P2P liquidity to execute at competitive spreads with minimal slippage.',
  },
  {
    icon: Rocket,
    title: 'Fast settlement',
    desc: 'Move value across borders in minutes, not days—without the legacy friction.',
  },
  {
    icon: Wallet,
    title: 'Transparent pricing',
    desc: 'No hidden fees. Clear quotes up front and tracked from initiation to settlement.',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative z-10 bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Why TCR Finance</h2>
          <p className="mt-3 text-white/70">Built for teams that need speed, reliability, and compliant cross-border rails.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-blue-500 text-black">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
