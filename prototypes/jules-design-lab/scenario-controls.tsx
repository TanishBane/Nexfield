'use client'

import { useState } from 'react'
import { CloudSun, Droplets, Layers3, Leaf, ThermometerSun, Wind } from 'lucide-react'

// Dummy components to simulate shadcn/ui for the isolated prototype
const Slider = (props: any) => <input type="range" {...props} className="w-full accent-[#10B981]" />
const Switch = (props: any) => <input type="checkbox" {...props} className="accent-[#10B981]" />

const layers = [
  { id: 'irrigation', label: 'Irrigation Layers', detail: 'Water coverage', icon: Droplets, defaultChecked: true },
  { id: 'thermal', label: 'Thermal Overlays', detail: 'Crop heat stress', icon: ThermometerSun, defaultChecked: true },
  { id: 'wind', label: 'Wind Vectors', detail: 'Current conditions', icon: Wind, defaultChecked: false },
]

export function ScenarioControls() {
  const [enabledLayers, setEnabledLayers] = useState(
    Object.fromEntries(layers.map((layer) => [layer.id, layer.defaultChecked])),
  )
  const [forecast, setForecast] = useState([62])

  const forecastHour = Math.round((forecast[0] / 100) * 24)
  const forecastLabel = forecastHour === 0 ? 'Now' : `+${forecastHour}h`

  return (
    <aside className="w-full max-w-[352px] rounded-[22px] border border-white/[0.09] bg-[#16201B]/90 p-5 text-[#F0F5F2] shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl" aria-label="Scenario controls">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981] ring-1 ring-inset ring-[#10B981]/20">
            <Leaf className="h-[18px] w-[18px]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A9D92]">Field intelligence</p>
            <h2 className="mt-1 text-[17px] font-medium tracking-tight">Scenario Controls</h2>
          </div>
        </div>
        <span className="mt-1 h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_12px_#10B981]" aria-label="Live" />
      </div>

      <div className="mb-5 rounded-2xl border border-white/[0.06] bg-[#090D0B]/35 p-3.5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CloudSun className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
            Time / Forecast
          </div>
          <span className="rounded-md bg-[#10B981]/10 px-2 py-1 font-mono text-[11px] font-medium text-[#63E6B0]">{forecastLabel}</span>
        </div>
        <Slider aria-label="Time and forecast" value={forecast} onChange={(e: any) => setForecast([Number(e.target.value)])} max={100} step={1} />
        <div className="mt-2 flex justify-between font-mono text-[10px] text-[#71847A]"><span>NOW</span><span>+12H</span><span>+24H</span></div>
      </div>

      <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71847A]"><Layers3 className="h-3.5 w-3.5" aria-hidden="true" /> Map layers</div>
      <div className="space-y-1">
        {layers.map(({ id, label, detail, icon: Icon }) => (
          <label key={id} className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-white/[0.04]">
            <span className="flex items-center gap-3">
              <Icon className={`h-[17px] w-[17px] ${enabledLayers[id] ? 'text-[#10B981]' : 'text-[#71847A]'}`} aria-hidden="true" />
              <span><span className="block text-sm text-[#DCE8E1]">{label}</span><span className="mt-0.5 block text-[11px] text-[#71847A]">{detail}</span></span>
            </span>
            <Switch checked={enabledLayers[id]} onChange={(e: any) => setEnabledLayers((current) => ({ ...current, [id]: e.target.checked }))} aria-label={`Toggle ${label}`} />
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-[11px] text-[#71847A]"><span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Simulation synced <span className="ml-auto font-mono text-[10px]">LIVE</span></div>
    </aside>
  )
}
