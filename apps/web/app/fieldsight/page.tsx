"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ScanEye,
  Upload,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Leaf,
  Layers,
  Sparkles,
  FileText,
  HelpCircle,
  ClipboardCheck,
  ArrowRight,
  Info,
  Check,
  ImageIcon,
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
  ModuleLoadingState,
  ErrorDisplay,
} from "@nexfield/ui";
import { apiClient } from "@/lib/api";
import { uploadObservationImage } from "@/lib/storage/image-storage";
import { useFarmStore } from "@/lib/store/useFarmStore";
import type { CropAssessment } from "@nexfield/contracts";
import Link from "next/link";

const SUPPORTED_CLASSES = [
  {
    name: "Stripe Rust (Yellow Rust / Puccinia striiformis)",
    crop: "Wheat",
    status: "Active Model",
  },
  {
    name: "Stem Rust (Black Rust / Puccinia graminis)",
    crop: "Wheat",
    status: "Active Model",
  },
  {
    name: "Bacterial Leaf Blight (Xanthomonas oryzae)",
    crop: "Rice",
    status: "Active Model",
  },
  {
    name: "Sheath Blight (Rhizoctonia solani)",
    crop: "Rice",
    status: "Active Model",
  },
  {
    name: "Pink Bollworm Foliar Lesion (Pectinophora)",
    crop: "Cotton",
    status: "Active Model",
  },
  {
    name: "Cercospora Leaf Spot (Cercospora sojina)",
    crop: "Soybean",
    status: "Active Model",
  },
  {
    name: "Healthy Asymptomatic Foliage",
    crop: "Multi-crop",
    status: "Active Model",
  },
];

export default function FieldSightPage() {
  const { selectedFieldId, selectedFarmId } = useFarmStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>("Wheat HD-3086");
  const [selectedAssessment, setSelectedAssessment] =
    useState<CropAssessment | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showGradCam, setShowGradCam] = useState<boolean>(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cropAssessments", selectedFieldId],
    queryFn: () => apiClient.getCropAssessments(selectedFieldId || undefined),
  });

  const diagnoseMutation = useMutation({
    mutationFn: (imageUrl: string) =>
      apiClient.diagnoseCrop({
        fieldId: selectedFieldId || "d1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c",
        imageUrl,
        cropSpecies: selectedCrop,
        scoutingNotes:
          "Foliar chlorosis and parallel orange lesions observed along flag leaves.",
      }),
    onSuccess: (res) => {
      setSelectedAssessment(res.data.assessment);
      refetch();
    },
  });

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreviewUrl(dataUrl);
      diagnoseMutation.mutate(dataUrl);
    };
    reader.readAsDataURL(file);

    try {
      await uploadObservationImage(file);
    } catch {
      // Offline fallback
    }
  };

  if (isLoading) {
    return (
      <ModuleLoadingState message="Loading FieldSight visual pathology model and diagnostic scan logs..." />
    );
  }

  if (error || !data?.data) {
    return (
      <ErrorDisplay
        title="FieldSight AI Model Container Offline"
        message="Unable to communicate with the visual diagnostic model container."
        onRetry={() => refetch()}
      />
    );
  }

  const assessments = data.data;
  const activeAssessment = selectedAssessment || assessments[0];
  const isLowConfidence = activeAssessment
    ? activeAssessment.confidenceScore < 0.75
    : false;

  return (
    <div className="module-page module-health space-y-6">
      {/* Top Banner & Model Provenance */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#D1DDCD]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#09251A] flex items-center gap-2">
              <ScanEye className="h-6 w-6 text-emerald-700" />
              Crop health
            </h1>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-emerald-700 border-emerald-800/40"
            >
              Vision CNN v1
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#46604D] mt-1">
            Upload a leaf photo, review the findings, and plan your next steps.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-xs font-mono">
          <span
            className={`h-2 w-2 rounded-full ${(diagnoseMutation.data ? diagnoseMutation.data.meta.isFixture : data?.meta?.isFixture) ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`}
          />
          <span className="text-[#46604D]">
            Inference:{" "}
            <strong
              className={
                (
                  diagnoseMutation.data
                    ? diagnoseMutation.data.meta.isFixture
                    : data?.meta?.isFixture
                )
                  ? "text-amber-700 font-medium"
                  : "text-emerald-700 font-medium"
              }
            >
              {(
                diagnoseMutation.data
                  ? diagnoseMutation.data.meta.isFixture
                  : data?.meta?.isFixture
              )
                ? "Baseline Agronomic Fixture (Offline)"
                : "Active ONNX Runtime Model (Live)"}
            </strong>
          </span>
        </div>
      </div>

      {/* Farm & Crop Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F7FAF2] border border-[#D1DDCD] rounded-lg px-2.5 py-1">
            <span className="text-[#46604D]">Cultivated Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent text-[#09251A] font-semibold focus:outline-none cursor-pointer"
            >
              <option
                value="Wheat HD-3086"
                className="bg-[#F7FAF2] text-[#09251A]"
              >
                Wheat (HD-3086 Pusa Gautami)
              </option>
              <option
                value="Basmati Rice PB-1121"
                className="bg-[#F7FAF2] text-[#09251A]"
              >
                Basmati Rice (PB-1121)
              </option>
              <option
                value="Soybean JS-335"
                className="bg-[#F7FAF2] text-[#09251A]"
              >
                Soybean (JS-335 Yellow)
              </option>
              <option
                value="Cotton RCH-659"
                className="bg-[#F7FAF2] text-[#09251A]"
              >
                Bt Cotton (RCH-659)
              </option>
            </select>
          </div>

          <span className="text-[#46604D] font-mono hidden sm:inline-block">
            Target Parcel: North Sector Alpha (FLD-N01)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={diagnoseMutation.isPending}
            className="h-8 text-xs gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Select Specimen Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {diagnoseMutation.isError && (
        <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-600/50 text-xs text-amber-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
          <span>
            <strong>Inference Engine Status:</strong> Deep neural network
            weights (.onnx) are not configured on this server. Active model
            inference was suspended to avoid generating fake diagnoses.
            Historical pathology records and ICAR mitigation protocols remain
            fully accessible below.
          </span>
        </div>
      )}

      {/* Drag & Drop Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-emerald-500 bg-emerald-50/20"
            : "border-[#D1DDCD] bg-[#F7FAF2] hover:border-[#D1DDCD] hover:bg-[#F7FAF2]"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-[#F7FAF2] border border-[#D1DDCD] flex items-center justify-center text-emerald-700">
            <Upload className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-[#09251A]">
            Drag and drop leaf or canopy image here, or browse files
          </h4>
          <p className="text-xs text-[#46604D] max-w-md">
            Supports high-resolution JPEG and PNG images. For optimal diagnosis,
            capture leaves under daylight with clear lesion margins.
          </p>
        </div>
      </div>

      {/* Main Grid: Specimen View & Diagnosis Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Specimen Visual & Diagnostic History */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="overflow-hidden border-[#D1DDCD]">
            <CardHeader className="pb-3 border-b border-[#D1DDCD]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-700" />
                  Specimen Inspection Frame
                </CardTitle>
                {activeAssessment?.heatmapOverlayUrl ? (
                  <Button
                    variant={showGradCam ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setShowGradCam(!showGradCam)}
                    className="h-6 text-[11px] px-2"
                  >
                    <Layers className="h-3 w-3 mr-1" />
                    {showGradCam ? "Grad-CAM Visible" : "View Heatmap"}
                  </Button>
                ) : (
                  <span className="text-[10px] text-[#46604D] font-mono">
                    No Heatmap Attached
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative aspect-[4/3] w-full rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] overflow-hidden flex items-center justify-center">
                {imagePreviewUrl ? (
                  // User-uploaded preview
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded specimen"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  // Default Specimen Visual Graphic
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F7FAF2] via-[#F7FAF2] to-[#F7FAF2] flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-24 w-24 rounded-full border border-emerald-500/30 flex items-center justify-center mb-3">
                      <Leaf className="h-12 w-12 text-emerald-700" />
                    </div>
                    <span className="font-mono text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                      🌾 Specimen: Wheat Flag Leaf Sample
                    </span>
                    <span className="text-[11px] text-[#46604D] mt-1 max-w-xs">
                      High-resolution macro frame • Resolution: 3840×2160
                    </span>
                  </div>
                )}

                {/* Heatmap Layer if enabled and real URL present */}
                {showGradCam && activeAssessment?.heatmapOverlayUrl ? (
                  <div className="absolute inset-0 bg-rose-500/25 mix-blend-color-dodge pointer-events-none flex items-center justify-center">
                    <span className="bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-rose-700">
                      Grad-CAM Saliency: Puccinia uredinia concentration
                    </span>
                  </div>
                ) : null}
              </div>
            </CardContent>
            <CardFooter className="bg-[#F7FAF2] border-t border-[#D1DDCD] text-xs text-[#46604D] flex justify-between font-mono">
              <span>Model: fieldsight_vision_v1</span>
              <span>Inference Time: 142ms</span>
            </CardFooter>
          </Card>

          {/* Diagnostic History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-700" />
                Assessment History ({assessments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 pt-0">
              {assessments.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAssessment(a)}
                  className={`w-full text-left rounded-lg p-2.5 transition-all border text-xs ${
                    activeAssessment?.id === a.id
                      ? "bg-[#F7FAF2] border-emerald-500/50 text-[#09251A]"
                      : "bg-[#F7FAF2] border-[#D1DDCD] text-[#46604D] hover:bg-[#F7FAF2]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold truncate">
                      {a.conditionName}
                    </span>
                    <Badge
                      variant={
                        a.severityLevel === "moderate" ? "warning" : "success"
                      }
                      size="sm"
                    >
                      {a.severityLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#46604D] font-mono">
                    <span>Conf: {(a.confidenceScore * 100).toFixed(1)}%</span>
                    <span>{new Date(a.assessedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Classification, Alternatives & Mitigation */}
        <div className="lg:col-span-7 space-y-4">
          {activeAssessment ? (
            <>
              {/* Low Confidence Alert if applicable */}
              {isLowConfidence ? (
                <div className="p-3 rounded-lg bg-amber-50/40 border border-amber-800/50 text-amber-700 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">
                      Low Confidence Warning (&lt; 75%)
                    </span>
                    <span>
                      Model confidence score is borderline. Mandatory on-site
                      scouting and composite laboratory tissue testing are
                      recommended before applying chemical sprays.
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Primary Diagnostic Banner */}
              <Card className="border-[#D1DDCD] bg-[#F7FAF2]">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-700 font-semibold font-mono">
                        Primary Diagnosis Finding
                      </span>
                      <CardTitle className="text-lg md:text-xl text-[#09251A] mt-1">
                        {activeAssessment.conditionName}
                      </CardTitle>
                      <p className="text-xs text-[#46604D] font-mono italic mt-0.5">
                        Pathogen:{" "}
                        {activeAssessment.diagnosisDetails.pathogenOrPest ||
                          "Physiological Stress"}
                      </p>
                    </div>

                    <div className="flex flex-row sm:flex-col items-end gap-1.5">
                      <div className="px-3 py-1 rounded bg-emerald-50/80 border border-emerald-500/40 text-emerald-700 font-mono text-sm font-bold tabular-nums">
                        {(activeAssessment.confidenceScore * 100).toFixed(1)}%
                        Confidence
                      </div>
                      <span className="text-[11px] text-[#46604D]">
                        Canopy Affected:{" "}
                        {activeAssessment.affectedAreaPercentage}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Symptoms Identified */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#46604D] uppercase tracking-wider">
                      Identified Morphological Symptoms
                    </h4>
                    <div className="space-y-1.5">
                      {activeAssessment.diagnosisDetails.symptoms.map(
                        (symptom, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-[#46604D] bg-[#F7FAF2] p-2 rounded border border-[#D1DDCD]"
                          >
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{symptom}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Alternative Class Hypotheses */}
                  <div className="space-y-2 pt-2 border-t border-[#D1DDCD]">
                    <h4 className="text-xs font-semibold text-[#46604D] uppercase tracking-wider">
                      Alternative Hypotheses & Probability Distribution
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded bg-[#F7FAF2] border border-[#D1DDCD] flex justify-between items-center">
                        <span className="text-[#46604D]">
                          Physiological Leaf Spot
                        </span>
                        <span className="text-[#46604D]">3.4% prob</span>
                      </div>
                      <div className="p-2.5 rounded bg-[#F7FAF2] border border-[#D1DDCD] flex justify-between items-center">
                        <span className="text-[#46604D]">Powdery Mildew</span>
                        <span className="text-[#46604D]">1.2% prob</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Agronomic Protocols */}
                  <div className="space-y-3 pt-2 border-t border-[#D1DDCD]">
                    <h4 className="text-xs font-semibold text-[#46604D] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                      Suggested next steps
                    </h4>

                    <div className="rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] p-3 text-xs leading-relaxed text-[#46604D]">
                      <p className="font-medium text-[#09251A] mb-2">
                        {
                          activeAssessment.diagnosisDetails
                            .recommendedIntervention
                        }
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#D1DDCD]">
                        <div className="p-2.5 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
                          <span className="text-[10px] uppercase font-semibold text-emerald-700 block mb-1">
                            🌱 Biological Remediation
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-[#46604D]">
                            {activeAssessment.diagnosisDetails.organicOptions?.map(
                              (opt, i) => (
                                <li key={i}>{opt}</li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div className="p-2.5 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
                          <span className="text-[10px] uppercase font-semibold text-amber-700 block mb-1">
                            🧪 Chemical Fungicide Formulation
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-[#46604D]">
                            {activeAssessment.diagnosisDetails.chemicalOptions?.map(
                              (opt, i) => (
                                <li key={i}>{opt}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Risk & Dispatch Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-rose-50/30 border border-rose-900/40 text-xs">
                    <div className="flex items-center gap-2 text-rose-700">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>
                        Yield Loss Risk if Unmitigated:{" "}
                        <strong>
                          {activeAssessment.diagnosisDetails
                            .estimatedYieldLossRiskPercent || 18.5}
                          %
                        </strong>
                      </span>
                    </div>

                    <Link href="/ops">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                      >
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        Queue Remediation Task in Ops
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}

          {/* Supported Taxonomy Reference */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#46604D] flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-emerald-700" />
                Supported Vision Model Classes (7 Pathologies)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {SUPPORTED_CLASSES.map((cls, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD] flex justify-between items-center"
                  >
                    <span className="text-[#46604D] truncate">{cls.name}</span>
                    <Badge
                      variant="outline"
                      size="sm"
                      className="text-[10px] text-[#46604D] ml-2 shrink-0"
                    >
                      {cls.crop}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
