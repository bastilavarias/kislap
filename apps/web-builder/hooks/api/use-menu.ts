'use client';

import { useApi } from '@/lib/api';
import { APIResponseMenu } from '@/types/api-response';

export function useMenu() {
  const { apiPost } = useApi();

  const create = async (form: FormData) => {
    return await apiPost<APIResponseMenu>('api/menu', form);
  };

  return {
    create,
  };
}
