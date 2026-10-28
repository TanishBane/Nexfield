/**
 * Image storage and validation utility for FieldSight visual pathology scans.
 * In public demo mode, images are validated and converted to local Object URLs / Data URLs
 * entirely in-browser with zero external cloud dependencies.
 */

export const STORAGE_BUCKET_FIELDSIGHT = 'fieldsight-observations';
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadResult {
  path: string;
  signedUrl: string;
  error?: string;
}

/**
 * Validates file MIME type and size boundaries.
 */
export function validateObservationFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPEG, PNG, or WEBP image.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Generates an in-memory object URL for foliar observation images during public demo mode.
 */
export async function uploadObservationImage(
  file: File,
  _userId?: string
): Promise<UploadResult> {
  const validation = validateObservationFile(file);
  if (!validation.valid) {
    return { path: '', signedUrl: '', error: validation.error };
  }

  const localUrl = URL.createObjectURL(file);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `demo-observations/${Date.now()}_${sanitizedName}`;

  return {
    path,
    signedUrl: localUrl,
  };
}

/**
 * Resolves observation image URL in demo mode.
 */
export async function getObservationSignedUrl(
  path: string,
  _expiresInSeconds: number = 3600
): Promise<string | null> {
  if (!path) return null;
  return path;
}

/**
 * Revokes a previously allocated Object URL to prevent browser memory leaks.
 */
export function revokeObservationUrl(url: string | null | undefined): void {
  if (url && typeof window !== 'undefined' && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // safe noop
    }
  }
}
