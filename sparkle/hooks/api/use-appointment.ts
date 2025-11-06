import { useApi } from '@/lib/api';
import { AppointmentFormValues } from '@/lib/schemas/appointment';
import { APIResponseAppoinment } from '@/types/api-response';

export function useAppointment() {
  const { apiPost } = useApi();

  const create = async (form: AppointmentFormValues) => {
    return await apiPost<APIResponseAppoinment>('api/appointments', form);
  };

  return {
    create,
  };
}
