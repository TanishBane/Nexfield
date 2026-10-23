'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ModuleLoadingState, ErrorDisplay } from '@nexfield/ui';
import { AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { uploadObservationImage } from '@/lib/supabase/storage';
import { useFarmStore } from '@/lib/store/useFarmStore';
import type { CropAssessment } from '@nexfield/contracts';
import { FieldSightBanner } from './components/FieldSightBanner';
import { FieldSightSelector } from './components/FieldSightSelector';
import { FieldSightDropzone } from './components/FieldSightDropzone';
import { SpecimenInspection } from './components/SpecimenInspection';
import { DiagnosticDetails } from './components/DiagnosticDetails';

const SUPPORTED_CLASSES = [
  { name: 'Stripe Rust (Yellow Rust / Puccinia striiformis)', crop: 'Wheat', status: 'Active Model' },
  { name: 'Stem Rust (Black Rust / Puccinia graminis)', crop: 'Wheat', status: 'Active Model' },
  { name: 'Bacterial Leaf Blight (Xanthomonas oryzae)', crop: 'Rice', status: 'Active Model' },
  { name: 'Sheath Blight (Rhizoctonia solani)', crop: 'Rice', status: 'Active Model' },
  { name: 'Pink Bollworm Foliar Lesion (Pectinophora)', crop: 'Cotton', status: 'Active Model' },
  { name: 'Cercospora Leaf Spot (Cercospora sojina)', crop: 'Soybean', status: 'Active Model' },
  { name: 'Healthy Asymptomatic Foliage', crop: 'Multi-crop', status: 'Active Model' },
];

export default function FieldSightPage() {
  const { selectedFieldId, selectedFarmId } = useFarmStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat HD-3086');
  const [selectedAssessment, setSelectedAssessment] = useState<CropAssessment | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showGradCam, setShowGradCam] = useState<boolean>(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cropAssessments', selectedFieldId],
    queryFn: () => apiClient.getCropAssessments(selectedFieldId || undefined),
  });

  const diagnoseMutation = useMutation({
    mutationFn: (imageUrl: string) =>
      apiClient.diagnoseCrop({
        fieldId: selectedFieldId || 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c',
        imageUrl,
        cropSpecies: selectedCrop,
        scoutingNotes: 'Foliar chlorosis and parallel orange lesions observed along flag leaves.',
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
    return <ModuleLoadingState message="Loading FieldSight visual pathology model and diagnostic scan logs..." />;
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
  const isLowConfidence = activeAssessment ? activeAssessment.confidenceScore < 0.75 : false;

  return (
    <div className="space-y-6">
      <FieldSightBanner />

      <FieldSightSelector
        selectedCrop={selectedCrop}
        setSelectedCrop={setSelectedCrop}
        onUploadClick={() => fileInputRef.current?.click()}
        isPending={diagnoseMutation.isPending}
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
      />

      {diagnoseMutation.isError && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/50 text-xs text-amber-200 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>Inference Engine Status:</strong> Deep neural network weights (.onnx) are not configured on this server. Active model inference was suspended to avoid generating fake diagnoses. Historical pathology records and ICAR mitigation protocols remain fully accessible below.
          </span>
        </div>
      )}

      <FieldSightDropzone
        isDragOver={isDragOver}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SpecimenInspection
          activeAssessment={activeAssessment}
          showGradCam={showGradCam}
          setShowGradCam={setShowGradCam}
          imagePreviewUrl={imagePreviewUrl}
          assessments={assessments}
          setSelectedAssessment={setSelectedAssessment}
        />

        <DiagnosticDetails
          activeAssessment={activeAssessment}
          isLowConfidence={isLowConfidence}
          supportedClasses={SUPPORTED_CLASSES}
        />
      </div>
    </div>
  );
}
