'use client';

import React, { useState, useMemo } from 'react';
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
  Search,
  CheckCircle,
  RefreshCw,
  ShieldCheck,
  Scale,
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
import { MarketTrendChart } from '@/components/modules/markets/MarketTrendChart';
import { TransportCalculator } from '@/components/modules/markets/TransportCalculator';
import type { MarketObservation } from '@nexfield/contracts';

export default function MarketsPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Wheat');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeObservation, setActiveObservation] = useState<MarketObservation | null>(null);

  const pricesQuery = useQuery({
    queryKey: ['marketPrices', selectedCommodity, selectedState],
    queryFn: () =>
      apiClient.getMarketObservations({
        commodity: selectedCommodity === 'All' ? undefined : selectedCommodity,
        state: selectedState === 'All' ? undefined : selectedState,
      }),
  });

  const comparisonQuery = useQuery({
    queryKey: ['marketComparison', selectedCommodity],
    queryFn: () => apiClient.getMarketComparison(),
  });


  const prices = useMemo(() => pricesQuery.data?.data || [], [pricesQuery.data?.data]);
  const comparison = comparisonQuery.data?.data;
  // Filter prices by search query
  const filteredPrices = useMemo(() => {
    return prices.filter((m) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        m.marketName.toLowerCase().includes(query) ||
        m.district.toLowerCase().includes(query) ||
        m.state.toLowerCase().includes(query) ||
        m.commodity.toLowerCase().includes(query)
      );
    });
  }, [prices, searchQuery]);

  const currentObservation = activeObservation || filteredPrices[0] || prices[0];

  if (pricesQuery.isLoading || comparisonQuery.isLoading) {
    return <ModuleLoadingState message="Aggregating APMC Mandi price bulletins and calculating freight margins..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Freshness */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              NEXFIELD Markets — Mandi Price Intelligence & Spatial Arbitrage
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-emerald-400 border-emerald-800/40">
              Agmarknet Telemetry
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-1">
            Real APMC terminal prices, commodity arrival tonnages, transport expense models, and net realization arbitrage.
          </p>
        </div>

        {/* Provenance & Freshness Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F1713] border border-[#1E2E25] text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#849F90]">
            Adapter: <strong className="text-emerald-300 font-medium">Jules Mandi Scraper v1.2</strong>
          </span>
          <span className="text-[#516E5E]">• Data Freshness: 10:45 AM Today (Fixture)</span>
        </div>
      </div>

      {/* Commodity & Geography Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0C120F] border border-[#1E2E25]">
        {/* Commodity Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['Wheat', 'Basmati Rice', 'Soybean', 'All'].map((crop) => (
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

        {/* State Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#121B16] border border-[#203227] rounded-lg px-2.5 py-1 text-xs">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[#718D7E]">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#121B16] text-[#E1ECE5]">All States</option>
              <option value="Punjab" className="bg-[#121B16] text-[#E1ECE5]">Punjab</option>
              <option value="Haryana" className="bg-[#121B16] text-[#E1ECE5]">Haryana</option>
              <option value="Maharashtra" className="bg-[#121B16] text-[#E1ECE5]">Maharashtra</option>
              <option value="Madhya Pradesh" className="bg-[#121B16] text-[#E1ECE5]">Madhya Pradesh</option>
            </select>
          </div>

          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-[#5D796A]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mandi or district..."
              className="h-8 pl-8 w-44 md:w-56 text-xs bg-[#121B16]"
            />
          </div>
        </div>
      </div>

      {/* Spatial Arbitrage Engine Hero Card */}
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

      {/* Historical Trend Chart & Transport Calculator */}
      {currentObservation ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketTrendChart
            commodity={currentObservation.commodity}
            marketName={currentObservation.marketName}
          />
          <TransportCalculator
            selectedMandiName={currentObservation.marketName}
            modalPrice={currentObservation.modalPricePerQuintalInr}
          />
        </div>
      ) : null}

      {/* Official CACP Minimum Support Price (MSP) Matrix */}
      <Card className="border-[#273B2F] bg-[#101713]">
        <CardHeader className="pb-3 border-b border-[#1C2921]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-[#F1F6F3]">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                CACP Official Minimum Support Price (MSP) Reference Matrix
              </CardTitle>
              <CardDescription>
                Authoritative statutory floor prices established by the Commission for Agricultural Costs and Prices (CACP) and approved by CCEA.
              </CardDescription>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-[11px] border-emerald-800 text-emerald-400">
              Government Gazette Benchmarks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1E2E25] text-[#71897C] uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-2.5">Commodity & Variety</th>
                  <th className="pb-2.5">Season & Year</th>
                  <th className="pb-2.5">Statutory MSP</th>
                  <th className="pb-2.5">Cost A2+FL</th>
                  <th className="pb-2.5">Margin Over Cost</th>
                  <th className="pb-2.5">Procurement Agency</th>
                  <th className="pb-2.5">Statutory Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18261F] text-[#D8E6DE] font-mono">
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#F1F6F3]">
                    Wheat (Standard / Milling)
                  </td>
                  <td className="py-2.5 text-[#8CA394]">RMS 2026-27</td>
                  <td className="py-2.5 font-bold text-emerald-300">₹2,585 / q</td>
                  <td className="py-2.5 text-[#8CA394]">₹1,260 / q</td>
                  <td className="py-2.5 text-emerald-400">+105.2%</td>
                  <td className="py-2.5 font-sans text-xs">Food Corporation of India (FCI)</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#8CA394]">Approved by CCEA</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#F1F6F3]">
                    Wheat (Standard / Milling)
                  </td>
                  <td className="py-2.5 text-[#8CA394]">RMS 2024-25</td>
                  <td className="py-2.5 font-bold text-[#D8E6DE]">₹2,275 / q</td>
                  <td className="py-2.5 text-[#8CA394]">₹1,128 / q</td>
                  <td className="py-2.5 text-emerald-400">+101.7%</td>
                  <td className="py-2.5 font-sans text-xs">Food Corporation of India (FCI)</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#8CA394]">Historical Benchmark</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#F1F6F3]">
                    Paddy (Common)
                  </td>
                  <td className="py-2.5 text-[#8CA394]">KMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-300">₹2,300 / q</td>
                  <td className="py-2.5 text-[#8CA394]">₹1,438 / q</td>
                  <td className="py-2.5 text-emerald-400">+60.0%</td>
                  <td className="py-2.5 font-sans text-xs">FCI / State Civil Supplies</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#8CA394]">Active Kharif Floor</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#F1F6F3]">
                    Paddy (Grade A)
                  </td>
                  <td className="py-2.5 text-[#8CA394]">KMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-300">₹2,320 / q</td>
                  <td className="py-2.5 text-[#8CA394]">₹1,438 / q</td>
                  <td className="py-2.5 text-emerald-400">+61.3%</td>
                  <td className="py-2.5 font-sans text-xs">FCI / State Civil Supplies</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#8CA394]">Active Kharif Floor</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#F1F6F3]">
                    Gram / Chana
                  </td>
                  <td className="py-2.5 text-[#8CA394]">RMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-300">₹5,440 / q</td>
                  <td className="py-2.5 text-[#8CA394]">₹3,400 / q</td>
                  <td className="py-2.5 text-emerald-400">+60.0%</td>
                  <td className="py-2.5 font-sans text-xs">NAFED (PSS)</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#8CA394]">Active Rabi Floor</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#F1F6F3]">
                    Mustard / Rapeseed
                  </td>
                  <td className="py-2.5 text-[#8CA394]">RMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-300">₹5,650 / q</td>
                  <td className="py-2.5 text-[#8CA394]">₹2,855 / q</td>
                  <td className="py-2.5 text-emerald-400">+97.9%</td>
                  <td className="py-2.5 font-sans text-xs">NAFED</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#8CA394]">Active Rabi Floor</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#F1F6F3]">
                    Soybean (Yellow)
                  </td>
                  <td className="py-2.5 text-[#8CA394]">KMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-300">₹4,892 / q</td>
                  <td className="py-2.5 text-[#8CA394]">₹3,261 / q</td>
                  <td className="py-2.5 text-emerald-400">+50.0%</td>
                  <td className="py-2.5 font-sans text-xs">NAFED / State Agencies</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#8CA394]">Active Kharif Floor</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-amber-300">
                    Tomato (Horticulture)
                  </td>
                  <td className="py-2.5 text-[#8CA394]">Continuous</td>
                  <td className="py-2.5 font-sans text-xs text-amber-400">Non-MSP Produce</td>
                  <td className="py-2.5 text-[#8CA394]">—</td>
                  <td className="py-2.5 text-[#8CA394]">—</td>
                  <td className="py-2.5 font-sans text-xs">Operation Greens / TOP Buffer</td>
                  <td className="py-2.5 font-sans text-[11px] text-amber-300/80">Market Intervention Scheme (MIS)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed APMC Mandi Commodity Arrival & Price Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Landmark className="h-4 w-4 text-emerald-400" />
                Live APMC Mandi Commodity Arrivals & Prices
              </CardTitle>
              <CardDescription>
                Official modal price observations and arrival volumes. Click any row to analyze freight haulage and 30-day trends.
              </CardDescription>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-[11px]">
              {filteredPrices.length} Markets
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
                  <th className="pb-2.5">Reported Date</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18261F] text-[#D8E6DE]">
                {filteredPrices.map((m) => {
                  const isSelected = currentObservation?.id === m.id;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setActiveObservation(m)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#15251C]' : 'hover:bg-[#121B16]'
                      }`}
                    >
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
                      <td className="py-3 text-[11px] font-mono text-[#789383]">
                        {m.reportedDate}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant={isSelected ? 'primary' : 'outline'}
                          size="sm"
                          className="h-7 text-xs px-2.5"
                        >
                          {isSelected ? 'Selected' : 'Analyze'}
                        </Button>
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
