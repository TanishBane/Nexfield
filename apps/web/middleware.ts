import { NextResponse, type NextRequest } from 'next/server';

/**
 * Public Demo Middleware.
 * No Supabase sessions or authentication barriers.
 * Legacy auth routes are cleanly redirected to the public platform demo (/control).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Clean redirect for obsolete authentication or onboarding routes
  if (
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/update-password' ||
    pathname === '/onboarding' ||
    pathname.startsWith('/auth')
  ) {
    const destination = new URL('/control', request.url);
    return NextResponse.redirect(destination, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
