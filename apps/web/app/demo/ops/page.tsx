"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Thermometer,
  Droplets,
  ShieldAlert,
  ShieldCheck,
  Check,
  User,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@nexfield/ui";
import { useDemoStore } from "@/lib/store/useDemoStore";

interface InventoryItem {
  id: string;
  name: string;
  category: "Fertilizer" | "Bio-Pesticide" | "Chemical Fungicide" | "Hardware";
  quantityKg: number;
  unit: string;
  reorderLevel: number;
}

export default function DemoOpsPage() {
  const { farmName, tasks, expenses, addTask, completeTask } = useDemoStore();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<
    | "irrigation"
    | "fertilization"
    | "spraying_pest_control"
    | "crop_scouting"
    | "harvesting"
  >("fertilization");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [assignedOperator, setAssignedOperator] = useState(
    "Ramesh K. (Lead Sprayer)",
  );
  const [assignedSector, setAssignedSector] = useState("Sector 2-B");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [deductionNotice, setDeductionNotice] = useState<string | null>(null);

  // Local inventory state to support demo-state deductions
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "inv-1",
      name: "Potassium Nitrate (13-0-45)",
      category: "Fertilizer",
      quantityKg: 300,
      unit: "kg",
      reorderLevel: 100,
    },
    {
      id: "inv-2",
      name: "Mancozeb 75 WP Fungicide",
      category: "Chemical Fungicide",
      quantityKg: 24,
      unit: "kg",
      reorderLevel: 10,
    },
    {
      id: "inv-3",
      name: "Neem Oil 10,000 PPM Emulsion",
      category: "Bio-Pesticide",
      quantityKg: 12,
      unit: "L",
      reorderLevel: 5,
    },
    {
      id: "inv-4",
      name: "Inline Drip Emitters 2.2 LPH",
      category: "Hardware",
      quantityKg: 45,
      unit: "units",
      reorderLevel: 50,
    },
  ]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: `${newTaskTitle.trim()} [${assignedSector} · ${assignedOperator.split(" ")[0]}]`,
      category: newTaskCategory,
      priority: newTaskPriority,
      status: "todo",
      dueDate: "In 2 days",
      costInr: 650,
    });

    setNewTaskTitle("");
    setShowTaskForm(false);
  };

  const handleToggleTask = (taskId: string, category: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.status !== "completed") {
      completeTask(taskId);

      // Apply demo inventory deduction
      if (category === "spraying_pest_control") {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === "inv-2"
              ? { ...item, quantityKg: Math.max(0, item.quantityKg - 4.8) }
              : item,
          ),
        );
        setDeductionNotice(
          "Deducted 4.8 kg Mancozeb 75 WP from warehouse custody.",
        );
      } else if (category === "fertilization" || category === "irrigation") {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === "inv-1"
              ? { ...item, quantityKg: Math.max(0, item.quantityKg - 25) }
              : item,
          ),
        );
        setDeductionNotice(
          "Deducted 25 kg Potassium Nitrate (13-0-45) from inventory.",
        );
      } else {
        setDeductionNotice("Task logged in verified farm audit trail.");
      }

      setTimeout(() => setDeductionNotice(null), 5000);
    }
  };

  const totalExpenseInr = expenses.reduce((sum, e) => sum + e.amountInr, 0);

  return (
    <div className="module-page module-tasks space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D1DDCD]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09251A] font-serif">
              Daily tasks
            </h1>
            <Badge
              variant="outline"
              className="text-purple-700 border-purple-500/40 font-mono text-xs px-2.5 py-0.5"
            >
              ADAPPT 5.0 Food Tech
            </Badge>
          </div>
          <p className="text-sm text-[#46604D] mt-1">
            {farmName} · Field work order dispatch, automated custody
            deductions, and post-harvest safe storage monitors
          </p>
        </div>

        <Button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="text-xs font-bold gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#070B09] shadow-md shadow-emerald-500/20 py-2"
        >
          <Plus className="h-4 w-4" />
          <span>{showTaskForm ? "Close Form" : "Schedule Work Order"}</span>
        </Button>
      </div>

      {/* Deduction Alert Notice Toast */}
      {deductionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-500/60 text-xs font-mono text-emerald-700 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>{deductionNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-700/80">
            Tamper-evident audit log updated
          </span>
        </div>
      )}

      {/* Task Creation Form */}
      {showTaskForm && (
        <Card className="border-emerald-500/50 bg-[#F7FAF2] p-5 shadow-sm">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="text-sm font-bold text-emerald-700 font-serif">
              Dispatch New Field Work Order
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Work Order description (e.g., Foliar Mancozeb spray)"
                className="px-3.5 py-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A] focus:outline-none"
              >
                <option value="fertilization">Fertilization</option>
                <option value="irrigation">Irrigation</option>
                <option value="spraying_pest_control">
                  Spraying & Pest Control
                </option>
                <option value="crop_scouting">Crop Scouting</option>
                <option value="harvesting">Harvesting</option>
              </select>
              <select
                value={assignedSector}
                onChange={(e) => setAssignedSector(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A] focus:outline-none"
              >
                <option value="Sector 1-A">Sector 1-A (Tomato Abhinav)</option>
                <option value="Sector 2-B">Sector 2-B (Tomato Abhinav)</option>
                <option value="Sector 3-C">Sector 3-C (Onion Bhima)</option>
              </select>
              <select
                value={assignedOperator}
                onChange={(e) => setAssignedOperator(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A] focus:outline-none"
              >
                <option value="Ramesh K. (Lead Sprayer)">
                  Ramesh K. (Lead Sprayer)
                </option>
                <option value="Sunita P. (Irrigation Tech)">
                  Sunita P. (Irrigation Tech)
                </option>
                <option value="Vijay M. (Agronomist)">
                  Vijay M. (Agronomist)
                </option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTaskForm(false)}
                className="text-xs text-[#46604D] border-[#D1DDCD]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-500 text-[#070B09] font-bold text-xs"
              >
                Dispatch Work Order
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD]">
          <div className="text-xs text-[#46604D] font-semibold">
            Active Field Work Orders
          </div>
          <div className="text-3xl font-bold text-emerald-700 tabular-nums mt-1">
            {tasks.filter((t) => t.status !== "completed").length} Pending
          </div>
          <div className="text-xs text-[#46604D] mt-1 font-mono">
            {tasks.filter((t) => t.status === "completed").length} Completed in
            current cycle
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD]">
          <div className="text-xs text-[#46604D] font-semibold">
            Season Input Expenses
          </div>
          <div className="text-3xl font-bold text-[#09251A] tabular-nums mt-1">
            ₹{totalExpenseInr.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-mono">
            Budget Remaining: ₹32,450
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD]">
          <div className="text-xs text-[#46604D] font-semibold">
            Tracked Harvest Lots
          </div>
          <div className="text-3xl font-bold text-purple-700 tabular-nums mt-1">
            5,050 kg
          </div>
          <div className="text-xs text-[#46604D] mt-1 font-mono">
            63.3% Certified Export Grade A
          </div>
        </div>
      </div>

      {/* 3. ADAPPT 5.0 Food Tech: Grain Silo & Cold Storage Quality Monitors */}
      <div className="p-5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D1DDCD]">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Food storage quality & preservation summary
            </div>
            <h2 className="text-lg font-bold text-[#09251A] font-serif mt-0.5">
              Harvest storage
            </h2>
          </div>
          <Badge
            variant="outline"
            className="text-emerald-700 border-emerald-500/30 font-mono text-xs self-start sm:self-auto"
          >
            Domain 2: AI in Food Technology
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Grain Silo #1 */}
          <div className="p-4 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4 text-amber-700" />
                <span className="font-bold text-sm text-[#09251A]">
                  Grain Silo #1 (Wheat Reserve)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-mono border border-emerald-500/30">
                Safe Storage
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
              <div className="p-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[10px]">
                  EQUILIBRIUM MOISTURE
                </span>
                <span className="text-sky-700 font-bold text-sm tabular-nums">
                  12.4%
                </span>
                <span className="text-[10px] text-[#46604D] block">
                  &lt; 14.0% limit
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[10px]">
                  SILO TEMP
                </span>
                <span className="text-amber-700 font-bold text-sm tabular-nums">
                  21.8°C
                </span>
                <span className="text-[10px] text-[#46604D] block">
                  Aeration Active
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[10px]">
                  AFLATOXIN RISK
                </span>
                <span className="text-emerald-700 font-bold text-sm tabular-nums">
                  0.0%
                </span>
                <span className="text-[10px] text-[#46604D] block">
                  Aspergillus Guard
                </span>
              </div>
            </div>

            <div className="text-xs text-[#46604D] leading-relaxed">
              Equilibrium Relative Humidity (ERH) is 58%, preventing mold
              sporulation. Safe storage window: <strong>180 Days</strong>.
            </div>
          </div>

          {/* Cold Storage Room #2 */}
          <div className="p-4 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-cyan-700" />
                <span className="font-bold text-sm text-[#09251A]">
                  Cold Room #2 (Tomato Harvest)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-mono border border-emerald-500/30">
                Optimal Hold
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
              <div className="p-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[10px]">
                  CHAMBER TEMP
                </span>
                <span className="text-cyan-700 font-bold text-sm tabular-nums">
                  11.5°C
                </span>
                <span className="text-[10px] text-[#46604D] block">
                  &gt; 10°C (No Chilling)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[10px]">
                  CHAMBER RH
                </span>
                <span className="text-sky-700 font-bold text-sm tabular-nums">
                  88.5%
                </span>
                <span className="text-[10px] text-[#46604D] block">
                  Prevents Shrivel
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[10px]">
                  ETHYLENE SCRUBBER
                </span>
                <span className="text-emerald-700 font-bold text-sm tabular-nums">
                  0.04 ppm
                </span>
                <span className="text-[10px] text-[#46604D] block">
                  Suppresses Ripening
                </span>
              </div>
            </div>

            <div className="text-xs text-[#46604D] leading-relaxed">
              Maintained strictly above 10°C to eliminate chilling injury and
              surface pitting. Table shelf-life projection:{" "}
              <strong>14 Days</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Task List & Real-Time Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Management (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-[#D1DDCD] bg-[#F7FAF2]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#09251A]">
                  Field Work Orders
                </CardTitle>
                <CardDescription className="text-xs text-[#46604D]">
                  Click to complete work order and trigger automated inventory
                  deductions
                </CardDescription>
              </div>
              <span className="text-xs text-[#46604D] font-mono">
                {tasks.length} total
              </span>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {tasks.map((task) => {
                const isCompleted = task.status === "completed";
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.category)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isCompleted
                        ? "bg-[#F7FAF2] border-[#D1DDCD] opacity-60"
                        : "bg-[#F7FAF2] border-[#D1DDCD] hover:border-emerald-500/50 hover:bg-[#F7FAF2]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                          isCompleted
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "border-[#D1DDCD] bg-[#F7FAF2]"
                        }`}
                      >
                        {isCompleted && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-semibold ${
                            isCompleted
                              ? "line-through text-[#46604D]"
                              : "text-[#09251A]"
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-[#46604D] font-mono mt-0.5">
                          {task.category} · Due {task.dueDate} · Est: ₹
                          {task.costInr}
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                        task.priority === "urgent"
                          ? "border-rose-700/60 text-rose-700 bg-rose-50/30"
                          : task.priority === "high"
                            ? "border-amber-700/60 text-amber-700 bg-amber-50/30"
                            : "border-emerald-700/60 text-emerald-700 bg-emerald-50/30"
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Demo Inventory Snapshot (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-[#D1DDCD] bg-[#F7FAF2]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#09251A]">
                  Demo Input Inventory
                </CardTitle>
                <CardDescription className="text-xs text-[#46604D]">
                  Deductions synchronized with task completion
                </CardDescription>
              </div>
              <Boxes className="h-4 w-4 text-emerald-700" />
            </CardHeader>
            <CardContent className="space-y-2.5 font-mono text-xs">
              {inventory.map((item) => {
                const isLow = item.quantityKg <= item.reorderLevel;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[#09251A] font-sans font-semibold text-xs">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#46604D]">
                        {item.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-[#09251A] tabular-nums">
                        {item.quantityKg} {item.unit}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border inline-block mt-0.5 ${
                          isLow
                            ? "border-amber-700/60 text-amber-700 bg-amber-50/30"
                            : "border-emerald-700/60 text-emerald-700 bg-emerald-50/30"
                        }`}
                      >
                        {isLow ? "Low Stock Warning" : "Adequate"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Traceable Batch Sample */}
          <div className="p-4 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#09251A] font-bold">
                Consignment NEX-TOM-2026-B01
              </span>
              <span className="text-emerald-700 font-bold">Export Grade A</span>
            </div>
            <div className="text-[#46604D]">
              3,200 kg · Sector 2-B · Tamper-evident QR verifiable in the demo market record
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
