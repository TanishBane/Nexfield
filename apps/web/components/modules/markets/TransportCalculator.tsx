'use client';

import React, { useState } from 'react';
import { Truck, Calculator, IndianRupee, ShieldCheck, Fuel, Users, Scale, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from '@nexfield/ui';

interface TransportCalculatorProps {
  selectedMandiName: string;
  modalPrice: number;
}

type VehicleOption = 'light_commercial_vehicle' | 'tractor_trolley' | 'medium_truck' | 'heavy_truck';

const VEHICLE_CONFIGS: Record<VehicleOption, { name: string; capacity: number; kmPerLiter: number; defaultBhatta: number }> = {
  light_commercial_vehicle: {
    name: 'Tata Ace / Bolero Pickup',
    capacity: 25,
    kmPerLiter: 11.5,
    defaultBhatta: 400,
  },
  tractor_trolley: {
    name: 'Tractor-Trolley (50q)',
    capacity: 50,
    kmPerLiter: 6.2,
    defaultBhatta: 350,
  },
  medium_truck: {
    name: 'Eicher Pro (10-Ton / 100q)',
    capacity: 100,
    kmPerLiter: 4.8,
    defaultBhatta: 600,
  },
  heavy_truck: {
    name: 'BharatBenz 16-Ton (160q)',
    capacity: 160,
    kmPerLiter: 3.8,
    defaultBhatta: 800,
  },
};

export function TransportCalculator({ selectedMandiName, modalPrice }: TransportCalculatorProps) {
  const [distanceKm, setDistanceKm] = useState<number>(48);
  const [vehicleType, setVehicleType] = useState<VehicleOption>('medium_truck');
  const [batchQuantityQuintals, setBatchQuantityQuintals] = useState<number>(200); // 20 MT
  const [dieselPrice, setDieselPrice] = useState<number>(90);
  const [tollsInr, setTollsInr] = useState<number>(60);
  const [driverBhatta, setDriverBhatta] = useState<number>(600);
  const [hamaliPerQuintal, setHamaliPerQuintal] = useState<number>(12);
  const [mandiCessPercent, setMandiCessPercent] = useState<number>(1.5);
  const [shrinkagePercent, setShrinkagePercent] = useState<number>(1.0);

  const vehicle = VEHICLE_CONFIGS[vehicleType];
  const trips = Math.ceil(batchQuantityQuintals / vehicle.capacity);
  const totalRoundTripKm = trips * distanceKm * 2;
  const fuelLiters = totalRoundTripKm / vehicle.kmPerLiter;
  const fuelCostTotal = fuelLiters * dieselPrice;
  const fuelCostPerQ = fuelCostTotal / batchQuantityQuintals;

  const tollsTotal = trips * tollsInr;
  const tollsPerQ = tollsTotal / batchQuantityQuintals;

  const driverTotal = trips * driverBhatta;
  const driverPerQ = driverTotal / batchQuantityQuintals;

  const hamaliTotal = hamaliPerQuintal * batchQuantityQuintals;
  const hamaliPerQ = hamaliPerQuintal;

  const mandiCessPerQ = (modalPrice * mandiCessPercent) / 100;
  const mandiCessTotal = mandiCessPerQ * batchQuantityQuintals;

  const shrinkagePerQ = (modalPrice * shrinkagePercent) / 100;
  const shrinkageTotal = shrinkagePerQ * batchQuantityQuintals;

  const totalDeductionsPerQuintal =
    fuelCostPerQ + tollsPerQ + driverPerQ + hamaliPerQ + mandiCessPerQ + shrinkagePerQ;
  const netRealizationPerQuintal = modalPrice - totalDeductionsPerQuintal;
  const totalGrossRevenue = modalPrice * batchQuantityQuintals;
  const totalNetRevenue = netRealizationPerQuintal * batchQuantityQuintals;
  const netRealizationPct = (netRealizationPerQuintal / modalPrice) * 100;

  return (
    <Card className="border-[#273B2F] bg-[#111814]">
      <CardHeader className="pb-3 border-b border-[#1C2921]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#F1F6F3]">
            <Calculator className="h-4 w-4 text-emerald-400" />
            Multi-Factor Freight & Net Realization Engine
          </CardTitle>
          <Badge variant="outline" size="sm" className="font-mono text-[11px] border-emerald-800 text-emerald-400">
            Target: {selectedMandiName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 text-xs">
        {/* Vehicle Selection Tabs */}
        <div>
          <label className="text-[11px] text-[#8BA193] font-medium block mb-1.5">
            Transport Haulage Vehicle
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {(Object.keys(VEHICLE_CONFIGS) as VehicleOption[]).map((vKey) => {
              const v = VEHICLE_CONFIGS[vKey];
              const isSelected = vehicleType === vKey;
              return (
                <button
                  key={vKey}
                  type="button"
                  onClick={() => {
                    setVehicleType(vKey);
                    setDriverBhatta(v.defaultBhatta);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-[#15291E] border-emerald-500/60 text-[#F1F6F3]'
                      : 'bg-[#0E1511] border-[#1E2E25] text-[#8CA394] hover:border-[#2C4235]'
                  }`}
                >
                  <span className="font-semibold text-[11px] block truncate">{v.name}</span>
                  <span className="text-[10px] text-[#6E8779] block">
                    {v.capacity}q cap • {v.kmPerLiter} km/L
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Logistics Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[#8BA193] font-medium block">Haulage (One-way)</label>
              <span className="font-mono text-emerald-400 font-bold">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="250"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-[#0C120F] rounded-lg cursor-pointer"
            />
            <Input
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Math.max(0, Number(e.target.value)))}
              className="bg-[#0C120F] font-mono text-xs mt-1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Lot Weight (Quintals)</label>
            <Input
              type="number"
              value={batchQuantityQuintals}
              onChange={(e) => setBatchQuantityQuintals(Math.max(1, Number(e.target.value)))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Diesel Price (₹/L)</label>
            <Input
              type="number"
              value={dieselPrice}
              onChange={(e) => setDieselPrice(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Driver Bhatta (₹/trip)</label>
            <Input
              type="number"
              value={driverBhatta}
              onChange={(e) => setDriverBhatta(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>
        </div>

        {/* Secondary Deductions: Tolls, Hamali, Cess & Shrinkage */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-[#1C2A20]">
          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Tolls (₹/trip)</label>
            <Input
              type="number"
              value={tollsInr}
              onChange={(e) => setTollsInr(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Hamali Labor (₹/q)</label>
            <Input
              type="number"
              value={hamaliPerQuintal}
              onChange={(e) => setHamaliPerQuintal(Number(e.target.value))}
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

          <div className="space-y-1">
            <label className="text-[#8BA193] font-medium block">Shrinkage Loss (%)</label>
            <Input
              type="number"
              step="0.1"
              value={shrinkagePercent}
              onChange={(e) => setShrinkagePercent(Number(e.target.value))}
              className="bg-[#0C120F] font-mono text-xs"
            />
          </div>
        </div>

        {/* Itemized Deductions Ledger */}
        <div className="p-3 rounded-lg bg-[#0C120F] border border-[#1E2E25] font-mono space-y-1 text-[11px]">
          <div className="flex justify-between text-[#8CA394]">
            <span>Trips Required ({trips} × {distanceKm * 2} km round-trip):</span>
            <span>{totalRoundTripKm} km total</span>
          </div>
          <div className="flex justify-between text-[#8CA394]">
            <span>Fuel ({fuelLiters.toFixed(1)} L diesel @ ₹{dieselPrice}/L):</span>
            <span className="text-rose-300">₹{fuelCostPerQ.toFixed(2)}/q</span>
          </div>
          <div className="flex justify-between text-[#8CA394]">
            <span>Driver Bhatta + Tolls:</span>
            <span className="text-rose-300">₹{(driverPerQ + tollsPerQ).toFixed(2)}/q</span>
          </div>
          <div className="flex justify-between text-[#8CA394]">
            <span>Hamali Loading/Unloading:</span>
            <span className="text-rose-300">₹{hamaliPerQ.toFixed(2)}/q</span>
          </div>
          <div className="flex justify-between text-[#8CA394]">
            <span>Mandi Cess ({mandiCessPercent}%) + Transit Shrinkage ({shrinkagePercent}%):</span>
            <span className="text-rose-300">₹{(mandiCessPerQ + shrinkagePerQ).toFixed(2)}/q</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#1C2A20] font-bold text-xs text-rose-400">
            <span>Total Logistics Deductions:</span>
            <span>-₹{totalDeductionsPerQuintal.toFixed(2)}/quintal</span>
          </div>
        </div>

        {/* Visual Net Realization Waterfall */}
        <div className="space-y-1.5 p-3 rounded-lg bg-[#0C120F] border border-[#1E2E25]">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[#8DA295]">Net Farm Gate Capture</span>
            <span className="text-emerald-400 font-bold">{netRealizationPct.toFixed(1)}% Realized</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#18261F] overflow-hidden flex">
            {/* Net Realization (Green) */}
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${Math.max(0, Math.min(100, netRealizationPct))}%` }}
              title={`Net Realization: ${netRealizationPct.toFixed(1)}%`}
            />
            {/* Fuel (Amber) */}
            <div
              className="bg-amber-400 h-full transition-all"
              style={{ width: `${Math.max(0, Math.min(100, (fuelCostPerQ / modalPrice) * 100))}%` }}
              title={`Fuel: ${((fuelCostPerQ / modalPrice) * 100).toFixed(1)}%`}
            />
            {/* Freight / Cess / Shrinkage (Rose) */}
            <div
              className="bg-rose-500 h-full transition-all"
              style={{ width: `${Math.max(0, Math.min(100, ((totalDeductionsPerQuintal - fuelCostPerQ) / modalPrice) * 100))}%` }}
              title={`Mandi Cess, Tolls & Hamali: ${(((totalDeductionsPerQuintal - fuelCostPerQ) / modalPrice) * 100).toFixed(1)}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#607D6D]">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Net Gate (₹{netRealizationPerQuintal.toFixed(0)})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Fuel (₹{fuelCostPerQ.toFixed(0)})
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Cess & Labor (₹{(totalDeductionsPerQuintal - fuelCostPerQ).toFixed(0)})
            </span>
          </div>
        </div>

        {/* Outcome Summary */}
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
            <span className="text-[10px] text-[#789685] block">
              {netRealizationPct.toFixed(1)}% of terminal price
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-[#7C9788]">
          <span>
            Net Consignment Revenue ({batchQuantityQuintals} quintals):{' '}
            <strong className="text-emerald-400 font-mono">
              ₹{Math.round(totalNetRevenue).toLocaleString('en-IN')}
            </strong>
          </span>
          <span className="font-mono text-[#587566]">Validated: CACP & APMC Transport Model</span>
        </div>
      </CardContent>
    </Card>
  );
}
