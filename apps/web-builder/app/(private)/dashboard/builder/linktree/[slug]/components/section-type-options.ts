import type { SectionType } from './sections-editor-fields';

export const SECTION_TYPES: Array<{ id: SectionType; label: string }> = [
  { id: 'link', label: 'Link' },
  { id: 'promo', label: 'Promo Card' },
  { id: 'support', label: 'Support Card' },
  { id: 'quote', label: 'Quote Card' },
  { id: 'banner', label: 'Banner Card' },
  { id: 'text', label: 'Text / About' },
  { id: 'project', label: 'Project' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
];

export function typeLabel(type?: string) {
  return SECTION_TYPES.find((item) => item.id === type)?.label || 'Section';
}
