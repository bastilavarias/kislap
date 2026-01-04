import { useApi } from '@/lib/api';
import { useFormData } from '../use-form-data';
import { APIResponseDocumentResume } from '@/types/api-response';

export function useDocument() {
  const { apiPost } = useApi();

  const parse = async (file: File, type: string) => {
    return await apiPost<APIResponseDocumentResume>(
      'api/documents',
      useFormData({
        file,
        type,
      })
    );
  };

  return {
    parse,
  };
}
