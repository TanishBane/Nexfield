'use client'

import { useState } from 'react'
import { CalendarDays, ClipboardList, LayoutGrid, Plus, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { label: 'Overview', icon: LayoutGrid },
  { label: 'Tasks', icon: ClipboardList },
  { label: 'Schedule', icon: CalendarDays },
  { label: 'Settings', icon: Settings2 },
]

export function MobileBottomNavigation() {
  const [active, setActive] = useState('Overview')
  return (
    <nav aria-label="Primary navigation" className="flex w-full max-w-[430px] items-center justify-between border-t border-[#354238] bg-[#111914]/95 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      {items.map(({ label, icon: Icon }) => {
        const isActive = active === label
        return <button key={label} type="button" aria-current={isActive ? 'page' : undefined} onClick={() => setActive(label)} className={cn('flex min-w-[64px] flex-col items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition', isActive ? 'text-[#E5B869]' : 'text-[#829083] hover:text-[#F7F6F0]')}><Icon className={cn('size-5', isActive && 'stroke-[2.5]')} /><span>{label}</span></button>
      })}
      <button type="button" aria-label="Create a new task" className="-mt-9 flex size-14 shrink-0 items-center justify-center rounded-2xl border-4 border-[#090D0B] bg-[#E5B869] text-[#090D0B] shadow-lg shadow-black/20 hover:bg-[#f0ca82]"><Plus className="size-6" /></button>
    </nav>
  )
}
