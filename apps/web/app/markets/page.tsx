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
    queryFn: () => apiClient.getMarketComparison(selectedCommodity),
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
              <TrendingUp className="h-6 w-6 text-[#048547]" />
              Market prices
            </h1>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-[#005B36] border-[#B8D494] bg-[#E5F2CF]"
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#D1DDCD] text-xs font-mono shadow-2xs">
          <span
            className={`h-2 w-2 rounded-full motion-safe:animate-pulse ${pricesQuery.data?.meta?.isFixture ? "bg-[#D97706]" : "bg-[#048547]"}`}
          />
          <span className="text-[#46604D]">
            Feed:{" "}
            <strong
              className={
                pricesQuery.data?.meta?.isFixture
                  ? "text-[#92400E] font-semibold"
                  : "text-[#005B36] font-semibold"
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#D1DDCD] shadow-xs">
        {/* Commodity Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["Wheat", "Basmati Rice", "Soybean", "All"].map((crop) => (
            <Button
              key={crop}
              variant={selectedCommodity === crop ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedCommodity(crop)}
              className={`text-xs h-8 cursor-pointer font-semibold ${selectedCommodity === crop ? "bg-[#048547] text-white hover:bg-[#005B36]" : "border-[#D1DDCD]"}`}
            >
              {crop}
            </Button>
          ))}
        </div>

        {/* State Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#F7FAF2] border border-[#D1DDCD] rounded-xl px-3 py-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5 text-[#048547]" />
            <span className="text-[#46604D] font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-[#09251A] font-semibold focus:outline-none focus-visible:ring-1 focus-visible:ring-[#048547] rounded cursor-pointer"
            >
              <option value="All" className="bg-white text-[#09251A]">
                All States
              </option>
              <option value="Punjab" className="bg-white text-[#09251A]">
                Punjab
              </option>
              <option value="Haryana" className="bg-white text-[#09251A]">
                Haryana
              </option>
              <option
                value="Maharashtra"
                className="bg-white text-[#09251A]"
              >
                Maharashtra
              </option>
              <option
                value="Madhya Pradesh"
                className="bg-white text-[#09251A]"
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
              className="h-9 pl-8 w-44 md:w-56 text-xs bg-white border-[#D1DDCD]"
            />
          </div>
        </div>
      </div>

      {/* Spatial Arbitrage Engine Hero Card */}
      {comparison ? (
        <Card className="border-[#B8D494] bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-[#D1DDCD]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#005B36] font-bold font-mono flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#048547]" />
                  Real-Time Spatial Arbitrage Engine
                </span>
                <CardTitle className="text-lg md:text-xl text-[#09251A] mt-1 font-bold">
                  Arbitrage Optimization for {comparison.commodity}
                </CardTitle>
                <CardDescription>
                  Base Benchmark: {comparison.baseOriginMarketName} (₹
                  {comparison.baseModalPricePerQuintalInr}/q)
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 bg-[#E5F2CF] border border-[#B8D494] rounded-xl p-3 shadow-2xs">
                <Truck className="h-5 w-5 text-[#048547]" />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-[#46604D] block font-bold">
                    RECOMMENDED DESTINATION
                  </span>
                  <span className="text-[#005B36] font-bold text-sm tabular-nums">
                    {comparison.optimalDecision.suggestedMarket} (+₹
                    {comparison.optimalDecision.expectedNetProfitDeltaInr}/q
                    Net)
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <p className="text-xs text-[#46604D] bg-[#F7FAF2] p-3.5 rounded-xl border border-[#D1DDCD] leading-relaxed">
              <span className="text-[#005B36] font-bold">
                Agronomic AI Rationale:
              </span>{" "}
              {comparison.optimalDecision.rationale}
            </p>

            {/* Opportunities Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {comparison.opportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border text-xs space-y-2 shadow-2xs ${
                    opp.recommendation === "transport_arbitrage_profitable"
                      ? "bg-[#E5F2CF]/30 border-[#B8D494]"
                      : "bg-white border-[#D1DDCD]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#09251A]">
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

                  <div className="space-y-1 font-mono text-[11px] pt-2 border-t border-[#D1DDCD] tabular-nums">
                    <div className="flex justify-between">
                      <span className="text-[#46604D]">Modal Price:</span>
                      <span className="text-[#09251A] font-bold">
                        ₹{opp.modalPricePerQuintalInr}/q
                      </span>
                    </div>
                    <div className="flex justify-between text-[#46604D]">
                      <span>Gross Spread:</span>
                      <span className="font-semibold">+₹{opp.grossSpreadPerQuintalInr}</span>
                    </div>
                    <div className="flex justify-between text-[#991B1B]">
                      <span>Freight & Mandi Cess:</span>
                      <span>
                        -₹
                        {opp.estimatedFreightPerQuintalInr +
                          opp.mandiFeePerQuintalInr}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#D1DDCD] font-bold text-xs text-[#005B36]">
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
      <Card className="border-[#D1DDCD] bg-white shadow-xs overflow-hidden max-w-full">
        <CardHeader className="pb-3 border-b border-[#D1DDCD]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-[#09251A] font-bold">
                <ShieldCheck className="h-4 w-4 text-[#048547]" />
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
              className="font-mono text-[11px] border-[#B8D494] text-[#005B36] bg-[#E5F2CF]"
            >
              Government Gazette Benchmarks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 max-w-full overflow-hidden">
          <div className="overflow-x-auto w-full max-w-full min-w-0">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="border-b border-[#D1DDCD] text-[#46604D] uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Commodity & Variety</th>
                  <th className="pb-3">Season & Year</th>
                  <th className="pb-3">Statutory MSP</th>
                  <th className="pb-3">Cost A2+FL</th>
                  <th className="pb-3">Margin Over Cost</th>
                  <th className="pb-3">Procurement Agency</th>
                  <th className="pb-3">Statutory Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D1DDCD] text-[#09251A] font-mono tabular-nums">
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#09251A]">
                    Wheat (Standard / Milling)
                  </td>
                  <td className="py-3 text-[#46604D]">RMS 2026-27</td>
                  <td className="py-3 font-bold text-[#005B36]">
                    ₹2,585 / q
                  </td>
                  <td className="py-3 text-[#46604D]">₹1,260 / q</td>
                  <td className="py-3 font-bold text-[#005B36]">+105.2%</td>
                  <td className="py-3 font-sans text-xs">
                    Food Corporation of India (FCI)
                  </td>
                  <td className="py-3 font-sans text-[11px] text-[#46604D]">
                    Approved by CCEA
                  </td>
                </tr>
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#09251A]">
                    Wheat (Standard / Milling)
                  </td>
                  <td className="py-3 text-[#46604D]">RMS 2024-25</td>
                  <td className="py-3 font-bold text-[#09251A]">
                    ₹2,275 / q
                  </td>
                  <td className="py-3 text-[#46604D]">₹1,128 / q</td>
                  <td className="py-3 font-bold text-[#005B36]">+101.7%</td>
                  <td className="py-3 font-sans text-xs">
                    Food Corporation of India (FCI)
                  </td>
                  <td className="py-3 font-sans text-[11px] text-[#46604D]">
                    Historical Benchmark
                  </td>
                </tr>
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#09251A]">
                    Paddy (Common)
                  </td>
                  <td className="py-3 text-[#46604D]">KMS 2024-25</td>
                  <td className="py-3 font-bold text-[#005B36]">
                    ₹2,300 / q
                  </td>
                  <td className="py-3 text-[#46604D]">₹1,438 / q</td>
                  <td className="py-3 font-bold text-[#005B36]">+60.0%</td>
                  <td className="py-3 font-sans text-xs">
                    FCI / State Civil Supplies
                  </td>
                  <td className="py-3 font-sans text-[11px] text-[#46604D]">
                    Active Kharif Floor
                  </td>
                </tr>
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#09251A]">
                    Paddy (Grade A)
                  </td>
                  <td className="py-3 text-[#46604D]">KMS 2024-25</td>
                  <td className="py-3 font-bold text-[#005B36]">
                    ₹2,320 / q
                  </td>
                  <td className="py-3 text-[#46604D]">₹1,438 / q</td>
                  <td className="py-3 font-bold text-[#005B36]">+61.3%</td>
                  <td className="py-3 font-sans text-xs">
                    FCI / State Civil Supplies
                  </td>
                  <td className="py-3 font-sans text-[11px] text-[#46604D]">
                    Active Kharif Floor
                  </td>
                </tr>
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#09251A]">
                    Gram / Chana
                  </td>
                  <td className="py-3 text-[#46604D]">RMS 2024-25</td>
                  <td className="py-3 font-bold text-[#005B36]">
                    ₹5,440 / q
                  </td>
                  <td className="py-3 text-[#46604D]">₹3,400 / q</td>
                  <td className="py-3 font-bold text-[#005B36]">+60.0%</td>
                  <td className="py-3 font-sans text-xs">NAFED (PSS)</td>
                  <td className="py-3 font-sans text-[11px] text-[#46604D]">
                    Active Rabi Floor
                  </td>
                </tr>
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#09251A]">
                    Mustard / Rapeseed
                  </td>
                  <td className="py-3 text-[#46604D]">RMS 2024-25</td>
                  <td className="py-3 font-bold text-[#005B36]">
                    ₹5,650 / q
                  </td>
                  <td className="py-3 text-[#46604D]">₹2,855 / q</td>
                  <td className="py-3 font-bold text-[#005B36]">+97.9%</td>
                  <td className="py-3 font-sans text-xs">NAFED</td>
                  <td className="py-3 font-sans text-[11px] text-[#46604D]">
                    Active Rabi Floor
                  </td>
                </tr>
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#09251A]">
                    Soybean (Yellow)
                  </td>
                  <td className="py-3 text-[#46604D]">KMS 2024-25</td>
                  <td className="py-3 font-bold text-[#005B36]">
                    ₹4,892 / q
                  </td>
                  <td className="py-3 text-[#46604D]">₹3,261 / q</td>
                  <td className="py-3 font-bold text-[#005B36]">+50.0%</td>
                  <td className="py-3 font-sans text-xs">
                    NAFED / State Agencies
                  </td>
                  <td className="py-3 font-sans text-[11px] text-[#46604D]">
                    Active Kharif Floor
                  </td>
                </tr>
                <tr className="hover:bg-[#F7FAF2] transition-colors">
                  <td className="py-3 font-sans font-bold text-[#D97706]">
                    Tomato (Horticulture)
                  </td>
                  <td className="py-3 text-[#46604D]">Continuous</td>
                  <td className="py-3 font-sans text-xs text-[#D97706] font-semibold">
                    Non-MSP Produce
                  </td>
                  <td className="py-3 text-[#46604D]">—</td>
                  <td className="py-3 text-[#46604D]">—</td>
                  <td className="py-3 font-sans text-xs">
                    Operation Greens / TOP Buffer
                  </td>
                  <td className="py-3 font-sans text-[11px] text-[#D97706]">
                    Market Intervention Scheme (MIS)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed APMC Mandi Commodity Arrival & Price Table */}
      <Card className="bg-white border-[#D1DDCD] shadow-xs overflow-hidden max-w-full">
        <CardHeader className="pb-3 border-b border-[#D1DDCD]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 font-bold text-[#09251A]">
                <Landmark className="h-4 w-4 text-[#048547]" />
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
              className="font-mono text-[11px] border-[#B8D494] text-[#005B36] bg-[#E5F2CF]"
            >
              {filteredPrices.length} Markets
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 max-w-full overflow-hidden">
          <div className="overflow-x-auto w-full max-w-full min-w-0">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="border-b border-[#D1DDCD] text-[#46604D] uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Mandi / Terminal</th>
                  <th className="pb-3">Commodity & Variety</th>
                  <th className="pb-3">Arrival Volume</th>
                  <th className="pb-3">Min Price</th>
                  <th className="pb-3">Max Price</th>
                  <th className="pb-3">Modal Price</th>
                  <th className="pb-3">24h Trend</th>
                  <th className="pb-3">Reported Date</th>
                  <th className="pb-3 text-right">Action</th>
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
                        isSelected ? "bg-[#E5F2CF]/40 border-l-4 border-l-[#048547]" : "hover:bg-[#F7FAF2]"
                      }`}
                    >
                      <td className="py-3.5">
                        <span className="font-bold text-[#09251A] block">
                          {m.marketName}
                        </span>
                        <span className="text-[11px] text-[#46604D]">
                          {m.district}, {m.state}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="font-semibold text-[#005B36]">
                          {m.commodity}
                        </span>
                        <span className="text-[11px] text-[#46604D] block font-mono">
                          {m.variety}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono tabular-nums">
                        {m.arrivalQuantityTons.toLocaleString()} MT
                      </td>
                      <td className="py-3.5 font-mono text-[#46604D] tabular-nums">
                        ₹{m.minPricePerQuintalInr}
                      </td>
                      <td className="py-3.5 font-mono text-[#46604D] tabular-nums">
                        ₹{m.maxPricePerQuintalInr}
                      </td>
                      <td className="py-3.5 font-mono font-bold text-sm text-[#09251A] tabular-nums">
                        ₹{m.modalPricePerQuintalInr}
                      </td>
                      <td className="py-3.5 font-mono tabular-nums">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            m.dailyChangeInr > 0
                              ? "text-[#005B36] bg-[#E5F2CF] border border-[#B8D494]"
                              : m.dailyChangeInr < 0
                                ? "text-[#991B1B] bg-[#FBE0E8] border border-[#E9B4C4]"
                                : "text-[#46604D] bg-[#F7FAF2] border border-[#D1DDCD]"
                          }`}
                        >
                          {m.dailyChangeInr > 0 ? "+" : ""}
                          {m.dailyChangeInr} ₹/q
                        </span>
                      </td>
                      <td className="py-3.5 text-[11px] font-mono text-[#46604D]">
                        {m.reportedDate}
                      </td>
                      <td className="py-3.5 text-right">
                        <Button
                          variant={isSelected ? "primary" : "outline"}
                          size="sm"
                          className={`h-7 text-xs px-2.5 cursor-pointer font-semibold ${isSelected ? "bg-[#048547] text-white hover:bg-[#005B36]" : ""}`}
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
