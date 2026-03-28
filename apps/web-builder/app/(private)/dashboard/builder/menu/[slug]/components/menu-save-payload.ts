import { MenuFormValues } from '@/lib/schemas/menu';

interface BuildMenuSavePayloadContext {
  menuID?: number | null;
  projectID?: number;
  userID?: number;
  theme?: Record<string, unknown>;
  layout: string;
}

export function buildMenuSaveFormData(
  values: MenuFormValues,
  context: BuildMenuSavePayloadContext
) {
  const payload = {
    menu_id: context.menuID,
    project_id: context.projectID,
    user_id: context.userID,
    name: values.name,
    description: values.description || '',
    logo_url: values.logo ? null : values.logo_url || null,
    cover_image_url: values.cover_image ? null : values.cover_image_url || null,
    phone: values.phone || '',
    email: values.email || '',
    website_url: values.website_url || '',
    whatsapp: values.whatsapp || '',
    address: values.address || '',
    city: values.city || '',
    country: values.country || '',
    google_maps_url: values.google_maps_url || '',
    search_enabled: values.search_enabled,
    hours_enabled: values.hours_enabled,
    layout_name: context.layout,
    theme: { ...(context.theme || {}) },
    qr_settings: values.qr_settings,
    business_hours: values.business_hours,
    social_links: values.social_links.filter((link) => link.url?.trim()),
    gallery_images: values.gallery_images.map((image) => ({
      image_url: image.image ? null : image.image_url || null,
    })),
    categories: values.categories.map((category, index) => ({
      id: category.id || null,
      client_key: category.client_key,
      name: category.name,
      description: category.description || '',
      image_url: category.image ? null : category.image_url || null,
      placement_order: index,
      is_visible: category.is_visible,
    })),
    items: values.items.map((item, index) => ({
      id: item.id || null,
      category_id: item.category_id || null,
      category_key: item.category_key || null,
      name: item.name,
      description: item.description || '',
      image_url: item.image ? null : item.image_url || null,
      badge: item.badge || '',
      price: item.price,
      variants: item.variants.map((variant, variantIndex) => ({
        name: variant.name,
        price: variant.price,
        is_default: variant.is_default,
        placement_order: variantIndex,
      })),
      placement_order: index,
      is_available: item.is_available,
      is_featured: item.is_featured,
    })),
  };

  const formData = new FormData();
  if (values.logo instanceof File) formData.append('logo', values.logo);
  if (values.cover_image instanceof File) formData.append('cover_image', values.cover_image);

  values.categories.forEach((category, index) => {
    if (category.image instanceof File) {
      formData.append(`categories[${index}].image`, category.image);
    }
  });

  values.items.forEach((item, index) => {
    if (item.image instanceof File) {
      formData.append(`items[${index}].image`, item.image);
    }
  });

  values.gallery_images.forEach((image, index) => {
    if (image.image instanceof File) {
      formData.append(`gallery_images[${index}].image`, image.image);
    }
  });

  formData.append('json_body', JSON.stringify(payload));

  return formData;
}
