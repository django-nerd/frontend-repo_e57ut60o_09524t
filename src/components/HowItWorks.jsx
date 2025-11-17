import { ArrowRight } from 'lucide-react'

const steps = [
  {
    title: 'Share your need',
    desc: 'Tell us your currency, amount, and timeline. We support USDT ⇄ BRL via OTC or P2P.',
  },
  {
    title: 'Instant quote',
    desc: 'We provide a clear, competitive quote with fees and expected settlement window.',
  },
  { title: 'Settle fast', desc: 'Fund and receive within minutes with full visibility along the way.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative z-10 bg-black py-20 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_100%,rgba(255,85,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">How it works</h2>
          <p className="mt-3 text-white/70">Three steps to fast, compliant cross-border transfers.</p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,85,0,0.25),transparent_60%)] blur-2xl" />
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80">{i + 1}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-white/70">{s.desc}</p>
              <div className="mt-4 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight className="h-5 w-5" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
