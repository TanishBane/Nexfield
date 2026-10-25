"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ArrowRight,
  Sliders,
  History,
  Activity,
  Cpu,
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

interface DiagnosticSample {
  id: string;
  title: string;
  crop: string;
  variety: string;
  location: string;
  pathogen: string;
  pathogenType: "Fungal" | "Bacterial" | "Viral" | "Physiological" | "None";
  confidence: number;
  severityPercent: number;
  status: "Critical" | "Warning" | "Optimal";
  color: string;
  organicTreatment: string;
  chemicalTreatment: string;
  withholdingDays: number;
  activeIngredient: string;
  dosage: string;
  description: string;
  features: string[];
}

const SPECIMENS: DiagnosticSample[] = [
  {
    id: "sample-1",
    title: "Tomato Early Blight",
    crop: "Tomato",
    variety: "Abhinav F1 Hybrid",
    location: "Sector 2-B, Nashik Valley",
    pathogen: "Alternaria solani",
    pathogenType: "Fungal",
    confidence: 94.6,
    severityPercent: 28.5,
    status: "Critical",
    color: "text-rose-700 border-rose-500/40 bg-rose-50/20",
    description:
      "Dark brown to black necrotic lesions with characteristic target-like concentric rings on basal leaves. High ambient relative humidity (>82%) accelerates spore germination.",
    organicTreatment:
      "Foliar spray of Trichoderma viride (10 g/L) + Pseudomonas fluorescens biopesticide at 7-day intervals. Prune lower diseased foliage.",
    chemicalTreatment:
      "Mancozeb 75 WP @ 2.5 g/L or Azoxystrobin 23 SC @ 1 ml/L with uniform canopy coverage.",
    activeIngredient: "Mancozeb 75% WP / Azoxystrobin",
    dosage: "2.5 g / Litre of water",
    withholdingDays: 7,
    features: [
      "Concentric Target Rings",
      "Chlorotic Yellow Halos",
      "Basal Foliar Progression",
    ],
  },
  {
    id: "sample-2",
    title: "Onion Purple Blotch",
    crop: "Onion",
    variety: "Bhima Super",
    location: "Sector 1-A, Lasalgaon Block",
    pathogen: "Alternaria porri",
    pathogenType: "Fungal",
    confidence: 91.8,
    severityPercent: 18.2,
    status: "Warning",
    color: "text-amber-700 border-amber-500/40 bg-amber-50/20",
    description:
      "Sunken oval lesions with distinctive purplish centres turning dark brown with yellow borders along leaf tips and scapes. Reduces bulb diameter if untreated.",
    organicTreatment:
      "Neem oil foliar emulsion (5 ml/L) mixed with liquid copper soap formulation during morning hours.",
    chemicalTreatment:
      "Difenoconazole 25 EC @ 1 ml/L or Chlorothalonil 75 WP @ 2 g/L with non-ionic agricultural wetting agent.",
    activeIngredient: "Difenoconazole 25% EC",
    dosage: "1.0 ml / Litre of water",
    withholdingDays: 14,
    features: [
      "Purple Centre Lesions",
      "Tip Blight Progression",
      "Oval Water-Soaked Patches",
    ],
  },
  {
    id: "sample-3",
    title: "Citrus Bacterial Canker",
    crop: "Orange",
    variety: "Nagpur Mandarin",
    location: "Sector 3-C, Vidarbha Grove",
    pathogen: "Xanthomonas axonopodis pv. citri",
    pathogenType: "Bacterial",
    confidence: 93.4,
    severityPercent: 12.0,
    status: "Warning",
    color: "text-amber-700 border-amber-500/40 bg-amber-50/20",
    description:
      "Raised corky lesions on leaves and young twigs surrounded by greasy, water-soaked oily margins and distinctive golden yellow halos.",
    organicTreatment:
      "Pruning of infected shoots followed by copper oxychloride (3 g/L) protective barrier spray.",
    chemicalTreatment:
      "Streptomycin sulphate 90% + Tetracycline hydrochloride 10% (Streptocycline) @ 0.5 g/L mixed with copper fungicide.",
    activeIngredient: "Streptocycline + Copper Hydroxide",
    dosage: "0.5 g / Litre + 2.0 g Copper",
    withholdingDays: 10,
    features: [
      "Raised Corky Crater",
      "Greasy Water Halo",
      "Stem Lesion Spreading",
    ],
  },
  {
    id: "sample-4",
    title: "Healthy Asymptomatic Canopy",
    crop: "Mango",
    variety: "Ratnagiri Alphonso",
    location: "Sector 4-D, Konkan Coastal Orchard",
    pathogen: "None (Healthy Crop)",
    pathogenType: "None",
    confidence: 98.7,
    severityPercent: 0,
    status: "Optimal",
    color: "text-emerald-700 border-emerald-500/40 bg-emerald-50/20",
    description:
      "Turgid, deep emerald leaves with vibrant venation, active stomatal conductance, and zero visible fungal or bacterial lesion activity.",
    organicTreatment:
      "Maintain balanced bio-fertilizer schedule (Panchagavya foliar tonic 30 ml/L) to preserve systemic acquired resistance (SAR).",
    chemicalTreatment: "No chemical pesticide intervention required.",
    activeIngredient: "N/A — Organic Tonic",
    dosage: "30 ml Panchagavya / Litre",
    withholdingDays: 0,
    features: [
      "High Chlorophyll Saturation",
      "Intact Cuticle Wax",
      "Vigorous Apical Flush",
    ],
  },
];

export default function DemoFieldSightPage() {
  const { farmName, addTask } = useDemoStore();
  const [activeSpecimen, setActiveSpecimen] = useState<DiagnosticSample>(
    SPECIMENS[0],
  );
  const [gradCamIntensity, setGradCamIntensity] = useState<number>(75);
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [taskDispatched, setTaskDispatched] = useState<boolean>(false);

  const handleSelectSpecimen = (specimen: DiagnosticSample) => {
    setIsAnalyzing(true);
    setActiveSpecimen(specimen);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 300);
  };

  const handleDispatchTask = () => {
    if (activeSpecimen.status === "Optimal") return;
    addTask({
      title: `Field Spray: ${activeSpecimen.title} (${activeSpecimen.activeIngredient})`,
      category: "spraying_pest_control",
      priority: activeSpecimen.status === "Critical" ? "urgent" : "high",
      status: "todo",
      dueDate: "Tomorrow Morning (06:00 AM)",
      costInr: 1250,
    });
    setTaskDispatched(true);
    setTimeout(() => setTaskDispatched(false), 4000);
  };

  return (
    <div className="module-page module-health space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with Edge Benchmarks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D1DDCD]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09251A] font-serif">
              Crop health
            </h1>
            <Badge
              variant="outline"
              className="text-rose-700 border-rose-500/40 font-mono text-xs px-2.5 py-0.5"
            >
              Dual CNN + Grad-CAM
            </Badge>
          </div>
          <p className="text-sm text-[#46604D] mt-1">
            {farmName} · Synthetic foliar lesion identification and
            demo treatment guidance
          </p>
        </div>

        {/* Inference Benchmark Badge */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs font-mono">
          <Cpu className="h-4 w-4 text-emerald-700" />
          <span className="text-[#46604D]">ONNX Edge:</span>
          <span className="text-emerald-700 font-bold tabular-nums">
            5.13 ms
          </span>
          <span className="text-[#46604D]">·</span>
          <span className="text-[#09251A] font-semibold">96.8% Top-1 Acc</span>
        </div>
      </div>

      {/* 2. Specimen Selector Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#46604D]">
          <span>SELECT FOLIAR SPECIMEN TO INSPECT:</span>
          <span className="text-[#46604D] font-mono">
            4 regional ground-truth baselines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SPECIMENS.map((s) => {
            const isSelected = activeSpecimen.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSpecimen(s)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-[#F7FAF2] border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30"
                    : "bg-[#F7FAF2] border-[#D1DDCD] hover:border-[#D1DDCD] hover:bg-[#F7FAF2]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-[#46604D] uppercase">
                    {s.crop}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${s.color}`}
                  >
                    {s.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#09251A] line-clamp-1">
                  {s.title}
                </div>
                <div className="text-xs text-[#46604D] mt-1 line-clamp-1">
                  {s.variety}
                </div>
                <div className="text-[11px] font-mono text-emerald-700/90 mt-2">
                  Conf: {s.confidence}% · {s.severityPercent}% damage
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace: Photo-Studio Inspector & Scientific Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: High-Resolution Photo-Studio Inspection Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-5 shadow-sm flex flex-col justify-between space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D1DDCD]">
              <div>
                <h3 className="text-base font-bold text-[#09251A] font-serif">
                  {activeSpecimen.title}
                </h3>
                <p className="text-xs text-[#46604D] mt-0.5">
                  Specimen from {activeSpecimen.location} ·{" "}
                  {activeSpecimen.crop} ({activeSpecimen.variety})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-emerald-700 border-emerald-600/40"
                >
                  Certainty: {activeSpecimen.confidence}%
                </Badge>
              </div>
            </div>

            {/* Interactive Leaf Viewport with Grad-CAM Blending */}
            <div className="relative rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] h-72 sm:h-80 flex items-center justify-center overflow-hidden shadow-inner group">
              {/* Simulated Leaf Graphic Texture */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <svg
                  className="w-64 h-64 text-emerald-900/60"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <path d="M50 5 C25 25, 20 70, 50 95 C80 70, 75 25, 50 5 Z" />
                  <path
                    d="M50 5 L50 95 M50 35 L30 25 M50 55 L25 45 M50 75 L30 65 M50 35 L70 25 M50 55 L75 45 M50 75 L70 65"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Dynamic Grad-CAM Heatmap Layer */}
              {showGradCam && activeSpecimen.severityPercent > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: gradCamIntensity / 100,
                    background:
                      "radial-gradient(circle at 45% 55%, rgba(244, 63, 94, 0.65) 0%, rgba(245, 158, 11, 0.45) 35%, rgba(16, 185, 129, 0.15) 60%, transparent 80%)",
                  }}
                />
              )}

              {/* Center Specimen Identity Badge */}
              <div className="text-center space-y-2 z-10 p-6 backdrop-blur-[2px] rounded-2xl bg-[#F7FAF2]/70 border border-[#D1DDCD]/60 max-w-sm">
                <div className="inline-flex p-3 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] text-emerald-700">
                  <Leaf className="h-10 w-10" />
                </div>
                <div className="text-base font-bold text-[#09251A]">
                  {activeSpecimen.title}
                </div>
                <div className="text-xs font-mono text-[#46604D]">
                  Identified Pathogen:{" "}
                  <span className="text-emerald-700 italic font-semibold">
                    {activeSpecimen.pathogen}
                  </span>
                </div>
              </div>

              {/* Camera Resolution Watermark */}
              <div className="absolute top-3 right-3 font-mono text-[11px] px-2.5 py-1 rounded-lg bg-[#F7FAF2]/90 border border-[#D1DDCD] text-[#46604D]">
                1024×1024 Multispectral RAW
              </div>

              {/* Diagnostic Severity Badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 rounded-lg bg-[#F7FAF2]/90 border border-[#D1DDCD]">
                <span className="text-[#46604D]">Damage:</span>
                <span className="text-rose-700 font-bold tabular-nums">
                  {activeSpecimen.severityPercent}% Foliar Area
                </span>
              </div>
            </div>

            {/* Grad-CAM Blending Controls */}
            <div className="p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowGradCam(!showGradCam)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    showGradCam
                      ? "bg-rose-50/80 text-rose-700 border border-rose-500/50"
                      : "bg-[#F7FAF2] text-[#46604D] border border-[#D1DDCD]"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>
                    {showGradCam ? "Grad-CAM Heatmap Active" : "Heatmap Hidden"}
                  </span>
                </button>
                <span className="text-[#46604D]">Blend Opacity:</span>
              </div>

              <div className="flex items-center gap-3 flex-1 sm:max-w-xs">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  disabled={!showGradCam}
                  value={gradCamIntensity}
                  onChange={(e) => setGradCamIntensity(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-[#F7FAF2] h-1.5 rounded-lg"
                />
                <span className="text-rose-700 font-mono font-bold w-10 text-right tabular-nums">
                  {gradCamIntensity}%
                </span>
              </div>
            </div>

            {/* Pathological Feature Checklist */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#46604D] font-semibold">
                NEURAL NETWORK SALIENT ACTIVATION FEATURES:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeSpecimen.features.map((feat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#F7FAF2] border border-[#D1DDCD] text-[#46604D]"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scientific Pathology & ICAR Treatment Protocol (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Diagnostic Metrics Card */}
          <div className="p-5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
              Automated Agronomic Diagnosis
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <div className="text-[10px] text-[#46604D]">
                  DAMAGE SEVERITY
                </div>
                <div className="text-2xl font-bold text-rose-700 tabular-nums mt-1">
                  {activeSpecimen.severityPercent}%
                </div>
                <div className="text-[11px] text-[#46604D] mt-0.5">
                  Canopy Impact
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <div className="text-[10px] text-[#46604D]">
                  CONFIDENCE SCORE
                </div>
                <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                  {activeSpecimen.confidence}%
                </div>
                <div className="text-[11px] text-[#46604D] mt-0.5">
                  Dual Model Consensus
                </div>
              </div>
            </div>

            <p className="text-sm text-[#46604D] leading-relaxed">
              {activeSpecimen.description}
            </p>
          </div>

          {/* ICAR Treatment Protocol Card */}
          <div className="p-5 rounded-2xl bg-[#F7FAF2] border border-emerald-500/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <span>ICAR Standard Treatment Protocol</span>
              </div>
              <Badge
                variant="outline"
                className="text-emerald-700 border-emerald-500/30 text-[10px]"
              >
                Certified
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              {/* Recommended Dosage */}
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
                <div className="text-[#46604D] font-semibold text-[11px]">
                  ACTIVE INGREDIENT & DOSAGE:
                </div>
                <div className="text-[#09251A] font-mono font-bold text-sm">
                  {activeSpecimen.activeIngredient}
                </div>
                <div className="text-emerald-700 font-mono text-xs">
                  Dosage: {activeSpecimen.dosage}
                </div>
              </div>

              {/* Organic Prescription */}
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
                <div className="text-emerald-700 font-semibold text-[11px] uppercase tracking-wider">
                  Organic & Bio-Control:
                </div>
                <div className="text-[#46604D] leading-relaxed">
                  {activeSpecimen.organicTreatment}
                </div>
              </div>

              {/* Chemical Rescue */}
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
                <div className="text-amber-700 font-semibold text-[11px] uppercase tracking-wider">
                  Targeted Chemical Intervention:
                </div>
                <div className="text-[#46604D] leading-relaxed">
                  {activeSpecimen.chemicalTreatment}
                </div>
              </div>

              {/* Safety Withholding Period */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7FAF2] border border-emerald-600/30 text-xs">
                <span className="text-[#46604D]">
                  Safe Harvest Withholding Period:
                </span>
                <span className="text-emerald-700 font-mono font-bold">
                  {activeSpecimen.withholdingDays > 0
                    ? `${activeSpecimen.withholdingDays} Days Pre-Harvest`
                    : "Zero Withholding (Safe)"}
                </span>
              </div>
            </div>

            {/* Convert to Task Button */}
            {activeSpecimen.status !== "Optimal" && (
              <Button
                onClick={handleDispatchTask}
                className="w-full text-xs font-bold gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#070B09] shadow-md shadow-emerald-500/20 py-2.5"
              >
                {taskDispatched ? (
                  <>
                    <Check className="h-4 w-4 text-[#070B09]" />
                    <span>Spray Work Order Dispatched to Ops!</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    <span>Schedule Treatment in Ops Ledger</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
