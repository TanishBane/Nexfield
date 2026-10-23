'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, CheckCircle2, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Button, Input, Badge } from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

interface ConvertToTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConvertToTaskModal({ isOpen, onClose }: ConvertToTaskModalProps) {
  const queryClient = useQueryClient();
  const { selectedFarmId, selectedFieldId } = useFarmStore();
  const { params, activeScenario } = useSimulationStore();

  const [title, setTitle] = useState(
    `Execute Deficit Pulse Drip (${params.irrigationVolumeM3PerHa} m³/ha) + Split-N (${params.nitrogenTopDressingKgPerHa} kg/ha)`
  );
  const [dueDate, setDueDate] = useState('2026-10-25');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');
  const [isSuccess, setIsSuccess] = useState(false);

  const createTaskMutation = useMutation({
    mutationFn: () =>
      apiClient.createTask({
        farmId: selectedFarmId,
        fieldId: selectedFieldId || undefined,
        title,
        description: `Operational task generated from NEXFIELD Twin simulation scenario. Projected yield delta: +${activeScenario?.projectedOutcomes.yieldDeltaPercent.toFixed(1) || 14.8}%.`,
        category: 'irrigation',
        priority,
        dueDate,
        costEstimateInr: 3200,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', selectedFarmId] });
      queryClient.invalidateQueries({ queryKey: ['controlOverview', selectedFarmId] });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl border border-[#273B2F] bg-[#0E1512] shadow-2xl overflow-hidden text-[#E2ECE5]">
        <div className="flex items-center justify-between p-4 border-b border-[#1E2E25] bg-[#111A15]">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-base text-[#F1F6F3]">
              Convert Simulation to Farm Task
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-[#8BA193]">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {isSuccess ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-sm font-semibold text-[#F1F6F3]">
                Work Order Dispatched to NEXFIELD Ops!
              </h4>
              <p className="text-[#8BA193]">
                Operators and field technicians will receive this task in their work order queue.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-[#A2B6AA] font-semibold block">Task Work Order Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#121B16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#A2B6AA] font-semibold block">Scheduled Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#121B16] font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A2B6AA] font-semibold block">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as typeof priority)}
                    className="w-full h-9 rounded-lg border border-[#263A2F] bg-[#121B16] px-3 text-xs text-[#F0F5F2] focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0C120F] border border-[#1E2E25] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#668273] block">
                  Simulated Intervention Impact
                </span>
                <p className="font-mono text-emerald-400 font-semibold">
                  Yield Delta: +{activeScenario?.projectedOutcomes.yieldDeltaPercent.toFixed(1) || 14.8}% • Economic Gain: +₹{activeScenario?.projectedOutcomes.economicBenefitInrPerHa || 17850}/ha
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => createTaskMutation.mutate()}
                  isLoading={createTaskMutation.isPending}
                  className="gap-1.5"
                >
                  Confirm & Dispatch Task
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
