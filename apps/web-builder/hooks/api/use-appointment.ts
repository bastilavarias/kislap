import { useApi } from '@/lib/api';
import { APIResponseAppoinment, APIResponsePaginationMeta } from '@/types/api-response';

export interface CreateAppointmentPayload {
  user_id: number;
  project_id: number;
  name: string;
  email: string;
  contact_number?: string;
  message?: string;
}

export function useAppointment() {
  const { apiGet, apiPost } = useApi();

  const list = async (page: number, perPage: number, projectID: number) => {
    return await apiGet<{ data: APIResponseAppoinment[]; meta: APIResponsePaginationMeta }>(
      `api/appointments?page=${page}&per_page=${perPage}&project_id=${projectID}`
    );
  };

  const create = async (payload: CreateAppointmentPayload) => {
    return await apiPost<APIResponseAppoinment, CreateAppointmentPayload>('api/appointments', payload);
  };

  return {
    list,
    create,
  };
}
