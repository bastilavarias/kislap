import { APIResponseProject } from '@/types/api-response';
import { MenuFormValues } from '@/lib/schemas/menu';

export function buildMenuPreviewData(values: MenuFormValues, project: APIResponseProject | null) {
  return {
    id: project?.menu?.id || 0,
    project_id: project?.id,
    user_id: project?.menu?.user_id || 0,
    name: values.name || '',
    description: values.description || '',
    logo_url: values.logo_url || '',
    cover_image_url: values.cover_image_url || '',
    phone: values.phone || '',
    email: values.email || '',
    website_url: values.website_url || '',
    whatsapp: values.whatsapp || '',
    address: values.address || '',
    city: values.city || '',
    country: values.country || '',
    google_maps_url: values.google_maps_url || '',
    currency: values.currency || 'PHP',
    layout_name: values.layout_name || 'menu-default',
    theme_object: project?.menu?.theme_object,
    qr_settings: values.qr_settings,
    search_enabled: values.search_enabled,
    hours_enabled: values.hours_enabled,
    business_hours: values.business_hours || [],
    social_links: (values.social_links || []).filter((item) => item.platform),
    categories: (values.categories || [])
      .slice()
      .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0))
      .map((category, index) => ({
        id: category.id || index + 1,
        menu_id: project?.menu?.id || 0,
        client_key: category.client_key,
        name: category.name || '',
        description: category.description || '',
        image_url: category.image_url || '',
        placement_order: category.placement_order ?? index,
        is_visible: category.is_visible ?? true,
      })),
    items: (values.items || [])
      .slice()
      .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0))
      .map((item, index) => ({
        id: item.id || index + 1,
        menu_id: project?.menu?.id || 0,
        menu_category_id: item.category_id || 0,
        name: item.name || '',
        description: item.description || '',
        image_url: item.image_url || '',
        badge: item.badge || '',
        price: item.price || '',
        placement_order: item.placement_order ?? index,
        is_available: item.is_available ?? true,
        is_featured: item.is_featured ?? false,
      })),
  };
}
