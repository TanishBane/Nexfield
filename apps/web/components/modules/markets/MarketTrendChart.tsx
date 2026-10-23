'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardHeader, CardTitle, CardContent } from '@nexfield/ui';

interface MarketTrendChartProps {
  commodity: string;
  marketName: string;
}

export function MarketTrendChart({ commodity, marketName }: MarketTrendChartProps) {
  // 30-day timeline
  const days = [
    'Oct 01', 'Oct 04', 'Oct 07', 'Oct 10', 'Oct 13', 'Oct 16', 'Oct 19', 'Oct 22', 'Oct 24'
  ];

  // Price trajectories depending on commodity
  const isBasmati = commodity.toLowerCase().includes('basmati') || commodity.toLowerCase().includes('rice');
  const isSoybean = commodity.toLowerCase().includes('soybean');

  const prices = isBasmati
    ? [4180, 4220, 4200, 4280, 4310, 4360, 4390, 4410, 4420]
    : isSoybean
    ? [4820, 4780, 4750, 4720, 4700, 4680, 4690, 4710, 4690]
    : [2480, 2495, 2510, 2505, 2530, 2545, 2560, 2575, 2580];

  const mspBaseline = isBasmati ? 4000 : isSoybean ? 4600 : 2275;

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0F1713',
      borderColor: '#263B2F',
      textStyle: { color: '#E1ECE5', fontSize: 12 },
    },
    legend: {
      data: [`${commodity} Modal Price (₹/q)`, 'Government MSP Benchmark', '3-Year Seasonal Mean'],
      textStyle: { color: '#8EA295', fontSize: 11 },
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { lineStyle: { color: '#1E2F25' } },
      axisLabel: { color: '#7E9789', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: 'Price (₹/quintal)',
      nameTextStyle: { color: '#7E9789', fontSize: 10 },
      splitLine: { lineStyle: { color: '#14221A' } },
      axisLabel: { color: '#7E9789', fontSize: 10 },
    },
    series: [
      {
        name: `${commodity} Modal Price (₹/q)`,
        type: 'line',
        data: prices,
        smooth: true,
        lineStyle: { color: '#10B981', width: 3 },
        itemStyle: { color: '#10B981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.28)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.0)' },
            ],
          },
        },
      },
      {
        name: 'Government MSP Benchmark',
        type: 'line',
        data: days.map(() => mspBaseline),
        lineStyle: { color: '#F59E0B', type: 'dashed', width: 2 },
        itemStyle: { color: '#F59E0B' },
      },
      {
        name: '3-Year Seasonal Mean',
        type: 'line',
        data: prices.map((p) => p - 90),
        lineStyle: { color: '#64748B', type: 'dotted', width: 1.5 },
        itemStyle: { color: '#64748B' },
      },
    ],
  };

  return (
    <Card className="border-[#203126]">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Historical Mandi Price Trajectory vs MSP Benchmark
          </CardTitle>
          <span className="text-[11px] font-mono text-[#749081]">
            Market: {marketName}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ReactECharts option={chartOption} style={{ height: '220px', width: '100%' }} />
      </CardContent>
    </Card>
  );
}
