import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Checks whether live Supabase credentials are configured on the server.
 */
export function isSupabaseServerConfigured(): boolean {
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
 * Creates a Supabase client for Server Components, Actions, and Route Handlers.
 * In Next.js 15, cookies() returns a Promise and must be awaited.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseServerConfigured() || !supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase server is not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be safely ignored if middleware refreshes the session.
        }
      },
    },
  });
}

