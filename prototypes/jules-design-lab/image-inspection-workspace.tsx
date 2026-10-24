'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  Crosshair,
  Download,
  FileText,
  Grid2X2,
  Layers3,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  ScanSearch,
  Sprout,
  Target,
} from 'lucide-react'

// Dummy wrapper to simulate components without complex dependencies for this visual prototype
function Button(props: any) {
  return <button {...props} className={`rounded-md ${props.className}`}>{props.children}</button>
}

const metrics = [
  { label: 'Affected area', value: '18.4', unit: '%', status: 'elevated' },
  { label: 'Confidence score', value: '94.7', unit: '%', status: 'good' },
  { label: 'Canopy coverage', value: '72.1', unit: '%', status: 'good' },
  { label: 'Stress index', value: '0.68', unit: 'NDVI', status: 'elevated' },
]

export function ImageInspectionWorkspace() {
  const [zoom, setZoom] = useState(1)
  const [activeTab, setActiveTab] = useState('assessment')
  const [marked, setMarked] = useState(false)

  return (
    <main className="min-h-screen bg-[#0b0f0d] text-[#e7eee9] selection:bg-emerald-500/30">
      <header className="flex h-16 items-center justify-between border-b border-[#25312b] bg-[#101612] px-5 lg:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-[#07100b] shadow-[0_0_24px_rgba(52,211,153,.22)]">
            <Sprout className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-wide text-white">FieldSight</span>
              <span className="rounded border border-[#304239] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#82988a]">Research</span>
            </div>
            <p className="text-[11px] text-[#6e8174]">Image inspection workspace</p>
          </div>
        </div>
      </header>

      <div className="border-b border-[#25312b] bg-[#0e1410] px-5 py-3 lg:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-[#8da095]">
            <span>Projects</span><span className="text-[#46574c]">/</span><span>North Field Trial</span><span className="text-[#46574c]">/</span><span className="text-[#dce8df]">Plot 04 · Canopy scan</span>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-105px)] min-h-[680px] p-3 lg:p-5 flex flex-row gap-4">
        {/* Left Pane (Image) */}
        <section className="flex-1 flex flex-col overflow-hidden rounded-xl border border-[#26352c] bg-[#111812] shadow-2xl">
          <div className="flex h-12 items-center justify-between border-b border-[#26352c] px-4">
            <div className="flex items-center gap-2 text-xs text-[#a3b5a9]"><Layers3 className="h-4 w-4 text-emerald-400" /> RGB / canopy detail</div>
          </div>
          <div className="relative flex-1 overflow-hidden bg-[#18221b]">
             <div className="absolute inset-7 overflow-hidden rounded-lg border border-[#516659] bg-[url('https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center shadow-2xl transition-transform duration-300" style={{ transform: `scale(${zoom})` }} role="img" aria-label="Close-up multispectral image of crop canopy">
                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-color" />
                <div className="absolute left-[38%] top-[29%] h-28 w-28 rounded-full border-2 border-crimson-400 border-[#f05252]/90 shadow-[0_0_0_9999px_rgba(7,16,10,.1),0_0_22px_rgba(240,82,82,.55)]" />
                <span className="absolute left-[39%] top-[24%] rounded bg-[#170e0e]/90 px-2 py-1 text-[10px] font-medium text-[#ff8888]">Stress cluster · 18.4%</span>
             </div>
             {/* Zoom Toolbar */}
             <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-[#405246] bg-[#111812]/95 p-1.5 shadow-lg backdrop-blur">
                <button onClick={() => setZoom(Math.max(.75, zoom - .15))} className="rounded p-2 text-[#b4c5b8] hover:bg-[#27382c]"><Minus className="h-4 w-4" /></button>
                <span className="min-w-12 text-center font-mono text-[11px] text-[#b8c8bc]">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(Math.min(1.8, zoom + .15))} className="rounded p-2 text-[#b4c5b8] hover:bg-[#27382c]"><Plus className="h-4 w-4" /></button>
             </div>
          </div>
        </section>

        {/* Right Pane (Data) */}
        <aside className="w-[400px] flex flex-col overflow-auto rounded-xl border border-[#26352c] bg-[#131b16] shadow-2xl">
          <div className="border-b border-[#26352c] px-6 py-5">
            <div className="mb-4 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7e9384]">Automated assessment</span></div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b1b1d] text-[#ff7272]"><AlertTriangle className="h-5 w-5" /></div>
              <div><h1 className="text-xl font-semibold tracking-tight text-white">Pathology Alert</h1><p className="mt-1 text-xs leading-relaxed text-[#9baca0]">Potential early-stage fungal infection detected in canopy sector B.</p></div>
            </div>
          </div>
          <div className="flex-1 px-6 py-5">
             <div className="mb-5 flex items-end justify-between">
                <div><p className="text-xs text-[#84988a]">Severity index</p><p className="mt-1 font-mono text-4xl font-medium tracking-tight text-[#ff7878]">0.74 <span className="text-sm text-[#a5b3a9]">/ 1.00</span></p></div>
             </div>
             <div className="overflow-hidden rounded-lg border border-[#2b3a30] bg-[#101711]">
               <div className="grid grid-cols-2 divide-x divide-[#2b3a30] border-b border-[#2b3a30]">{metrics.slice(0, 2).map((metric) => <Metric key={metric.label} {...metric} />)}</div>
               <div className="grid grid-cols-2 divide-x divide-[#2b3a30]">{metrics.slice(2).map((metric) => <Metric key={metric.label} {...metric} />)}</div>
             </div>
          </div>
          <div className="border-t border-[#26352c] p-6">
            <Button onClick={() => setMarked(!marked)} className={`flex items-center justify-center h-11 w-full gap-2 font-semibold shadow-lg ${marked ? 'bg-[#294e3a] text-emerald-100' : 'bg-emerald-500 text-[#07100b]'}`}>
              <FileText className="h-4 w-4" />{marked ? 'Marked for follow-up' : 'Mark for follow-up'}
            </Button>
          </div>
        </aside>
      </div>
    </main>
  )
}

function Metric({ label, value, unit, status }: { label: string; value: string; unit: string; status: string }) {
  return <div className="p-3.5"><p className="text-[10px] uppercase tracking-wide text-[#718478]">{label}</p><p className={`mt-1 font-mono text-lg ${status === 'elevated' ? 'text-[#ff8585]' : 'text-[#d8eadc]'}`}>{value}<span className="ml-1 text-[10px] text-[#829489]">{unit}</span></p></div>
}
