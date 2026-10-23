import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Info, ClipboardCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@nexfield/ui';
import type { CropAssessment } from '@nexfield/contracts';

interface DiagnosticDetailsProps {
  activeAssessment: CropAssessment | null;
  isLowConfidence: boolean;
  supportedClasses: Array<{ name: string; crop: string; status: string }>;
}

export function DiagnosticDetails({
  activeAssessment,
  isLowConfidence,
  supportedClasses,
}: DiagnosticDetailsProps) {
  return (
    <div className="lg:col-span-7 space-y-4">
      {activeAssessment ? (
        <>
          {/* Low Confidence Alert if applicable */}
          {isLowConfidence ? (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Low Confidence Warning (&lt; 75%)</span>
                <span>
                  Model confidence score is borderline. Mandatory on-site scouting and composite laboratory tissue testing are recommended before applying chemical sprays.
                </span>
              </div>
            </div>
          ) : null}

          {/* Primary Diagnostic Banner */}
          <Card className="border-[#273B2F] bg-[#111915]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
                    Primary Diagnosis Finding
                  </span>
                  <CardTitle className="text-lg md:text-xl text-[#F1F6F3] mt-1">
                    {activeAssessment.conditionName}
                  </CardTitle>
                  <p className="text-xs text-[#8EA295] font-mono italic mt-0.5">
                    Pathogen: {activeAssessment.diagnosisDetails.pathogenOrPest || 'Physiological Stress'}
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

              {/* Alternative Class Hypotheses */}
              <div className="space-y-2 pt-2 border-t border-[#1C2A21]">
                <h4 className="text-xs font-semibold text-[#CADBD0] uppercase tracking-wider">
                  Alternative Hypotheses & Probability Distribution
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-[#0E1511] border border-[#1E2E25] flex justify-between items-center">
                    <span className="text-[#96ACA0]">Physiological Leaf Spot</span>
                    <span className="text-[#647C6E]">3.4% prob</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#0E1511] border border-[#1E2E25] flex justify-between items-center">
                    <span className="text-[#96ACA0]">Powdery Mildew</span>
                    <span className="text-[#647C6E]">1.2% prob</span>
                  </div>
                </div>
              </div>

              {/* Recommended Agronomic Protocols */}
              <div className="space-y-3 pt-2 border-t border-[#1C2A21]">
                <h4 className="text-xs font-semibold text-[#CADBD0] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Intervention & Remediation Protocols
                </h4>

                <div className="rounded-lg bg-[#0C120F] border border-[#1E2E25] p-3 text-xs leading-relaxed text-[#BACDC2]">
                  <p className="font-medium text-[#E2ECE5] mb-2">
                    {activeAssessment.diagnosisDetails.recommendedIntervention}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#1C2A21]">
                    <div className="p-2.5 rounded bg-[#131D17] border border-[#203126]">
                      <span className="text-[10px] uppercase font-semibold text-emerald-400 block mb-1">
                        🌱 Biological Remediation
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[#9BB1A4]">
                        {activeAssessment.diagnosisDetails.organicOptions?.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded bg-[#131D17] border border-[#203126]">
                      <span className="text-[10px] uppercase font-semibold text-amber-400 block mb-1">
                        🧪 Chemical Fungicide Formulation
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

              {/* Impact Risk & Dispatch Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs">
                <div className="flex items-center gap-2 text-rose-300">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>
                    Yield Loss Risk if Unmitigated:{' '}
                    <strong>
                      {activeAssessment.diagnosisDetails.estimatedYieldLossRiskPercent || 18.5}%
                    </strong>
                  </span>
                </div>

                <Link href="/ops">
                  <Button variant="destructive" size="sm" className="h-7 text-xs gap-1.5">
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
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#CADCD1] flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-emerald-400" />
            Supported Vision Model Classes ({supportedClasses.length} Pathologies)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {supportedClasses.map((cls, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-[#0E1511] border border-[#1E2E25] flex justify-between items-center"
              >
                <span className="text-[#C1D4C8] truncate">{cls.name}</span>
                <Badge variant="outline" size="sm" className="text-[10px] text-[#698476] ml-2 shrink-0">
                  {cls.crop}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
