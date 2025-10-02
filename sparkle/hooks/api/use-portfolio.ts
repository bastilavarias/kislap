import { useApi } from '@/lib/api';
import { APIResponsePortfolio } from '@/types/api-response';

export function usePortfolio() {
  const { apiPost } = useApi();

  const create = async (form: any) => {
    return await apiPost<APIResponsePortfolio>('api/portfolios', form);
  };

  return {
    create,
  };
}
