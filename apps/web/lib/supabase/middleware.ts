import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Checks if live Supabase credentials are configured in middleware environment.
 */
function isSupabaseConfigured(): boolean {
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
 * Refreshes Supabase auth token cookies and enforces protected routes.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // Protected application routes (Real farmer workspace)
  const protectedPrefixes = [
    '/control',
    '/twin',
    '/fieldsight',
    '/markets',
    '/ops',
    '/intelligence',
    '/data-center',
    '/onboarding',
  ];
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // /demo routes and landing page (/) are always public
  const isDemoRoute = pathname.startsWith('/demo');

  // If Supabase credentials are not configured
  if (!isSupabaseConfigured()) {
    // If accessing protected routes without Supabase configured, redirect to /login with unconfigured error
    if (isProtectedRoute && !isDemoRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('error', 'supabase_unconfigured');
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid using getSession() in Server/Middleware; getUser() performs secure JWT validation against Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated user tries to access a protected route
  if (!user && isProtectedRoute && !isDemoRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user navigates to /login or /forgot-password, redirect to /control
  const isAuthRoute = pathname === '/login' || pathname === '/forgot-password';
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/control';
    redirectUrl.pathname = redirectTo.startsWith('/') ? redirectTo : '/control';
    redirectUrl.searchParams.delete('redirectTo');
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

