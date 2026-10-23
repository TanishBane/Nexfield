'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowUpRight, CircleCheck, Clock3, Database, PackageCheck, Store } from 'lucide-react'

export function MarketIntelligenceTerminal() {
  const prices = [
    { commodity: 'Wheat · Sharbati', price: '2,425', arrival: '184.6', freshness: '2h ago', trend: '+3.8%' },
    { commodity: 'Soybean · Yellow', price: '4,780', arrival: '96.2', freshness: '38m ago', trend: '+1.2%' },
    { commodity: 'Cotton · MCU-5', price: '7,120', arrival: '42.8', freshness: '1h ago', trend: '-0.6%' },
    { commodity: 'Maize · Yellow', price: '2,180', arrival: '211.4', freshness: '12m ago', trend: '+2.1%' },
  ]

  return (
    <section className="rounded-xl border border-[#243129] bg-[#111714] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">
            <Store size={14} /> Market intelligence
          </div>
          <h2 className="mt-2 text-lg font-medium text-[#F0F5F2]">Mandi price terminal</h2>
          <p className="mt-1 text-xs text-[#9BB1A4]">Live regional pricing across monitored agricultural markets.</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#9BB1A4]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
          SYNCED 09:42:18 UTC
        </div>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-x-auto rounded-lg border border-[#243129]">
          <table className="w-full min-w-[620px] text-left">
            <thead className="bg-[#16201B] text-[10px] uppercase tracking-wider text-[#6d8578]">
              <tr>
                <th className="px-4 py-3 font-medium">Commodity</th>
                <th className="px-4 py-3 font-medium">Modal price</th>
                <th className="px-4 py-3 font-medium">Arrival MT</th>
                <th className="px-4 py-3 font-medium">Freshness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243129]">
              {prices.map((row) => (
                <tr key={row.commodity} className="text-sm">
                  <td className="px-4 py-3.5 font-medium text-[#F0F5F2]">{row.commodity}</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-[#F0F5F2]">
                    ₹{row.price} <span className={`ml-2 text-[10px] ${row.trend.startsWith('+') ? 'text-[#10B981]' : 'text-[#FB7185]'}`}>{row.trend}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-[#9BB1A4]">{row.arrival}</td>
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-[#9BB1A4]">{row.freshness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-[#243129] bg-[#16201B] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#F0F5F2]">Wheat price movement</p>
              <p className="mt-1 font-mono text-[10px] text-[#6d8578]">Last 30 days · ₹ / quintal</p>
            </div>
            <ArrowUpRight size={16} className="text-[#10B981]" />
          </div>
          <div className="relative mt-5 h-32 overflow-hidden rounded-md border border-[#294034] bg-[#111714]">
            <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-[#294034]" />
            <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-[#294034]" />
            <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-[#294034]" />
            <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 88 C32 82 42 90 70 72 S112 78 140 62 S178 70 205 48 S248 55 274 38 S316 45 344 27 S378 34 400 14" fill="none" stroke="#10B981" strokeWidth="3" />
              <path d="M0 88 C32 82 42 90 70 72 S112 78 140 62 S178 70 205 48 S248 55 274 38 S316 45 344 27 S378 34 400 14 V120 H0Z" fill="#10B981" fillOpacity=".08" />
            </svg>
          </div>
          <div className="mt-3 flex justify-between font-mono text-[9px] text-[#6d8578]">
            <span>30d ago</span><span>15d ago</span><span>Today</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function OpsInventoryLedger() {
  const inventory = [
    { item: 'Urea 46% N', type: 'Fertilizer', quantity: '18.4 MT', status: 'Available', hash: 'a8f2…91c4' },
    { item: 'Dripline 16mm', type: 'Irrigation', quantity: '12,800 m', status: 'Available', hash: 'c71b…4e20' },
    { item: 'Trichoderma', type: 'Bio-input', quantity: '420 kg', status: 'Low stock', hash: 'f09d…7a31' },
    { item: 'Solar pump SP-04', type: 'Equipment', quantity: '1 unit', status: 'In transit', hash: 'd62e…08bf' },
  ]
  return (
    <section className="rounded-xl border border-[#243129] bg-[#111714] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">
            <PackageCheck size={14} /> Operations ledger
          </div>
          <h2 className="mt-2 text-lg font-medium text-[#F0F5F2]">Inventory resources</h2>
          <p className="mt-1 text-xs text-[#9BB1A4]">Verified resource positions across North Basin Farm.</p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-[#16201B] px-3 py-2 font-mono text-[10px] text-[#9BB1A4]">
          <Database size={13} className="text-[#10B981]" /> LEDGER BLOCK 0842
        </div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-[#243129]">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-[#16201B] text-[10px] uppercase tracking-wider text-[#6d8578]">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#243129]">
            {inventory.map((row) => (
              <tr key={row.item} className="text-sm">
                <td className="px-4 py-3.5 font-medium text-[#F0F5F2]">{row.item}</td>
                <td className="px-4 py-3.5 text-[#9BB1A4]">{row.type}</td>
                <td className="px-4 py-3.5 font-mono tabular-nums text-[#F0F5F2]">{row.quantity}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs ${row.status === 'Available' ? 'text-[#10B981]' : row.status === 'Low stock' ? 'text-[#FBBF24]' : 'text-[#9BB1A4]'}`}>
                    {row.status === 'Available' ? <CircleCheck size={13} /> : row.status === 'Low stock' ? <AlertTriangle size={13} /> : <Clock3 size={13} />}
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-[#6d8578]">{row.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
