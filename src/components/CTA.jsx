export default function CTA() {
  return (
    <section id="contact" className="relative z-10 bg-black py-20 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_0%_50%,rgba(255,85,0,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 backdrop-blur">
          <div className="grid items-center gap-6 sm:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/70">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF5500]" />
                Desk online now
              </div>
              <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">Fale com o nosso desk</h3>
              <p className="mt-2 text-white/70">Conte seu fluxo e enviamos um quote em minutos.</p>
            </div>
            <form className="grid gap-3">
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#FF5500]" placeholder="Seu email" type="email" required />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#FF5500]" placeholder="Volume (ex: 50.000 BRL)" type="text" />
              <button type="submit" className="rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FF7733] px-6 py-3 font-semibold text-black shadow-[0_12px_40px_rgba(255,85,0,0.35)] transition-transform hover:scale-[1.02] active:scale-95">
                Solicitar cotação
              </button>
            </form>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-white/50">Ao continuar, você concorda com os Termos e reconhece a nossa Política de Privacidade.</p>
      </div>
    </section>
  )
}
