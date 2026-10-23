'use client';

import React, { useState } from 'react';
import { Truck, Calculator, IndianRupee, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from '@nexfield/ui';

interface TransportCalculatorProps {
  selectedMandiName: string;
  modalPrice: number;
}

export function TransportCalculator({ selectedMandiName, modalPrice }: TransportCalculatorProps) {
  const [distanceKm, setDistanceKm] = useState<number>(48);
  const [freightRatePerKmPerQuintal, setFreightRatePerKmPerQuintal] = useState<number>(1.25);
  const [batchQuantityQuintals, setBatchQuantityQuintals] = useState<number>(248); // 24.8 MT
  const [mandiCessPercent, setMandiCessPercent] = useState<number>(1.5);
  const [handlingFeePerQuintal, setHandlingFeePerQuintal] = useState<number>(12);

  // Calculations
  const grossFreightPerQuintal = distanceKm * freightRatePerKmPerQuintal;
  const mandiCessInrPerQuintal = (modalPrice * mandiCessPercent) / 100;
  const totalDeductionsPerQuintal = grossFreightPerQuintal + mandiCessInrPerQuintal + handlingFeePerQuintal;
  const netRealizationPerQuintal = modalPrice - totalDeductionsPerQuintal;
  const totalNetRevenue = netRealizationPerQuintal * batchQuantityQuintals;

  return (
    <Card className="border-[#273B2F] bg-[#111814]">
      <CardHeader className="pb-3 border-b border-[#1C2921]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4 text-emerald-400" />
            Freight & Net Realization Calculator
          </CardTitle>
          <Badge variant="outline" size="sm" className="font-mono text-[11px]">
            Target: {selectedMandiName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Haulage Distance (km)</label>
            <Input
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Freight Rate (₹/q/km)</label>
            <Input
              type="number"
              step="0.05"
              value={freightRatePerKmPerQuintal}
              onChange={(e) => setFreightRatePerKmPerQuintal(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Lot Quantity (Quintals)</label>
            <Input
              type="number"
              value={batchQuantityQuintals}
              onChange={(e) => setBatchQuantityQuintals(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">APMC Cess (%)</label>
            <Input
              type="number"
              step="0.1"
              value={mandiCessPercent}
              onChange={(e) => setMandiCessPercent(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>
        </div>

        {/* Calculation Outcome Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-[#0C120F] border border-[#1E2E25] font-mono">
          <div>
            <span className="text-[10px] text-[#637C6E] block">GROSS MODAL PRICE</span>
            <span className="text-sm font-bold text-[#F1F6F3]">₹{modalPrice}/q</span>
          </div>
          <div>
            <span className="text-[10px] text-rose-400 block">TOTAL LOGISTICS EXPENSE</span>
            <span className="text-sm font-bold text-rose-300">
              -₹{totalDeductionsPerQuintal.toFixed(1)}/q
            </span>
          </div>
          <div className="sm:border-l sm:border-[#1E2E25] sm:pl-3">
            <span className="text-[10px] text-emerald-400 block font-semibold">
              ESTIMATED NET REALIZATION
            </span>
            <span className="text-base font-bold text-emerald-300">
              ₹{netRealizationPerQuintal.toFixed(1)}/quintal
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-[#7C9788]">
          <span>
            Projected Consignment Gross Revenue ({batchQuantityQuintals} quintals):{' '}
            <strong className="text-emerald-400 font-mono">
              ₹{Math.round(totalNetRevenue).toLocaleString('en-IN')}
            </strong>
          </span>
          <span className="font-mono text-[#587566]">Source: Jules Mandi Transit Matrix</span>
        </div>
      </CardContent>
    </Card>
  );
}
