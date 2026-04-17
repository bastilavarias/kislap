import { MenuFormValues } from '@/lib/schemas/menu';
import {
  createDefaultBusinessHours,
  createDefaultDisplayPosterSettings,
  createDefaultSocialLinks,
} from '@/lib/menu-defaults';
import { APIResponseMenu } from '@/types/api-response';

function createKey(seed?: string | number) {
  return `category-${seed || Math.random().toString(36).slice(2, 10)}`;
}

function normalizePreferredPosterImages(
  preferredImages: string[] | null | undefined,
  galleryImages: Array<string | null | undefined>
): string[] {
  if (!preferredImages?.length) {
    return [];
  }

  const gallerySet = new Set(galleryImages.filter((imageURL): imageURL is string => !!imageURL?.trim()));
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const imageURL of preferredImages) {
    const trimmed = imageURL?.trim();
    if (!trimmed || !gallerySet.has(trimmed) || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    normalized.push(trimmed);
    if (normalized.length === 2) {
      break;
    }
  }

  return normalized;
}

function normalizeDisplayPosterSettings(
  settings: APIResponseMenu['display_poster_settings'] | MenuFormValues['display_poster_settings'] | undefined,
  galleryImages: Array<string | null | undefined> = []
): MenuFormValues['display_poster_settings'] {
  const defaults = createDefaultDisplayPosterSettings();

  return {
    ...defaults,
    ...(settings || {}),
    template: settings?.template === 'brand' ? 'brand' : 'clean',
    size: 'a6' as const,
    color_mode: settings?.color_mode === 'dark' ? 'dark' : 'light',
    headline: settings?.headline ?? '',
    subtext: settings?.subtext ?? '',
    footer_note: settings?.footer_note ?? '',
    preferred_images: normalizePreferredPosterImages(settings?.preferred_images, galleryImages),
  };
}

export function mapToFormValues(source: APIResponseMenu): MenuFormValues {
  const categories = (source.categories || []).map((category, index) => ({
    id: category.id,
    client_key: category.client_key || createKey(category.id || index),
    name: category.name || '',
    description: category.description || '',
    image: null,
    image_url: category.image_url || '',
    placement_order: category.placement_order ?? index,
    is_visible: category.is_visible ?? true,
  }));

  const categoryKeyByID = new Map<number, string>();
  categories.forEach((category) => {
    if (category.id) categoryKeyByID.set(category.id, category.client_key);
  });

  const defaultHours = createDefaultBusinessHours();
  const hoursByDay = new Map((source.business_hours || []).map((entry) => [entry.day, entry]));
  const businessHours = defaultHours.map((entry) => {
    const saved = hoursByDay.get(entry.day);
    return saved
      ? {
          day: saved.day,
          open: saved.open || entry.open,
          close: saved.close || entry.close,
          closed: saved.closed ?? entry.closed,
        }
      : entry;
  });

  const defaultSocialLinks = createDefaultSocialLinks();
  const socialLinksByPlatform = new Map(
    (source.social_links || []).map((entry) => [entry.platform, entry])
  );
  const socialLinks = defaultSocialLinks.map((entry) => {
    const saved = socialLinksByPlatform.get(entry.platform);
    return {
      platform: entry.platform,
      url: saved?.url || '',
    };
  });

  const galleryImages = (source.gallery_images || []).map((imageURL) => imageURL || '');

  return {
    name: source.name || '',
    description: source.description || '',
    logo: null,
    logo_url: source.logo_url || '',
    cover_image: null,
    cover_image_url: source.cover_image_url || '',
    phone: source.phone || '',
    email: source.email || '',
    website_url: source.website_url || '',
    address: source.address || '',
    city: source.city || '',
    google_maps_url: source.google_maps_url || '',
    search_enabled: source.search_enabled ?? true,
    hours_enabled: source.hours_enabled ?? false,
    business_hours: businessHours,
    social_links: socialLinks,
    gallery_images: galleryImages.map((imageURL) => ({
      image: null,
      image_url: imageURL || '',
    })),
    layout_name: source.layout_name || 'menu-default',
    qr_settings: {
      foreground_color: source.qr_settings?.foreground_color || '#111111',
      background_color: source.qr_settings?.background_color || '#ffffff',
      show_logo: source.qr_settings?.show_logo || false,
    },
    display_poster_settings: normalizeDisplayPosterSettings(source.display_poster_settings, galleryImages),
    display_poster_image_url: source.display_poster_image_url || '',
    categories,
    items: (source.items || []).map((item, index) => ({
      id: item.id,
      category_id: item.menu_category_id,
      category_key: categoryKeyByID.get(item.menu_category_id) || null,
      name: item.name || '',
      description: item.description || '',
      image: null,
      image_url: item.image_url || '',
      badge: item.badge || '',
      price: item.price || '',
      variants: (item.variants || []).map((variant, variantIndex) => ({
        name: variant.name || '',
        price: variant.price || '',
        is_default: variant.is_default ?? false,
        placement_order: variant.placement_order ?? variantIndex,
      })),
      placement_order: item.placement_order ?? index,
      is_available: item.is_available ?? true,
      is_featured: item.is_featured ?? false,
    })),
  };
}

interface ParsedMenuCategory {
  name: string;
  description?: string | null;
  items?: ParsedMenuItem[];
}

interface ParsedMenuItem {
  name: string;
  description?: string | null;
  price?: string | null;
  badge?: string | null;
  variants?:
    | {
        name?: string | null;
        price?: string | null;
        is_default?: boolean | null;
      }[]
    | null;
}

interface ParsedMenuResponse {
  name?: string | null;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  website_url?: string | null;
  address?: string | null;
  city?: string | null;
  google_maps_url?: string | null;
  categories?: ParsedMenuCategory[];
}

export function mapParsedMenuToFormValues(
  source: ParsedMenuResponse,
  current?: MenuFormValues
): MenuFormValues {
  const baseHours = current?.business_hours ?? createDefaultBusinessHours();
  const baseSocials = current?.social_links ?? createDefaultSocialLinks();
  const baseGallery = current?.gallery_images ?? [];
  const layoutName = current?.layout_name ?? 'menu-default';
  const qrSettings = current?.qr_settings ?? {
    foreground_color: '#111111',
    background_color: '#ffffff',
    show_logo: false,
  };
  const displayPosterSettings = normalizeDisplayPosterSettings(
    current?.display_poster_settings,
    baseGallery.map((entry) => entry.image_url || '')
  );

  const categories = (source.categories || []).map((category, index) => ({
    id: undefined,
    client_key: createKey(index),
    name: category.name || '',
    description: category.description || '',
    image: null,
    image_url: '',
    placement_order: index,
    is_visible: true,
  }));

  const categoryKeyByIndex = new Map<number, string>();
  categories.forEach((category, index) => {
    categoryKeyByIndex.set(index, category.client_key);
  });

  const items = (source.categories || []).flatMap((category, categoryIndex) => {
    const itemsList = category.items || [];
    return itemsList.map((item, index) => ({
      id: undefined,
      category_id: undefined,
      category_key: categoryKeyByIndex.get(categoryIndex) || null,
      name: item.name || '',
      description: item.description || '',
      image: null,
      image_url: '',
      badge: item.badge || '',
      price: item.price || '',
      variants: (item.variants || []).map((variant, variantIndex) => ({
        name: variant.name || '',
        price: variant.price || '',
        is_default: variant.is_default ?? false,
        placement_order: variantIndex,
      })),
      placement_order: index,
      is_available: true,
      is_featured: false,
    }));
  });

  return {
    name: source.name || current?.name || '',
    description: source.description || current?.description || '',
    logo: current?.logo || null,
    logo_url: current?.logo_url || '',
    cover_image: current?.cover_image || null,
    cover_image_url: current?.cover_image_url || '',
    phone: source.phone || current?.phone || '',
    email: source.email || current?.email || '',
    website_url: source.website_url || current?.website_url || '',
    address: source.address || current?.address || '',
    city: source.city || current?.city || '',
    google_maps_url: source.google_maps_url || current?.google_maps_url || '',
    search_enabled: current?.search_enabled ?? true,
    hours_enabled: current?.hours_enabled ?? false,
    business_hours: baseHours,
    social_links: baseSocials,
    gallery_images: baseGallery,
    layout_name: layoutName,
    qr_settings: qrSettings,
    display_poster_settings: displayPosterSettings,
    display_poster_image_url: current?.display_poster_image_url || '',
    categories,
    items,
  };
}
