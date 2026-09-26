'use client';

import { useApi } from '@/lib/api';
import { LinktreeFormValues } from '@/lib/schemas/linktree';
import { APIResponseLinktree } from '@/types/api-response';

export function useLinktree() {
  const { apiPost } = useApi();

  const create = async (form: LinktreeFormValues) => {
    return await apiPost<{ linktree: APIResponseLinktree }>('api/linktree', form);
  };

  return {
    create,
  };
}
