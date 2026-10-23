'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardList,
  Boxes,
  Archive,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  IndianRupee,
  Layers,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ModuleLoadingState,
  ErrorDisplay,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';

export default function OpsPage() {
  const { selectedFarmId } = useFarmStore();

  const tasksQuery = useQuery({
    queryKey: ['tasks', selectedFarmId],
    queryFn: () => apiClient.getTasks(selectedFarmId),
  });

  const inventoryQuery = useQuery({
    queryKey: ['inventory', selectedFarmId],
    queryFn: () => apiClient.getInventory(selectedFarmId),
  });

  const harvestQuery = useQuery({
    queryKey: ['harvestBatches', selectedFarmId],
    queryFn: () => apiClient.getHarvestBatches(selectedFarmId),
  });

  if (tasksQuery.isLoading || inventoryQuery.isLoading || harvestQuery.isLoading) {
    return <ModuleLoadingState message="Loading resource inventory, workforce tasks, and harvest ledgers..." />;
  }

  const tasks = tasksQuery.data?.data || [];
  const inventory = inventoryQuery.data?.data || [];
  const harvestBatches = harvestQuery.data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-emerald-400" />
              NEXFIELD Ops — Resource Inventory & Field Operations
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-0.5">
            Operational command: field workforce work orders, input stocks burn-rate, and graded harvest batch custody.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Dispatch Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Work Orders"
          value={tasks.filter((t) => t.status !== 'completed').length}
          unit="Tasks"
          subValue="1 Urgent, 1 Medium Priority"
          trend="neutral"
          trendValue="On Track"
          icon={<ClipboardList className="h-4 w-4" />}
          variant="emerald"
        />

        <StatCard
          label="Inventory Valuation"
          value="₹93,100"
          unit="INR"
          subValue="Seed & Agrochemical reserves"
          trend="down"
          trendValue="Stock Stable"
          icon={<Boxes className="h-4 w-4" />}
          variant="sky"
        />

        <StatCard
          label="Harvest in Custody"
          value="24.8"
          unit="MT"
          subValue="PB-1121 Export Grade Silo #3"
          trend="up"
          trendValue="Moisture: 12.8%"
          icon={<Archive className="h-4 w-4" />}
          variant="amber"
        />

        <StatCard
          label="Operational Expenses"
          value="₹97,300"
          unit="YTD"
          subValue="Fertilizer, seed & fuel costs"
          trend="up"
          trendValue="Budget Aligned"
          icon={<IndianRupee className="h-4 w-4" />}
          variant="default"
        />
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="tasks">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Field Dispatch Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Boxes className="h-4 w-4" />
            Input Stock Inventory ({inventory.length})
          </TabsTrigger>
          <TabsTrigger value="harvest" className="gap-2">
            <Archive className="h-4 w-4" />
            Harvest Batches & Silos ({harvestBatches.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Tasks */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Field Work Orders & Labor Dispatch</CardTitle>
              <CardDescription>
                Scheduled agronomic actions assigned to operators and agronomists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg bg-[#0E1511] border border-[#1E2E25] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : task.priority === 'urgent' ? (
                        <AlertCircle className="h-4 w-4 text-rose-400 animate-pulse" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#F1F6F3]">
                          {task.title}
                        </span>
                        <Badge
                          variant={
                            task.priority === 'urgent'
                              ? 'destructive'
                              : task.priority === 'high'
                              ? 'warning'
                              : 'default'
                          }
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-[#87A092]">{task.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-[#698475] pt-0.5">
                        <span>Assignee: {task.assignedToName || 'Unassigned'}</span>
                        <span>Due: {task.dueDate}</span>
                        {task.costEstimateInr ? (
                          <span className="font-mono text-emerald-400">
                            Est: ₹{task.costEstimateInr.toLocaleString('en-IN')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                    <Badge variant={task.status === 'completed' ? 'success' : 'outline'} size="sm">
                      {task.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Inventory */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agrochemical, Seed & Fuel Reserves</CardTitle>
              <CardDescription>
                Real-time stock balance, lot numbers, and supplier trace records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#1E2E25] text-[#71897C] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-2.5">Item Name</th>
                      <th className="pb-2.5">Category</th>
                      <th className="pb-2.5">Batch #</th>
                      <th className="pb-2.5">Balance</th>
                      <th className="pb-2.5">Unit Price</th>
                      <th className="pb-2.5">Total Valuation</th>
                      <th className="pb-2.5">Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18261F] text-[#D8E6DE]">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#121B16] transition-colors">
                        <td className="py-3 font-semibold text-[#F1F6F3]">{item.itemName}</td>
                        <td className="py-3 capitalize text-[#8DA295]">
                          {item.itemType.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 font-mono text-[11px] text-[#748F80]">
                          {item.batchNumber || '—'}
                        </td>
                        <td className="py-3 font-mono font-semibold text-emerald-400">
                          {item.balanceAfterQuantity} {item.unit}
                        </td>
                        <td className="py-3 font-mono">₹{item.unitPriceInr}</td>
                        <td className="py-3 font-mono font-bold">
                          ₹{item.totalAmountInr.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 text-[#879E91]">{item.supplierOrVendor || 'Direct'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Harvest Batches */}
        <TabsContent value="harvest">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Harvested Batches & Quality Grading</CardTitle>
              <CardDescription>
                Post-harvest grain records, moisture testing, and warehouse custody.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {harvestBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-lg bg-[#0E1511] border border-[#1E2E25] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-emerald-400">
                        {batch.batchCode}
                      </span>
                      <span className="font-semibold text-sm text-[#F1F6F3]">
                        {batch.cropName} ({batch.variety})
                      </span>
                      <Badge variant="success" size="sm">
                        {batch.qualityGrade.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-[#87A092] pt-1">
                      <div>
                        <span className="text-[#597365] block text-[10px]">TOTAL MASS</span>
                        <span className="text-[#F1F6F3] font-semibold">
                          {(batch.totalQuantityKg / 1000).toFixed(1)} MT
                        </span>
                      </div>
                      <div>
                        <span className="text-[#597365] block text-[10px]">MOISTURE CONTENT</span>
                        <span className="text-sky-300 font-semibold">
                          {batch.moistureContentPercent}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[#597365] block text-[10px]">FOREIGN MATTER</span>
                        <span className="text-emerald-300 font-semibold">
                          {batch.foreignMatterPercent}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[#597365] block text-[10px]">STORAGE LOCATION</span>
                        <span className="text-[#BACDC2]">{batch.storageWarehouse}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="gap-1 text-xs">
                      <Truck className="h-3.5 w-3.5 text-emerald-400" />
                      Dispatch to Mandi
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
