import { useApi } from '@/lib/api';
import { APIResponsePageActivityTrack } from '@/types/api-response';

export function usePageActivity() {
  const { apiPost } = useApi();

  const trackPageView = async (projectID: number, type: string = 'view', pageURL: string = '/') => {
    return await apiPost<APIResponsePageActivityTrack>('api/page-activities', {
      project_id: projectID,
      type,
      page_url: pageURL,
    });
  };

  return {
    trackPageView,
  };
}
