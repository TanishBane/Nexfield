'use client'

import { useState } from 'react'
import { Activity, AlertTriangle, BarChart3, Bell, BrainCircuit, ChevronDown, CloudRain, Droplets, Gauge, Hexagon, Leaf, LineChart, Map, Menu, MoreHorizontal, Play, Settings2, ShieldCheck, Sprout, Sun, Thermometer, Tractor, Wind, X } from 'lucide-react'

const modules = [
  { label: 'Control', icon: Gauge },
  { label: 'FieldSight', icon: Map },
  { label: 'Twin', icon: Hexagon },
  { label: 'Intelligence', icon: BrainCircuit },
  { label: 'Ops', icon: Tractor },
  { label: 'Markets', icon: BarChart3 },
]

export function NEXFIELDHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[#243129] bg-[#0b100d] px-5 sm:px-8">
      <div className="flex items-center gap-4">
        <button aria-label="Open navigation" onClick={onMenu} className="rounded-lg p-2 text-[#9BB1A4] hover:bg-[#16201B] lg:hidden"><Menu size={20} /></button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#10B981]">NEXFIELD / CONTROL</p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#F0F5F2]">Farm overview</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-[#243129] bg-[#111714] px-3 py-2 text-xs text-[#9BB1A4] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" /> Systems nominal</div>
        <button aria-label="Notifications" className="rounded-lg border border-[#243129] bg-[#111714] p-2.5 text-[#9BB1A4] hover:text-[#F0F5F2]"><Bell size={17} /></button>
        <div className="flex items-center gap-2 border-l border-[#243129] pl-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#1c4635] text-xs font-bold text-[#8bf0c4]">JD</div><span className="hidden text-sm text-[#F0F5F2] md:block">Jordan Davis</span><ChevronDown size={14} className="text-[#9BB1A4]" /></div>
      </div>
    </header>
  )
}

export function NEXFIELDSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const content = <aside className="flex h-full w-[224px] flex-col border-r border-[#243129] bg-[#0b100d] px-3 py-5">
    <div className="mb-9 flex items-center gap-3 px-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#10B981] text-[#07130e]"><Leaf size={19} strokeWidth={2.5} /></div><div><div className="text-sm font-bold tracking-[0.12em] text-[#F0F5F2]">NEXFIELD</div><div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#6d8578]">Agri intelligence</div></div><button onClick={onClose} className="ml-auto text-[#9BB1A4] lg:hidden"><X size={18} /></button></div>
    <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5c7467]">Workspace</p>
    <nav className="space-y-1">{modules.map(({ label, icon: Icon }, index) => <button key={label} className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${index === 0 ? 'bg-[#123d2d] text-[#8bf0c4]' : 'text-[#9BB1A4] hover:bg-[#16201B] hover:text-[#F0F5F2]'}`}><Icon size={18} strokeWidth={index === 0 ? 2.2 : 1.7} /><span>{label}</span>{index === 0 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#10B981]" />}</button>)}</nav>
    <div className="mt-auto space-y-1"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#9BB1A4] hover:bg-[#16201B]"><Settings2 size={18} />Settings</button><div className="mt-3 rounded-lg border border-[#26392f] bg-[#111714] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#F0F5F2]"><ShieldCheck size={15} className="text-[#10B981]" /> Data integrity</div><p className="font-mono text-[10px] leading-relaxed text-[#6d8578]">Last sync<br /><span className="text-[#9BB1A4]">Today, 09:42:18 UTC</span></p></div></div>
  </aside>
  return <div className={`fixed inset-y-0 left-0 z-40 transition-transform lg:static lg:block ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>{content}</div>
}

function Metric({ icon: Icon, label, value, detail, tone = 'emerald' }: { icon: typeof Thermometer; label: string; value: string; detail: string; tone?: 'emerald' | 'yellow' | 'rose' }) {
  const colors = { emerald: 'text-[#10B981] bg-[#123d2d]', yellow: 'text-[#FBBF24] bg-[#3c3215]', rose: 'text-[#FB7185] bg-[#3e1d28]' }
  return <div className="flex items-center gap-3"><div className={`grid h-8 w-8 place-items-center rounded-md ${colors[tone]}`}><Icon size={16} /></div><div><p className="text-[10px] uppercase tracking-wider text-[#6d8578]">{label}</p><p className="font-mono text-sm font-medium tabular-nums text-[#F0F5F2]">{value} <span className="text-xs text-[#6d8578]">{detail}</span></p></div></div>
}

export function FarmOverviewDashboard() {
  const [running, setRunning] = useState(false)
  return <main className="flex-1 overflow-auto bg-[#090D0B] p-5 sm:p-8"><div className="mx-auto max-w-[1380px]">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs text-[#6d8578]"><span className="text-[#10B981]">Overview</span><span>/</span><span>North Basin Farm</span></div><h2 className="text-2xl font-semibold tracking-tight text-[#F0F5F2]">Good morning, Jordan.</h2><p className="mt-1 text-sm text-[#9BB1A4]">Here&apos;s what&apos;s happening across your operation.</p></div><button className="flex w-fit items-center gap-2 rounded-lg border border-[#243129] bg-[#111714] px-3 py-2 text-xs text-[#9BB1A4] hover:text-[#F0F5F2]"><span className="h-2 w-2 rounded-full bg-[#10B981]" />North Basin Farm <ChevronDown size={14} /></button></div>
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <section className="rounded-xl border border-[#243129] bg-[#111714] p-5"><div className="mb-5 flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">Live conditions</p><h3 className="mt-1 text-base font-medium text-[#F0F5F2]">Weather intelligence</h3></div><div className="rounded-lg bg-[#16201B] p-2 text-[#FBBF24]"><Sun size={20} /></div></div><div className="flex items-end justify-between border-b border-[#243129] pb-5"><div><div className="font-mono text-5xl font-medium tracking-tighter tabular-nums text-[#F0F5F2]">72°</div><p className="mt-1 text-xs text-[#9BB1A4]">Clear skies · Feels like 70°</p></div><div className="text-right font-mono text-xs tabular-nums text-[#6d8578]">Updated 2 min ago<br /><span className="text-[#9BB1A4]">North Basin, CA</span></div></div><div className="grid grid-cols-2 gap-x-4 gap-y-5 pt-5 sm:grid-cols-4"><Metric icon={Droplets} label="Humidity" value="48" detail="%" /><Metric icon={Wind} label="Wind" value="8" detail="mph" /><Metric icon={CloudRain} label="Rainfall" value="0.0" detail="in" /><Metric icon={Thermometer} label="Soil temp" value="64" detail="°F" /></div></section>
      <section className="rounded-xl border border-[#243129] bg-[#111714] p-5"><div className="mb-5 flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">Field analysis</p><h3 className="mt-1 text-base font-medium text-[#F0F5F2]">Crop health assessment</h3></div><button aria-label="More options" className="text-[#6d8578] hover:text-[#F0F5F2]"><MoreHorizontal size={18} /></button></div><div className="flex items-center gap-6"><div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#10B981 0 86%, #243129 86% 100%)' }}><div className="grid h-20 w-20 place-items-center rounded-full bg-[#111714]"><span className="font-mono text-3xl font-medium tabular-nums text-[#F0F5F2]">86</span></div></div><div><p className="text-sm font-medium text-[#F0F5F2]">Healthy outlook</p><p className="mt-1 text-xs leading-relaxed text-[#9BB1A4]">Vegetative growth is tracking above the seasonal baseline.</p><div className="mt-3 flex items-center gap-2 text-xs text-[#10B981]"><Activity size={14} /> +4.2% vs. last week</div></div></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg bg-[#16201B] p-3"><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#6d8578]"><span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />Optimal</div><p className="font-mono text-lg tabular-nums text-[#F0F5F2]">74.8%</p><p className="mt-1 text-[10px] text-[#6d8578]">1,248 acres</p></div><div className="rounded-lg bg-[#16201B] p-3"><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#6d8578]"><span className="h-1.5 w-1.5 rounded-full bg-[#FB7185]" />Needs attention</div><p className="font-mono text-lg tabular-nums text-[#F0F5F2]">6.2%</p><p className="mt-1 text-[10px] text-[#6d8578]">103 acres</p></div></div></section>
    </div>
    <section className="mt-4 rounded-xl border border-[#243129] bg-[#111714] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">Digital twin</p><h3 className="mt-1 text-base font-medium text-[#F0F5F2]">Simulation controls</h3><p className="mt-1 text-xs text-[#9BB1A4]">Model a scenario to forecast field outcomes.</p></div><div className="flex items-center gap-2 rounded-md bg-[#16201B] px-3 py-2 font-mono text-[10px] text-[#9BB1A4]"><LineChart size={14} className="text-[#10B981]" />MODEL v2.4.1</div></div><div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end"><label className="block"><span className="mb-2 block text-xs text-[#9BB1A4]">Scenario</span><select className="w-full rounded-lg border border-[#304439] bg-[#16201B] px-3 py-2.5 text-sm text-[#F0F5F2] outline-none"><option>Standard growing season</option><option>Drought resilience test</option><option>Early harvest projection</option></select></label><div><div className="mb-2 flex justify-between text-xs text-[#9BB1A4]"><span>Water allocation</span><span className="font-mono tabular-nums text-[#F0F5F2]">68%</span></div><input aria-label="Water allocation" type="range" defaultValue="68" className="h-1.5 w-full accent-[#10B981]" /></div><button onClick={() => setRunning(!running)} className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${running ? 'bg-[#3c3215] text-[#FBBF24]' : 'bg-[#10B981] text-[#07130e] hover:bg-[#34d399]'}`}><Play size={15} fill="currentColor" />{running ? 'Simulation running' : 'Run simulation'}</button></div></section>
    <div className="mt-4 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-[#243129] bg-[#111714] p-4"><p className="text-xs text-[#9BB1A4]">Active fields</p><p className="mt-2 font-mono text-2xl tabular-nums text-[#F0F5F2]">12</p><p className="mt-1 text-[10px] text-[#10B981]">+2 this season</p></div><div className="rounded-xl border border-[#243129] bg-[#111714] p-4"><p className="text-xs text-[#9BB1A4]">Irrigation efficiency</p><p className="mt-2 font-mono text-2xl tabular-nums text-[#F0F5F2]">91.4%</p><p className="mt-1 text-[10px] text-[#10B981]">+6.8% vs. baseline</p></div><div className="rounded-xl border border-[#243129] bg-[#111714] p-4"><p className="text-xs text-[#9BB1A4]">Open alerts</p><p className="mt-2 font-mono text-2xl tabular-nums text-[#F0F5F2]">03</p><p className="mt-1 flex items-center gap-1 text-[10px] text-[#FBBF24]"><AlertTriangle size={11} /> 1 high priority</p></div></div>
  </div></main>
}

export function NEXFIELDApp() { const [sidebarOpen, setSidebarOpen] = useState(false); return <div className="flex h-screen overflow-hidden bg-[#090D0B]"><NEXFIELDSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><NEXFIELDHeader onMenu={() => setSidebarOpen(true)} /><FarmOverviewDashboard /></div></div> }
