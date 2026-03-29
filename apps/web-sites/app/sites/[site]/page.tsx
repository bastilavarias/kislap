import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { Builder } from '@/app/components/builder';
import { SiteError } from '@/components/site-error';
import { buildProjectJsonLd, buildProjectMetadata } from '@/lib/site-seo';

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

const getLiveUrl = async (subdomain: string) => {
  const headersList = await headers();
  const forwardedProto = headersList.get('x-forwarded-proto');
  const host = headersList.get('host');

  if (host) {
    const protocol =
      forwardedProto || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    return `${protocol}://${host}`;
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'kislap.app';
  return `https://${subdomain}.${rootDomain}`;
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

  const liveUrl = await getLiveUrl(subdomain);
  return buildProjectMetadata(project, liveUrl);
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

  const liveUrl = await getLiveUrl(subdomain);
  const jsonLd = buildProjectJsonLd(project, liveUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Builder initialProject={project} initialSubdomain={subdomain} />
    </>
  );
}
