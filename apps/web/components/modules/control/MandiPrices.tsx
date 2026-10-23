import React from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@nexfield/ui';

interface MandiPrice {
  commodity: string;
  marketName: string;
  modalPricePerQuintalInr: number;
  dailyChangeInr: number;
}

interface MandiPricesProps {
  relevantMandiPrices: MandiPrice[];
}

export function MandiPrices({ relevantMandiPrices }: MandiPricesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Mandi Benchmark Rates
          </CardTitle>
          <Link href="/markets" className="text-xs text-emerald-400 hover:underline">
            Arbitrage
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {relevantMandiPrices.map((mp, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25] font-mono"
          >
            <div>
              <span className="text-[#E1ECE5] font-semibold block">{mp.commodity}</span>
              <span className="text-[11px] text-[#718A7D]">{mp.marketName}</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold">₹{mp.modalPricePerQuintalInr}/q</span>
              <span className="text-[10px] text-emerald-500 block">+{mp.dailyChangeInr} ₹/q</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
