'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Filter,
  Check,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  X,
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
  Input,
  ModuleLoadingState,
  ErrorDisplay,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import type { FarmTask, InventoryTransaction } from '@nexfield/contracts';
import Link from 'next/link';

const UNDERSCORE_REGEX = /_/g;

export default function OpsPage() {
  const queryClient = useQueryClient();
  const { selectedFarmId, selectedFieldId } = useFarmStore();

  const [activeTaskFilter, setActiveTaskFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('irrigation');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-10-26');
  const [newTaskCost, setNewTaskCost] = useState('2500');

  // New Transaction Form State
  const [newTxItemName, setNewTxItemName] = useState('DAP Fertilizer (50kg)');
  const [newTxType, setNewTxType] = useState('usage');
  const [newTxQuantity, setNewTxQuantity] = useState('10');
  const [newTxUnitPrice, setNewTxUnitPrice] = useState('1350');

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

  // Task Creation Mutation
  const createTaskMutation = useMutation({
    mutationFn: () =>
      apiClient.createTask({
        farmId: selectedFarmId,
        fieldId: selectedFieldId || undefined,
        title: newTaskTitle,
        category: newTaskCategory,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        costEstimateInr: Number(newTaskCost),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', selectedFarmId] });
      setIsNewTaskModalOpen(false);
      setNewTaskTitle('');
    },
  });

  if (tasksQuery.isLoading || inventoryQuery.isLoading || harvestQuery.isLoading) {
    return <ModuleLoadingState message="Loading farm operational ledgers, inventory balances, and task queues..." />;
  }

  const tasks = tasksQuery.data?.data || [];
  const inventory = inventoryQuery.data?.data || [];
  const harvestBatches = harvestQuery.data?.data || [];

  const filteredTasks = tasks.filter((t) => {
    if (activeTaskFilter === 'all') return true;
    if (activeTaskFilter === 'urgent') return t.priority === 'urgent';
    if (activeTaskFilter === 'completed') return t.status === 'completed';
    if (activeTaskFilter === 'pending') return t.status !== 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-emerald-400" />
              NEXFIELD Ops — Resource Inventory & Operational Command
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-emerald-400 border-emerald-800/40">
              Active Ledger
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-1">
            Workforce task orders, inventory transactions, input cost accounting, and harvest batch storage custody.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsNewTransactionModalOpen(true)}
            className="h-8 text-xs gap-1.5"
          >
            <Boxes className="h-3.5 w-3.5 text-emerald-400" />
            Book Inventory
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewTaskModalOpen(true)}
            className="h-8 text-xs gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Dispatch Work Order
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Work Orders"
          value={tasks.reduce((count, t) => t.status !== 'completed' ? count + 1 : count, 0)}
          unit="Tasks"
          subValue="1 Urgent, 1 Medium Priority"
          trend="neutral"
          trendValue="On Track"
          icon={<ClipboardList className="h-4 w-4" />}
          variant="emerald"
        />

        <StatCard
          label="Inventory Stock Value"
          value="₹93,100"
          unit="INR"
          subValue="Seed, chemical & diesel stores"
          trend="down"
          trendValue="Burn Rate Normal"
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
          label="Total Season Expenses"
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
            Work Orders ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Boxes className="h-4 w-4" />
            Stock Ledger ({inventory.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2">
            <Receipt className="h-4 w-4" />
            Expense Breakdown
          </TabsTrigger>
          <TabsTrigger value="harvest" className="gap-2">
            <Archive className="h-4 w-4" />
            Harvest Batches ({harvestBatches.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Tasks */}
        <TabsContent value="tasks" className="space-y-4">
          {/* Task Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#0C120F] border border-[#1E2E25] text-xs">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-semibold text-[#CADCD1]">Filter Work Orders:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {['all', 'pending', 'urgent', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveTaskFilter(filter)}
                  className={`px-2.5 py-1 rounded text-xs capitalize font-medium transition-colors ${
                    activeTaskFilter === filter
                      ? 'bg-[#18261F] text-emerald-400 border border-[#273C30]'
                      : 'text-[#7D998B] hover:text-[#D1E0D7]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Field Labor & Machinery Dispatch Schedule</CardTitle>
              <CardDescription>
                Agronomic tasks synchronized with NEXFIELD Twin simulations and FieldSight alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTasks.map((task) => (
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
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#698475] pt-0.5">
                        <span>Assignee: {task.assignedToName || 'Unassigned Technician'}</span>
                        <span>Due Date: {task.dueDate}</span>
                        {task.costEstimateInr ? (
                          <span className="font-mono text-emerald-400">
                            Est: ₹{task.costEstimateInr.toLocaleString('en-IN')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={task.status === 'completed' ? 'success' : 'outline'} size="sm">
                      {task.status.replace(UNDERSCORE_REGEX, ' ')}
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
              <CardTitle className="text-base">Agrochemical, Seed & Fuel Ledger</CardTitle>
              <CardDescription>
                Current storage balances, transaction lots, unit costs, and supplier provenance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#1E2E25] text-[#71897C] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-2.5">Item Name</th>
                      <th className="pb-2.5">Category</th>
                      <th className="pb-2.5">Batch / Lot #</th>
                      <th className="pb-2.5">Balance</th>
                      <th className="pb-2.5">Unit Price</th>
                      <th className="pb-2.5">Total Valuation</th>
                      <th className="pb-2.5">Supplier / Vendor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18261F] text-[#D8E6DE]">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#121B16] transition-colors">
                        <td className="py-3 font-semibold text-[#F1F6F3]">{item.itemName}</td>
                        <td className="py-3 capitalize text-[#8DA295]">
                          {item.itemType.replace(UNDERSCORE_REGEX, ' ')}
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

        {/* Tab 3: Expenses */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current Season Input Expense Allocations</CardTitle>
              <CardDescription>
                Auditable financial ledger tracking seed, fertilizer, chemical, and diesel expenditures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                  <span className="text-[#647C6E] text-[10px] block">TOTAL REVENUE (PROJECTED)</span>
                  <span className="text-lg font-bold text-emerald-400">₹12,38,400</span>
                  <span className="text-[11px] text-[#789383] block mt-0.5">Based on 48 MT Wheat @ ₹2,580/q</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                  <span className="text-[#647C6E] text-[10px] block">TOTAL CUMULATIVE EXPENSES</span>
                  <span className="text-lg font-bold text-amber-300">₹97,300</span>
                  <span className="text-[11px] text-[#789383] block mt-0.5">Inputs, diesel & maintenance</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                  <span className="text-[#647C6E] text-[10px] block">NET MARGIN ESTIMATE</span>
                  <span className="text-lg font-bold text-emerald-300">₹11,41,100</span>
                  <span className="text-[11px] text-[#789383] block mt-0.5">Net margin: ~92.1%</span>
                </div>
              </div>

              {/* Expense Breakdown Categories */}
              <div className="space-y-2 pt-2 text-xs">
                <h4 className="font-semibold text-[#CADCD1] uppercase tracking-wider text-[11px]">
                  Expense Allocation Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2.5 rounded bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[#E1ECE5]">Foundation Seed (HD-3086 Certified)</span>
                    <span className="font-mono text-[#F1F6F3] font-bold">₹57,600 (59.2%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[#E1ECE5]">Agrochemicals (Tilt Fungicide 25L)</span>
                    <span className="font-mono text-[#F1F6F3] font-bold">₹35,500 (36.5%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[#E1ECE5]">Precision Soil Sampling & Core Assay</span>
                    <span className="font-mono text-[#F1F6F3] font-bold">₹2,350 (2.4%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[#E1ECE5]">Irrigation Manifold Filter Maintenance</span>
                    <span className="font-mono text-[#F1F6F3] font-bold">₹1,850 (1.9%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Harvest Batches */}
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
                        {batch.qualityGrade.replace(UNDERSCORE_REGEX, ' ')}
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
                    <Link href="/markets">
                      <Button variant="secondary" size="sm" className="gap-1 text-xs">
                        <Truck className="h-3.5 w-3.5 text-emerald-400" />
                        Check Mandi Arbitrage
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Task Modal */}
      {isNewTaskModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-xl border border-[#273B2F] bg-[#0E1512] shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1E2E25] pb-3">
              <h3 className="font-semibold text-base text-[#F1F6F3]">Dispatch New Work Order</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="h-6 w-6 text-[#7F998B]"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="task-title" className="text-[#A2B6AA] font-semibold block">Task Title</label>
                <Input
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Bio-stimulant spray run on Sector Alpha"
                  className="bg-[#121B16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="task-category" className="text-[#A2B6AA] font-semibold block">Category</label>
                  <select
                    id="task-category"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full h-9 rounded-lg border border-[#263A2F] bg-[#121B16] px-3 text-xs text-[#F0F5F2] focus:outline-none"
                  >
                    <option value="irrigation">Irrigation</option>
                    <option value="spraying_pest_control">Spraying</option>
                    <option value="fertilization">Fertilization</option>
                    <option value="equipment_maintenance">Equipment</option>
                    <option value="soil_testing">Soil Testing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="task-priority" className="text-[#A2B6AA] font-semibold block">Priority</label>
                  <select
                    id="task-priority"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as typeof newTaskPriority)}
                    className="w-full h-9 rounded-lg border border-[#263A2F] bg-[#121B16] px-3 text-xs text-[#F0F5F2] focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="task-due-date" className="text-[#A2B6AA] font-semibold block">Due Date</label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="bg-[#121B16] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="task-cost" className="text-[#A2B6AA] font-semibold block">Cost Estimate (₹)</label>
                  <Input
                    id="task-cost"
                    type="number"
                    value={newTaskCost}
                    onChange={(e) => setNewTaskCost(e.target.value)}
                    className="bg-[#121B16] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2E25]">
              <Button variant="secondary" size="sm" onClick={() => setIsNewTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => createTaskMutation.mutate()}
                disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
                isLoading={createTaskMutation.isPending}
              >
                Dispatch Order
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Book Inventory Modal */}
      {isNewTransactionModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-xl border border-[#273B2F] bg-[#0E1512] shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1E2E25] pb-3">
              <h3 className="font-semibold text-base text-[#F1F6F3]">Book Inventory Stock Transaction</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNewTransactionModalOpen(false)}
                className="h-6 w-6 text-[#7F998B]"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="tx-item-name" className="text-[#A2B6AA] font-semibold block">Item Name</label>
                <Input
                  id="tx-item-name"
                  value={newTxItemName}
                  onChange={(e) => setNewTxItemName(e.target.value)}
                  className="bg-[#121B16]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label htmlFor="tx-type" className="text-[#A2B6AA] font-semibold block">Transaction</label>
                  <select
                    id="tx-type"
                    value={newTxType}
                    onChange={(e) => setNewTxType(e.target.value)}
                    className="w-full h-9 rounded-lg border border-[#263A2F] bg-[#121B16] px-2 text-xs text-[#F0F5F2] focus:outline-none"
                  >
                    <option value="usage">Field Usage</option>
                    <option value="purchase">Purchase</option>
                    <option value="wastage_adjustment">Wastage</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="tx-quantity" className="text-[#A2B6AA] font-semibold block">Quantity</label>
                  <Input
                    id="tx-quantity"
                    type="number"
                    value={newTxQuantity}
                    onChange={(e) => setNewTxQuantity(e.target.value)}
                    className="bg-[#121B16] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="tx-unit-price" className="text-[#A2B6AA] font-semibold block">Unit Price (₹)</label>
                  <Input
                    id="tx-unit-price"
                    type="number"
                    value={newTxUnitPrice}
                    onChange={(e) => setNewTxUnitPrice(e.target.value)}
                    className="bg-[#121B16] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2E25]">
              <Button variant="secondary" size="sm" onClick={() => setIsNewTransactionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsNewTransactionModalOpen(false)}
              >
                Book Transaction
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
