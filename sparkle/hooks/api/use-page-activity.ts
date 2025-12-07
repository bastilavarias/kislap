import { useApi } from '@/lib/api';
import {
  APIResponseDashboardStats,
  APIResponsePageActivity,
  APIResponsePageVisit,
  APIResponsePaginationMeta,
} from '@/types/api-response';

export function usePageActivity() {
  const { apiGet } = useApi();

  const getOverview = async (projectID: number) => {
    return await apiGet<APIResponseDashboardStats>(
      `api/page-activities/${projectID}?page=1&limit=1`
    );
  };

  const getVisits = async (page: number, limit: number, projectID: number) => {
    return await apiGet<{ data: APIResponsePageVisit[]; meta: APIResponsePaginationMeta }>(
      `api/page-activities/${projectID}/visits?page=${page}&limit=${limit}`
    );
  };

  const getRecentActivities = async (page: number, limit: number, projectID: number) => {
    return await apiGet<{ data: APIResponsePageActivity[]; meta: APIResponsePaginationMeta }>(
      `api/page-activities/${projectID}/recent-activities?page=${page}&limit=${limit}`
    );
  };

  return {
    getOverview,
    getVisits,
    getRecentActivities,
  };
}
