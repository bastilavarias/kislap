import { useApi } from '@/lib/api';
import { APIResponsePortfolio } from '@/types/api-response';

export function usePortfolio() {
  const { apiPost } = useApi();

  const create = async (form: FormData) => {
    return await apiPost<APIResponsePortfolio>('api/portfolios', form);
  };

  return {
    create,
  };
}
