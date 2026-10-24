import { NextResponse } from 'next/server';
import { createClient, isSupabaseServerConfigured } from '@/lib/supabase/server';

/**
 * Sanitizes the next redirect URL to prevent open redirect vulnerabilities.
 * Ensures the target is strictly an internal, relative path.
 */
function sanitizeNextUrl(next: string | null): string {
  if (!next) return '/control';

  // Decode URI component to catch encoded bypass attempts
  let decoded = next;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return '/control';
  }

  // Strictly disallow protocol-relative URLs (//evil.com), backslashes (\evil.com), or schemes
  if (
    !decoded.startsWith('/') ||
    decoded.startsWith('//') ||
    decoded.includes('\\') ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded)
  ) {
    return '/control';
  }

  return decoded;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const rawNext = searchParams.get('next');
  const next = sanitizeNextUrl(rawNext);

  if (!isSupabaseServerConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=supabase_unconfigured`);
  }

  try {
    const supabase = await createClient();

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.session) {
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        const baseUrl = isLocalEnv || !forwardedHost ? origin : `https://${forwardedHost}`;

        if (next === '/update-password') {
          return NextResponse.redirect(`${baseUrl}/update-password`);
        }

        return NextResponse.redirect(`${baseUrl}${next}`);
      }
    } else if (tokenHash && type) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as any,
      });
      if (!error && data?.session) {
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        const baseUrl = isLocalEnv || !forwardedHost ? origin : `https://${forwardedHost}`;

        if (next === '/update-password') {
          return NextResponse.redirect(`${baseUrl}/update-password`);
        }

        return NextResponse.redirect(`${baseUrl}${next}`);
      }
    }
  } catch {
    return NextResponse.redirect(`${origin}/login?error=auth_exchange_failed`);
  }

  // Return to login with error indicator if exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth_exchange_failed`);
}
