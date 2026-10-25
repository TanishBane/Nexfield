import React from "react";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@nexfield/ui";

interface ResourceInventoryProps {
  inventorySummary: {
    seedStockKg: number;
    fertilizerStockBags: number;
    dieselLiters: number;
    lowStockAlerts: string[];
  };
}

export function ResourceInventory({
  inventorySummary,
}: ResourceInventoryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Boxes className="h-4 w-4 text-emerald-700" />
            Resource Inventory Stocks
          </CardTitle>
          <Link
            href="/ops"
            className="text-xs text-emerald-700 hover:underline"
          >
            Full Ledger
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs font-mono">
        <div className="flex justify-between p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
          <span className="text-[#46604D]">Seed Foundation:</span>
          <span className="text-[#09251A] font-bold">
            {inventorySummary.seedStockKg} kg
          </span>
        </div>
        <div className="flex justify-between p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
          <span className="text-[#46604D]">Fertilizer Bags:</span>
          <span className="text-[#09251A] font-bold">
            {inventorySummary.fertilizerStockBags} bags
          </span>
        </div>
        <div className="flex justify-between p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
          <span className="text-[#46604D]">Diesel Reserve:</span>
          <span className="text-[#09251A] font-bold">
            {inventorySummary.dieselLiters} L
          </span>
        </div>
        {inventorySummary.lowStockAlerts.length > 0 ? (
          <div className="p-2 rounded bg-amber-50/40 border border-amber-900/40 text-amber-700 text-[11px]">
            ⚠️ {inventorySummary.lowStockAlerts[0]}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
