import { createClient, isSupabaseConfigured } from './client';

export const STORAGE_BUCKET_FIELDSIGHT = 'fieldsight-observations';
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadResult {
  path: string;
  signedUrl?: string;
  error?: string;
}

/**
 * Validates file parameters before upload.
 */
export function validateObservationFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type}). Please upload a JPEG, PNG, or WEBP image.`,
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
 * Uploads a crop disease observation image to the private Supabase storage bucket.
 * Files are isolated in user-scoped directory paths: {userId}/{timestamp}_{sanitized_name}
 */
export async function uploadObservationImage(
  file: File,
  userId?: string
): Promise<UploadResult> {
  const validation = validateObservationFile(file);
  if (!validation.valid) {
    return { path: '', error: validation.error };
  }

  // If Supabase is not configured, generate a local object URL for offline demonstration
  if (!isSupabaseConfigured()) {
    const localUrl = URL.createObjectURL(file);
    return {
      path: `local-demo/${file.name}`,
      signedUrl: localUrl,
    };
  }

  const supabase = createClient();
  const ownerId = userId || (await supabase.auth.getUser()).data.user?.id || 'anonymous-demo';

  // Sanitize filename: alphanumeric, dashes, dots, underscores
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${ownerId}/${Date.now()}_${sanitizedName}`;

  const { data, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET_FIELDSIGHT)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return { path: '', error: uploadError.message };
  }

  // Generate a temporary signed URL (valid for 1 hour) for the private bucket
  const { data: signedData, error: signedError } = await supabase.storage
    .from(STORAGE_BUCKET_FIELDSIGHT)
    .createSignedUrl(data.path, 3600);

  if (signedError) {
    return { path: data.path, error: signedError.message };
  }

  return {
    path: data.path,
    signedUrl: signedData.signedUrl,
  };
}

/**
 * Retrieves a signed URL for a private observation image path.
 */
export async function getObservationSignedUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  if (!isSupabaseConfigured() || path.startsWith('local-demo/')) {
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_FIELDSIGHT)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data) {
    return null;
  }

  return data.signedUrl;
}
