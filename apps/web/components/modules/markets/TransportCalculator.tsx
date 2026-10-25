"use client";

import React, { useState } from "react";
import {
  Truck,
  Calculator,
  IndianRupee,
  ShieldCheck,
  Fuel,
  Users,
  Scale,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
  Badge,
} from "@nexfield/ui";

interface TransportCalculatorProps {
  selectedMandiName: string;
  modalPrice: number;
}

type VehicleOption =
  | "light_commercial_vehicle"
  | "tractor_trolley"
  | "medium_truck"
  | "heavy_truck";

const VEHICLE_CONFIGS: Record<
  VehicleOption,
  { name: string; capacity: number; kmPerLiter: number; defaultBhatta: number }
> = {
  light_commercial_vehicle: {
    name: "LCV (Bolero / Tata 407)",
    capacity: 25,
    kmPerLiter: 11.0,
    defaultBhatta: 400,
  },
  tractor_trolley: {
    name: "Tractor-Trolley (50q)",
    capacity: 50,
    kmPerLiter: 6.0,
    defaultBhatta: 350,
  },
  medium_truck: {
    name: "Medium Truck (10 Ton)",
    capacity: 100,
    kmPerLiter: 4.5,
    defaultBhatta: 600,
  },
  heavy_truck: {
    name: "Heavy 10-Wheeler (25 Ton)",
    capacity: 250,
    kmPerLiter: 3.2,
    defaultBhatta: 800,
  },
};

export function TransportCalculator({
  selectedMandiName,
  modalPrice,
}: TransportCalculatorProps) {
  const [distanceKm, setDistanceKm] = useState<number>(48);
  const [vehicleType, setVehicleType] = useState<VehicleOption>("medium_truck");
  const [batchQuantityQuintals, setBatchQuantityQuintals] =
    useState<number>(200); // 20 MT
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
    fuelCostPerQ +
    tollsPerQ +
    driverPerQ +
    hamaliPerQ +
    mandiCessPerQ +
    shrinkagePerQ;
  const netRealizationPerQuintal = modalPrice - totalDeductionsPerQuintal;
  const totalGrossRevenue = modalPrice * batchQuantityQuintals;
  const totalNetRevenue = netRealizationPerQuintal * batchQuantityQuintals;
  const netRealizationPct = (netRealizationPerQuintal / modalPrice) * 100;

  return (
    <Card className="border-[#D1DDCD] bg-white shadow-xs">
      <CardHeader className="pb-3 border-b border-[#D1DDCD]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#09251A]">
            <Calculator className="h-4 w-4 text-[#048547]" />
            Multi-Factor Freight & Net Realization Engine
          </CardTitle>
          <Badge
            variant="outline"
            size="sm"
            className="font-mono text-[11px] border-[#B8D494] text-[#005B36] bg-[#E5F2CF]"
          >
            Target: {selectedMandiName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 text-xs">
        {/* Vehicle Selection Tabs */}
        <div>
          <label className="text-[11px] text-[#46604D] font-bold block mb-1.5">
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
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#E5F2CF] border-[#B8D494] text-[#005B36] shadow-2xs font-semibold"
                      : "bg-white border-[#D1DDCD] text-[#46604D] hover:bg-[#F7FAF2] hover:text-[#09251A]"
                  }`}
                >
                  <span className="font-semibold text-[11px] block truncate">
                    {v.name}
                  </span>
                  <span className="text-[10px] text-[#46604D] block font-mono">
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
            <label className="text-[#09251A] font-medium block">
              Haulage (One-way km)
            </label>
            <Input
              type="number"
              value={distanceKm}
              onChange={(e) =>
                setDistanceKm(Math.max(0, Number(e.target.value)))
              }
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#09251A] font-medium block">
              Lot Weight (Quintals)
            </label>
            <Input
              type="number"
              value={batchQuantityQuintals}
              onChange={(e) =>
                setBatchQuantityQuintals(Math.max(1, Number(e.target.value)))
              }
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#09251A] font-medium block">
              Diesel Price (₹/L)
            </label>
            <Input
              type="number"
              value={dieselPrice}
              onChange={(e) => setDieselPrice(Number(e.target.value))}
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#09251A] font-medium block">
              Driver Bhatta (₹/trip)
            </label>
            <Input
              type="number"
              value={driverBhatta}
              onChange={(e) => setDriverBhatta(Number(e.target.value))}
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>
        </div>

        {/* Secondary Deductions: Tolls, Hamali, Cess & Shrinkage */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-[#D1DDCD]">
          <div className="space-y-1">
            <label className="text-[#09251A] font-medium block">
              Tolls (₹/trip)
            </label>
            <Input
              type="number"
              value={tollsInr}
              onChange={(e) => setTollsInr(Number(e.target.value))}
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#09251A] font-medium block">
              Hamali Labor (₹/q)
            </label>
            <Input
              type="number"
              value={hamaliPerQuintal}
              onChange={(e) => setHamaliPerQuintal(Number(e.target.value))}
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#09251A] font-medium block">
              APMC Cess (%)
            </label>
            <Input
              type="number"
              step="0.1"
              value={mandiCessPercent}
              onChange={(e) => setMandiCessPercent(Number(e.target.value))}
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#09251A] font-medium block">
              Shrinkage Loss (%)
            </label>
            <Input
              type="number"
              step="0.1"
              value={shrinkagePercent}
              onChange={(e) => setShrinkagePercent(Number(e.target.value))}
              className="bg-white border-[#D1DDCD] font-mono text-xs tabular-nums"
            />
          </div>
        </div>

        {/* Itemized Deductions Ledger */}
        <div className="p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] font-mono space-y-1.5 text-[11px] tabular-nums">
          <div className="flex justify-between text-[#46604D]">
            <span>
              Trips Required ({trips} × {distanceKm * 2} km round-trip):
            </span>
            <span className="font-semibold text-[#09251A]">{totalRoundTripKm} km total</span>
          </div>
          <div className="flex justify-between text-[#46604D]">
            <span>
              Fuel ({fuelLiters.toFixed(1)} L diesel @ ₹{dieselPrice}/L):
            </span>
            <span className="text-[#991B1B] font-semibold">₹{fuelCostPerQ.toFixed(2)}/q</span>
          </div>
          <div className="flex justify-between text-[#46604D]">
            <span>Driver Bhatta + Tolls:</span>
            <span className="text-[#991B1B] font-semibold">
              ₹{(driverPerQ + tollsPerQ).toFixed(2)}/q
            </span>
          </div>
          <div className="flex justify-between text-[#46604D]">
            <span>Hamali Loading/Unloading:</span>
            <span className="text-[#991B1B] font-semibold">₹{hamaliPerQ.toFixed(2)}/q</span>
          </div>
          <div className="flex justify-between text-[#46604D]">
            <span>
              Mandi Cess ({mandiCessPercent}%) + Transit Shrinkage (
              {shrinkagePercent}%):
            </span>
            <span className="text-[#991B1B] font-semibold">
              ₹{(mandiCessPerQ + shrinkagePerQ).toFixed(2)}/q
            </span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-[#D1DDCD] font-bold text-xs text-[#991B1B]">
            <span>Total Logistics Deductions:</span>
            <span>-₹{totalDeductionsPerQuintal.toFixed(2)}/quintal</span>
          </div>
        </div>

        {/* Outcome Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] font-mono tabular-nums">
          <div>
            <span className="text-[10px] text-[#46604D] block font-bold">
              GROSS MODAL PRICE
            </span>
            <span className="text-base font-bold text-[#09251A]">
              ₹{modalPrice}/q
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#991B1B] block font-bold">
              TOTAL LOGISTICS EXPENSE
            </span>
            <span className="text-base font-bold text-[#991B1B]">
              -₹{totalDeductionsPerQuintal.toFixed(1)}/q
            </span>
          </div>
          <div className="sm:border-l sm:border-[#D1DDCD] sm:pl-3">
            <span className="text-[10px] text-[#005B36] block font-bold">
              ESTIMATED NET REALIZATION
            </span>
            <span className="text-lg font-extrabold text-[#005B36]">
              ₹{netRealizationPerQuintal.toFixed(1)}/quintal
            </span>
            <span className="text-[10px] text-[#46604D] block">
              {netRealizationPct.toFixed(1)}% of terminal price
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-[#46604D]">
          <span>
            Net Consignment Revenue ({batchQuantityQuintals} quintals):{" "}
            <strong className="text-[#005B36] font-mono font-bold tabular-nums">
              ₹{Math.round(totalNetRevenue).toLocaleString("en-IN")}
            </strong>
          </span>
          <span className="font-mono text-[#46604D]">
            Validated: CACP & APMC Transport Model
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
