'use client'

import { useState } from 'react'
import { CalendarDays, Check, ChevronDown, Clock3, MapPin, MoreHorizontal, Paperclip, Plus, Sprout, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type FarmTaskDrawerProps = {
  open?: boolean
  onClose?: () => void
}

const fields = ['North 40 · Wheat', 'Creekside · Soybeans', 'West Orchard · Apples']

export function FarmTaskDrawer({ open = true, onClose }: FarmTaskDrawerProps) {
  const [selectedField, setSelectedField] = useState(fields[0])
  const [priority, setPriority] = useState('Routine')
  const [saved, setSaved] = useState(false)

  if (!open) return null

  return (
    <aside aria-label="Create farm task" className="w-full max-w-[430px] overflow-hidden rounded-[28px] border border-[#354238] bg-[#111914] text-[#F7F6F0] shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-[#354238] px-6 py-5">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E5B869]">Field operations</p>
          <h2 className="text-xl font-semibold tracking-tight">New farm task</h2>
        </div>
        <button aria-label="Close task drawer" onClick={onClose} className="rounded-full p-2 text-[#aab6aa] hover:bg-[#253128] hover:text-[#F7F6F0]">
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <label htmlFor="task-title" className="mb-2 block text-xs font-medium text-[#aab6aa]">Task name</label>
          <input id="task-title" defaultValue="Scout north field for rust" className="h-12 w-full rounded-xl border border-[#405044] bg-[#19231c] px-4 text-sm text-[#F7F6F0] outline-none transition placeholder:text-[#708073] focus:border-[#E5B869] focus:ring-2 focus:ring-[#E5B869]/20" />
        </div>

        <div>
          <label htmlFor="task-field" className="mb-2 block text-xs font-medium text-[#aab6aa]">Field</label>
          <div className="relative">
            <Sprout className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#E5B869]" />
            <select id="task-field" value={selectedField} onChange={(event) => setSelectedField(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-[#405044] bg-[#19231c] pl-11 pr-10 text-sm text-[#F7F6F0] outline-none focus:border-[#E5B869] focus:ring-2 focus:ring-[#E5B869]/20">
              {fields.map((field) => <option key={field}>{field}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#aab6aa]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#354238] bg-[#19231c] p-3">
            <div className="mb-3 flex items-center gap-2 text-[#aab6aa]"><CalendarDays className="size-4 text-[#E5B869]" /><span className="text-xs">Due date</span></div>
            <p className="text-sm font-medium">Today, Oct 23</p>
          </div>
          <div className="rounded-xl border border-[#354238] bg-[#19231c] p-3">
            <div className="mb-3 flex items-center gap-2 text-[#aab6aa]"><Clock3 className="size-4 text-[#E5B869]" /><span className="text-xs">Estimated</span></div>
            <p className="text-sm font-medium">2 hours</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-[#aab6aa]">Priority</span><span className="text-xs text-[#708073]">Set urgency</span></div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Task priority">
            {['Routine', 'Soon', 'Urgent'].map((item) => <button key={item} type="button" onClick={() => setPriority(item)} className={cn('rounded-lg border px-3 py-2.5 text-xs font-medium transition', priority === item ? 'border-[#E5B869] bg-[#E5B869]/12 text-[#E5B869]' : 'border-[#405044] text-[#aab6aa] hover:border-[#768977]')}>{item}</button>)}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#354238] pt-5">
          <div className="flex -space-x-2" aria-label="Assigned to field crew">
            {['ML', 'JD'].map((initials) => <span key={initials} className="flex size-8 items-center justify-center rounded-full border-2 border-[#111914] bg-[#496050] text-[10px] font-semibold text-[#F7F6F0]">{initials}</span>)}
            <button type="button" aria-label="Add assignee" className="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-[#536457] bg-[#19231c] text-[#E5B869]"><Plus className="size-3.5" /></button>
          </div>
          <div className="flex gap-1 text-[#aab6aa]"><button type="button" aria-label="Add location" className="rounded-lg p-2 hover:bg-[#253128]"><MapPin className="size-4" /></button><button type="button" aria-label="Attach file" className="rounded-lg p-2 hover:bg-[#253128]"><Paperclip className="size-4" /></button><button type="button" aria-label="More options" className="rounded-lg p-2 hover:bg-[#253128]"><MoreHorizontal className="size-4" /></button></div>
        </div>

        <button onClick={() => setSaved(true)} className="h-12 w-full rounded-xl bg-[#E5B869] font-semibold text-[#090D0B] hover:bg-[#f0ca82] transition-colors">{saved ? <div className="flex items-center justify-center"><Check className="mr-2 size-4" />Task added</div> : 'Add task'}</button>
      </div>
    </aside>
  )
}
