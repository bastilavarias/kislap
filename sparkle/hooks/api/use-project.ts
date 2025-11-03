import { useApi } from '@/lib/api';
import { ProjectFormValues } from '@/lib/schemas/project';
import { APIResponseProject } from '@/types/api-response';

export function useProject() {
  const { apiPost, apiGet, apiPut } = useApi();

  const create = async (form: ProjectFormValues) => {
    return await apiPost<APIResponseProject>('api/projects', form);
  };

  const getBySlug = async (slug: string, level: string) => {
    return await apiGet<APIResponseProject>(`api/projects/show/slug/${slug}?level=${level}`);
  };

  const getList = async () => {
    return await apiGet<APIResponseProject[]>('api/projects/list');
  };

  const publish = async (id: number, isPublished: boolean) => {
    return await apiPut<APIResponseProject>(`api/projects/publish/${id}`, {
      published: isPublished,
    });
  };

  return {
    create,
    getBySlug,
    getList,
    publish,
  };
}
