import { useApi } from '@/lib/api';

export type Portfolio = {
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

export function usePortfolio() {
  const { apiPost } = useApi();

  const create = async (form: any) => {
    return await apiPost<Portfolio>('api/portfolios', form);
  };

  return {
    create,
  };
}
