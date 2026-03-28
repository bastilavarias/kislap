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
  variants?: {
    name: string;
    price: string;
    is_default: boolean;
    placement_order: number;
  }[] | null;
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

export interface MenuQRSettings {
  foreground_color?: string | null;
  background_color?: string | null;
  show_logo?: boolean;
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
  city?: string | null;
  website_url?: string | null;
  google_maps_url?: string | null;
  qr_settings?: MenuQRSettings | null;
  search_enabled?: boolean;
  hours_enabled?: boolean;
  business_hours?: MenuBusinessHour[] | null;
  social_links?: MenuSocialLink[] | null;
  categories?: MenuCategory[];
  items?: MenuItem[];
}

export function formatPlatformLabel(platform: string) {
  return platform
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatHoursLabel(entry: MenuBusinessHour) {
  if (entry.closed) return 'Closed';

  const toTwelveHour = (value: string) => {
    const trimmed = value.trim();
    const normalized = trimmed.toUpperCase();

    if (/(AM|PM)/.test(normalized)) {
      return normalized.replace(/\s+/g, '');
    }

    const match = normalized.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return trimmed;

    const hours = Number(match[1]);
    const minutes = match[2];
    const period = hours >= 12 ? 'PM' : 'AM';
    const normalizedHours = hours % 12 || 12;

    return `${normalizedHours}:${minutes} ${period}`;
  };

  return `${toTwelveHour(entry.open)} - ${toTwelveHour(entry.close)}`;
}

export function formatMenuLocation(menu: Pick<MenuData, 'address' | 'city'>) {
  const parts = [menu.address, menu.city]
    .map((value) => value?.trim())
    .filter(Boolean);

  return parts.join(', ');
}

export function formatMenuEyebrow(menu: Pick<MenuData, 'city'>, categories: MenuCategory[] = []) {
  const visibleCategoryNames = categories
    .filter((category) => category.is_visible !== false)
    .map((category) => category.name?.trim())
    .filter(Boolean)
    .slice(0, 2) as string[];

  if (visibleCategoryNames.length) {
    return visibleCategoryNames.join(' / ');
  }

  const location = [menu.city?.trim()].filter(Boolean).join(', ');
  return location || 'Restaurant Menu';
}
