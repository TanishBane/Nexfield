import React from 'react';
import Link from 'next/link';
import { Boxes } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@nexfield/ui';

interface ResourceInventoryProps {
  inventorySummary: {
    seedStockKg: number;
    fertilizerStockBags: number;
    dieselLiters: number;
    lowStockAlerts: string[];
  };
}

export function ResourceInventory({ inventorySummary }: ResourceInventoryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Boxes className="h-4 w-4 text-emerald-400" />
            Resource Inventory Stocks
          </CardTitle>
          <Link href="/ops" className="text-xs text-emerald-400 hover:underline">
            Full Ledger
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs font-mono">
        <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
          <span className="text-[#8EA295]">Seed Foundation:</span>
          <span className="text-[#F1F6F3] font-bold">{inventorySummary.seedStockKg} kg</span>
        </div>
        <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
          <span className="text-[#8EA295]">Fertilizer Bags:</span>
          <span className="text-[#F1F6F3] font-bold">{inventorySummary.fertilizerStockBags} bags</span>
        </div>
        <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
          <span className="text-[#8EA295]">Diesel Reserve:</span>
          <span className="text-[#F1F6F3] font-bold">{inventorySummary.dieselLiters} L</span>
        </div>
        {inventorySummary.lowStockAlerts.length > 0 ? (
          <div className="p-2 rounded bg-amber-950/40 border border-amber-900/40 text-amber-300 text-[11px]">
            ⚠️ {inventorySummary.lowStockAlerts[0]}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
