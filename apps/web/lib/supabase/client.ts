import { createBrowserClient } from '@supabase/ssr';

/**
 * Checks whether live Supabase credentials are configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  const trimmedUrl = url.trim().toLowerCase();
  const trimmedKey = key.trim().toLowerCase();
  if (
    trimmedUrl.includes('placeholder') ||
    trimmedUrl.includes('your-project') ||
    trimmedKey.includes('placeholder') ||
    trimmedKey.includes('your-anon')
  ) {
    return false;
  }
  return true;
}

/**
 * Creates a Supabase client for browser components using @supabase/ssr.
 * Fails safely with a clear, actionable error when credentials are not configured.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured() || !supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase client is not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

