export default function CTA() {
  return (
    <section id="contact" className="relative z-10 bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-8 backdrop-blur">
          <div className="grid items-center gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold sm:text-3xl">Talk to our desk</h3>
              <p className="mt-2 text-white/70">Tell us your flow and we’ll get you a quote fast.</p>
            </div>
            <form className="grid gap-3">
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Your email" type="email" required />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Volume (e.g. 50,000 BRL)" type="text" />
              <button type="submit" className="rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 px-6 py-3 font-semibold text-black shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.02] active:scale-95">
                Request a quote
              </button>
            </form>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-white/50">By proceeding, you agree to our Terms and acknowledge our Privacy Policy.</p>
      </div>
    </section>
  )
}
