'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ScanEye,
  Upload,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Leaf,
  Layers,
  Sparkles,
  RefreshCw,
  FileText,
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ModuleLoadingState,
  ErrorDisplay,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import type { CropAssessment } from '@nexfield/contracts';

export default function FieldSightPage() {
  const { selectedFieldId } = useFarmStore();
  const [selectedAssessment, setSelectedAssessment] = useState<CropAssessment | null>(null);
  const [viewHeatmap, setViewHeatmap] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cropAssessments', selectedFieldId],
    queryFn: () => apiClient.getCropAssessments(selectedFieldId || undefined),
  });

  const diagnoseMutation = useMutation({
    mutationFn: () =>
      apiClient.diagnoseCrop({
        fieldId: selectedFieldId || 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c',
        imageUrl: '/fixtures/imagery/wheat_yellow_rust_leaf.jpg',
        cropSpecies: 'Triticum aestivum (Wheat)',
        scoutingNotes: 'Foliar chlorosis and parallel orange lesions observed along middle canopy.',
      }),
    onSuccess: (res) => {
      setSelectedAssessment(res.data.assessment);
      refetch();
    },
  });

  if (isLoading) {
    return <ModuleLoadingState message="Loading FieldSight visual pathology model and scan history..." />;
  }

  if (error || !data?.data) {
    return (
      <ErrorDisplay
        title="FieldSight AI Model Offline"
        message="Unable to communicate with the visual diagnostic model container."
        onRetry={() => refetch()}
      />
    );
  }

  const assessments = data.data;
  const activeAssessment = selectedAssessment || assessments[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <ScanEye className="h-6 w-6 text-emerald-400" />
              FieldSight AI — Crop Pathology & Quality Vision
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-0.5">
            Deep convolutional neural network for real-time foliar pathology, pest vectors, and Grad-CAM lesion localization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => diagnoseMutation.mutate()}
            isLoading={diagnoseMutation.isPending}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Sample / Scan
          </Button>
        </div>
      </div>

      {/* Main Grid: Visual Inspection HUD & Diagnostic Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 cols): Visual Evidence & Grad-CAM Heatmap Viewer */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="overflow-hidden border-[#23352A]">
            <CardHeader className="pb-3 border-b border-[#1C2921]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-400" />
                  Specimen Visual Frame
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant={viewHeatmap ? 'primary' : 'secondary'}
                    size="sm"
                    className="h-7 text-xs px-2.5"
                    onClick={() => setViewHeatmap(!viewHeatmap)}
                  >
                    <Layers className="h-3 w-3 mr-1" />
                    {viewHeatmap ? 'Grad-CAM On' : 'Toggle Heatmap'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative aspect-[4/3] w-full rounded-lg bg-[#0C120F] border border-[#1E2E25] overflow-hidden flex items-center justify-center">
                {/* Synthetic Biological Canvas Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#122218] via-[#0E1A13] to-[#0A120D] flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative flex items-center justify-center mb-3">
                    <div className="h-28 w-28 rounded-full border border-emerald-500/30 flex items-center justify-center animate-pulse">
                      <div className="h-20 w-20 rounded-full border border-amber-500/40 flex items-center justify-center">
                        <Leaf className="h-10 w-10 text-emerald-400" />
                      </div>
                    </div>
                    {viewHeatmap ? (
                      <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
                    ) : null}
                  </div>

                  <span className="font-mono text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                    {viewHeatmap ? '🔥 Grad-CAM Attention Saliency' : '🌾 Specimen: Wheat Flag Leaf'}
                  </span>
                  <span className="text-[11px] text-[#789183] mt-1 max-w-xs">
                    {viewHeatmap
                      ? 'High spatial gradient density detected along secondary vascular veins.'
                      : 'RGB 4K Micro-lens capture @ Sector Alpha'}
                  </span>
                </div>

                {/* Saliency Overlay indicator */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono border border-white/10">
                  <span className="text-[#A2B8AA]">Resolution: 3840×2160</span>
                  <span className="text-amber-400">Puccinia Uredinia Cluster</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-[#0E1511] border-t border-[#1C2921] text-xs text-[#82998B] flex justify-between">
              <span>Model: fieldsight_vision_v1</span>
              <span>Inference: 142ms</span>
            </CardFooter>
          </Card>

          {/* Diagnostic History List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                Diagnostic Scan Log ({assessments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              {assessments.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAssessment(a)}
                  className={`w-full text-left rounded-lg p-2.5 transition-all border text-xs ${
                    activeAssessment?.id === a.id
                      ? 'bg-[#14231A] border-emerald-500/50 text-[#F1F6F3]'
                      : 'bg-[#0E1511] border-[#1E2E25] text-[#93A79B] hover:bg-[#121B15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold truncate">{a.conditionName}</span>
                    <Badge
                      variant={a.severityLevel === 'moderate' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {a.severityLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#71897C] font-mono">
                    <span>Conf: {(a.confidenceScore * 100).toFixed(1)}%</span>
                    <span>{new Date(a.assessedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col (7 cols): Detailed Pathology Assessment & Protocols */}
        <div className="lg:col-span-7 space-y-6">
          {activeAssessment ? (
            <>
              {/* Primary Diagnostic Banner */}
              <Card className="border-[#273B2F] bg-[#111915]">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
                        Primary Pathological Classification
                      </span>
                      <CardTitle className="text-lg md:text-xl text-[#F1F6F3] mt-1">
                        {activeAssessment.conditionName}
                      </CardTitle>
                      <p className="text-xs text-[#8EA295] font-mono italic mt-0.5">
                        {activeAssessment.diagnosisDetails.pathogenOrPest || 'Physiological stress vector'}
                      </p>
                    </div>

                    <div className="flex flex-row sm:flex-col items-end gap-1.5">
                      <div className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-bold tabular-nums">
                        {(activeAssessment.confidenceScore * 100).toFixed(1)}% Confidence
                      </div>
                      <span className="text-[11px] text-[#738B7E]">
                        Canopy Affected: {activeAssessment.affectedAreaPercentage}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Symptoms Identified */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#CADBD0] uppercase tracking-wider">
                      Identified Morphological Symptoms
                    </h4>
                    <div className="space-y-1.5">
                      {activeAssessment.diagnosisDetails.symptoms.map((symptom, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-[#A1B6A9] bg-[#0E1511] p-2 rounded border border-[#1E2C23]"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agronomic Intervention Protocols */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold text-[#CADBD0] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                      Recommended Agronomic Protocols
                    </h4>

                    <div className="rounded-lg bg-[#0C120F] border border-[#1E2E25] p-3 text-xs leading-relaxed text-[#BACDC2]">
                      <p className="font-medium text-[#E2ECE5] mb-2">
                        {activeAssessment.diagnosisDetails.recommendedIntervention}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#1C2A21]">
                        <div className="p-2.5 rounded bg-[#131D17] border border-[#203126]">
                          <span className="text-[10px] uppercase font-semibold text-emerald-400 block mb-1">
                            🌱 Biological / Organic Protocol
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-[#9BB1A4]">
                            {activeAssessment.diagnosisDetails.organicOptions?.map((opt, i) => (
                              <li key={i}>{opt}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-2.5 rounded bg-[#131D17] border border-[#203126]">
                          <span className="text-[10px] uppercase font-semibold text-amber-400 block mb-1">
                            🧪 Chemical Remediation Protocol
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-[#9BB1A4]">
                            {activeAssessment.diagnosisDetails.chemicalOptions?.map((opt, i) => (
                              <li key={i}>{opt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Risk */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs">
                    <div className="flex items-center gap-2 text-rose-300">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>
                        Yield Loss Risk if Unmitigated:{' '}
                        <strong>
                          {activeAssessment.diagnosisDetails.estimatedYieldLossRiskPercent || 15}%
                        </strong>
                      </span>
                    </div>
                    <Button variant="destructive" size="sm" className="h-7 text-xs">
                      Queue Remediation Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
