import React from 'react';
import { Upload } from 'lucide-react';

interface FieldSightDropzoneProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

export function FieldSightDropzone({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: FieldSightDropzoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
        isDragOver
          ? 'border-emerald-500 bg-emerald-950/20'
          : 'border-[#1E2E25] bg-[#0A0F0D] hover:border-[#2C4235] hover:bg-[#0D1410]'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="h-12 w-12 rounded-full bg-[#121B16] border border-[#203126] flex items-center justify-center text-emerald-400">
          <Upload className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-semibold text-[#F1F6F3]">
          Drag and drop leaf or canopy image here, or browse files
        </h4>
        <p className="text-xs text-[#7B9586] max-w-md">
          Supports high-resolution JPEG and PNG images. For optimal diagnosis, capture leaves under daylight with clear lesion margins.
        </p>
      </div>
    </div>
  );
}
