"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { useDemoStore } from "@/lib/store/useDemoStore";
import { useFarmStore } from "@/lib/store/useFarmStore";
import { apiClient } from "@/lib/api";
import { Button, Badge } from "@nexfield/ui";

interface ContextualTaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalTask {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "completed";
  dueDate: string;
  costInr?: number;
}

export function ContextualTaskDrawer({
  isOpen,
  onClose,
}: ContextualTaskDrawerProps) {
  const pathname = usePathname();
  const isDemo = pathname.startsWith("/demo");
  const demoStore = useDemoStore();
  const { selectedFarmId } = useFarmStore();

  const [liveTasks, setLiveTasks] = useState<LocalTask[]>([]);
  const [isLoadingLiveTasks, setIsLoadingLiveTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "alerts">("tasks");

  // Load live tasks when drawer is opened in authenticated mode
  useEffect(() => {
    if (isOpen && !isDemo && selectedFarmId) {
      setIsLoadingLiveTasks(true);
      apiClient
        .getTasks(selectedFarmId)
        .then((res) => {
          if (res.data && Array.isArray(res.data)) {
            const mapped: LocalTask[] = res.data.map((t: any) => ({
              id: t.id,
              title: t.title,
              category: t.category || "crop_scouting",
              priority: (t.priority?.toLowerCase() as any) || "medium",
              status: t.status === "completed" ? "completed" : "todo",
              dueDate: t.dueDate || "Today",
              costInr: t.costEstimateInr || 500,
            }));
            setLiveTasks(mapped);
          }
        })
        .catch(() => {
          // Fallback gracefully
        })
        .finally(() => {
          setIsLoadingLiveTasks(false);
        });
    }
  }, [isOpen, isDemo, selectedFarmId]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTasks: LocalTask[] = isDemo
    ? demoStore.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        costInr: t.costInr,
      }))
    : liveTasks;

  const pendingTasks = currentTasks.filter((t) => t.status !== "completed");
  const completedTasks = currentTasks.filter((t) => t.status === "completed");

  const handleCompleteTask = (taskId: string) => {
    if (isDemo) {
      demoStore.completeTask(taskId);
    } else {
      setLiveTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)),
      );
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (isDemo) {
      demoStore.addTask({
        title: newTaskTitle.trim(),
        category: "crop_scouting",
        priority: newTaskPriority,
        status: "todo",
        dueDate: "Today",
        costInr: 450,
      });
    } else {
      const tempTask: LocalTask = {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        category: "crop_scouting",
        priority: newTaskPriority,
        status: "todo",
        dueDate: "Today",
        costInr: 500,
      };
      setLiveTasks((prev) => [tempTask, ...prev]);

      try {
        if (selectedFarmId) {
          await apiClient.createTask({
            farmId: selectedFarmId,
            title: newTaskTitle.trim(),
            category: "crop_scouting",
            priority: newTaskPriority,
            dueDate: new Date().toISOString().split("T")[0],
            costEstimateInr: 500,
          });
        }
      } catch {
        // Optimistic UI retained
      }
    }

    setNewTaskTitle("");
    setShowAddForm(false);
  };

  const farmTitle = isDemo ? demoStore.farmName : "Farm Workspace";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container: Slide from right on desktop, Bottom sheet on mobile */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 sm:pl-16">
        <div
          data-testid="contextual-task-drawer"
          className="w-screen max-w-md bg-[#F7FAF2] border-l border-[#D1DDCD] shadow-sm flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#D1DDCD] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#815414]" />
                <h2 className="text-base font-bold text-[#09251A]">
                  Farm Operations & Tasks
                </h2>
              </div>
              <p className="text-xs text-[#46604D]">
                {farmTitle} · Operational Queue
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2] transition-colors"
              aria-label="Close task drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Subheader Filter Tabs */}
          <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-[#D1DDCD] bg-[#F7FAF2]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("tasks")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "tasks"
                    ? "bg-[#FFFFFF] text-[#815414] border border-[#D7B678]/40"
                    : "text-[#46604D] hover:text-[#09251A]"
                }`}
              >
                Today&apos;s Tasks ({pendingTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("alerts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "alerts"
                    ? "bg-[#FFFFFF] text-[#815414] border border-[#D7B678]/40"
                    : "text-[#46604D] hover:text-[#09251A]"
                }`}
              >
                Urgent Alerts (2)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-[#F7FAF2] transition-colors flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showAddForm ? "Cancel" : "New"}</span>
            </button>
          </div>

          {/* Quick Task Creation Form */}
          {showAddForm && (
            <div className="p-4 bg-[#F7FAF2] border-b border-[#D1DDCD]">
              <form onSubmit={handleCreateTask} className="space-y-3">
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title (e.g. Inspect drip emitters)"
                  className="w-full px-3 py-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A]"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#070B09] font-bold text-xs h-7 px-3"
                  >
                    Add Task
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === "tasks" ? (
              <>
                {/* Pending Tasks */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-[#46604D] uppercase tracking-wider block">
                    Pending Field Actions
                  </span>
                  {isLoadingLiveTasks ? (
                    <div className="p-6 text-center text-xs text-[#46604D] flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-[#D7B678] border-t-transparent rounded-full animate-spin" />
                      Loading farm operations...
                    </div>
                  ) : pendingTasks.length === 0 ? (
                    <div className="p-6 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-center text-xs text-[#46604D]">
                      <CheckCircle2 className="h-6 w-6 text-emerald-700 mx-auto mb-2" />
                      <span>All today&apos;s agronomic tasks completed!</span>
                    </div>
                  ) : (
                    pendingTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleCompleteTask(task.id)}
                        className="p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] hover:border-emerald-500/50 hover:bg-[#F7FAF2] cursor-pointer transition-all flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-4 w-4 rounded border border-[#D1DDCD] bg-[#F7FAF2] group-hover:border-emerald-400 mt-0.5 shrink-0 flex items-center justify-center transition-colors" />
                          <div className="space-y-0.5">
                            <div className="text-xs font-semibold text-[#09251A] group-hover:text-emerald-700 transition-colors">
                              {task.title}
                            </div>
                            <div className="text-[11px] text-[#46604D] font-mono">
                              Due: {task.dueDate} · Est: ₹{task.costInr}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border shrink-0 ${
                            task.priority === "urgent"
                              ? "border-rose-700/60 text-rose-700 bg-rose-50/20"
                              : task.priority === "high"
                                ? "border-amber-700/60 text-amber-700 bg-amber-50/20"
                                : "border-emerald-700/60 text-emerald-700 bg-emerald-50/20"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-[#D1DDCD]">
                    <span className="text-xs font-semibold text-[#46604D] uppercase tracking-wider block">
                      Completed Today ({completedTasks.length})
                    </span>
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] opacity-60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-4 w-4 rounded bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span className="text-xs line-through text-[#46604D]">
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#46604D]">
                          Done
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Urgent Alerts Tab */
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#46604D] uppercase tracking-wider block">
                  Agronomic Risk Watchlist
                </span>

                <div className="p-3.5 rounded-xl bg-rose-50/20 border border-rose-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-700" />
                      Early Blight Lesion Risk
                    </span>
                    <span className="text-[10px] font-mono text-rose-700 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-800/40">
                      Sector 2-B
                    </span>
                  </div>
                  <p className="text-xs text-[#46604D] leading-relaxed">
                    Relative humidity reached 88% at dawn. Target Mancozeb 75 WP
                    foliar spray within 24 hours.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/20 border border-amber-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-700" />
                      Soil Moisture Dip Window
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-800/40">
                      Sector 1-A
                    </span>
                  </div>
                  <p className="text-xs text-[#46604D] leading-relaxed">
                    Rootzone depletion reached 18.2 mm. Recommended drip cycle
                    of 22 mm scheduled for 05:30 AM tomorrow.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="p-4 border-t border-[#D1DDCD] bg-[#F7FAF2] flex items-center justify-between text-xs text-[#46604D]">
            <span>
              {isDemo
                ? "Interactive Demo · Sample Farm Data"
                : "Optional API Sync Pending"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs text-[#46604D] border-[#D1DDCD] h-7"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
