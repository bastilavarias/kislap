import { Builder } from '@/app/components/builder';
import { headers } from 'next/headers';

const getSubdomain = async () => {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');
  let subDomain: string | null = null;
  if (parts.length >= 2) {
    subDomain = parts[0];
  }

  return subDomain;
};

async function getProject(subdomain: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.test';
  try {
    const res = await fetch(`${API_BASE_URL}/api/projects/show/sub-domain/${subdomain}?level=full`);
    if (!res.ok) {
      console.error(`Failed to load project: ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export default async function Page() {
  const subdomain = await getSubdomain();
  if (!subdomain) {
    return <div>Error: Subdomain not found</div>;
  }
  const project = await getProject(subdomain);
  if (!project) {
    return <div>Error: Project not found</div>;
  }

  return <Builder initialProject={project} initialSubdomain={subdomain} />;
}
