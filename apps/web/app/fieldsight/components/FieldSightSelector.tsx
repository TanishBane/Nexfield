import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@nexfield/ui';

interface FieldSightSelectorProps {
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  onUploadClick: () => void;
  isPending: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FieldSightSelector({
  selectedCrop,
  setSelectedCrop,
  onUploadClick,
  isPending,
  fileInputRef,
  onFileSelect,
}: FieldSightSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0C120F] border border-[#1E2E25] text-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#121B16] border border-[#203227] rounded-lg px-2.5 py-1">
          <span className="text-[#728E7E]">Cultivated Crop:</span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-transparent text-[#E1ECE5] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="Wheat HD-3086" className="bg-[#121B16] text-[#E1ECE5]">Wheat (HD-3086 Pusa Gautami)</option>
            <option value="Basmati Rice PB-1121" className="bg-[#121B16] text-[#E1ECE5]">Basmati Rice (PB-1121)</option>
            <option value="Soybean JS-335" className="bg-[#121B16] text-[#E1ECE5]">Soybean (JS-335 Yellow)</option>
            <option value="Cotton RCH-659" className="bg-[#121B16] text-[#E1ECE5]">Bt Cotton (RCH-659)</option>
          </select>
        </div>

        <span className="text-[#647C6F] font-mono hidden sm:inline-block">
          Target Parcel: North Sector Alpha (FLD-N01)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onUploadClick}
          isLoading={isPending}
          className="h-8 text-xs gap-1.5"
        >
          <Upload className="h-3.5 w-3.5" />
          Select Specimen Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
