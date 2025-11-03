import { useApi } from '@/lib/api';
import { PortfolioFormValues } from '@/lib/schemas/portfolio';
import { APIResponsePortfolio } from '@/types/api-response';

export function usePortfolio() {
  const { apiPost } = useApi();

  const create = async (form: PortfolioFormValues) => {
    return await apiPost<APIResponsePortfolio>('api/portfolios', form);
  };

  return {
    create,
  };
}
