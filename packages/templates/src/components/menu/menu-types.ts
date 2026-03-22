export interface MenuCategory {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  is_visible?: boolean;
  placement_order?: number;
}

export interface MenuItem {
  id: number;
  menu_category_id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  badge?: string | null;
  price: string;
  is_available?: boolean;
  is_featured?: boolean;
  placement_order?: number;
}

export interface MenuBusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface MenuSocialLink {
  platform: string;
  url?: string | null;
}

export interface MenuData {
  project_id?: number;
  name?: string;
  description?: string;
  logo_url?: string | null;
  cover_image_url?: string | null;
  gallery_images?: string[] | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  website_url?: string | null;
  google_maps_url?: string | null;
  whatsapp?: string | null;
  currency?: string | null;
  search_enabled?: boolean;
  hours_enabled?: boolean;
  business_hours?: MenuBusinessHour[] | null;
  social_links?: MenuSocialLink[] | null;
  categories?: MenuCategory[];
  items?: MenuItem[];
}

export function formatPlatformLabel(platform: string) {
  switch (platform) {
    case 'google-reviews':
      return 'Google Reviews';
    case 'tripadvisor':
      return 'TripAdvisor';
    default:
      return platform
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
  }
}

export function formatHoursLabel(entry: MenuBusinessHour) {
  if (entry.closed) return 'Closed';
  return `${entry.open} - ${entry.close}`;
}

export function formatMenuLocation(menu: Pick<MenuData, 'address' | 'city' | 'country'>) {
  const parts = [menu.address, menu.city, menu.country]
    .map((value) => value?.trim())
    .filter(Boolean);

  return parts.join(', ');
}

export function formatMenuEyebrow(menu: Pick<MenuData, 'city' | 'country'>, categories: MenuCategory[] = []) {
  const visibleCategoryNames = categories
    .filter((category) => category.is_visible !== false)
    .map((category) => category.name?.trim())
    .filter(Boolean)
    .slice(0, 2) as string[];

  if (visibleCategoryNames.length) {
    return visibleCategoryNames.join(' • ');
  }

  const location = [menu.city?.trim(), menu.country?.trim()].filter(Boolean).join(', ');
  return location || 'Restaurant Menu';
}
