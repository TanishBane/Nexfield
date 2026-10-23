'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Boxes,
  DollarSign,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Truck,
  Archive,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '@nexfield/ui';
import { useDemoStore } from '@/lib/store/useDemoStore';

export default function DemoOpsPage() {
  const { farmName, cropName, tasks, expenses, addTask, completeTask } = useDemoStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'irrigation' | 'fertilization' | 'spraying_pest_control' | 'crop_scouting' | 'harvesting'>('fertilization');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const inventoryItems = [
    { name: 'Potassium Nitrate (13-0-45)', category: 'Fertilizer', stock: '12 Bags (300 kg)', status: 'Optimal' },
    { name: 'Neem Oil 10,000 PPM Emulsion', category: 'Bio-Pesticide', stock: '8 Litres', status: 'Optimal' },
    { name: 'Inline Drip Emitters 2.2 LPH', category: 'Hardware', stock: '85 Units', status: 'Low Stock' },
    { name: 'Trichoderma viride Bio-Culture', category: 'Bio-Fungicide', stock: '4 kg', status: 'Optimal' },
  ];

  const harvestBatches = [
    {
      batchCode: 'NEX-TOM-2026-B01',
      field: 'Sector 2-B',
      crop: 'Tomato (Abhinav F1)',
      grade: 'Grade_A_Export',
      quantityKg: 3200,
      harvestDate: '2026-10-21',
      status: 'Consignment Booked',
      targetPrice: '₹2,500 / qtl',
    },
    {
      batchCode: 'NEX-TOM-2026-B02',
      field: 'Sector 1-A',
      crop: 'Tomato (Abhinav F1)',
      grade: 'Grade_B_Domestic_Premium',
      quantityKg: 1850,
      harvestDate: '2026-10-18',
      status: 'Settled at Mandi',
      targetPrice: '₹2,240 / qtl',
    },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      status: 'todo',
      dueDate: 'In 2 days',
      costInr: 650,
    });

    setNewTaskTitle('');
    setShowTaskForm(false);
  };

  const totalExpenseInr = expenses.reduce((sum, e) => sum + e.amountInr, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1A261F]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              NEXFIELD Ops — Operational Ledger & Inventory
            </h1>
            <Badge variant="outline" className="text-purple-400 border-purple-500/40 font-mono text-[10px]">
              Farm ERP
            </Badge>
          </div>
          <p className="text-xs text-[#7B9587] mt-0.5">
            Resource logistics, field tasks, and QR-verifiable harvest records for {farmName}
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="text-xs gap-1.5 bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-bold"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{showTaskForm ? 'Close Form' : 'Add Farm Task'}</span>
        </Button>
      </div>

      {/* Task Creation Modal / Form */}
      {showTaskForm && (
        <Card className="border-emerald-500/50 bg-[#0F1813] p-4">
          <form onSubmit={handleCreateTask} className="space-y-3">
            <div className="text-xs font-bold text-emerald-400">Schedule New Agronomic Task</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g., Apply foliar Boron spray in Sector 2-B"
                className="sm:col-span-1 px-3 py-2 rounded-lg bg-[#080D0A] border border-[#203227] text-xs text-[#F1F6F3]"
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-[#080D0A] border border-[#203227] text-xs text-[#E1ECE5]"
              >
                <option value="fertilization">Fertilization</option>
                <option value="irrigation">Irrigation</option>
                <option value="spraying_pest_control">Spraying & Pest Control</option>
                <option value="crop_scouting">Crop Scouting</option>
                <option value="harvesting">Harvesting</option>
              </select>
              <div className="flex gap-2">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#080D0A] border border-[#203227] text-xs text-[#E1ECE5]"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                <Button type="submit" size="sm" className="bg-emerald-600 text-white text-xs">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25]">
          <div className="text-xs text-[#7B9587]">Active Tasks</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {tasks.filter((t) => t.status !== 'completed').length} Pending
          </div>
          <div className="text-[11px] text-[#556D60] font-mono mt-0.5">
            {tasks.filter((t) => t.status === 'completed').length} Completed
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25]">
          <div className="text-xs text-[#7B9587]">Recorded Season Expenses</div>
          <div className="text-2xl font-bold text-[#F1F6F3] mt-1">
            ₹{totalExpenseInr.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
            Budgeted: ₹45,000 / ha
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25]">
          <div className="text-xs text-[#7B9587]">Dispatched Harvest Lots</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            5,050 kg
          </div>
          <div className="text-[11px] text-[#7B9587] font-mono mt-0.5">
            Export Grade: 63.3%
          </div>
        </div>
      </div>

      {/* 3. Task List & Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Management */}
        <Card className="border-[#1E2E25] bg-[#0E1511]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#F1F6F3]">
              Active Field Work Orders
            </CardTitle>
            <CardDescription className="text-xs text-[#7B9587]">
              Dispatch tasks to field workers or agronomists
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => completeTask(task.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  task.status === 'completed'
                    ? 'bg-[#080D0A] border-[#18261E] opacity-50'
                    : 'bg-[#0E1712] border-[#22352B] hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-[#3D5C4A]'
                    }`}
                  >
                    {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-medium ${
                        task.status === 'completed' ? 'line-through text-[#63796E]' : 'text-[#E1ECE5]'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-[10px] text-[#7B9587] font-mono mt-0.5">
                      {task.category} · Due {task.dueDate} · Est: ₹{task.costInr}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[9px] font-mono uppercase ${
                    task.priority === 'urgent'
                      ? 'border-rose-700/60 text-rose-400'
                      : task.priority === 'high'
                      ? 'border-amber-700/60 text-amber-400'
                      : 'border-emerald-700/60 text-emerald-400'
                  }`}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Input Inventory */}
        <Card className="border-[#1E2E25] bg-[#0E1511]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#F1F6F3]">
              Farm Input Inventory
            </CardTitle>
            <CardDescription className="text-xs text-[#7B9587]">
              Real-time stock of fertilizers, bio-inputs and hardware
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 font-mono text-xs">
            {inventoryItems.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E] flex items-center justify-between"
              >
                <div>
                  <div className="text-[#F1F6F3] font-sans font-medium">{item.name}</div>
                  <div className="text-[10px] text-[#7B9587]">{item.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{item.stock}</div>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded border ${
                      item.status === 'Low Stock'
                        ? 'border-amber-700/60 text-amber-400'
                        : 'border-emerald-700/60 text-emerald-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Harvest Batches & Traceability QR */}
      <Card className="border-[#1E2E25] bg-[#0E1511]">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-[#F1F6F3]">
              Harvest Consignments & Food Quality Provenance
            </CardTitle>
            <CardDescription className="text-xs text-[#7B9587]">
              Export batches tracked with tamper-evident batch codes
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 text-[10px] font-mono">
            ADAPPT 5.0 Food Tech Traceability
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {harvestBatches.map((batch) => (
              <div
                key={batch.batchCode}
                className="p-4 rounded-xl bg-[#080D0A] border border-[#19261E] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#16231B] pb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-emerald-300">
                      {batch.batchCode}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    {batch.grade.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#8EA698]">
                  <div>Field: <span className="text-[#F1F6F3]">{batch.field}</span></div>
                  <div>Quantity: <span className="text-emerald-400 font-bold">{batch.quantityKg} kg</span></div>
                  <div>Harvest Date: <span className="text-[#F1F6F3]">{batch.harvestDate}</span></div>
                  <div>Status: <span className="text-purple-400">{batch.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
