import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,200,0.15),transparent_40%),radial-gradient(ellipse_at_bottom,rgba(0,140,255,0.15),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="text-balance bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Cross-border USDT ⇄ BRL made effortless
          </h1>
          <p className="mt-4 text-pretty text-base text-white/80 sm:text-lg">
            TCR Finance streamlines OTC and P2P settlements so you can move money internationally faster than traditional rails.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a href="#contact" className="pointer-events-auto inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 px-6 py-3 font-semibold text-black shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.02] active:scale-95">
            Get started
          </a>
          <a href="#rates" className="pointer-events-auto inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white/90 backdrop-blur transition hover:bg-white/10">
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
            <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 backdrop-blur">
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
