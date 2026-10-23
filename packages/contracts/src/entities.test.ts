import { describe, it, expect } from 'vitest';
import { CropAssessmentSchema } from './entities';

describe('CropAssessmentSchema', () => {
  const validBasePayload = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    fieldId: '123e4567-e89b-12d3-a456-426614174001',
    assessmentType: 'foliar_disease',
    conditionName: 'Rust',
    confidenceScore: 0.95,
    severityLevel: 'moderate',
    affectedAreaPercentage: 25.5,
    diagnosisDetails: {
      symptoms: ['yellow spots', 'brown pustules'],
      recommendedIntervention: 'Apply fungicide',
    },
    assessedAt: '2023-10-24T10:00:00Z',
  };

  it('should pass with a valid payload', () => {
    const result = CropAssessmentSchema.safeParse(validBasePayload);
    expect(result.success).toBe(true);
  });

  it('should pass with all optional fields provided', () => {
    const payload = {
      ...validBasePayload,
      cycleId: '123e4567-e89b-12d3-a456-426614174002',
      visualEvidenceUrl: 'https://example.com/image.jpg',
      heatmapOverlayUrl: 'https://example.com/heatmap.jpg',
      assessedBy: 'human_expert',
    };
    const result = CropAssessmentSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('should fail if required fields are missing', () => {
    const { conditionName, ...missingRequired } = validBasePayload;
    const result = CropAssessmentSchema.safeParse(missingRequired);
    expect(result.success).toBe(false);
  });

  it('should fail if id is not a valid UUID', () => {
    const payload = { ...validBasePayload, id: 'invalid-uuid' };
    const result = CropAssessmentSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('should fail if confidenceScore is out of bounds', () => {
    const payloadTooHigh = { ...validBasePayload, confidenceScore: 1.5 };
    const resultTooHigh = CropAssessmentSchema.safeParse(payloadTooHigh);
    expect(resultTooHigh.success).toBe(false);

    const payloadTooLow = { ...validBasePayload, confidenceScore: -0.1 };
    const resultTooLow = CropAssessmentSchema.safeParse(payloadTooLow);
    expect(resultTooLow.success).toBe(false);
  });

  it('should fail if affectedAreaPercentage is out of bounds', () => {
    const payloadTooHigh = { ...validBasePayload, affectedAreaPercentage: 105 };
    const resultTooHigh = CropAssessmentSchema.safeParse(payloadTooHigh);
    expect(resultTooHigh.success).toBe(false);

    const payloadTooLow = { ...validBasePayload, affectedAreaPercentage: -5 };
    const resultTooLow = CropAssessmentSchema.safeParse(payloadTooLow);
    expect(resultTooLow.success).toBe(false);
  });

  it('should fail for an invalid assessmentType', () => {
    const payload = { ...validBasePayload, assessmentType: 'invalid_type' };
    const result = CropAssessmentSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('should default assessedBy if not provided', () => {
    const result = CropAssessmentSchema.safeParse(validBasePayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.assessedBy).toBe('fieldsight_vision_v1');
    }
  });
});
