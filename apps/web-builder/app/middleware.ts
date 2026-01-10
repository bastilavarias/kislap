import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GUEST_ONLY_ROUTES = [
  '/',
  '/login/github',
  '/login/google',
  '/about',
  '/terms',
  '/privacy',
  '/showcase',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.has('access_token') || request.cookies.has('refresh_token');

  if (hasSession) {
    if (GUEST_ONLY_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (!GUEST_ONLY_ROUTES.includes(pathname) && !pathname.includes('callback')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
