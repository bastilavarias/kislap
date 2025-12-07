import { useApi } from '@/lib/api';
import { APIResponseAppoinment, APIResponsePaginationMeta } from '@/types/api-response';

export function useAppointment() {
  const { apiGet } = useApi();

  const list = async (page: number, perPage: number, projectID: number) => {
    return await apiGet<{ data: APIResponseAppoinment[]; meta: APIResponsePaginationMeta }>(
      `api/appointments?page=${page}&per_page=${perPage}&project_id=${projectID}`
    );
  };

  return {
    list,
  };
}
