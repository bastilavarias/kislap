import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import type { MenuFormValues } from '@/lib/schemas/menu';
import type { PortfolioFormValues } from '@/lib/schemas/portfolio';
import {
  type StarterProjectType,
  buildLinktreeStarterValues,
  buildMenuStarterValues,
  buildPortfolioStarterValues,
  createThemeObject,
  getThemeStylesForPreset,
} from '@/lib/project-starters';

export type PreviewProjectParams = {
  type: StarterProjectType;
  starterId: string;
  layoutName: string;
  themePreset: string;
  projectName: string;
};

export function getPreviewThemeStyles(themePreset: string) {
  return getThemeStylesForPreset(themePreset);
}

function slugifyPreviewName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function splitPreviewName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'Avery',
    lastName: parts.slice(1).join(' ') || 'Navarro',
  };
}

function buildPortfolioProjectData(
  portfolio: PortfolioFormValues,
  themePreset: string,
  layoutName: string,
  projectName: string,
  now: string
) {
  const themeObject = createThemeObject(themePreset);
  const slug = slugifyPreviewName(projectName) || 'avery-navarro';
  const { firstName, lastName } = splitPreviewName(projectName);

  return {
    id: 1,
    name: projectName,
    description: portfolio.introduction || '',
    slug,
    sub_domain: slug,
    type: 'portfolio' as const,
    published: 0,
    created_at: now,
    updated_at: now,
    portfolio: {
      id: 1,
      project_id: 1,
      user_id: 1,
      name: portfolio.name || projectName,
      avatar_url: portfolio.avatar_url || '',
      location: portfolio.location || '',
      job_title: portfolio.job_title || '',
      introduction: portfolio.introduction || '',
      about: portfolio.about || '',
      email: portfolio.email || '',
      phone: portfolio.phone || '',
      website: portfolio.website || '',
      github: portfolio.github || '',
      linkedin: portfolio.linkedin || '',
      twitter: portfolio.twitter || '',
      theme_name: themePreset,
      theme_object: themeObject,
      layout_name: layoutName,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      user: {
        id: 1,
        first_name: firstName,
        last_name: lastName,
        email: portfolio.email || 'avery.navarro@example.com',
        role: 'user',
        image_url: portfolio.avatar_url || '',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      work_experiences:
        portfolio.work_experiences?.map((work, index) => ({
          id: index + 1,
          company: work.company || '',
          role: work.role || '',
          location: work.location || '',
          start_date: work.startDate || '',
          end_date: work.endDate || '',
          about: work.about || '',
          url: work.url || '',
          placement_order: work.placement_order || index,
        })) || [],
      education:
        portfolio.education?.map((item, index) => ({
          id: index + 1,
          school: item.school || '',
          level: item.level || '',
          degree: item.degree || '',
          location: item.location || '',
          about: item.about || '',
          year_start: item.yearStart || '',
          year_end: item.yearEnd || '',
          placement_order: item.placement_order || index,
        })) || [],
      showcases:
        portfolio.showcases?.map((showcase, index) => ({
          id: index + 1,
          name: showcase.name || '',
          description: showcase.description || '',
          role: showcase.role || '',
          url: showcase.url || '',
          placement_order: showcase.placement_order || index,
          technologies:
            showcase.technologies?.map((tech, techIndex) => ({
              id: techIndex + 1,
              name: tech.name || '',
            })) || [],
        })) || [],
      skills:
        portfolio.skills?.map((skill, index) => ({
          id: index + 1,
          name: skill.name || '',
        })) || [],
    },
  };
}

function buildLinktreeProjectData(
  linktree: LinktreeFormValues,
  themePreset: string,
  layoutName: string,
  projectName: string,
  now: string
) {
  const themeObject = createThemeObject(themePreset);
  const slug = `${slugifyPreviewName(projectName) || 'mika-reyes'}-links`;
  const allSections =
    linktree.sections?.map((section, index) => ({
      id: index + 1,
      linktree_id: 1,
      type: section.type || 'link',
      title: section.title || '',
      url: section.url || '',
      description: section.description || '',
      app_url: section.app_url || '',
      image_url: section.image_url || '',
      icon_key: section.icon_key || '',
      accent_color: section.accent_color || '',
      quote_text: section.quote_text || '',
      quote_author: section.quote_author || '',
      banner_text: section.banner_text || '',
      support_note: section.support_note || '',
      support_qr_image_url: section.support_qr_image_url || '',
      cta_label: section.cta_label || '',
      placement_order: index,
    })) || [];
  const links = allSections.filter((section) => section.type === 'link');
  const sections = allSections.filter((section) => section.type !== 'link');

  return {
    id: 1,
    name: projectName,
    description: linktree.about || '',
    slug,
    sub_domain: slug,
    type: 'linktree' as const,
    published: 0,
    created_at: now,
    updated_at: now,
    linktree: {
      id: 1,
      project_id: 1,
      user_id: 1,
      name: linktree.name,
      tagline: linktree.tagline || '',
      about: linktree.about || '',
      phone: linktree.phone || '',
      email: linktree.email || '',
      logo_url: linktree.logo_url || '',
      background_style: linktree.background_style || 'grid',
      theme_object: themeObject,
      layout_name: layoutName,
      links,
      sections,
    },
  };
}

function buildMenuProjectData(
  menu: MenuFormValues,
  themePreset: string,
  layoutName: string,
  projectName: string,
  now: string
) {
  const themeObject = createThemeObject(themePreset);
  const categories = (menu.categories || []).map((category, index) => ({
    id: index + 1,
    menu_id: 1,
    client_key: category.client_key,
    name: category.name,
    description: category.description || '',
    image_url: category.image_url || '',
    placement_order: category.placement_order || index,
    is_visible: category.is_visible,
  }));
  const categoryIdByKey = new Map(
    categories.map((category) => [category.client_key, category.id])
  );

  return {
    id: 1,
    name: projectName,
    description: menu.description || '',
    slug: 'john-doe-cafe',
    sub_domain: 'john-doe-cafe',
    type: 'menu' as const,
    published: 0,
    created_at: now,
    updated_at: now,
    menu: {
      id: 1,
      project_id: 1,
      user_id: 1,
      name: menu.name,
      description: menu.description || '',
      logo_url: menu.logo_url || '',
      cover_image_url: menu.cover_image_url || '',
      phone: menu.phone || '',
      email: menu.email || '',
      website_url: menu.website_url || '',
      address: menu.address || '',
      city: menu.city || '',
      google_maps_url: menu.google_maps_url || '',
      layout_name: layoutName,
      theme_name: themePreset,
      theme_object: themeObject,
      qr_settings: menu.qr_settings,
      search_enabled: menu.search_enabled,
      hours_enabled: menu.hours_enabled,
      business_hours: menu.business_hours || [],
      social_links: menu.social_links || [],
      gallery_images: (menu.gallery_images || []).map((entry) => entry.image_url).filter(Boolean),
      categories,
      items: (menu.items || []).map((item, index) => ({
        id: index + 1,
        menu_id: 1,
        menu_category_id: categoryIdByKey.get(item.category_key || '') || null,
        name: item.name,
        description: item.description || '',
        image_url: item.image_url || '',
        badge: item.badge || '',
        price: item.price,
        variants: item.variants || [],
        placement_order: item.placement_order || index,
        is_available: item.is_available,
        is_featured: item.is_featured,
      })),
    },
  };
}

export function createMockProject({
  type,
  starterId,
  layoutName,
  themePreset,
  projectName,
}: PreviewProjectParams) {
  const now = new Date().toISOString();

  if (type === 'portfolio') {
    return buildPortfolioProjectData(
      buildPortfolioStarterValues(starterId, projectName),
      themePreset,
      layoutName,
      projectName,
      now
    );
  }

  if (type === 'linktree') {
    return buildLinktreeProjectData(
      buildLinktreeStarterValues(starterId, projectName),
      themePreset,
      layoutName,
      projectName,
      now
    );
  }

  return buildMenuProjectData(
    buildMenuStarterValues(starterId, projectName),
    themePreset,
    layoutName,
    projectName,
    now
  );
}
