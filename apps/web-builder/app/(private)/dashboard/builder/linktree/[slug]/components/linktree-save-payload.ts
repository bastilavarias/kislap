import { LinktreeFormValues } from '@/lib/schemas/linktree';

type SaveContext = {
  projectID?: number;
  linktreeID?: number | null;
  userID?: number;
  theme: Record<string, unknown>;
  layout: string;
};

const DEFAULT_LAYOUT = { width: 'auto', align: 'left' };
const DEFAULT_STYLE = { variant: 'default', padding: 'normal' };

function buildOrderedContentItems(items: LinktreeFormValues['sections']) {
  return [...(items || [])];
}

function serializeItem(item: any, index: number) {
  return {
    id: item.id,
    type: item.type,
    title: item.title || '',
    url: item.url || '',
    app_url: item.app_url || '',
    description: item.description || '',
    image_url: item.image_url || '',
    icon_key: item.icon_key || '',
    accent_color: item.accent_color || '',
    quote_text: item.quote_text || '',
    quote_author: item.quote_author || '',
    banner_text: item.banner_text || '',
    support_note: item.support_note || '',
    support_qr_image_url: item.support_qr_image_url || '',
    cta_label: item.cta_label || '',
    content_json: item.content || null,
    layout_json: item.layout || DEFAULT_LAYOUT,
    style_json: item.style || DEFAULT_STYLE,
    placement_order: index,
  };
}

export function buildLinktreeSaveFormData(data: LinktreeFormValues, context: SaveContext): FormData {
  const orderedContentItems = buildOrderedContentItems(data.sections || []);

  // Persist every Page block through one API item path. The API splits link vs non-link
  // blocks back into response collections by type, so layout/style metadata follows
  // the same proven save path for every block kind.
  const links = orderedContentItems.map(serializeItem);

  const fullPayload = {
    project_id: context.projectID,
    linktree_id: context.linktreeID,
    user_id: context.userID,
    ...data,
    links,
    sections: [],
    theme: context.theme,
    layout_name: context.layout,
  };

  const formData = new FormData();
  const jsonPayload = JSON.parse(JSON.stringify(fullPayload));

  orderedContentItems.forEach((item: any, index) => {
    if (item.image instanceof File) {
      formData.append(`links[${index}].image`, item.image);
      if (jsonPayload.links?.[index]) {
        jsonPayload.links[index].image = null;
      }
    }

    if (item.support_qr_image instanceof File) {
      formData.append(`links[${index}].support_qr_image`, item.support_qr_image);
      if (jsonPayload.links?.[index]) {
        jsonPayload.links[index].support_qr_image = null;
      }
    }
  });

  if (data.logo instanceof File) {
    formData.append('logo', data.logo);
    jsonPayload.logo = null;
  }

  formData.append('json_body', JSON.stringify(jsonPayload));
  return formData;
}
