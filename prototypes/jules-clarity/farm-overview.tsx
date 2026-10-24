'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  CloudSun,
  Droplets,
  FileText,
  MapPin,
  Plane,
  RefreshCcw,
  Sprout,
  Thermometer,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function FarmOverviewHero() {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-[#090D0B] p-8 md:p-12 text-[#F7F6F0] shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599981504996-5fc712ad64bd?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090D0B] via-[#090D0B]/80 to-transparent" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2A3F32] bg-[#14231B]/80 px-3 py-1.5 text-xs font-medium text-[#A4B8AB] backdrop-blur-md">
              <span className="flex size-2 rounded-full bg-[#E5B869] animate-pulse" />
              Valley View Parcel A
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[#F7F6F0]">
              Wheat & Canola Canopy
            </h1>
            <p className="mt-2 text-lg text-[#A4B8AB]">
              450 Hectares · Operational State Nominal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#2A3F32] bg-[#14231B]/80 p-4 backdrop-blur-md">
              <CloudSun className="size-8 text-[#E5B869]" />
              <div>
                <p className="text-xl font-semibold">24°C</p>
                <p className="text-xs text-[#A4B8AB]">Partly Sunny</p>
              </div>
            </div>
            <button className="flex h-16 items-center gap-2 rounded-2xl bg-[#E5B869] px-6 font-semibold text-[#090D0B] transition-colors hover:bg-[#F3C97E]">
              <RefreshCcw className="size-5" />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PriorityActionCard() {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#E5B869]/30 bg-[#1A1813] p-6 transition-all hover:border-[#E5B869]/60 hover:shadow-[0_0_30px_rgba(229,184,105,0.1)]">
      <div className="flex items-start justify-between">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-[#33250F] px-2 py-1 text-xs font-semibold text-[#E5B869]">
          <AlertTriangle className="size-3.5" />
          Priority 01
        </div>
        <span className="text-xs font-medium text-[#888]">4m ago</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-[#F7F6F0]">Canopy Nitrogen Deficit</h3>
      <p className="mt-1 text-sm text-[#A4B8AB]">Sector 4C · Moderate stress detected via NIR</p>

      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E5B869] px-4 py-3 text-sm font-semibold text-[#090D0B] transition-transform group-hover:scale-[1.02]">
        Review & Schedule Bio-Spray
        <ArrowRight className="size-4" />
      </button>
    </div>
  )
}

export function ResponsiveDataPanel() {
  const metrics = [
    { label: 'Mean NDVI Canopy Health', value: '0.78', trend: '+0.04', status: 'optimal', icon: Activity },
    { label: 'Root-Zone Moisture', value: '28.4%', trend: 'stable', status: 'optimal', icon: Droplets },
    { label: 'Fleet Readiness', value: '4/4', trend: 'active', status: 'optimal', icon: Tractor },
    { label: 'Projected Yield Forecast', value: '4.6', unit: 'T/Ha', trend: '+8%', status: 'optimal', icon: TrendingUp },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <div key={i} className="flex flex-col justify-between rounded-3xl border border-[#2A3F32] bg-[#14231B] p-6">
          <div className="flex items-center justify-between text-[#A4B8AB]">
            <span className="text-sm font-medium">{metric.label}</span>
            <metric.icon className="size-5 opacity-50" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#F7F6F0]">{metric.value}</span>
            {metric.unit && <span className="text-sm text-[#A4B8AB]">{metric.unit}</span>}
          </div>
          <div className="mt-2 text-xs font-medium text-[#E5B869]">
            {metric.trend.startsWith('+') ? '↑ ' : ''}{metric.trend} {metric.status === 'optimal' ? '· Optimal' : ''}
          </div>
        </div>
      ))}
    </div>
  )
}

export function FarmQuickActions() {
  const actions = [
    { label: 'Dispatch UAV', icon: Plane },
    { label: 'Run Irrigation', icon: Droplets },
    { label: 'Log Observation', icon: FileText },
    { label: 'Export Brief', icon: Activity },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action, i) => (
        <button key={i} className="flex items-center gap-2 rounded-xl border border-[#2A3F32] bg-[#0E1712] px-4 py-3 text-sm font-medium text-[#F7F6F0] transition-colors hover:bg-[#1A2A22] hover:border-[#3B5746]">
          <action.icon className="size-4 text-[#A4B8AB]" />
          {action.label}
        </button>
      ))}
    </div>
  )
}
