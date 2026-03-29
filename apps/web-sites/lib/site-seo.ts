import type { Metadata } from 'next';
import type { Project } from '@/types/project';

function stripMarkup(value?: string | null) {
  if (!value) return '';
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`#>\-\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value: string, max = 160) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function asArray<T>(value: T[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

function pickImage(project: Project) {
  if ((project as any).og_image_url) return (project as any).og_image_url as string;

  if (project.type === 'portfolio') {
    return (
      project.portfolio?.avatar_url ||
      project.portfolio?.user?.image_url ||
      '/og-image.png'
    );
  }

  if (project.type === 'linktree') {
    const linktree = project.linktree as any;
    const sectionImage =
      asArray(linktree?.sections).find((section: any) => section?.image_url)?.image_url || null;
    const linkImage =
      asArray(linktree?.links).find((link: any) => link?.image_url)?.image_url || null;

    return linktree?.logo_url || sectionImage || linkImage || '/og-image.png';
  }

  if (project.type === 'menu') {
    const menu = project.menu as any;
    const gallery = asArray(menu?.gallery_images).find(Boolean);
    return menu?.cover_image_url || menu?.logo_url || gallery || '/og-image.png';
  }

  return '/og-image.png';
}

function buildPortfolioSeo(project: Project) {
  const portfolio = project.portfolio;
  const title = [portfolio?.name, portfolio?.job_title].filter(Boolean).join(' | ') || project.name;
  const description = truncate(
    stripMarkup(
      portfolio?.introduction ||
        portfolio?.about ||
        project.description ||
        `${portfolio?.name || project.name} portfolio`
    ),
    170
  );

  const keywords = unique(
    [
      portfolio?.name,
      portfolio?.job_title,
      portfolio?.location,
      'portfolio',
      'personal website',
      ...asArray(portfolio?.skills).map((skill: any) => skill?.name).filter(Boolean),
    ].filter(Boolean) as string[]
  );

  const sameAs = [
    portfolio?.website,
    portfolio?.github,
    portfolio?.linkedin,
    portfolio?.twitter,
  ].filter(Boolean) as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: title,
    description,
    mainEntity: {
      '@type': 'Person',
      name: portfolio?.name || project.name,
      description,
      jobTitle: portfolio?.job_title || undefined,
      address: portfolio?.location || undefined,
      email: portfolio?.email || undefined,
      telephone: portfolio?.phone || undefined,
      image: pickImage(project),
      sameAs: sameAs.length ? sameAs : undefined,
      url: undefined,
    },
  };

  return { title, description, keywords, jsonLd };
}

function buildLinktreeSeo(project: Project) {
  const linktree = project.linktree as any;
  const title = linktree?.name?.trim() || project.name;
  const externalUrls = unique(
    [
      ...asArray(linktree?.links).flatMap((link: any) => [link?.url, link?.app_url]),
      ...asArray(linktree?.sections).flatMap((section: any) => [section?.url, section?.app_url]),
    ].filter(Boolean) as string[]
  );
  const description = truncate(
    stripMarkup(
      linktree?.tagline ||
        linktree?.about ||
        project.description ||
        `${title} links, socials, and featured destinations`
    ),
    170
  );
  const keywords = unique(
    [
      title,
      linktree?.tagline,
      'link in bio',
      'social links',
      ...asArray(linktree?.links).map((link: any) => link?.title).filter(Boolean),
    ].filter(Boolean) as string[]
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: title,
    description,
    mainEntity: {
      '@type': 'Person',
      name: title,
      description,
      image: linktree?.logo_url || pickImage(project),
      email: linktree?.email || undefined,
      telephone: linktree?.phone || undefined,
      sameAs: externalUrls.length ? externalUrls : undefined,
      url: undefined,
    },
  };

  return { title, description, keywords, jsonLd };
}

function buildMenuSeo(project: Project) {
  const menu = project.menu as any;
  const title = menu?.name?.trim()
    ? `${menu.name} Menu`
    : `${project.name} Menu`;
  const categoryNames = asArray(menu?.categories)
    .filter((category: any) => category?.is_visible !== false)
    .map((category: any) => category?.name)
    .filter(Boolean);
  const description = truncate(
    stripMarkup(
      menu?.description ||
        `${menu?.name || project.name} menu${menu?.city ? ` in ${menu.city}` : ''}${
          categoryNames.length ? ` featuring ${categoryNames.slice(0, 3).join(', ')}` : ''
        }.`
    ),
    170
  );
  const socialUrls = asArray(menu?.social_links)
    .map((link: any) => link?.url)
    .filter(Boolean) as string[];

  const openingHours = asArray(menu?.business_hours)
    .filter((entry: any) => !entry?.closed && entry?.open && entry?.close)
    .map((entry: any) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${String(entry.day || '')
        .toLowerCase()
        .replace(/^\w/, (char) => char.toUpperCase())}`,
      opens: entry.open,
      closes: entry.close,
    }));

  const menuSections = asArray(menu?.categories)
    .filter((category: any) => category?.is_visible !== false)
    .map((category: any) => ({
      '@type': 'MenuSection',
      name: category?.name,
      description: stripMarkup(category?.description),
      hasMenuItem: asArray(menu?.items)
        .filter(
          (item: any) =>
            item?.menu_category_id === category?.id && item?.is_available !== false
        )
        .map((item: any) => ({
          '@type': 'MenuItem',
          name: item?.name,
          description: stripMarkup(item?.description),
          image: item?.image_url || undefined,
        })),
    }));

  const keywords = unique(
    [
      menu?.name,
      menu?.city,
      'restaurant menu',
      'cafe menu',
      ...categoryNames,
    ].filter(Boolean) as string[]
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Restaurant',
        name: menu?.name || project.name,
        description,
        image: unique(
          [menu?.cover_image_url, menu?.logo_url, ...asArray(menu?.gallery_images)].filter(
            Boolean
          ) as string[]
        ),
        telephone: menu?.phone || undefined,
        email: menu?.email || undefined,
        sameAs: socialUrls.length ? socialUrls : undefined,
        address:
          menu?.address || menu?.city
            ? {
                '@type': 'PostalAddress',
                streetAddress: menu?.address || undefined,
                addressLocality: menu?.city || undefined,
              }
            : undefined,
        openingHoursSpecification: openingHours.length ? openingHours : undefined,
      },
      {
        '@type': 'Menu',
        name: title,
        hasMenuSection: menuSections.length ? menuSections : undefined,
      },
    ],
  };

  return { title, description, keywords, jsonLd };
}

export function buildProjectSeo(project: Project) {
  if (project.type === 'portfolio') return buildPortfolioSeo(project);
  if (project.type === 'linktree') return buildLinktreeSeo(project);
  if (project.type === 'menu') return buildMenuSeo(project);

  const title = project.name;
  const description = truncate(stripMarkup(project.description || project.name), 170);
  return {
    title,
    description,
    keywords: [project.name],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
    },
  };
}

export function buildProjectMetadata(project: Project, liveUrl: string): Metadata {
  const { title, description, keywords } = buildProjectSeo(project);
  const image = pickImage(project);

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(liveUrl),
    alternates: {
      canonical: liveUrl,
    },
    icons: {
      icon: '/icon.svg',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: liveUrl,
      siteName: 'Kislap',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function buildProjectJsonLd(project: Project, liveUrl: string) {
  const { jsonLd } = buildProjectSeo(project);

  if (jsonLd?.mainEntity && !jsonLd.mainEntity.url) {
    jsonLd.mainEntity.url = liveUrl;
  }

  if (!jsonLd.url) {
    jsonLd.url = liveUrl;
  }

  return jsonLd;
}
