import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Auth pages that logged-in users should leave (already have a session). */
const guestOnlyAuthPaths = ['/login', '/register'];

/** Auth pages that must stay reachable even with a refresh cookie (e.g. right after register). */
const alwaysAccessibleAuthPaths = ['/verify-email', '/forgot-password', '/reset-password'];

const protectedPaths = [
  '/dashboard',
  '/my-listings',
  '/my-favorites',
  '/messages',
  '/profile',
  '/settings',
  '/admin',
  '/post',
  '/edit-listing',
  '/promote',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (guestOnlyAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // verify/forgot/reset stay accessible regardless of session cookie
  if (alwaysAccessibleAuthPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (protectedPaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
