'use client';

import React, { useState, useMemo } from 'react';
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
  LayoutGrid,
  List,
  Search,
  ShieldAlert,
  ThermometerSnowflake,
  Droplets,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  PackageCheck,
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
  DataTable,
  ProvenanceBadge,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useDemoStore } from '@/lib/store/useDemoStore';
import type { FarmTask, InventoryTransaction } from '@nexfield/contracts';
import Link from 'next/link';

const UNDERSCORE_REGEX = /_/g;

interface TaskItem {
  id: string;
  farmId?: string;
  fieldId?: string;
  title: string;
  description?: string;
  category: 'irrigation' | 'fertilization' | 'spraying_pest_control' | 'crop_scouting' | 'harvesting' | 'equipment_maintenance' | 'soil_testing';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
  costInr: number;
  assignedToName?: string;
}

export default function OpsPage() {
  const queryClient = useQueryClient();
  const demoStore = useDemoStore();
  const activeFarmId = demoStore.farmId;
  const activeFarmName = demoStore.farmName;

  // View modes: list or kanban
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [activeTaskFilter, setActiveTaskFilter] = useState<string>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  // Modals state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'irrigation' | 'fertilization' | 'spraying_pest_control' | 'crop_scouting' | 'harvesting'>('irrigation');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-10-28');
  const [newTaskCost, setNewTaskCost] = useState('3200');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // New Transaction Form State
  const [newTxItemName, setNewTxItemName] = useState('Tilt Propiconazole 25% EC (5L)');
  const [newTxType, setNewTxType] = useState('usage');
  const [newTxQuantity, setNewTxQuantity] = useState('5');
  const [newTxUnitPrice, setNewTxUnitPrice] = useState('1850');

  // React Query baseline data
  const tasksQuery = useQuery({
    queryKey: ['tasks', activeFarmId],
    queryFn: () => apiClient.getTasks(activeFarmId),
  });

  const inventoryQuery = useQuery({
    queryKey: ['inventory', activeFarmId],
    queryFn: () => apiClient.getInventory(activeFarmId),
  });

  const harvestQuery = useQuery({
    queryKey: ['harvestBatches', activeFarmId],
    queryFn: () => apiClient.getHarvestBatches(activeFarmId),
  });

  // Merge store tasks with query data
  const allTasks: TaskItem[] = useMemo(() => {
    const storeTasks = demoStore.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: 'Scheduled agronomic field operation synchronized with NEXFIELD biophysical model.',
      category: t.category,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      costInr: t.costInr,
      assignedToName: 'Field Operations Crew',
    }));

    const apiTasks = (tasksQuery.data?.data || []).map((t) => ({
      id: t.id,
      farmId: t.farmId,
      fieldId: t.fieldId,
      title: t.title,
      description: t.description || 'Verified agronomic task order.',
      category: (t.category as TaskItem['category']) || 'crop_scouting',
      priority: (t.priority as TaskItem['priority']) || 'medium',
      status: (t.status as TaskItem['status']) || 'todo',
      dueDate: t.dueDate,
      costInr: t.costEstimateInr || 2500,
      assignedToName: t.assignedToName || 'Agronomy Specialist',
    }));

    // Deduplicate by title
    const seen = new Set<string>();
    const combined: TaskItem[] = [];

    for (const item of [...storeTasks, ...apiTasks]) {
      const key = item.title.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
    }

    return combined;
  }, [demoStore.tasks, tasksQuery.data?.data]);

  // Task filtering
  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      if (activeTaskFilter === 'urgent' && t.priority !== 'urgent') return false;
      if (activeTaskFilter === 'pending' && t.status === 'completed') return false;
      if (activeTaskFilter === 'completed' && t.status !== 'completed') return false;
      if (activeTaskFilter === 'in_progress' && t.status !== 'in_progress') return false;

      if (taskSearchQuery.trim()) {
        const q = taskSearchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.priority.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allTasks, activeTaskFilter, taskSearchQuery]);

  // Tasks by Kanban column
  const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'todo'), [filteredTasks]);
  const inProgressTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'in_progress'), [filteredTasks]);
  const completedTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'completed'), [filteredTasks]);

  // Task Creation Handler
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    demoStore.addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      status: 'todo',
      dueDate: newTaskDueDate,
      costInr: Number(newTaskCost) || 0,
    });

    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    queryClient.invalidateQueries({ queryKey: ['tasks', activeFarmId] });
  };

  // Status transitions
  const handleSetStatus = (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    demoStore.updateTaskStatus(taskId, newStatus);
    queryClient.invalidateQueries({ queryKey: ['tasks', activeFarmId] });
  };

  if (tasksQuery.isLoading || inventoryQuery.isLoading || harvestQuery.isLoading) {
    return <ModuleLoadingState message="Loading farm operational ledgers, inventory balances, and task queues..." />;
  }

  const inventory = inventoryQuery.data?.data || [];
  const harvestBatches = harvestQuery.data?.data || [];

  // Inventory Table Columns for DataTable
  const inventoryColumns = [
    {
      key: 'itemName',
      header: 'Item Name & Formulation',
      sortable: true,
      render: (item: InventoryTransaction) => (
        <div>
          <span className="font-semibold text-[#F1F6F3] block">{item.itemName}</span>
          <span className="text-[11px] font-mono text-[#748F80]">Batch: {item.batchNumber || 'LOT-2026-N09'}</span>
        </div>
      ),
    },
    {
      key: 'itemType',
      header: 'Category',
      sortable: true,
      render: (item: InventoryTransaction) => (
        <Badge variant="outline" size="sm" className="capitalize text-[#8DA295]">
          {item.itemType.replace(UNDERSCORE_REGEX, ' ')}
        </Badge>
      ),
    },
    {
      key: 'balanceAfterQuantity',
      header: 'Current Stock & Health',
      sortable: true,
      render: (item: InventoryTransaction) => {
        const isLow = item.balanceAfterQuantity <= 15;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                {item.balanceAfterQuantity} {item.unit}
              </span>
              {isLow && (
                <Badge variant="warning" size="sm" className="text-[10px] py-0 px-1.5">
                  Low Stock
                </Badge>
              )}
            </div>
            <div className="w-24 h-1.5 bg-[#17241D] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isLow ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, (item.balanceAfterQuantity / 60) * 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'unitPriceInr',
      header: 'Unit Price',
      sortable: true,
      render: (item: InventoryTransaction) => (
        <span className="font-mono tabular-nums text-[#BACDC2]">₹{item.unitPriceInr.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'totalAmountInr',
      header: 'Total Valuation',
      sortable: true,
      render: (item: InventoryTransaction) => (
        <span className="font-mono tabular-nums font-bold text-[#F1F6F3]">
          ₹{item.totalAmountInr.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'supplierOrVendor',
      header: 'Vendor / Provenance',
      render: (item: InventoryTransaction) => (
        <span className="text-[11px] text-[#879E91]">{item.supplierOrVendor || 'ICAR Registered Depot'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E2E25]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-emerald-400" />
              NEXFIELD Ops — Operational Command & Storage Custody
            </h1>
            <ProvenanceBadge type="fixture" source="Public Demo" />
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-1">
            Active farm: <span className="font-semibold text-emerald-400">{activeFarmName}</span> — Workforce task dispatch, agrochemical inventory, and post-harvest grain quality custody.
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

      {/* KPI Stat Cards (APCA Compliant, Tabular Figures, Concentric Radii) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Work Orders"
          value={allTasks.filter((t) => t.status !== 'completed').length}
          unit="Tasks"
          subValue={`${todoTasks.length} queued, ${inProgressTasks.length} in field`}
          trend="neutral"
          trendValue="On Track"
          icon={<ClipboardList className="h-4 w-4" />}
          variant="emerald"
        />

        <StatCard
          label="Inventory Valuation"
          value="₹93,100"
          unit="INR"
          subValue="4 active input categories"
          trend="down"
          trendValue="Burn Rate Normal"
          icon={<Boxes className="h-4 w-4" />}
          variant="sky"
        />

        <StatCard
          label="Silo Storage Custody"
          value="24.8"
          unit="MT"
          subValue="Safe Moisture: 12.8% (<14% req.)"
          trend="up"
          trendValue="Export Grade"
          icon={<Archive className="h-4 w-4" />}
          variant="amber"
        />

        <StatCard
          label="Season OPEX Realized"
          value="₹97,300"
          unit="YTD"
          subValue="Seed, inputs & fuel"
          trend="up"
          trendValue="Budget Aligned"
          icon={<IndianRupee className="h-4 w-4" />}
          variant="emerald"
        />
      </div>

      {/* Main Operational Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Work Orders ({allTasks.length})
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Boxes className="h-4 w-4" />
            Agrochemical Stock ({inventory.length})
          </TabsTrigger>
          <TabsTrigger value="custody" className="gap-2">
            <Archive className="h-4 w-4" />
            Storage Custody & Food Safety
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2">
            <Receipt className="h-4 w-4" />
            Cost & OPEX Ledger
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: WORK ORDERS (KANBAN & LIST) */}
        <TabsContent value="tasks" className="space-y-4">
          {/* Subheader Toolbar: Search, Filters, and View Mode Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-lg bg-[#0C120F] border border-[#1E2E25] text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="h-4 w-4 text-[#7D998B] shrink-0" />
              <input
                type="text"
                placeholder="Search work orders..."
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#F1F6F3] placeholder-[#5A7365] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#14201A] p-1 rounded-md border border-[#21352A]">
                {['all', 'urgent', 'in_progress', 'completed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveTaskFilter(filter)}
                    className={`px-2.5 py-1 rounded text-xs capitalize font-medium transition-colors ${
                      activeTaskFilter === filter
                        ? 'bg-[#1C2F25] text-emerald-400 border border-[#2A4434]'
                        : 'text-[#7D998B] hover:text-[#D1E0D7]'
                    }`}
                  >
                    {filter.replace(UNDERSCORE_REGEX, ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-[#14201A] p-1 rounded-md border border-[#21352A]">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-[#1C2F25] text-emerald-400'
                      : 'text-[#7D998B] hover:text-[#D1E0D7]'
                  }`}
                  title="Kanban Board View"
                  aria-label="Kanban Board View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#1C2F25] text-emerald-400'
                      : 'text-[#7D998B] hover:text-[#D1E0D7]'
                  }`}
                  title="List View"
                  aria-label="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* KANBAN BOARD VIEW */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1: To-Do */}
              <div className="rounded-xl bg-[#0B100E] border border-[#1C2A22] p-4 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#1A2820]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="font-semibold text-xs text-[#E1ECE5]">To-Do / Scheduled</span>
                  </div>
                  <Badge variant="outline" size="sm" className="font-mono text-amber-400">
                    {todoTasks.length}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2.5">
                  {todoTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#637C6E] border border-dashed border-[#1C2A22] rounded-lg">
                      No tasks in queue
                    </div>
                  ) : (
                    todoTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg bg-[#111A15] border border-[#213228] p-3.5 space-y-2.5 hover:border-emerald-700/50 transition-colors shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-[#F1F6F3] leading-snug">{task.title}</span>
                          <Badge
                            variant={
                              task.priority === 'urgent'
                                ? 'destructive'
                                : task.priority === 'high'
                                ? 'warning'
                                : 'default'
                            }
                            size="sm"
                            className="shrink-0 text-[10px]"
                          >
                            {task.priority}
                          </Badge>
                        </div>

                        <p className="text-[11px] text-[#8DA295] line-clamp-2">{task.description}</p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[#6A8476] pt-1 border-t border-[#19271F]">
                          <span>Due: {task.dueDate}</span>
                          <span className="text-emerald-400 font-semibold">₹{task.costInr.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSetStatus(task.id, 'in_progress')}
                            className="h-6 text-[10px] px-2 text-sky-400 hover:text-sky-300 border-[#22352A]"
                          >
                            Start Task
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="rounded-xl bg-[#0B100E] border border-[#1C2A22] p-4 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#1A2820]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-sky-400" />
                    <span className="font-semibold text-xs text-[#E1ECE5]">In Field / In Progress</span>
                  </div>
                  <Badge variant="outline" size="sm" className="font-mono text-sky-400">
                    {inProgressTasks.length}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2.5">
                  {inProgressTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#637C6E] border border-dashed border-[#1C2A22] rounded-lg">
                      No active fieldwork right now
                    </div>
                  ) : (
                    inProgressTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg bg-[#111A15] border border-sky-800/40 p-3.5 space-y-2.5 hover:border-sky-600/60 transition-colors shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-[#F1F6F3] leading-snug">{task.title}</span>
                          <Badge variant="warning" size="sm" className="shrink-0 text-[10px]">
                            In Progress
                          </Badge>
                        </div>

                        <p className="text-[11px] text-[#8DA295] line-clamp-2">{task.description}</p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[#6A8476] pt-1 border-t border-[#19271F]">
                          <span>Due: {task.dueDate}</span>
                          <span className="text-emerald-400 font-semibold">₹{task.costInr.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSetStatus(task.id, 'completed')}
                            className="h-6 text-[10px] px-2 text-emerald-400 hover:text-emerald-300 border-[#22352A]"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Sign Off
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className="rounded-xl bg-[#0B100E] border border-[#1C2A22] p-4 flex flex-col gap-3 min-h-[400px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#1A2820]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-semibold text-xs text-[#E1ECE5]">Completed & Signed Off</span>
                  </div>
                  <Badge variant="outline" size="sm" className="font-mono text-emerald-400">
                    {completedTasks.length}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2.5">
                  {completedTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#637C6E] border border-dashed border-[#1C2A22] rounded-lg">
                      No completed tasks
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg bg-[#0F1713] border border-[#1C2C23] p-3.5 space-y-2 opacity-85 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-[#CADCD1] line-through">{task.title}</span>
                          <Badge variant="success" size="sm" className="shrink-0 text-[10px]">
                            Done
                          </Badge>
                        </div>

                        <p className="text-[11px] text-[#698475] line-clamp-1">{task.description}</p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[#5A7365] pt-1 border-t border-[#19271F]">
                          <span>Completed</span>
                          <span className="text-[#8DA295]">₹{task.costInr.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex items-center justify-end pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetStatus(task.id, 'todo')}
                            className="h-5 text-[10px] px-1 text-[#698475] hover:text-[#9FB7AA]"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Re-queue
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* LIST VIEW */
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Field Labor & Machinery Dispatch Schedule</CardTitle>
                <CardDescription>
                  Agronomic task orders synchronized with NEXFIELD biophysical simulations and FieldSight alerts.
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
                          <span className={`font-semibold text-sm ${task.status === 'completed' ? 'text-[#8DA295] line-through' : 'text-[#F1F6F3]'}`}>
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
                          <span>Assignee: {task.assignedToName || 'Crew Lead'}</span>
                          <span>Due: {task.dueDate}</span>
                          <span className="font-mono text-emerald-400">
                            Est: ₹{task.costInr.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={task.status === 'completed' ? 'success' : 'outline'} size="sm">
                        {task.status.replace(UNDERSCORE_REGEX, ' ')}
                      </Badge>
                      {task.status !== 'completed' ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSetStatus(task.id, 'completed')}
                          className="h-7 text-[11px] px-2 text-emerald-300 hover:text-emerald-200 border-[#22352A]"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSetStatus(task.id, 'todo')}
                          className="h-7 text-[11px] px-2 text-[#7F998B]"
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 2: AGROCHEMICAL & RESOURCE INVENTORY */}
        <TabsContent value="inventory" className="space-y-4">
          {/* Low Stock Warning Banner */}
          <div className="rounded-lg bg-amber-950/30 border border-amber-800/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-200 block text-sm">
                  Inventory Safety Threshold Alert: Mancozeb 75 WP
                </span>
                <p className="text-amber-300/80 mt-0.5">
                  Current balance is at 8 kg, falling below the mandatory ICAR prophylactic safety reserve (10 kg) for Early Blight prevention.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewTransactionModalOpen(true)}
              className="shrink-0 bg-amber-900/40 hover:bg-amber-900/60 text-amber-200 border-amber-700/50 text-xs"
            >
              Order Replenishment
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agrochemical, Seed & Fuel Warehouse Ledger</CardTitle>
              <CardDescription>
                Real-time stock balance, lot provenance, unit costs, and reorder levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={inventoryColumns}
                data={inventory}
                keyExtractor={(item) => item.id}
                emptyMessage="No agrochemical records in current facility."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: STORAGE CUSTODY & FOOD SAFETY */}
        <TabsContent value="custody" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grain Silo Custody */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-sky-400" />
                    Grain Silo Custody & Equilibrium Moisture
                  </CardTitle>
                  <Badge variant="success" size="sm">
                    Safe Custody
                  </Badge>
                </div>
                <CardDescription>
                  Indian National Grain Storage Standard: Equilibrium Moisture Content (EMC) must remain strictly below 14% to inhibit <span className="italic font-medium text-amber-300">Aspergillus flavus</span> and carcinogenic aflatoxin synthesis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[#0E1511] border border-[#1E2E25] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8DA295]">Silo #3 Wheat Core Moisture</span>
                    <span className="font-mono font-bold text-sky-400 text-sm">12.8%</span>
                  </div>
                  {/* Visual Bar */}
                  <div className="w-full h-3 bg-[#17251E] rounded-full overflow-hidden relative">
                    {/* Safe zone 0 - 14% */}
                    <div className="absolute top-0 bottom-0 left-0 bg-emerald-500/80 rounded-full" style={{ width: '64%' }} />
                    {/* Danger line at 70% (representing 14%) */}
                    <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-rose-500 z-10" />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#637C6E] font-mono">
                    <span>Safe Zone (&lt;14%)</span>
                    <span className="text-rose-400 font-semibold">14.0% Aflatoxin Critical Threshold</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[10px] text-[#597365] block uppercase">Foreign Matter</span>
                    <span className="text-emerald-400 font-bold text-sm">0.8%</span>
                    <span className="text-[10px] text-[#71897C] block mt-0.5">ICAR Limit: 1.5%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[10px] text-[#597365] block uppercase">Broken Grains</span>
                    <span className="text-emerald-400 font-bold text-sm">1.2%</span>
                    <span className="text-[10px] text-[#71897C] block mt-0.5">ICAR Limit: 3.0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cold Storage Custody */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ThermometerSnowflake className="h-5 w-5 text-sky-400" />
                    Cold Storage & Chilling-Injury Prevention
                  </CardTitle>
                  <Badge variant="success" size="sm">
                    Optimal Thermal State
                  </Badge>
                </div>
                <CardDescription>
                  Cold Chain Standard: Fresh tomato custody temperature must be maintained strictly above 10°C to prevent chilling injury, flesh softening, and aroma loss.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[#0E1511] border border-[#1E2E25] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8DA295]">Chamber #2 Core Temperature</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">11.5°C</span>
                  </div>
                  {/* Visual Bar */}
                  <div className="w-full h-3 bg-[#17251E] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-[35%] w-[40%] bg-emerald-500/80 rounded-full" />
                    {/* Minimum chilling injury boundary */}
                    <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-sky-400 z-10" />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#637C6E] font-mono">
                    <span className="text-sky-400 font-semibold">10.0°C Chilling Injury Limit</span>
                    <span>13.0°C Upper Ripening Bound</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[10px] text-[#597365] block uppercase">Relative Humidity</span>
                    <span className="text-sky-300 font-bold text-sm">91.4%</span>
                    <span className="text-[10px] text-[#71897C] block mt-0.5">Target: 90 - 95%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                    <span className="text-[10px] text-[#597365] block uppercase">Ethylene Scrubbing</span>
                    <span className="text-emerald-400 font-bold text-sm">Active</span>
                    <span className="text-[10px] text-[#71897C] block mt-0.5">&lt;0.05 ppm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Harvest Batches List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Certified Harvest Batches in Facility Custody</CardTitle>
              <CardDescription>
                Verified batch codes, moisture tests, quality grades, and Mandi dispatch links.
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

        {/* TAB 4: EXPENSES & OPEX LEDGER */}
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
      </Tabs>

      {/* DISPATCH NEW TASK MODAL */}
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
                    onChange={(e) => setNewTaskCategory(e.target.value as typeof newTaskCategory)}
                    className="w-full h-9 rounded-lg border border-[#263A2F] bg-[#121B16] px-3 text-xs text-[#F0F5F2] focus:outline-none"
                  >
                    <option value="irrigation">Irrigation</option>
                    <option value="spraying_pest_control">Spraying</option>
                    <option value="fertilization">Fertilization</option>
                    <option value="crop_scouting">Scouting</option>
                    <option value="harvesting">Harvesting</option>
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
                onClick={handleCreateTask}
                disabled={!newTaskTitle.trim()}
              >
                Dispatch Order
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* BOOK INVENTORY MODAL */}
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
