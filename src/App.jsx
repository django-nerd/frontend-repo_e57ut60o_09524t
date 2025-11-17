import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Rates from './components/Rates'
import HowItWorks from './components/HowItWorks'
import CTA from './components/CTA'
import Ticker from './components/Ticker'
import NetworkMap from './components/NetworkMap'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Ticker />
      <main>
        <Hero />
        <Features />
        <NetworkMap />
        <Rates />
        <HowItWorks />
        <CTA />
      </main>
      <footer className="relative z-10 border-t border-white/10 bg-black/80 py-10 text-white/70">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} TCR Finance. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
