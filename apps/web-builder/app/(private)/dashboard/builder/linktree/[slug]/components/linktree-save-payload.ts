import { LinktreeFormValues } from '@/lib/schemas/linktree';

type SaveContext = {
  projectID?: number;
  linktreeID?: number | null;
  userID?: number;
  theme: Record<string, unknown>;
  layout: string;
};

function buildOrderedContentItems(items: LinktreeFormValues['sections']) {
  return [...(items || [])];
}

export function buildLinktreeSaveFormData(data: LinktreeFormValues, context: SaveContext): FormData {
  const orderedContentItems = buildOrderedContentItems(data.sections || []);
  const links: Record<string, unknown>[] = [];
  const sections: Record<string, unknown>[] = [];

  orderedContentItems.forEach((item: any, index) => {
    if (item.type === 'link') {
      links.push({
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
        placement_order: index,
      });
      return;
    }

    sections.push({
      id: item.id,
      type: item.type,
      title: item.title || '',
      description: item.description || '',
      url: item.url || '',
      app_url: item.app_url || '',
      image_url: item.image_url || '',
      icon_key: item.icon_key || '',
      accent_color: item.accent_color || '',
      quote_text: item.quote_text || '',
      quote_author: item.quote_author || '',
      banner_text: item.banner_text || '',
      support_note: item.support_note || '',
      support_qr_image_url: item.support_qr_image_url || '',
      cta_label: item.cta_label || '',
      placement_order: index,
    });
  });

  const fullPayload = {
    project_id: context.projectID,
    linktree_id: context.linktreeID,
    user_id: context.userID,
    ...data,
    links,
    sections,
    theme: context.theme,
    layout_name: context.layout,
  };

  const formData = new FormData();
  const jsonPayload = JSON.parse(JSON.stringify(fullPayload));

  let linkIndex = 0;
  let sectionIndex = 0;
  orderedContentItems.forEach((item: any) => {
    if (item.type === 'link') {
      if (item.image instanceof File) {
        formData.append(`links[${linkIndex}].image`, item.image);
        if (jsonPayload.links?.[linkIndex]) {
          jsonPayload.links[linkIndex].image = null;
        }
      }
      if (item.support_qr_image instanceof File) {
        formData.append(`links[${linkIndex}].support_qr_image`, item.support_qr_image);
        if (jsonPayload.links?.[linkIndex]) {
          jsonPayload.links[linkIndex].support_qr_image = null;
        }
      }
      linkIndex += 1;
      return;
    }

    if (item.image instanceof File) {
      formData.append(`sections[${sectionIndex}].image`, item.image);
      if (jsonPayload.sections?.[sectionIndex]) {
        jsonPayload.sections[sectionIndex].image = null;
      }
    }

    if (item.support_qr_image instanceof File) {
      formData.append(`sections[${sectionIndex}].support_qr_image`, item.support_qr_image);
      if (jsonPayload.sections?.[sectionIndex]) {
        jsonPayload.sections[sectionIndex].support_qr_image = null;
      }
    }
    sectionIndex += 1;
  });

  if (data.logo instanceof File) {
    formData.append('logo', data.logo);
    jsonPayload.logo = null;
  }

  formData.append('json_body', JSON.stringify(jsonPayload));
  return formData;
}
