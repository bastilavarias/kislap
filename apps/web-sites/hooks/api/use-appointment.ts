import { useApi } from '@/lib/api';
import { APIResponseAppoinment } from '@/types/api-response';

export interface CreateAppointmentPayload {
  user_id: number;
  project_id: number;
  date?: string;
  time_from?: string;
  time_to?: string;
  name: string;
  email: string;
  contact_number?: string;
  message?: string;
}

export function useAppointment() {
  const { apiPost } = useApi();

  const create = async (payload: CreateAppointmentPayload) => {
    return await apiPost<APIResponseAppoinment>('api/appointments', payload);
  };

  return {
    create,
  };
}
