const fallbackSiteUrl = 'https://kislap.app';
const fallbackBuilderUrl = 'https://builder.kislap.app';

function normalizeBaseUrl(value: string | undefined, fallback: string) {
  const candidate = value?.trim() || fallback;
  return candidate.endsWith('/') ? candidate.slice(0, -1) : candidate;
}

export const SITE_URL = normalizeBaseUrl(import.meta.env.SITE_URL, fallbackSiteUrl);
export const BUILDER_URL = normalizeBaseUrl(import.meta.env.BUILDER_URL, fallbackBuilderUrl);

export function getSiteUrl(path = '/') {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function getBuilderUrl(path = '/') {
  return new URL(path, `${BUILDER_URL}/`).toString();
}

export function getBuilderProjectCreateUrl(params?: {
  type?: 'portfolio' | 'linktree' | 'menu';
  starter?: string;
}) {
  const url = new URL('/dashboard/projects/new', `${BUILDER_URL}/`);
  if (params?.type) {
    url.searchParams.set('type', params.type);
  }
  if (params?.starter) {
    url.searchParams.set('starter', params.starter);
  }
  return url.toString();
}

export function getPublicProjectUrl(subdomain?: string | null) {
  if (!subdomain) return '#';

  const siteUrl = new URL(`${SITE_URL}/`);
  siteUrl.hostname = `${subdomain}.${siteUrl.hostname}`;
  siteUrl.pathname = '/';
  siteUrl.search = '';
  siteUrl.hash = '';

  return siteUrl.toString();
}

export const SITE_HOST_LABEL = new URL(SITE_URL).host;
