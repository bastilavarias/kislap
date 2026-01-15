import { ImageResponse } from 'next/og';
import { headers } from 'next/headers';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const getSubdomain = async () => {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  if (host.includes('localhost')) {
    // You might want to return a hardcoded test subdomain here for dev
    // return 'sebastech';
  }

  const hostname = host.split(':')[0];
  const parts = hostname.split('.');

  if (parts.length >= 2) {
    return parts[0];
  }
  return null;
};

async function getProject(subdomain: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';

  try {
    const res = await fetch(`${API_BASE_URL}/api/projects/show/sub-domain/${subdomain}?level=full`);

    if (!res.ok) return null;
    const json = await res.json();

    return json.data || null;
  } catch (error) {
    return null;
  }
}

export default async function Image({ params }: { params: { site: string } }) {
  const project = await getProject(params.site);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Site not found
        </div>
      )
    );
  }

  const bgColor = project.theme?.backgroundColor || '#ffffff';
  const textColor = project.theme?.textColor || '#000000';
  const accentColor = project.theme?.accentColor || '#3b82f6'; // Default blue

  // 3. Render the "Business Card"
  return new ImageResponse(
    (
      <div
        style={{
          background: bgColor,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative Background Element (Optional - makes it look premium) */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`, // 20% opacity accent
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: textColor,
              margin: 0,
              marginBottom: 20,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {project.name}
          </h1>

          {/* User's Description */}
          <p
            style={{
              fontSize: 30,
              color: textColor,
              opacity: 0.8,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {project.description || 'Built with Kislap'}
          </p>
        </div>

        {/* Branding Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            fontSize: 20,
            color: textColor,
            opacity: 0.5,
          }}
        >
          <span style={{ fontWeight: 600 }}>kislap.app</span>
          <span style={{ margin: '0 10px' }}>/</span>
          <span>{params.site}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
