import { MenuFormValues } from '@/lib/schemas/menu';
import { createDefaultBusinessHours, createDefaultSocialLinks } from '@/lib/menu-defaults';
import { APIResponseMenu } from '@/types/api-response';

function createKey(seed?: string | number) {
  return `category-${seed || Math.random().toString(36).slice(2, 10)}`;
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
    whatsapp: source.whatsapp || '',
    address: source.address || '',
    city: source.city || '',
    country: source.country || '',
    google_maps_url: source.google_maps_url || '',
    currency: source.currency || 'PHP',
    search_enabled: source.search_enabled ?? true,
    hours_enabled: source.hours_enabled ?? false,
    business_hours: businessHours,
    social_links: socialLinks,
    gallery_images: (source.gallery_images || []).map((imageURL) => ({
      image: null,
      image_url: imageURL || '',
    })),
    layout_name: source.layout_name || 'menu-default',
    qr_settings: {
      foreground_color: source.qr_settings?.foreground_color || '#111111',
      background_color: source.qr_settings?.background_color || '#ffffff',
      show_logo: source.qr_settings?.show_logo || false,
    },
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
      placement_order: item.placement_order ?? index,
      is_available: item.is_available ?? true,
      is_featured: item.is_featured ?? false,
    })),
  };
}
