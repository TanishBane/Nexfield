'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRight, BrainCircuit, Cpu, Fingerprint, KeyRound, Leaf, LockKeyhole, Send, TerminalSquare } from 'lucide-react'

export function IntelligenceChatInterface() {
  const [query, setQuery] = useState('')
  return (
    <section className="flex min-h-[560px] flex-col rounded-xl border border-[#243129] bg-[#111714] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-[#243129] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">
            <BrainCircuit size={14} /> Intelligence node
          </div>
          <h2 className="mt-2 text-lg font-medium text-[#F0F5F2]">NEXFIELD assistant</h2>
          <p className="mt-1 text-xs text-[#9BB1A4]">Query field telemetry, models, and operational intelligence.</p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-[#16201B] px-3 py-2 font-mono text-[10px] text-[#9BB1A4]">
          <Cpu size={13} className="text-[#10B981]" /> ONLINE
        </div>
      </div>
      <div className="flex-1 space-y-6 py-6">
        <div className="flex justify-end">
          <div className="max-w-[82%] rounded-xl rounded-tr-sm bg-[#123d2d] px-4 py-3 text-sm text-[#F0F5F2]">
            What is causing the stress pattern in Field 07?
          </div>
        </div>
        <div className="flex max-w-[90%] gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#28513f] bg-[#16201B] text-[#10B981]">
            <BrainCircuit size={16} />
          </div>
          <div className="space-y-3">
            <div className="rounded-xl rounded-tl-sm border border-[#243129] bg-[#16201B] px-4 py-3 text-sm leading-relaxed text-[#F0F5F2]">
              Field 07 shows early-stage water stress concentrated along the western irrigation run. The strongest correlation is a 14% pressure drop at Zone C.
            </div>
            <div className="rounded-lg border border-[#294034] bg-[#0b100d] p-3">
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#10B981]">
                <TerminalSquare size={13} /> Tool execution chain
              </div>
              <div className="space-y-2 font-mono text-[11px] text-[#9BB1A4]">
                <p><span className="text-[#10B981]">01</span> Executed: query_multispectral_index <span className="text-[#6d8578]">[NDVI]</span></p>
                <p><span className="text-[#10B981]">02</span> Executed: compare_soil_moisture <span className="text-[#6d8578]">[14 samples]</span></p>
                <p><span className="text-[#10B981]">03</span> Executed: inspect_irrigation_pressure <span className="text-[#6d8578]">[Zone C]</span></p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-xs text-[#FBBF24]">
              <AlertTriangle size={13} /> Recommend inspection within 24 hours.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-[#243129] pt-4">
        <div className="flex gap-2 rounded-lg border border-[#304439] bg-[#16201B] p-2 focus-within:border-[#10B981]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask about your operation..." aria-label="Ask the NEXFIELD assistant" className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#F0F5F2] outline-none placeholder:text-[#6d8578]" />
          <button aria-label="Send query" className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#10B981] text-[#07130e] hover:bg-[#34d399]">
            <Send size={15} />
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-[#6d8578]">
          <LockKeyhole size={11} /> Queries are scoped to your organization's data boundary.
        </p>
      </div>
    </section>
  )
}

export function SignInTerminal() {
  return (
    <section className="flex min-h-[540px] items-center justify-center rounded-xl border border-[#243129] bg-[#090D0B] p-5 sm:p-8">
      <div className="w-full max-w-[430px] rounded-2xl border border-[#304439] bg-[#111714] p-6 shadow-2xl sm:p-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#10B981] text-[#07130e]">
              <Leaf size={21} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-[#F0F5F2]">NEXFIELD</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#6d8578]">Secure access terminal</p>
            </div>
          </div>
          <Fingerprint size={22} className="text-[#10B981]" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#10B981]">Enterprise gateway / 01</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F0F5F2]">Authenticate identity</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#9BB1A4]">Connect your verified enterprise credentials to access the control plane.</p>
        </div>
        <label className="mt-8 block">
          <span className="mb-2 block text-xs font-medium text-[#9BB1A4]">Enterprise ID</span>
          <div className="flex items-center gap-2 rounded-lg border border-[#304439] bg-[#16201B] px-3 py-3 focus-within:border-[#10B981]">
            <KeyRound size={16} className="text-[#6d8578]" />
            <input placeholder="NXF-0000-0000" className="w-full bg-transparent font-mono text-sm tracking-wider text-[#F0F5F2] outline-none placeholder:text-[#5c7467]" />
          </div>
        </label>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 py-3 text-sm font-semibold text-[#07130e] hover:bg-[#34d399]">
          Continue with FIDO2 Hardware Key <ArrowRight size={16} />
        </button>
        <div className="mt-8 flex items-center justify-between border-t border-[#243129] pt-4 font-mono text-[9px] uppercase tracking-wider text-[#6d8578]">
          <span className="flex items-center gap-1.5"><LockKeyhole size={11} /> End-to-end encrypted</span>
          <span className="text-[#FB7185]">Restricted system</span>
        </div>
      </div>
    </section>
  )
}
