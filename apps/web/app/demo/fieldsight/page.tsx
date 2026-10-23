'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ScanEye,
  Upload,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Layers,
  Sparkles,
  Info,
  Check,
  ImageIcon,
  ChevronRight,
  ShieldCheck,
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

interface DiagnosticSample {
  id: string;
  title: string;
  crop: string;
  pathogen: string;
  confidence: number;
  severityPercent: number;
  status: 'Critical' | 'Warning' | 'Optimal';
  color: string;
  organicTreatment: string;
  chemicalTreatment: string;
  description: string;
  features: string[];
}

const SAMPLES: DiagnosticSample[] = [
  {
    id: 'sample-1',
    title: 'Tomato Early Blight',
    crop: 'Tomato (Abhinav F1)',
    pathogen: 'Alternaria solani',
    confidence: 94.6,
    severityPercent: 28.5,
    status: 'Critical',
    color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
    description:
      'Dark brown to black necrotic spots with characteristic target-like concentric rings on lower foliage. Spores spread rapidly under humid conditions.',
    organicTreatment:
      'Foliar spray of Trichoderma viride (10g/L) + Pseudomonas fluorescens biopesticide at 7-day intervals. Prune lower diseased foliage.',
    chemicalTreatment:
      'Mancozeb 75 WP @ 2.5 g/L or Azoxystrobin 23 SC @ 1 ml/L with uniform canopy coverage.',
    features: ['Concentric Target Rings', 'Chlorotic Yellow Halos', 'Basal Foliar Progression'],
  },
  {
    id: 'sample-2',
    title: 'Tomato Septoria Leaf Spot',
    crop: 'Tomato (Abhinav F1)',
    pathogen: 'Septoria lycopersici',
    confidence: 91.2,
    severityPercent: 14.8,
    status: 'Warning',
    color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
    description:
      'Numerous small, circular lesions with tan/grey centers and dark margins. Pycnidia fungal fruiting bodies visible under magnification.',
    organicTreatment:
      'Neem oil foliar emulsion (5 ml/L) mixed with liquid copper soap formulation during morning hours.',
    chemicalTreatment:
      'Chlorothalonil 75 WP @ 2 g/L or Copper Oxychloride 50 WP @ 3 g/L.',
    features: ['Minute Grey Pitted Centers', 'Dark Brown Margins', 'Upper Canopy Sparing'],
  },
  {
    id: 'sample-3',
    title: 'Healthy Asymptomatic Foliage',
    crop: 'Tomato (Abhinav F1)',
    pathogen: 'None (Healthy Crop)',
    confidence: 98.4,
    severityPercent: 0,
    status: 'Optimal',
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
    description:
      'Turgid, deep green leaves with vibrant venation, active stomatal conductance, and zero visible fungal or bacterial lesion activity.',
    organicTreatment:
      'Maintain balanced bio-fertilizer schedule (Panchagavya foliar tonic 30 ml/L) to preserve systemic resistance.',
    chemicalTreatment: 'No chemical intervention required.',
    features: ['High Chlorophyll Saturation', 'Intact Cuticle Layer', 'Vigorous Apical Growth'],
  },
];

export default function DemoFieldSightPage() {
  const { farmName, cropName, cropVariety } = useDemoStore();
  const [activeSample, setActiveSample] = useState<DiagnosticSample>(SAMPLES[0]);
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleSelectSample = (sample: DiagnosticSample) => {
    setIsAnalyzing(true);
    setActiveSample(sample);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1A261F]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              FieldSight AI — Pathology & Diagnostics
            </h1>
            <Badge variant="outline" className="text-rose-400 border-rose-500/40 font-mono text-[10px]">
              Computer Vision
            </Badge>
          </div>
          <p className="text-xs text-[#7B9587] mt-0.5">
            {farmName} · Mobile-Optimized Foliar Disease Classification & Grad-CAM Heatmaps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGradCam(!showGradCam)}
            className={`text-xs gap-1.5 transition-all ${
              showGradCam
                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                : 'text-[#8EA698] border-[#22352A] hover:bg-[#121B16]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{showGradCam ? 'Grad-CAM Heatmap: ON' : 'Grad-CAM Heatmap: OFF'}</span>
          </Button>
        </div>
      </div>

      {/* 2. Sample Selector Strip */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-[#63796E]">Select Foliar Specimen:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLES.map((s) => {
            const isSelected = activeSample.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => handleSelectSample(s)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#121B16] border-emerald-500/80 ring-1 ring-emerald-500/30'
                    : 'bg-[#0E1511] border-[#1E2E25] hover:border-[#2D4536]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F1F6F3]">{s.title}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${s.color}`}>
                    {s.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#7B9587] font-mono mt-1">
                  Pathogen: {s.pathogen}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Pathology Inspection Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Inspection Card */}
        <Card className="border-[#1E2E25] bg-[#0E1511] flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#F1F6F3]">
                  High-Resolution Spectral Inspection
                </CardTitle>
                <CardDescription className="text-xs text-[#7B9587]">
                  Target canopy region from Field Sector 2-B
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs text-emerald-400 border-emerald-600/40">
                Confidence: {activeSample.confidence}%
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Visual Leaf Viewport */}
            <div className="relative rounded-2xl bg-[#060907] border border-[#1E2E25] h-64 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Simulated Heatmap Glow */}
              {showGradCam && activeSample.severityPercent > 0 && (
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/25 via-amber-500/20 to-transparent pointer-events-none animate-pulse" />
              )}

              <div className="text-center space-y-2 z-10 p-4">
                <div className="inline-flex p-4 rounded-2xl bg-[#111A15] border border-[#23382C] text-emerald-400">
                  <Leaf className="h-12 w-12" />
                </div>
                <div className="text-sm font-bold text-[#F1F6F3]">
                  {activeSample.title}
                </div>
                <div className="text-xs font-mono text-[#8EA698]">
                  Identified Agent: <span className="text-emerald-300 italic">{activeSample.pathogen}</span>
                </div>
              </div>

              {/* Status Badge in corner */}
              <div className="absolute top-3 right-3 font-mono text-[10px] px-2 py-0.5 rounded bg-[#0A0F0D]/90 border border-[#1E2E25] text-[#9BB1A4]">
                Resolution: 1024×1024 · ONNX Edge
              </div>
            </div>

            {/* Pathological Feature Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeSample.features.map((feat, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-md text-[10px] font-mono bg-[#090F0C] border border-[#1C2C22] text-[#BDD1C6]"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pt-3 border-t border-[#18261E] flex justify-between text-xs text-[#7B9587] font-mono">
            <span>Model: EfficientNet-V2-Agri</span>
            <span>Latency: 48ms</span>
          </CardFooter>
        </Card>

        {/* Diagnosis & Prescriptions Card */}
        <div className="space-y-4">
          <Card className="border-[#1E2E25] bg-[#0E1511]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#F1F6F3]">
                Pathology Analysis & Severity
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Automated leaf area damage computation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <div className="text-[10px] text-[#63796E]">AFFECTED CANOPY AREA</div>
                  <div className="text-xl font-bold text-rose-400 mt-1">
                    {activeSample.severityPercent}%
                  </div>
                  <div className="text-[10px] text-[#7B9587] mt-0.5">Estimated Foliar Damage</div>
                </div>

                <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <div className="text-[10px] text-[#63796E]">DIAGNOSTIC CERTAINTY</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {activeSample.confidence}%
                  </div>
                  <div className="text-[10px] text-[#7B9587] mt-0.5">Ensemble Consensus</div>
                </div>
              </div>

              <p className="text-[#BDD1C6] leading-relaxed">
                {activeSample.description}
              </p>
            </CardContent>
          </Card>

          {/* Treatment Prescriptions */}
          <Card className="border-[#1E2E25] bg-[#0E1511]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>ICAR-Standard Treatment Protocol</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E] space-y-1">
                <div className="font-bold text-emerald-300 font-mono text-[11px]">
                  ORGANIC & BIO-CONTROL PRESCRIPTION:
                </div>
                <div className="text-[#BDD1C6]">{activeSample.organicTreatment}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E] space-y-1">
                <div className="font-bold text-amber-300 font-mono text-[11px]">
                  TARGETED CHEMICAL RESCUE (IF THRESHOLD EXCEEDED):
                </div>
                <div className="text-[#BDD1C6]">{activeSample.chemicalTreatment}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
