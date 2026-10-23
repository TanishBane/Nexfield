import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes Supabase auth token cookies and enforces protected routes.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not configured, allow local dev / fixture mode through
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseUrl.includes('your-project')
  ) {
    return supabaseResponse;
  }

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
  ];
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // /demo routes and landing page (/) are always public
  const isDemoRoute = pathname.startsWith('/demo');

  // If unauthenticated user tries to access a protected route
  if (!user && isProtectedRoute && !isDemoRoute) {
    // If running in development fixture mode without live Supabase, allow browsing
    if (process.env.NEXT_PUBLIC_USE_FIXTURES === 'true' && !request.cookies.get('sb-enforce-auth')) {
      return supabaseResponse;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user navigates to /login, redirect to /control
  if (user && pathname === '/login') {
    const redirectUrl = request.nextUrl.clone();
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/control';
    redirectUrl.pathname = redirectTo;
    redirectUrl.searchParams.delete('redirectTo');
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
