'use client'

import { useState } from 'react'
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Grid2X2,
  Leaf,
  Map,
  Menu,
  Plus,
  Search,
  Settings2,
  Sprout,
  Tractor,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  icon: typeof Grid2X2
  active?: boolean
  badge?: string
}

const navItems: NavItem[] = [
  { label: 'Overview', icon: Grid2X2, active: true },
  { label: 'Fields', icon: Map, badge: '12' },
  { label: 'Crop health', icon: Leaf },
  { label: 'Operations', icon: Tractor },
  { label: 'Reports', icon: FileText },
]

export function MinimalSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 inline-flex size-10 items-center justify-center rounded-full border border-[#26352c] bg-[#101812] text-[#f7f6f0] shadow-lg lg:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>
      {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        aria-label="Primary navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-[#26352c] bg-[#090d0b] px-4 py-5 text-[#f7f6f0] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-2">
          <a href="#top" className="flex items-center gap-2.5" aria-label="NEXFIELD home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#e5b869] text-[#090d0b]"><Sprout className="size-4" aria-hidden="true" /></span>
            <span className="text-[15px] font-semibold tracking-[0.18em]">NEXFIELD</span>
          </a>
          <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="rounded-md p-1 text-[#9ca99e] hover:bg-[#17221b] hover:text-[#f7f6f0] lg:hidden"><X className="size-4" /></button>
        </div>

        <div className="mt-10 flex-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f7e73]">Workspace</p>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return <a key={item.label} href={`#${item.label.toLowerCase().replace(' ', '-')}`} onClick={() => setOpen(false)} className={cn('group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors', item.active ? 'bg-[#e5b869] font-medium text-[#090d0b]' : 'text-[#aeb9b0] hover:bg-[#17221b] hover:text-[#f7f6f0]')}><Icon className="size-4" aria-hidden="true" /><span className="flex-1">{item.label}</span>{item.badge && <span className={cn('text-[10px] font-medium', item.active ? 'text-[#4d3b1b]' : 'text-[#6f7e73]')}>{item.badge}</span>}</a>
            })}
          </nav>

          <p className="mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f7e73]">Manage</p>
          <nav className="mt-3 space-y-1">
            <a href="#team" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#aeb9b0] hover:bg-[#17221b] hover:text-[#f7f6f0]"><Users className="size-4" aria-hidden="true" />Team</a>
            <a href="#settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#aeb9b0] hover:bg-[#17221b] hover:text-[#f7f6f0]"><Settings2 className="size-4" aria-hidden="true" />Settings</a>
          </nav>
        </div>

        <div className="rounded-xl border border-[#26352c] bg-[#101812] p-3">
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#8dbf73]" /><span className="text-[11px] font-medium text-[#d7dfd4]">Field sync active</span></div>
          <p className="mt-2 text-[11px] leading-relaxed text-[#718077]">Last synced 4 min ago</p>
        </div>
        <button type="button" className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[#17221b]" aria-label="Open account menu"><span className="flex size-8 items-center justify-center rounded-full bg-[#344838] text-xs font-semibold text-[#e5b869]">AR</span><span className="flex-1"><span className="block text-xs font-medium">Alex Rios</span><span className="block text-[10px] text-[#718077]">Field manager</span></span><ChevronDown className="size-3.5 text-[#718077]" aria-hidden="true" /></button>
      </aside>
    </>
  )
}

const actionItems = [
  { label: 'Search', icon: Search, shortcut: '⌘ K' },
  { label: 'Add field', icon: Plus },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Alerts', icon: Bell, badge: '3' },
]

export function CompactActionBar() {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#26352c] bg-[#101812] p-1.5 shadow-2xl shadow-black/20" role="toolbar" aria-label="Quick actions">
      {actionItems.map((item) => { const Icon = item.icon; return <button key={item.label} type="button" aria-label={item.label} title={item.label} className="relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[#aeb9b0] transition-colors hover:bg-[#1b2a20] hover:text-[#f7f6f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b869]"> <Icon className="size-4" aria-hidden="true" /> <span className="hidden text-xs font-medium sm:inline">{item.label}</span>{item.shortcut && <kbd className="hidden rounded border border-[#344238] px-1.5 py-0.5 text-[10px] text-[#718077] md:inline">{item.shortcut}</kbd>}{item.badge && <span className="absolute right-1 top-1 flex size-3.5 items-center justify-center rounded-full bg-[#e5b869] text-[9px] font-bold text-[#090d0b]">{item.badge}</span>}</button> })}
      <span className="mx-1 h-5 w-px bg-[#26352c]" aria-hidden="true" />
      <button type="button" aria-label="Help center" title="Help center" className="inline-flex size-9 items-center justify-center rounded-lg text-[#718077] hover:bg-[#1b2a20] hover:text-[#f7f6f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b869]"><CircleHelp className="size-4" /></button>
    </div>
  )
}

export function NavigationPreview() {
  return <div id="top" className="flex min-h-screen bg-[#0d130f] text-[#f7f6f0]"><MinimalSidebar /><main className="min-w-0 flex-1"><header className="flex h-[76px] items-center justify-between border-b border-[#1d2a21] px-6 lg:px-10"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7e907f]">Tuesday, October 23, 2026</p><h1 className="mt-1 text-xl font-medium tracking-tight">Good morning, Alex.</h1></div><CompactActionBar /></header><section className="mx-auto max-w-6xl px-6 py-10 lg:px-10"><div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-[#26352c] bg-[#101812] p-5 md:col-span-2"><div className="flex items-start justify-between"><div><p className="text-xs text-[#8fa092]">Active acreage</p><p className="mt-3 text-4xl font-semibold tracking-tight">2,840 <span className="text-sm font-normal text-[#718077]">acres</span></p></div><div className="rounded-lg bg-[#1e3022] p-2 text-[#8dbf73]"><BarChart3 className="size-5" /></div></div><div className="mt-8 flex items-center gap-2 text-xs text-[#8dbf73]"><span className="rounded-full bg-[#203622] px-2 py-1">+8.4%</span><span className="text-[#718077]">from last season</span></div></div><div className="rounded-2xl border border-[#26352c] bg-[#101812] p-5"><p className="text-xs text-[#8fa092]">Crop health</p><p className="mt-3 text-4xl font-semibold tracking-tight">94<span className="text-xl text-[#e5b869]">%</span></p><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#26352c]"><div className="h-full w-[94%] rounded-full bg-[#8dbf73]" /></div><p className="mt-2 text-xs text-[#718077]">Within target range</p></div></div><div className="mt-4 rounded-2xl border border-dashed border-[#344238] bg-[#101812]/60 p-8 text-center"><Compass className="mx-auto size-6 text-[#e5b869]" /><h2 className="mt-3 text-sm font-medium">Your field command center</h2><p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#718077]">Use the navigation to explore field performance, crop health, and daily operations.</p></div></section></main></div>
}
