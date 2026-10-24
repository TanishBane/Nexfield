import { describe, it, expect } from 'vitest';
import { validateObservationFile, MAX_FILE_SIZE_BYTES } from './storage';

describe('validateObservationFile', () => {
  it('should return valid for a correct JPEG file under the size limit', () => {
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const result = validateObservationFile(file);
    expect(result).toEqual({ valid: true });
  });

  it('should return valid for a correct PNG file under the size limit', () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const result = validateObservationFile(file);
    expect(result).toEqual({ valid: true });
  });

  it('should return valid for a correct WEBP file under the size limit', () => {
    const file = new File(['dummy content'], 'test.webp', { type: 'image/webp' });
    const result = validateObservationFile(file);
    expect(result).toEqual({ valid: true });
  });

  it('should return invalid for an unsupported file type (e.g., application/pdf)', () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const result = validateObservationFile(file);
    expect(result).toEqual({
      valid: false,
      error: 'Unsupported file format (application/pdf). Please upload a JPEG, PNG, or WEBP image.',
    });
  });

  it('should return invalid for a file exceeding the maximum size limit', () => {
    // MAX_FILE_SIZE_BYTES is 10MB (10 * 1024 * 1024 = 10485760 bytes)
    // Create an ArrayBuffer of 11MB (11 * 1024 * 1024 = 11534336 bytes)
    const largeContent = new ArrayBuffer(11 * 1024 * 1024);
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

    const result = validateObservationFile(file);
    expect(result).toEqual({
      valid: false,
      error: 'File size (11.0 MB) exceeds maximum allowed limit of 10 MB.',
    });
  });

  it('should return invalid for an unsupported file type even if it exceeds the maximum size limit', () => {
    // The mime type check is first, so it should return the format error even if the file is too large
    const largeContent = new ArrayBuffer(11 * 1024 * 1024);
    const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });

    const result = validateObservationFile(file);
    expect(result).toEqual({
      valid: false,
      error: 'Unsupported file format (application/pdf). Please upload a JPEG, PNG, or WEBP image.',
    });
  });
});
