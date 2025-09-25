import { APIResponse, useApi } from '@/lib/api';
import { AuthLoginData, AuthUser } from '@/hooks/api/useAuth';

export type Project = {
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

export function useProject() {
  const { apiPost } = useApi();

  const create = async (name: string, description: string, sub_domain: string, type: string) => {
    return await apiPost<APIResponse<Project>>('api/project', {
      name,
      description,
      sub_domain,
      type,
    });
  };

  return {
    create,
  };
}
