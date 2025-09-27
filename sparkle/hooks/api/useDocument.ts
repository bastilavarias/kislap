import { useApi } from '@/lib/api';

export type Document = {
  id: number;
  name: string;
  description?: string;
  slug: string;
  sub_domain?: string | null;
  type: 'portfolio' | 'biz' | 'links' | 'waitlist';
  layout: string;
  theme_name: string;
  theme_object: object;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export function useDocument() {
  const { apiPost } = useApi();

  const parse = async (file: File, type: string) => {
    return await apiPost<Document>('api/document', {
      file,
      type,
    });
  };

  return {
    parse,
  };
}
