import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { Builder } from '@/app/components/builder';
import { SiteError } from '@/components/site-error';

const getSubdomain = async () => {
  const headersList = await headers();
  const host = headersList.get('host') || '';

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

export async function generateMetadata(
  props: { params: { site: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const subdomain = await getSubdomain();

  if (!subdomain) return { title: 'Not Found' };

  const project = await getProject(subdomain);
  if (!project || !project.published) return { title: 'Not Found' };

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'kislap.app';
  const liveUrl = `https://${subdomain}.${rootDomain}`;

  const typeWithDesc = {
    portfolio: 'Portfolio Preview',
  };
  const ogImage = project.og_image_url || '/og-image.png';
  const name =
    project.portfolio?.name ||
    `${project.name} ${typeWithDesc[project.type as keyof typeof typeWithDesc] || ''}`;
  const description =
    project.portfolio?.description ||
    `${project.name} ${typeWithDesc[project.type as keyof typeof typeWithDesc] || ''}`;

  return {
    title: name,
    description: description,
    metadataBase: new URL(liveUrl),
    icons: {
      icon: '/icon.svg',
    },
    openGraph: {
      title: name,
      description: description,
      url: liveUrl,
      siteName: `${project.name} | Kislap - Turn simple forms into stunning websites.`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: description,
      images: [ogImage],
    },
  };
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
