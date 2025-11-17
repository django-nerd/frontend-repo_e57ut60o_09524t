import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Orange neon grids and vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_40%_at_50%_0%,rgba(255,85,0,0.15),transparent_60%),radial-gradient(40%_30%_at_0%_100%,rgba(255,85,0,0.12),transparent_60%),radial-gradient(40%_30%_at_100%_100%,rgba(255,85,0,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5))]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/70 backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF5500]" />
            Web3-native cross-border desk
          </div>
          <h1 className="text-balance bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Crypto liquidity for USDT ⇄ BRL, at lightspeed
          </h1>
          <p className="mt-4 text-pretty text-base text-white/80 sm:text-lg">
            OTC and P2P settlements on a dark, crypto-native rail. Faster than banks. Built for scale.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a href="#contact" className="pointer-events-auto inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7733] px-6 py-3 font-semibold text-black shadow-[0_12px_40px_rgba(255,85,0,0.35)] transition-transform hover:scale-[1.02] active:scale-95">
            Get started
          </a>
          <a href="#rates" className="pointer-events-auto inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-medium text-white/90 backdrop-blur transition hover:bg-white/10">
            See live rates
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            'Regulated OTC',
            'P2P Desk',
            'Instant Settlement',
            'Best Execution',
          ].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/80 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Glow bars */}
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,85,0,0.35),transparent_70%)] blur-3xl" />
    </section>
  )
}
