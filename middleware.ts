import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JWTHelper } from './lib/jwt';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth-token')?.value;

  const protectedRoutes = ['/api/auth/me'];
  
  const authRoutes = ['/member/sign-in', '/member/sign-up'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = JWTHelper.verifyToken(token);
    if (!payload) {
      const response = NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
      response.cookies.set('auth-token', '', { maxAge: 0 });
      return response;
    }
  }

  if (isAuthRoute && token) {
    const payload = JWTHelper.verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/play', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/me/:path*',
    '/member/sign-in',
    '/member/sign-up',
  ]
};
