import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  validateObservationFile,
  uploadObservationImage,
  getObservationSignedUrl,
  MAX_FILE_SIZE_BYTES,
} from './image-storage';

describe('FieldSight In-Browser Image Storage & Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost:3000/demo-uuid-1234');
  });

  it('validates supported image formats (JPEG, PNG, WEBP)', () => {
    const validJpeg = new File(['mock content'], 'leaf.jpg', { type: 'image/jpeg' });
    const validPng = new File(['mock content'], 'stem.png', { type: 'image/png' });
    const validWebp = new File(['mock content'], 'rust.webp', { type: 'image/webp' });

    expect(validateObservationFile(validJpeg).valid).toBe(true);
    expect(validateObservationFile(validPng).valid).toBe(true);
    expect(validateObservationFile(validWebp).valid).toBe(true);
  });

  it('rejects unsupported file formats (PDF, executable, text)', () => {
    const invalidPdf = new File(['mock pdf'], 'doc.pdf', { type: 'application/pdf' });
    const invalidExe = new File(['binary'], 'virus.exe', { type: 'application/x-msdownload' });

    const pdfResult = validateObservationFile(invalidPdf);
    expect(pdfResult.valid).toBe(false);
    expect(pdfResult.error).toContain('Unsupported file format');

    const exeResult = validateObservationFile(invalidExe);
    expect(exeResult.valid).toBe(false);
    expect(exeResult.error).toContain('Unsupported file format');
  });

  it('rejects files exceeding the maximum size limit of 10 MB', () => {
    const oversizedFile = {
      name: 'large_raw_scan.jpg',
      type: 'image/jpeg',
      size: MAX_FILE_SIZE_BYTES + 1024,
    } as File;

    const result = validateObservationFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum allowed limit of 10 MB');
  });

  it('generates local in-memory Object URL without external cloud dependencies', async () => {
    const validFile = new File(['test-image-data'], 'flag_leaf_rust.jpg', { type: 'image/jpeg' });
    const uploadResult = await uploadObservationImage(validFile);

    expect(uploadResult.error).toBeUndefined();
    expect(uploadResult.signedUrl).toBe('blob:http://localhost:3000/demo-uuid-1234');
    expect(uploadResult.path).toMatch(/^demo-observations\/\d+_flag_leaf_rust\.jpg$/);
  });

  it('resolves observation image URL in demo mode', async () => {
    const path = 'demo-observations/12345_leaf.jpg';
    const resolved = await getObservationSignedUrl(path);
    expect(resolved).toBe(path);
  });
});
