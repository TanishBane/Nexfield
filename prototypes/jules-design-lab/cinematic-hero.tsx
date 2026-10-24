import { ArrowUpRight, ChevronDown, Orbit } from 'lucide-react'

const navItems = ['Platform', 'Intelligence', 'Field Notes']

export function CinematicHero() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090D0B] text-white selection:bg-emerald-400/30 selection:text-emerald-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[42%] h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.08] blur-[120px]" />
        <div className="absolute -right-40 top-[-12rem] h-[36rem] w-[36rem] rounded-full bg-teal-400/[0.05] blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
        <div className="absolute left-1/2 top-[46%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/10 shadow-[0_0_120px_rgba(16,185,129,0.08),inset_0_0_100px_rgba(16,185,129,0.05)]" />
        <div className="absolute left-1/2 top-[46%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/[0.08]" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10" aria-label="Primary navigation">
        <a href="#top" className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-white/90" aria-label="Aether home">
          <span className="flex size-8 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10 text-emerald-300"><Orbit className="size-4" /></span>
          NEXFIELD / OS
        </a>
        <div className="hidden items-center gap-9 text-[11px] uppercase tracking-[0.2em] text-white/45 md:flex">
          {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="transition-colors hover:text-emerald-300">{item}</a>)}
        </div>
        <a href="#contact" className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 transition-colors hover:text-emerald-200">Enter the field <ArrowUpRight className="ml-1 inline size-3" /></a>
      </nav>

      <section id="top" className="relative z-10 mx-auto flex min-h-[calc(100vh-92px)] max-w-7xl flex-col justify-center px-6 pb-20 pt-14 lg:px-10">
        <div className="max-w-4xl">
          <div className="mb-8 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-emerald-300/80"><span className="h-px w-9 bg-emerald-400/70" />Planetary intelligence / 2026</div>
          <h1 className="max-w-4xl text-[clamp(3.6rem,9vw,8.8rem)] font-medium leading-[0.88] tracking-[-0.075em] text-white">Autonomous<br /><span className="text-white/35">Earth.</span> <span className="text-emerald-300">Synthesized.</span></h1>
          <p className="mt-9 max-w-lg text-base leading-7 text-white/50 md:text-lg">A living digital twin of our planet, revealing the hidden systems that shape every horizon.</p>
          <a href="#demo" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#10B981] px-6 py-3.5 text-sm font-semibold text-[#04120d] shadow-[0_0_0_1px_rgba(110,231,183,0.3),0_0_28px_rgba(16,185,129,0.38)] transition-all hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_0_0_1px_rgba(167,243,208,0.5),0_0_42px_rgba(16,185,129,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090D0B]">Launch Interactive Demo <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
        </div>
        <div className="mt-auto flex items-end justify-between pt-20 text-[10px] uppercase tracking-[0.25em] text-white/30"><span>01 / 03</span><span className="hidden sm:block">A new operating layer for the living world</span><a href="#explore" className="flex items-center gap-2 transition-colors hover:text-emerald-300"><ChevronDown className="size-4" /> Explore</a></div>
      </section>
    </main>
  )
}
