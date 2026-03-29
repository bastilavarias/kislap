import { useApi } from '@/lib/api';
import { APIResponseParsedFile, APIResponseParsedFilesList } from '@/types/api-response';

interface ListParams {
  projectType: string;
  page?: number;
  limit?: number;
}

interface CreateParams {
  projectType: string;
  sourceType: string;
  files: File[];
}

export function useParsedFiles() {
  const { apiGet, apiPost } = useApi();

  const list = async ({ projectType, page = 1, limit = 10 }: ListParams) => {
    return await apiGet<APIResponseParsedFilesList>(
      `api/parsed-files?project_type=${projectType}&page=${page}&limit=${limit}`
    );
  };

  const create = async ({ projectType, sourceType, files }: CreateParams) => {
    const form = new FormData();
    form.append('project_type', projectType);
    form.append('source_type', sourceType);
    files.forEach((file) => form.append('files', file));

    return await apiPost<APIResponseParsedFile>('api/parsed-files', form);
  };

  return { list, create };
}
