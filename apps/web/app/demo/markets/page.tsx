"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  Truck,
  DollarSign,
  BarChart3,
  Calendar,
  Compass,
  CheckCircle2,
  Filter,
  Sparkles,
  Layers,
  MapPin,
  Scale,
  Percent,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@nexfield/ui";
import { useDemoStore } from "@/lib/store/useDemoStore";

interface MandiData {
  mandi: string;
  district: string;
  commodity: string;
  variety: string;
  arrivalQuintals: number;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  distanceKm: number;
  freightCostPerQtl: number;
  mandiCessPercent: number;
  mspBaselinePrice: number;
  netRealizationPerQtl: number;
  trend: "up" | "down" | "neutral";
}

const COMMODITIES = [
  {
    id: "Tomato",
    name: "Tomato (Abhinav F1)",
    msp: 0,
    defaultMandi: "Vashi APMC (Navi Mumbai)",
  },
  {
    id: "Onion",
    name: "Onion (Bhima Super)",
    msp: 0,
    defaultMandi: "Lasalgaon APMC",
  },
  {
    id: "Soybean",
    name: "Soybean (JS-335)",
    msp: 4892,
    defaultMandi: "Nagpur APMC",
  },
  {
    id: "Cotton",
    name: "Cotton (Medium Staple)",
    msp: 7121,
    defaultMandi: "Jalna APMC",
  },
  {
    id: "Wheat",
    name: "Wheat (Sharbati)",
    msp: 2425,
    defaultMandi: "Nashik APMC (Panchavati)",
  },
];

const MANDI_FEEDS: Record<string, MandiData[]> = {
  Tomato: [
    {
      mandi: "Vashi APMC (Navi Mumbai)",
      district: "Mumbai Metro, Maharashtra",
      commodity: "Tomato",
      variety: "Hybrid / Export",
      arrivalQuintals: 1250,
      minPrice: 2600,
      modalPrice: 2880,
      maxPrice: 3200,
      distanceKm: 165,
      freightCostPerQtl: 180,
      mandiCessPercent: 1.2,
      mspBaselinePrice: 0,
      netRealizationPerQtl: 2665,
      trend: "up",
    },
    {
      mandi: "Nashik APMC (Panchavati)",
      district: "Nashik, Maharashtra",
      commodity: "Tomato",
      variety: "Hybrid / Abhinav",
      arrivalQuintals: 420,
      minPrice: 2100,
      modalPrice: 2450,
      maxPrice: 2750,
      distanceKm: 14,
      freightCostPerQtl: 45,
      mandiCessPercent: 1.5,
      mspBaselinePrice: 0,
      netRealizationPerQtl: 2368,
      trend: "up",
    },
    {
      mandi: "Pimpalgaon APMC",
      district: "Nashik, Maharashtra",
      commodity: "Tomato",
      variety: "Local Hybrid",
      arrivalQuintals: 680,
      minPrice: 1950,
      modalPrice: 2240,
      maxPrice: 2450,
      distanceKm: 28,
      freightCostPerQtl: 60,
      mandiCessPercent: 1.5,
      mspBaselinePrice: 0,
      netRealizationPerQtl: 2146,
      trend: "neutral",
    },
    {
      mandi: "Lasalgaon APMC",
      district: "Nashik, Maharashtra",
      commodity: "Tomato",
      variety: "Mixed Standard",
      arrivalQuintals: 310,
      minPrice: 1850,
      modalPrice: 2180,
      maxPrice: 2350,
      distanceKm: 55,
      freightCostPerQtl: 95,
      mandiCessPercent: 1.5,
      mspBaselinePrice: 0,
      netRealizationPerQtl: 2052,
      trend: "down",
    },
  ],
  Onion: [
    {
      mandi: "Lasalgaon APMC",
      district: "Nashik, Maharashtra",
      commodity: "Onion",
      variety: "Red Bulb",
      arrivalQuintals: 4500,
      minPrice: 2800,
      modalPrice: 3250,
      maxPrice: 3600,
      distanceKm: 55,
      freightCostPerQtl: 95,
      mandiCessPercent: 1.5,
      mspBaselinePrice: 0,
      netRealizationPerQtl: 3106,
      trend: "up",
    },
    {
      mandi: "Pimpalgaon APMC",
      district: "Nashik, Maharashtra",
      commodity: "Onion",
      variety: "Pol / Early Kharif",
      arrivalQuintals: 2800,
      minPrice: 2700,
      modalPrice: 3150,
      maxPrice: 3450,
      distanceKm: 28,
      freightCostPerQtl: 60,
      mandiCessPercent: 1.5,
      mspBaselinePrice: 0,
      netRealizationPerQtl: 3043,
      trend: "neutral",
    },
    {
      mandi: "Vashi APMC (Navi Mumbai)",
      district: "Mumbai Metro, Maharashtra",
      commodity: "Onion",
      variety: "Graded Red",
      arrivalQuintals: 6200,
      minPrice: 3100,
      modalPrice: 3550,
      maxPrice: 3900,
      distanceKm: 165,
      freightCostPerQtl: 180,
      mandiCessPercent: 1.2,
      mspBaselinePrice: 0,
      netRealizationPerQtl: 3327,
      trend: "up",
    },
  ],
  Soybean: [
    {
      mandi: "Nagpur APMC",
      district: "Nagpur, Maharashtra",
      commodity: "Soybean",
      variety: "Yellow Grain",
      arrivalQuintals: 1850,
      minPrice: 4750,
      modalPrice: 5120,
      maxPrice: 5350,
      distanceKm: 210,
      freightCostPerQtl: 210,
      mandiCessPercent: 1.0,
      mspBaselinePrice: 4892,
      netRealizationPerQtl: 4859,
      trend: "up",
    },
    {
      mandi: "Latur APMC",
      district: "Latur, Maharashtra",
      commodity: "Soybean",
      variety: "Oil Grade",
      arrivalQuintals: 3100,
      minPrice: 4800,
      modalPrice: 5240,
      maxPrice: 5450,
      distanceKm: 280,
      freightCostPerQtl: 260,
      mandiCessPercent: 1.0,
      mspBaselinePrice: 4892,
      netRealizationPerQtl: 4928,
      trend: "up",
    },
  ],
  Cotton: [
    {
      mandi: "Jalna APMC",
      district: "Jalna, Maharashtra",
      commodity: "Cotton",
      variety: "Medium Staple",
      arrivalQuintals: 1400,
      minPrice: 7100,
      modalPrice: 7480,
      maxPrice: 7750,
      distanceKm: 195,
      freightCostPerQtl: 220,
      mandiCessPercent: 1.0,
      mspBaselinePrice: 7121,
      netRealizationPerQtl: 7185,
      trend: "up",
    },
  ],
  Wheat: [
    {
      mandi: "Nashik APMC (Panchavati)",
      district: "Nashik, Maharashtra",
      commodity: "Wheat",
      variety: "Sharbati Lokwan",
      arrivalQuintals: 780,
      minPrice: 2450,
      modalPrice: 2680,
      maxPrice: 2850,
      distanceKm: 14,
      freightCostPerQtl: 45,
      mandiCessPercent: 1.5,
      mspBaselinePrice: 2425,
      netRealizationPerQtl: 2595,
      trend: "up",
    },
  ],
};

export default function DemoMarketsPage() {
  const { farmName } = useDemoStore();
  const [selectedCommodity, setSelectedCommodity] = useState<string>("Tomato");
  const [consignmentVolumeQtl, setConsignmentVolumeQtl] = useState<number>(50);

  const feeds = MANDI_FEEDS[selectedCommodity] || MANDI_FEEDS["Tomato"];
  const sortedByNet = [...feeds].sort(
    (a, b) => b.netRealizationPerQtl - a.netRealizationPerQtl,
  );
  const bestMandi = sortedByNet[0];
  const localMandi = feeds.find((f) => f.distanceKm < 20) || feeds[0];
  const arbitrageSpread =
    bestMandi.netRealizationPerQtl - localMandi.netRealizationPerQtl;
  const totalArbitrageGain = arbitrageSpread * consignmentVolumeQtl;

  const currentCropObj = COMMODITIES.find((c) => c.id === selectedCommodity);

  return (
    <div className="module-page module-market space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D1DDCD]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09251A] font-serif">
              Market prices
            </h1>
            <Badge
              variant="outline"
              className="text-emerald-700 border-emerald-500/40 font-mono text-xs px-2.5 py-0.5"
            >
              Agmarknet Daily Feeds
            </Badge>
          </div>
          <p className="text-sm text-[#46604D] mt-1">
            {farmName} · Real-time wholesale mandi rates, transport freight
            optimization, and net realization models
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#46604D] bg-[#F7FAF2] border border-[#D1DDCD] px-3 py-1.5 rounded-xl">
          <Calendar className="h-4 w-4 text-emerald-700" />
          <span>October 2026 Season</span>
          <span className="text-[#46604D]">·</span>
          <span className="text-emerald-700 font-semibold">
            CACP MSP Benchmarked
          </span>
        </div>
      </div>

      {/* 2. Step 1: Choose Commodity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#46604D]">
          <span className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50/80 text-emerald-700 font-mono text-[10px] border border-emerald-500/30">
              STEP 1
            </span>
            <span>CHOOSE COMMODITY:</span>
          </span>
          <span className="text-[#46604D] font-mono">
            5 regional wholesale commodities
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {COMMODITIES.map((c) => {
            const isSelected = selectedCommodity === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCommodity(c.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-[#F7FAF2] border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30"
                    : "bg-[#F7FAF2] border-[#D1DDCD] hover:border-[#D1DDCD]"
                }`}
              >
                <div className="text-xs font-bold text-[#09251A]">{c.name}</div>
                <div className="text-[11px] font-mono text-[#46604D] mt-1">
                  {c.msp > 0
                    ? `MSP: ₹${c.msp.toLocaleString("en-IN")}`
                    : "Perishable (Free Market)"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Arbitrage Maximizer Banner */}
      <div className="p-5 rounded-2xl bg-[#F7FAF2] border border-emerald-500/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-50/80 text-purple-700 font-mono text-xs font-bold border border-purple-500/30">
              RECOMMENDED DESTINATION
            </span>
            <span className="text-sm font-bold text-[#09251A]">
              {bestMandi.mandi}
            </span>
          </div>
          <p className="text-sm text-[#46604D] leading-relaxed">
            By diverting your harvest to{" "}
            <strong className="text-[#09251A]">{bestMandi.mandi}</strong>{" "}
            instead of the nearest local gate, you realize an additional{" "}
            <strong className="text-emerald-700 font-mono">
              +₹{arbitrageSpread}/qtl
            </strong>{" "}
            net in hand after deducting road freight (₹
            {bestMandi.freightCostPerQtl}/qtl) and mandi cess.
          </p>
        </div>

        {/* Consignment Volume Slider */}
        <div className="p-4 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] w-full md:w-72 space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center text-[#46604D]">
            <span>Consignment Size:</span>
            <span className="text-sky-700 font-bold tabular-nums text-sm">
              {consignmentVolumeQtl} Qtl
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={consignmentVolumeQtl}
            onChange={(e) => setConsignmentVolumeQtl(Number(e.target.value))}
            className="w-full accent-sky-400 bg-[#F7FAF2] h-1.5 rounded-lg"
          />
          <div className="flex justify-between text-[#46604D] pt-1 border-t border-[#D1DDCD]">
            <span>Total Arbitrage Gain:</span>
            <span className="text-emerald-700 font-bold tabular-nums text-sm">
              +₹{totalArbitrageGain.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Comparison Table: Steps 2, 3, 4 */}
      <Card className="border-[#D1DDCD] bg-[#F7FAF2]">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-[#09251A]">
              Regional Mandi Rates & Net Returns Matrix
            </CardTitle>
            <CardDescription className="text-xs text-[#46604D]">
              Modal prices, daily arrivals, freight distance, diesel cost
              factor, and real net money in hand
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-emerald-700 border-emerald-500/30 text-xs font-mono self-start sm:self-auto"
          >
            Source: Agmarknet API Feeds
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#F7FAF2] border-y border-[#D1DDCD] text-[#46604D] text-[11px] uppercase font-sans">
                <tr>
                  <th className="py-3.5 px-4">Mandi & District</th>
                  <th className="py-3.5 px-4">Daily Volume</th>
                  <th className="py-3.5 px-4">Modal Price</th>
                  <th className="py-3.5 px-4">Freight & Cess</th>
                  <th className="py-3.5 px-4 text-right">
                    Net Realization / Qtl
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    Consignment Net ({consignmentVolumeQtl} Qtl)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D1DDCD]">
                {sortedByNet.map((feed, idx) => {
                  const isTop = idx === 0;
                  const consignmentTotal =
                    feed.netRealizationPerQtl * consignmentVolumeQtl;
                  return (
                    <tr
                      key={feed.mandi}
                      className={`transition-colors ${
                        isTop
                          ? "bg-[#F7FAF2] font-semibold"
                          : "hover:bg-[#F7FAF2]"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-sans font-bold text-[#09251A] flex items-center gap-1.5">
                          <span>{feed.mandi}</span>
                          {isTop && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono border border-emerald-500/30">
                              Top Return
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#46604D] font-mono">
                          {feed.district}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-sky-700 font-bold tabular-nums">
                        {feed.arrivalQuintals.toLocaleString("en-IN")} Qtl
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-emerald-700 tabular-nums">
                          ₹{feed.modalPrice.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-[#46604D]">
                          ₹{feed.minPrice} – ₹{feed.maxPrice}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#46604D]">
                        <div className="text-[#09251A] tabular-nums">
                          {feed.distanceKm} km
                        </div>
                        <div className="text-[11px] text-rose-700/90 tabular-nums">
                          -₹{feed.freightCostPerQtl}/qtl freight (
                          {feed.mandiCessPercent}% cess)
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="text-base font-extrabold text-emerald-700 tabular-nums">
                          ₹{feed.netRealizationPerQtl.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-[#46604D]">
                          Per Quintal Net
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="text-base font-bold text-[#09251A] tabular-nums">
                          ₹{consignmentTotal.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-[#46604D]">
                          In-Hand Total
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
