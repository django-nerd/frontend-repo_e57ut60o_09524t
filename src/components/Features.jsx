import { ShieldCheck, Zap, Rocket, Wallet } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Security-first',
    desc: 'Institutional-grade controls, KYB/KYC, multi-sig flows and real-time monitoring.',
  },
  {
    icon: Zap,
    title: 'Deep liquidity',
    desc: 'USDT ⇄ BRL at scale with competitive spreads and minimal slippage.',
  },
  {
    icon: Rocket,
    title: 'Near-instant settlement',
    desc: 'Move value across borders in minutes, not days—crypto-native rails.',
  },
  {
    icon: Wallet,
    title: 'Transparent pricing',
    desc: 'No hidden fees. Clear quotes up-front and tracked end-to-end.',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative z-10 bg-black py-20 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_0%_0%,rgba(255,85,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Why TCR Finance</h2>
          <p className="mt-3 text-white/70">Built for teams that need speed, reliability and compliant cross-border rails.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 backdrop-blur">
              <div className="absolute -top-10 right-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,85,0,0.25),transparent_60%)] blur-2xl" />
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5500] to-[#FF7733] text-black shadow-[0_8px_30px_rgba(255,85,0,0.35)]">
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
