'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  Truck,
  ArrowRight,
  Filter,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  BarChart3,
  Landmark,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  Badge,
  Button,
  Input,
  ModuleLoadingState,
  ErrorDisplay,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';

export default function MarketsPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');

  const pricesQuery = useQuery({
    queryKey: ['marketPrices', selectedCommodity],
    queryFn: () =>
      apiClient.getMarketObservations(
        selectedCommodity === 'All' ? undefined : { commodity: selectedCommodity }
      ),
  });

  const comparisonQuery = useQuery({
    queryKey: ['marketComparison'],
    queryFn: () => apiClient.getMarketComparison(),
  });

  if (pricesQuery.isLoading || comparisonQuery.isLoading) {
    return <ModuleLoadingState message="Aggregating APMC Mandi price bulletins and calculating freight margins..." />;
  }

  const prices = pricesQuery.data?.data || [];
  const comparison = comparisonQuery.data?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              NEXFIELD Markets — Mandi Price Intelligence & Spatial Arbitrage
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-0.5">
            Real APMC market arrival volumes, official modal prices, and automated transport arbitrage calculations.
          </p>
        </div>

        {/* Commodity Quick Filter */}
        <div className="flex items-center gap-2">
          {['All', 'Wheat', 'Basmati', 'Soybean'].map((crop) => (
            <Button
              key={crop}
              variant={selectedCommodity === crop ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCommodity(crop)}
              className="text-xs h-8"
            >
              {crop}
            </Button>
          ))}
        </div>
      </div>

      {/* Spatial Arbitrage Decision Engine Card (Hero Feature) */}
      {comparison ? (
        <Card className="border-emerald-700/50 bg-gradient-to-br from-[#121E17] via-[#0E1712] to-[#0A100D] shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Real-Time Spatial Arbitrage Engine
                </span>
                <CardTitle className="text-lg md:text-xl text-[#F1F6F3] mt-0.5">
                  Arbitrage Optimization for {comparison.commodity}
                </CardTitle>
                <CardDescription>
                  Base Benchmark: {comparison.baseOriginMarketName} (₹
                  {comparison.baseModalPricePerQuintalInr}/q)
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 rounded-lg p-2.5">
                <Truck className="h-5 w-5 text-emerald-400" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-[#789383] block">RECOMMENDED DESTINATION</span>
                  <span className="text-emerald-300 font-bold text-sm">
                    {comparison.optimalDecision.suggestedMarket} (+₹
                    {comparison.optimalDecision.expectedNetProfitDeltaInr}/q Net)
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-[#A1B8AB] bg-[#0E1511] p-3 rounded-lg border border-[#1E2E25] leading-relaxed">
              <span className="text-emerald-400 font-semibold">Agronomic AI Rationale:</span>{' '}
              {comparison.optimalDecision.rationale}
            </p>

            {/* Opportunities Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {comparison.opportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3.5 border text-xs space-y-2 ${
                    opp.recommendation === 'transport_arbitrage_profitable'
                      ? 'bg-[#132219] border-emerald-600/40'
                      : 'bg-[#0E1511] border-[#1E2E25]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-[#F1F6F3]">{opp.marketName}</h4>
                      <p className="text-[11px] text-[#738C7E]">
                        {opp.distanceKm} km away • ~{opp.transitTimeHours}h freight transit
                      </p>
                    </div>
                    <Badge
                      variant={
                        opp.recommendation === 'transport_arbitrage_profitable'
                          ? 'success'
                          : 'outline'
                      }
                      size="sm"
                    >
                      {opp.recommendation === 'transport_arbitrage_profitable'
                        ? 'Arbitrage Winner'
                        : 'Local Hold'}
                    </Badge>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] pt-1 border-t border-[#1C2A21]">
                    <div className="flex justify-between">
                      <span className="text-[#8DA396]">Modal Price:</span>
                      <span className="text-[#F1F6F3] font-bold">
                        ₹{opp.modalPricePerQuintalInr}/q
                      </span>
                    </div>
                    <div className="flex justify-between text-[#7E998B]">
                      <span>Gross Spread:</span>
                      <span>+₹{opp.grossSpreadPerQuintalInr}</span>
                    </div>
                    <div className="flex justify-between text-rose-300">
                      <span>Freight & Mandi Cess:</span>
                      <span>-₹{opp.estimatedFreightPerQuintalInr + opp.mandiFeePerQuintalInr}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#1C2A21] font-bold text-xs text-emerald-300">
                      <span>Net Arbitrage Profit:</span>
                      <span>+₹{opp.netArbitrageProfitPerQuintalInr}/quintal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* APMC Mandi Ticker Feed Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Landmark className="h-4 w-4 text-emerald-400" />
                Live APMC Mandi Commodity Arrivals & Prices
              </CardTitle>
              <CardDescription>
                Synchronized with official Agmarknet telemetry feeds across northern and central corridors.
              </CardDescription>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-[11px]">
              {prices.length} Markets Tracked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1E2E25] text-[#71897C] uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-2.5">Mandi / Terminal</th>
                  <th className="pb-2.5">Commodity & Variety</th>
                  <th className="pb-2.5">Arrival Volume</th>
                  <th className="pb-2.5">Min Price</th>
                  <th className="pb-2.5">Max Price</th>
                  <th className="pb-2.5">Modal Price</th>
                  <th className="pb-2.5">24h Trend</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18261F] text-[#D8E6DE]">
                {prices.map((m) => (
                  <tr key={m.id} className="hover:bg-[#121B16] transition-colors">
                    <td className="py-3">
                      <span className="font-semibold text-[#F1F6F3] block">{m.marketName}</span>
                      <span className="text-[11px] text-[#718A7D]">
                        {m.district}, {m.state}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-emerald-300">{m.commodity}</span>
                      <span className="text-[11px] text-[#799485] block">{m.variety}</span>
                    </td>
                    <td className="py-3 font-mono">
                      {m.arrivalQuantityTons.toLocaleString()} MT
                    </td>
                    <td className="py-3 font-mono text-[#8CA395]">
                      ₹{m.minPricePerQuintalInr}
                    </td>
                    <td className="py-3 font-mono text-[#8CA395]">
                      ₹{m.maxPricePerQuintalInr}
                    </td>
                    <td className="py-3 font-mono font-bold text-sm text-[#F1F6F3]">
                      ₹{m.modalPricePerQuintalInr}
                    </td>
                    <td className="py-3 font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          m.dailyChangeInr > 0
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/40'
                            : m.dailyChangeInr < 0
                            ? 'text-rose-400 bg-rose-950/60 border border-rose-900/40'
                            : 'text-[#8BA194] bg-[#16221B]'
                        }`}
                      >
                        {m.dailyChangeInr > 0 ? '+' : ''}
                        {m.dailyChangeInr} ₹/q
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                        Log Freight
                      </Button>
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
