'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from '@nexfield/ui';
import { useDemoStore } from '@/lib/store/useDemoStore';

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
  netRealizationPerQtl: number;
  trend: 'up' | 'down' | 'neutral';
}

const MANDI_FEEDS: MandiData[] = [
  {
    mandi: 'Nashik APMC (Panchavati)',
    district: 'Nashik, Maharashtra',
    commodity: 'Tomato',
    variety: 'Hybrid / Abhinav',
    arrivalQuintals: 420,
    minPrice: 2100,
    modalPrice: 2450,
    maxPrice: 2750,
    distanceKm: 14,
    freightCostPerQtl: 45,
    mandiCessPercent: 1.5,
    netRealizationPerQtl: 2368,
    trend: 'up',
  },
  {
    mandi: 'Vashi APMC (Navi Mumbai)',
    district: 'Mumbai Sub, Maharashtra',
    commodity: 'Tomato',
    variety: 'Hybrid / Export',
    arrivalQuintals: 1250,
    minPrice: 2600,
    modalPrice: 2880,
    maxPrice: 3200,
    distanceKm: 165,
    freightCostPerQtl: 180,
    mandiCessPercent: 1.2,
    netRealizationPerQtl: 2665,
    trend: 'up',
  },
  {
    mandi: 'Pimpalgaon APMC',
    district: 'Nashik, Maharashtra',
    commodity: 'Tomato',
    variety: 'Local Hybrid',
    arrivalQuintals: 680,
    minPrice: 1950,
    modalPrice: 2240,
    maxPrice: 2450,
    distanceKm: 28,
    freightCostPerQtl: 60,
    mandiCessPercent: 1.5,
    netRealizationPerQtl: 2146,
    trend: 'neutral',
  },
  {
    mandi: 'Lasalgaon APMC',
    district: 'Nashik, Maharashtra',
    commodity: 'Tomato',
    variety: 'Mixed Standard',
    arrivalQuintals: 310,
    minPrice: 1850,
    modalPrice: 2180,
    maxPrice: 2350,
    distanceKm: 55,
    freightCostPerQtl: 95,
    mandiCessPercent: 1.5,
    netRealizationPerQtl: 2052,
    trend: 'down',
  },
];

export default function DemoMarketsPage() {
  const { farmName } = useDemoStore();
  const [selectedCommodity, setSelectedCommodity] = useState('Tomato');

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1A261F]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              NEXFIELD Markets — Agmarknet Intelligence & Arbitrage
            </h1>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 font-mono text-[10px]">
              Wholesale Mandi Data
            </Badge>
          </div>
          <p className="text-xs text-[#7B9587] mt-0.5">
            Spatial price comparison and net realization models for {farmName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 font-mono text-xs">
            Source: Agmarknet Directorate of Economics & Statistics
          </Badge>
        </div>
      </div>

      {/* 2. Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25]">
          <div className="text-xs text-[#7B9587]">Peak Modal Price (Vashi Metro)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹2,880 / qtl</div>
          <div className="text-[11px] text-[#7B9587] font-mono mt-0.5">+₹430 / qtl Arbitrage vs Local Gate</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25]">
          <div className="text-xs text-[#7B9587]">Nashik APMC Daily Arrivals</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">420 Quintals</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Steady Demand Volume</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25]">
          <div className="text-xs text-[#7B9587]">Net Profit Maximizer (After Freight)</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">Vashi APMC</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Net Realization: ₹2,665 / qtl</div>
        </div>
      </div>

      {/* 3. Detailed Mandi Comparison Table */}
      <Card className="border-[#1E2E25] bg-[#0E1511]">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-[#F1F6F3]">
              Regional Mandi Spread Matrix
            </CardTitle>
            <CardDescription className="text-xs text-[#7B9587]">
              Modal rates, daily volume, freight deductions, and actual realization in hand
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs font-mono">
            Live Oct 2026 Season
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#090F0C] border-y border-[#18261E] text-[#63796E] text-[10px] uppercase font-sans">
                <tr>
                  <th className="py-3 px-4">Wholesale Mandi</th>
                  <th className="py-3 px-4">Commodity / Variety</th>
                  <th className="py-3 px-4">Arrivals (Qtl)</th>
                  <th className="py-3 px-4">Modal Price</th>
                  <th className="py-3 px-4">Distance & Freight</th>
                  <th className="py-3 px-4 text-right">Net Realization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18261E]">
                {MANDI_FEEDS.map((feed) => (
                  <tr key={feed.mandi} className="hover:bg-[#121B16] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-sans font-bold text-[#F1F6F3]">{feed.mandi}</div>
                      <div className="text-[10px] text-[#7B9587] font-mono">{feed.district}</div>
                    </td>
                    <td className="py-3 px-4 text-[#BDD1C6]">
                      {feed.commodity} ({feed.variety})
                    </td>
                    <td className="py-3 px-4 text-sky-400 font-bold">
                      {feed.arrivalQuintals}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-400">₹{feed.modalPrice}</div>
                      <div className="text-[10px] text-[#7B9587]">Range: ₹{feed.minPrice} - ₹{feed.maxPrice}</div>
                    </td>
                    <td className="py-3 px-4 text-[#8EA698]">
                      <div>{feed.distanceKm} km</div>
                      <div className="text-[10px] text-rose-400/80">-₹{feed.freightCostPerQtl} / qtl</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-base font-extrabold text-emerald-300">
                        ₹{feed.netRealizationPerQtl}
                      </div>
                      <div className="text-[10px] text-[#556D60]">Per Quintal In Hand</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
