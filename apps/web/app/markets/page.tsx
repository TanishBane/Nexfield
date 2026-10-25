"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
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
} from "@nexfield/ui";
import { apiClient } from "@/lib/api";
import { MarketTrendChart } from "@/components/modules/markets/MarketTrendChart";
import { TransportCalculator } from "@/components/modules/markets/TransportCalculator";
import type { MarketObservation } from "@nexfield/contracts";

export default function MarketsPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>("Wheat");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeObservation, setActiveObservation] =
    useState<MarketObservation | null>(null);

  const pricesQuery = useQuery({
    queryKey: ["marketPrices", selectedCommodity, selectedState],
    queryFn: () =>
      apiClient.getMarketObservations({
        commodity: selectedCommodity === "All" ? undefined : selectedCommodity,
        state: selectedState === "All" ? undefined : selectedState,
      }),
  });

  const comparisonQuery = useQuery({
    queryKey: ["marketComparison", selectedCommodity],
    queryFn: () => apiClient.getMarketComparison(),
  });

  if (pricesQuery.isLoading || comparisonQuery.isLoading) {
    return (
      <ModuleLoadingState message="Aggregating APMC Mandi price bulletins and calculating freight margins..." />
    );
  }

  const prices = pricesQuery.data?.data || [];
  const comparison = comparisonQuery.data?.data;

  // Filter prices by search query
  const filteredPrices = prices.filter((m) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.marketName.toLowerCase().includes(query) ||
      m.district.toLowerCase().includes(query) ||
      m.state.toLowerCase().includes(query) ||
      m.commodity.toLowerCase().includes(query)
    );
  });

  const currentObservation =
    activeObservation || filteredPrices[0] || prices[0];

  return (
    <div className="module-page module-market space-y-6">
      {/* Top Banner & Freshness */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#D1DDCD]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#09251A] flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-700" />
              Market prices
            </h1>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-emerald-700 border-emerald-800/40"
            >
              Agmarknet Telemetry
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#46604D] mt-1">
            Real APMC terminal prices, commodity arrival tonnages, transport
            expense models, and net realization arbitrage.
          </p>
        </div>

        {/* Provenance & Freshness Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-xs font-mono">
          <span
            className={`h-2 w-2 rounded-full ${pricesQuery.data?.meta?.isFixture ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`}
          />
          <span className="text-[#46604D]">
            Feed:{" "}
            <strong
              className={
                pricesQuery.data?.meta?.isFixture
                  ? "text-amber-700 font-medium"
                  : "text-emerald-700 font-medium"
              }
            >
              {pricesQuery.data?.meta?.isFixture
                ? "Agmarknet APMC Fixtures (Offline)"
                : "Live Agmarknet / CEDA Pipeline"}
            </strong>
          </span>
          <span className="text-[#46604D]">
            {pricesQuery.data?.meta?.isFixture
              ? "Sample prices"
              : "Check each price date"}
          </span>
        </div>
      </div>

      {/* Commodity & Geography Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
        {/* Commodity Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["Wheat", "Basmati Rice", "Soybean", "All"].map((crop) => (
            <Button
              key={crop}
              variant={selectedCommodity === crop ? "primary" : "secondary"}
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
          <div className="flex items-center gap-1.5 bg-[#F7FAF2] border border-[#D1DDCD] rounded-lg px-2.5 py-1 text-xs">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            <span className="text-[#46604D]">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-[#09251A] font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#F7FAF2] text-[#09251A]">
                All States
              </option>
              <option value="Punjab" className="bg-[#F7FAF2] text-[#09251A]">
                Punjab
              </option>
              <option value="Haryana" className="bg-[#F7FAF2] text-[#09251A]">
                Haryana
              </option>
              <option
                value="Maharashtra"
                className="bg-[#F7FAF2] text-[#09251A]"
              >
                Maharashtra
              </option>
              <option
                value="Madhya Pradesh"
                className="bg-[#F7FAF2] text-[#09251A]"
              >
                Madhya Pradesh
              </option>
            </select>
          </div>

          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-[#46604D]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mandi or district..."
              className="h-8 pl-8 w-44 md:w-56 text-xs bg-[#F7FAF2]"
            />
          </div>
        </div>
      </div>

      {/* Spatial Arbitrage Engine Hero Card */}
      {comparison ? (
        <Card className="border-emerald-700/50 bg-gradient-to-br from-[#F7FAF2] via-[#F7FAF2] to-[#F7FAF2] shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-700 font-semibold font-mono flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Real-Time Spatial Arbitrage Engine
                </span>
                <CardTitle className="text-lg md:text-xl text-[#09251A] mt-0.5">
                  Arbitrage Optimization for {comparison.commodity}
                </CardTitle>
                <CardDescription>
                  Base Benchmark: {comparison.baseOriginMarketName} (₹
                  {comparison.baseModalPricePerQuintalInr}/q)
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-500/40 rounded-lg p-2.5">
                <Truck className="h-5 w-5 text-emerald-700" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-[#46604D] block">
                    RECOMMENDED DESTINATION
                  </span>
                  <span className="text-emerald-700 font-bold text-sm">
                    {comparison.optimalDecision.suggestedMarket} (+₹
                    {comparison.optimalDecision.expectedNetProfitDeltaInr}/q
                    Net)
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-[#46604D] bg-[#F7FAF2] p-3 rounded-lg border border-[#D1DDCD] leading-relaxed">
              <span className="text-emerald-700 font-semibold">
                Agronomic AI Rationale:
              </span>{" "}
              {comparison.optimalDecision.rationale}
            </p>

            {/* Opportunities Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {comparison.opportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3.5 border text-xs space-y-2 ${
                    opp.recommendation === "transport_arbitrage_profitable"
                      ? "bg-[#F7FAF2] border-emerald-600/40"
                      : "bg-[#F7FAF2] border-[#D1DDCD]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-[#09251A]">
                        {opp.marketName}
                      </h4>
                      <p className="text-[11px] text-[#46604D]">
                        {opp.distanceKm} km away • ~{opp.transitTimeHours}h
                        freight transit
                      </p>
                    </div>
                    <Badge
                      variant={
                        opp.recommendation === "transport_arbitrage_profitable"
                          ? "success"
                          : "outline"
                      }
                      size="sm"
                    >
                      {opp.recommendation === "transport_arbitrage_profitable"
                        ? "Arbitrage Winner"
                        : "Local Hold"}
                    </Badge>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] pt-1 border-t border-[#D1DDCD]">
                    <div className="flex justify-between">
                      <span className="text-[#46604D]">Modal Price:</span>
                      <span className="text-[#09251A] font-bold">
                        ₹{opp.modalPricePerQuintalInr}/q
                      </span>
                    </div>
                    <div className="flex justify-between text-[#46604D]">
                      <span>Gross Spread:</span>
                      <span>+₹{opp.grossSpreadPerQuintalInr}</span>
                    </div>
                    <div className="flex justify-between text-rose-700">
                      <span>Freight & Mandi Cess:</span>
                      <span>
                        -₹
                        {opp.estimatedFreightPerQuintalInr +
                          opp.mandiFeePerQuintalInr}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#D1DDCD] font-bold text-xs text-emerald-700">
                      <span>Net Arbitrage Profit:</span>
                      <span>
                        +₹{opp.netArbitrageProfitPerQuintalInr}/quintal
                      </span>
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
      <Card className="border-[#D1DDCD] bg-[#F7FAF2]">
        <CardHeader className="pb-3 border-b border-[#D1DDCD]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-[#09251A]">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                CACP Official Minimum Support Price (MSP) Reference Matrix
              </CardTitle>
              <CardDescription>
                Authoritative statutory floor prices established by the
                Commission for Agricultural Costs and Prices (CACP) and approved
                by CCEA.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-[11px] border-emerald-800 text-emerald-700"
            >
              Government Gazette Benchmarks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#D1DDCD] text-[#46604D] uppercase font-mono text-[10px]">
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
              <tbody className="divide-y divide-[#D1DDCD] text-[#09251A] font-mono">
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#09251A]">
                    Wheat (Standard / Milling)
                  </td>
                  <td className="py-2.5 text-[#46604D]">RMS 2026-27</td>
                  <td className="py-2.5 font-bold text-emerald-700">
                    ₹2,585 / q
                  </td>
                  <td className="py-2.5 text-[#46604D]">₹1,260 / q</td>
                  <td className="py-2.5 text-emerald-700">+105.2%</td>
                  <td className="py-2.5 font-sans text-xs">
                    Food Corporation of India (FCI)
                  </td>
                  <td className="py-2.5 font-sans text-[11px] text-[#46604D]">
                    Approved by CCEA
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#09251A]">
                    Wheat (Standard / Milling)
                  </td>
                  <td className="py-2.5 text-[#46604D]">RMS 2024-25</td>
                  <td className="py-2.5 font-bold text-[#09251A]">
                    ₹2,275 / q
                  </td>
                  <td className="py-2.5 text-[#46604D]">₹1,128 / q</td>
                  <td className="py-2.5 text-emerald-700">+101.7%</td>
                  <td className="py-2.5 font-sans text-xs">
                    Food Corporation of India (FCI)
                  </td>
                  <td className="py-2.5 font-sans text-[11px] text-[#46604D]">
                    Historical Benchmark
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#09251A]">
                    Paddy (Common)
                  </td>
                  <td className="py-2.5 text-[#46604D]">KMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-700">
                    ₹2,300 / q
                  </td>
                  <td className="py-2.5 text-[#46604D]">₹1,438 / q</td>
                  <td className="py-2.5 text-emerald-700">+60.0%</td>
                  <td className="py-2.5 font-sans text-xs">
                    FCI / State Civil Supplies
                  </td>
                  <td className="py-2.5 font-sans text-[11px] text-[#46604D]">
                    Active Kharif Floor
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#09251A]">
                    Paddy (Grade A)
                  </td>
                  <td className="py-2.5 text-[#46604D]">KMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-700">
                    ₹2,320 / q
                  </td>
                  <td className="py-2.5 text-[#46604D]">₹1,438 / q</td>
                  <td className="py-2.5 text-emerald-700">+61.3%</td>
                  <td className="py-2.5 font-sans text-xs">
                    FCI / State Civil Supplies
                  </td>
                  <td className="py-2.5 font-sans text-[11px] text-[#46604D]">
                    Active Kharif Floor
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#09251A]">
                    Gram / Chana
                  </td>
                  <td className="py-2.5 text-[#46604D]">RMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-700">
                    ₹5,440 / q
                  </td>
                  <td className="py-2.5 text-[#46604D]">₹3,400 / q</td>
                  <td className="py-2.5 text-emerald-700">+60.0%</td>
                  <td className="py-2.5 font-sans text-xs">NAFED (PSS)</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#46604D]">
                    Active Rabi Floor
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#09251A]">
                    Mustard / Rapeseed
                  </td>
                  <td className="py-2.5 text-[#46604D]">RMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-700">
                    ₹5,650 / q
                  </td>
                  <td className="py-2.5 text-[#46604D]">₹2,855 / q</td>
                  <td className="py-2.5 text-emerald-700">+97.9%</td>
                  <td className="py-2.5 font-sans text-xs">NAFED</td>
                  <td className="py-2.5 font-sans text-[11px] text-[#46604D]">
                    Active Rabi Floor
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#09251A]">
                    Soybean (Yellow)
                  </td>
                  <td className="py-2.5 text-[#46604D]">KMS 2024-25</td>
                  <td className="py-2.5 font-bold text-emerald-700">
                    ₹4,892 / q
                  </td>
                  <td className="py-2.5 text-[#46604D]">₹3,261 / q</td>
                  <td className="py-2.5 text-emerald-700">+50.0%</td>
                  <td className="py-2.5 font-sans text-xs">
                    NAFED / State Agencies
                  </td>
                  <td className="py-2.5 font-sans text-[11px] text-[#46604D]">
                    Active Kharif Floor
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-amber-700">
                    Tomato (Horticulture)
                  </td>
                  <td className="py-2.5 text-[#46604D]">Continuous</td>
                  <td className="py-2.5 font-sans text-xs text-amber-700">
                    Non-MSP Produce
                  </td>
                  <td className="py-2.5 text-[#46604D]">—</td>
                  <td className="py-2.5 text-[#46604D]">—</td>
                  <td className="py-2.5 font-sans text-xs">
                    Operation Greens / TOP Buffer
                  </td>
                  <td className="py-2.5 font-sans text-[11px] text-amber-700/80">
                    Market Intervention Scheme (MIS)
                  </td>
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
                <Landmark className="h-4 w-4 text-emerald-700" />
                Live APMC Mandi Commodity Arrivals & Prices
              </CardTitle>
              <CardDescription>
                Official modal price observations and arrival volumes. Click any
                row to analyze freight haulage and 30-day trends.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-[11px]"
            >
              {filteredPrices.length} Markets
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#D1DDCD] text-[#46604D] uppercase font-mono text-[10px]">
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
              <tbody className="divide-y divide-[#D1DDCD] text-[#09251A]">
                {filteredPrices.map((m) => {
                  const isSelected = currentObservation?.id === m.id;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setActiveObservation(m)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#F7FAF2]" : "hover:bg-[#F7FAF2]"
                      }`}
                    >
                      <td className="py-3">
                        <span className="font-semibold text-[#09251A] block">
                          {m.marketName}
                        </span>
                        <span className="text-[11px] text-[#46604D]">
                          {m.district}, {m.state}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-emerald-700">
                          {m.commodity}
                        </span>
                        <span className="text-[11px] text-[#46604D] block">
                          {m.variety}
                        </span>
                      </td>
                      <td className="py-3 font-mono">
                        {m.arrivalQuantityTons.toLocaleString()} MT
                      </td>
                      <td className="py-3 font-mono text-[#46604D]">
                        ₹{m.minPricePerQuintalInr}
                      </td>
                      <td className="py-3 font-mono text-[#46604D]">
                        ₹{m.maxPricePerQuintalInr}
                      </td>
                      <td className="py-3 font-mono font-bold text-sm text-[#09251A]">
                        ₹{m.modalPricePerQuintalInr}
                      </td>
                      <td className="py-3 font-mono">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            m.dailyChangeInr > 0
                              ? "text-emerald-700 bg-emerald-50/60 border border-emerald-900/40"
                              : m.dailyChangeInr < 0
                                ? "text-rose-700 bg-rose-50/60 border border-rose-900/40"
                                : "text-[#46604D] bg-[#F7FAF2]"
                          }`}
                        >
                          {m.dailyChangeInr > 0 ? "+" : ""}
                          {m.dailyChangeInr} ₹/q
                        </span>
                      </td>
                      <td className="py-3 text-[11px] font-mono text-[#46604D]">
                        {m.reportedDate}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant={isSelected ? "primary" : "outline"}
                          size="sm"
                          className="h-7 text-xs px-2.5"
                        >
                          {isSelected ? "Selected" : "Analyze"}
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
