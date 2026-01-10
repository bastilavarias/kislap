import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const response = NextResponse.next();

  let hostname = req.headers.get('host') || '';
  hostname = hostname.split(':')[0];
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(':')[0] || 'kislap.app';

  const isSubdomain =
    hostname.includes('.') &&
    !hostname.includes('www') &&
    !hostname.endsWith(rootDomain) &&
    hostname !== 'localhost';

  const currentHost = hostname.replace(`.${rootDomain}`, '');
  if (hostname.includes('.') && !hostname.includes('www') && hostname !== rootDomain) {
    url.pathname = `/sites/${currentHost}${url.pathname}`;

    return NextResponse.rewrite(url);
  }

  response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://kislap.app;");

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|icon.svg).*)'],
};
