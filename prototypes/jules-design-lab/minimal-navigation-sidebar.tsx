'use client'

import { useState } from 'react'
import {
  BrainCircuit,
  Boxes,
  CircleUserRound,
  Command,
  Gauge,
  Settings,
  SlidersHorizontal,
} from 'lucide-react'

// Dummy utility to replace the actual cn import
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

const navigationItems = [
  { label: 'Overview', icon: Gauge },
  { label: 'Control', icon: SlidersHorizontal },
  { label: 'Intelligence', icon: BrainCircuit },
  { label: 'Spatial', icon: Boxes },
  { label: 'Execution', icon: Command },
]

export function MinimalNavigationSidebar() {
  const [activeItem, setActiveItem] = useState('Overview')

  return (
    <aside
      aria-label="Primary navigation"
      className="fixed left-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-2 rounded-[2rem] border border-white/[0.08] bg-[#16201B]/80 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:left-6"
    >
      <nav className="flex flex-col items-center gap-1" aria-label="Workspace sections">
        {navigationItems.map(({ label, icon: Icon }) => {
          const isActive = activeItem === label

          return (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              title={label}
              onClick={() => setActiveItem(label)}
              className={cn(
                'group relative flex h-11 w-11 items-center justify-center rounded-full text-white/45 transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101612]',
                isActive && 'bg-[#10B981]/12 text-[#10B981] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.14)]',
              )}
            >
              <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 1.8} />
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -left-2 h-5 w-0.5 rounded-full bg-[#10B981] opacity-0 transition-opacity',
                  isActive && 'opacity-100',
                )}
              />
            </button>
          )
        })}
      </nav>

      <div className="my-1 h-px w-6 bg-white/[0.09]" />

      <button
        type="button"
        aria-label="Profile and settings"
        title="Profile and settings"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full text-white/45 transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101612]"
      >
        <CircleUserRound aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.8} />
        <Settings aria-hidden="true" className="absolute h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={2.25} />
      </button>
    </aside>
  )
}
