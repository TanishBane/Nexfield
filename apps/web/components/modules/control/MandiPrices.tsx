import React from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@nexfield/ui";

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
            <TrendingUp className="h-4 w-4 text-emerald-700" />
            Mandi Benchmark Rates
          </CardTitle>
          <Link
            href="/markets"
            className="text-xs text-emerald-700 hover:underline"
          >
            Arbitrage
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {relevantMandiPrices.map((mp, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD] font-mono"
          >
            <div>
              <span className="text-[#09251A] font-semibold block">
                {mp.commodity}
              </span>
              <span className="text-[11px] text-[#46604D]">
                {mp.marketName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 font-bold">
                ₹{mp.modalPricePerQuintalInr}/q
              </span>
              <span className="text-[10px] text-emerald-500 block">
                +{mp.dailyChangeInr} ₹/q
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
