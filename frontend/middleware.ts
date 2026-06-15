import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // Protected Pages: Require Authentication
  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/bookmarks');

  // Admin-Only Pages: Require Admin role
  const isAdminPath = pathname.startsWith('/admin');

  // Auth Pages: Shouldn't visit if logged in
  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    // Remember original path to redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/notifications/:path*',
    '/bookmarks/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
