'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardHeader, CardTitle, CardContent } from '@nexfield/ui';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

export function TwinScenarioCharts() {
  const { params, activeScenario } = useSimulationStore();

  const baselineYield = 5.12;
  const simulatedYield = activeScenario?.projectedOutcomes.estimatedYieldMtPerHa || 5.88;

  // Phenological stages along cultivation cycle
  const stages = [
    'Germination',
    'Crown Root',
    'Tillering',
    'Jointing',
    'Flowering',
    'Milk Stage',
    'Maturity',
  ];

  // Phenology yield accumulation trajectory
  const baselineTrajectory = [0.2, 0.8, 1.8, 2.9, 4.1, 4.8, baselineYield];
  const simulatedTrajectory = [
    0.2,
    0.85,
    2.1,
    3.3,
    4.7,
    5.5,
    simulatedYield,
  ];

  const yieldChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0F1713',
      borderColor: '#263B2F',
      textStyle: { color: '#E1ECE5', fontSize: 12 },
    },
    legend: {
      data: ['Baseline Practice (Flood/Static N)', 'Twin Simulated Optimization'],
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
      data: stages,
      axisLine: { lineStyle: { color: '#1E2F25' } },
      axisLabel: { color: '#7E9789', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: 'Yield (MT/ha)',
      nameTextStyle: { color: '#7E9789', fontSize: 10 },
      splitLine: { lineStyle: { color: '#14221A' } },
      axisLabel: { color: '#7E9789', fontSize: 10 },
    },
    series: [
      {
        name: 'Baseline Practice (Flood/Static N)',
        type: 'line',
        data: baselineTrajectory,
        smooth: true,
        lineStyle: { color: '#64748B', width: 2, type: 'dashed' },
        itemStyle: { color: '#64748B' },
      },
      {
        name: 'Twin Simulated Optimization',
        type: 'line',
        data: simulatedTrajectory,
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
    ],
  };

  // Water Balance & Rootzone Depletion Chart
  const waterBalanceOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0F1713',
      borderColor: '#263B2F',
      textStyle: { color: '#E1ECE5', fontSize: 12 },
    },
    legend: {
      data: ['Daily ETc Demand (mm)', 'Irrigation + Rain Inflow (mm)', 'Stress Threshold (RAW)'],
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
      data: ['Day 1', 'Day 4', 'Day 7', 'Day 10', 'Day 13', 'Day 16', 'Day 19'],
      axisLine: { lineStyle: { color: '#1E2F25' } },
      axisLabel: { color: '#7E9789', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: 'Water Depth (mm)',
      nameTextStyle: { color: '#7E9789', fontSize: 10 },
      splitLine: { lineStyle: { color: '#14221A' } },
      axisLabel: { color: '#7E9789', fontSize: 10 },
    },
    series: [
      {
        name: 'Daily ETc Demand (mm)',
        type: 'bar',
        data: [4.2, 4.5, 4.1, 4.8, 5.0, 4.6, 4.3],
        itemStyle: { color: '#F59E0B' },
      },
      {
        name: 'Irrigation + Rain Inflow (mm)',
        type: 'bar',
        data: [
          0,
          params.irrigationVolumeM3PerHa / 100 + 4,
          0,
          params.projectedRainfallMm > 10 ? 12 : 0,
          params.irrigationVolumeM3PerHa / 100,
          0,
          6,
        ],
        itemStyle: { color: '#38BDF8' },
      },
      {
        name: 'Stress Threshold (RAW)',
        type: 'line',
        data: [18, 18, 18, 18, 18, 18, 18],
        lineStyle: { color: '#EF4444', type: 'dotted', width: 2 },
        itemStyle: { color: '#EF4444' },
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-[#203126]">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-semibold">
            Yield Trajectory Delta (Baseline vs Twin Scenario)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <ReactECharts option={yieldChartOption} style={{ height: '230px', width: '100%' }} />
        </CardContent>
      </Card>

      <Card className="border-[#203126]">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-semibold">
            Rootzone Hydrology & Dynamic Crop Evapotranspiration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <ReactECharts option={waterBalanceOption} style={{ height: '230px', width: '100%' }} />
        </CardContent>
      </Card>
    </div>
  );
}
