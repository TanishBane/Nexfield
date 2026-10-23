import React from 'react';
import { ImageIcon, Layers, Leaf, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge } from '@nexfield/ui';
import type { CropAssessment } from '@nexfield/contracts';

interface SpecimenInspectionProps {
  activeAssessment: CropAssessment | null;
  showGradCam: boolean;
  setShowGradCam: (show: boolean) => void;
  imagePreviewUrl: string | null;
  assessments: CropAssessment[];
  setSelectedAssessment: (assessment: CropAssessment) => void;
}

export function SpecimenInspection({
  activeAssessment,
  showGradCam,
  setShowGradCam,
  imagePreviewUrl,
  assessments,
  setSelectedAssessment,
}: SpecimenInspectionProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <Card className="overflow-hidden border-[#23352A]">
        <CardHeader className="pb-3 border-b border-[#1C2921]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-emerald-400" />
              Specimen Inspection Frame
            </CardTitle>
            {activeAssessment?.heatmapOverlayUrl ? (
              <Button
                variant={showGradCam ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowGradCam(!showGradCam)}
                className="h-6 text-[11px] px-2"
              >
                <Layers className="h-3 w-3 mr-1" />
                {showGradCam ? 'Grad-CAM Visible' : 'View Heatmap'}
              </Button>
            ) : (
              <span className="text-[10px] text-[#647C6F] font-mono">No Heatmap Attached</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative aspect-[4/3] w-full rounded-lg bg-[#0C120F] border border-[#1E2E25] overflow-hidden flex items-center justify-center">
            {imagePreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreviewUrl}
                alt="Uploaded specimen"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#122218] via-[#0E1A13] to-[#0A120D] flex flex-col items-center justify-center p-6 text-center">
                <div className="h-24 w-24 rounded-full border border-emerald-500/30 flex items-center justify-center mb-3">
                  <Leaf className="h-12 w-12 text-emerald-400" />
                </div>
                <span className="font-mono text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  🌾 Specimen: Wheat Flag Leaf Sample
                </span>
                <span className="text-[11px] text-[#789183] mt-1 max-w-xs">
                  High-resolution macro frame • Resolution: 3840×2160
                </span>
              </div>
            )}

            {showGradCam && activeAssessment?.heatmapOverlayUrl ? (
              <div className="absolute inset-0 bg-rose-500/25 mix-blend-color-dodge pointer-events-none flex items-center justify-center">
                <span className="bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-rose-300">
                  Grad-CAM Saliency: Puccinia uredinia concentration
                </span>
              </div>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="bg-[#0E1511] border-t border-[#1C2921] text-xs text-[#82998B] flex justify-between font-mono">
          <span>Model: fieldsight_vision_v1</span>
          <span>Inference Time: 142ms</span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
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
  );
}
