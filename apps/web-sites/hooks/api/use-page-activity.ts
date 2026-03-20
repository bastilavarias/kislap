import { useApi } from '@/lib/api';
import { APIResponsePageActivityTrack } from '@/types/api-response';

export function usePageActivity() {
  const { apiPost } = useApi();

  const trackPageView = async (projectID: number, type: string = 'view') => {
    return await apiPost<APIResponsePageActivityTrack>('api/page-activities', {
      project_id: projectID,
      type: 'view',
      page_url: '/',
    });
  };

  const trackPageProjectClick = async (projectID: number, showcaseID: number) => {
    return await apiPost<APIResponsePageActivityTrack>('api/page-activities', {
      project_id: projectID,
      type: 'click',
      page_url: '/',
      model_name: 'Showcase',
      model_id: showcaseID,
    });
  };

  return {
    trackPageView,
    trackPageProjectClick,
  };
}
