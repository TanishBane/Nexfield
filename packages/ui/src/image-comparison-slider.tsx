'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from './utils';

export interface ImageComparisonSliderProps {
  originalImage: string;
  overlayImage: string;
  originalLabel?: string;
  overlayLabel?: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageComparisonSlider({
  originalImage,
  overlayImage,
  originalLabel = 'Raw Foliage Macro',
  overlayLabel = 'Grad-CAM Saliency Activation',
  className,
  aspectRatio = 'aspect-[4/3]',
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      tabIndex={0}
      role="slider"
      aria-label="Image Comparison Slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative select-none overflow-hidden rounded-2xl border border-[#203127] bg-[#090D0B] cursor-ew-resize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
        aspectRatio,
        className
      )}
    >
      {/* Underlying Overlay Image (Grad-CAM or processed) */}
      <img
        src={overlayImage}
        alt={overlayLabel}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Top Original Image (Clipped by slider position) */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalImage}
          alt={originalLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Vertical Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 pointer-events-none shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Knob */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111714] border-2 border-emerald-400 shadow-lg flex items-center justify-center text-emerald-400 text-xs font-mono select-none">
          ‹›
        </div>
      </div>

      {/* Badges for Labels */}
      <div className="absolute top-3 left-3 pointer-events-none z-10">
        <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#090D0B]/85 text-[#F1F6F3] border border-[#203127] backdrop-blur-sm shadow">
          {originalLabel}
        </span>
      </div>

      <div className="absolute top-3 right-3 pointer-events-none z-10">
        <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#090D0B]/85 text-emerald-300 border border-emerald-800/60 backdrop-blur-sm shadow">
          {overlayLabel}
        </span>
      </div>

      {/* Drag Hint Footer */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
        <span className="px-3 py-1 rounded-full text-[10px] font-mono text-[#8DA396] bg-[#090D0B]/80 border border-[#203127] backdrop-blur-sm">
          Drag horizontally or use ← / → to compare
        </span>
      </div>
    </div>
  );
}
