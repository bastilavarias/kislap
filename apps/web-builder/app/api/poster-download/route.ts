import { NextRequest, NextResponse } from 'next/server';

function sanitizeFilename(value: string | null): string {
  const fallback = 'menu-poster-a6.png';
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }

  const cleaned = trimmed.replace(/[^A-Za-z0-9._-]/g, '-');
  return cleaned || fallback;
}

export async function GET(request: NextRequest) {
  const sourceURL = request.nextUrl.searchParams.get('url')?.trim();
  const filename = sanitizeFilename(request.nextUrl.searchParams.get('filename'));

  if (!sourceURL) {
    return NextResponse.json({ message: 'Missing url parameter' }, { status: 400 });
  }

  let parsedURL: URL;
  try {
    parsedURL = new URL(sourceURL);
  } catch {
    return NextResponse.json({ message: 'Invalid url parameter' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsedURL.protocol)) {
    return NextResponse.json({ message: 'Unsupported url protocol' }, { status: 400 });
  }

  const upstream = await fetch(parsedURL.toString(), {
    cache: 'no-store',
  });

  if (!upstream.ok) {
    return NextResponse.json({ message: 'Failed to fetch poster image' }, { status: 502 });
  }

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  const bytes = await upstream.arrayBuffer();

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
