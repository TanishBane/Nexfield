import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser components using @supabase/ssr.
 * Handles fallback gracefully when environment variables are not yet configured.
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseKey);
}

/**
 * Checks whether live Supabase credentials are configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes('placeholder') || url.includes('your-project')) return false;
  return true;
}
