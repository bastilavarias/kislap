import { useApi } from '@/lib/api';
import { BizFormValues } from '@/lib/schemas/biz';
import { APIResponseBiz } from '@/types/api-response';

export function useBiz() {
  const { apiPost } = useApi();

  const create = async (form: BizFormValues) => {
    return await apiPost<APIResponseBiz>('api/biz', form);
  };

  return {
    create,
  };
}
