import { LinktreeFormValues } from '@/lib/schemas/linktree';
import { APIResponseLinktree } from '@/types/api-response';

export function mapToFormValues(source: APIResponseLinktree): LinktreeFormValues {
  const mappedLinks = (source.links || []).map((socialLink: any) => ({
    id: socialLink.id || null,
    type: 'link' as const,
    title: socialLink.title || '',
    description: socialLink.description || '',
    url: socialLink.url || '',
    image_url: socialLink.image_url || '',
    icon_key: socialLink.icon_key || '',
    placement_order: socialLink.placement_order ?? 0,
  }));

  const mappedSections = (source.sections || []).map((section: any) => ({
    id: section.id || null,
    type: section.type || 'promo',
    title: section.title || '',
    description: section.description || '',
    url: section.url || '',
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
    placement_order: section.placement_order ?? 0,
  }));

  return {
    name: source.name || '',
    tagline: source.tagline || '',
    about: source.about || '',
    phone: source.phone || '',
    email: source.email || '',
    logo_url: source.logo_url || '',
    layout_name: source.layout_name ?? 'default-linktree',
    background_style: source.background_style ?? 'grid',
    sections: [...mappedLinks, ...mappedSections]
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map(({ placement_order, ...item }: any) => item),
  };
}
