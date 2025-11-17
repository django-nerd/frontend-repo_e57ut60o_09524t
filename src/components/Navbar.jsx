import { useState } from 'react'
import { Menu, X, Coins, Phone, Mail } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { label: 'Products', href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'Rates', href: '#rates' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <a href="#" className="flex items-center gap-2">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-blue-500 text-black">
                <Coins className="h-5 w-5" />
              </div>
              <div className="text-white font-semibold tracking-tight">TCR Finance</div>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="text-sm text-white/80 hover:text-white transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a href="tel:+5511999999999" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 transition">
                <Phone className="h-4 w-4" /> Call
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 px-3 py-2 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-transform">
                <Mail className="h-4 w-4" /> Get started
              </a>
            </div>

            <button onClick={() => setOpen(!open)} className="md:hidden text-white/90" aria-label="Toggle menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {open && (
            <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="block rounded-lg px-3 py-2 text-white/90 hover:bg-white/10">
                  {item.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <a href="tel:+5511999999999" className="flex-1 text-center rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white">Call</a>
                <a href="#contact" className="flex-1 text-center rounded-lg bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 px-3 py-2 font-semibold text-black">Get started</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
