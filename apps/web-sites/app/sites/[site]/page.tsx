import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { Builder } from '@/app/components/builder'; // Adjust path as needed
import { SiteError } from '@/components/site-error';

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

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {
  const subdomain = await getSubdomain();

  if (!subdomain) return { title: 'Not Found' };

  const project = await getProject(subdomain);
  if (!project || !project.published) return { title: 'Not Found' };

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'kislap.app';
  const liveUrl = `https://${subdomain}.${rootDomain}`;

  // const screenshotUrl = `https://api.microlink.io?url=${encodeURIComponent(liveUrl)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1200&viewport.height=630`;
  const screenshotUrl = null;

  const meta = {
    title: project.name,
    description: project.description,
    icons: {
      icon: '/icon.svg',
    },
    openGraph: {
      title: project.name,
      description: project.description,
      images: [
        {
          url: screenshotUrl,
          width: 1200,
          height: 630,
          alt: `${project.name} preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.description,
      images: [screenshotUrl],
    },
  };

  return meta;
}

export default async function Page() {
  const subdomain = await getSubdomain();

  if (!subdomain) {
    return <SiteError type="invalid-domain" />;
  }

  const project = await getProject(subdomain);

  if (!project) {
    return <SiteError type="not-found" />;
  }

  if (!project.published) {
    return <SiteError type="not-published" />;
  }

  return <Builder initialProject={project} initialSubdomain={subdomain} />;
}
