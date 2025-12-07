import { useApi } from '@/lib/api';
import { APIResponseDashboardStats, APIResponsePaginationMeta } from '@/types/api-response';

export function usePageActivity() {
  const { apiGet } = useApi();

  const getOverview = async (projectID: number) => {
    return await apiGet<{ data: APIResponseDashboardStats; meta: APIResponsePaginationMeta }>(
      `api/page-activities/${projectID}?page=1&limit=1`
    );
  };

  const getTopPages = async (page: number, limit: number, projectID: number) => {
    return await apiGet<{ data: APIResponseDashboardStats; meta: APIResponsePaginationMeta }>(
      `api/page-activities/${projectID}/top-pages?page=${page}&limit=${limit}`
    );
  };

  const getRecentActivities = async (page: number, limit: number, projectID: number) => {
    return await apiGet<{ data: APIResponseDashboardStats; meta: APIResponsePaginationMeta }>(
      `api/page-activities/${projectID}/recent-activities?page=${page}&limit=${limit}`
    );
  };

  return {
    getOverview,
    getTopPages,
    getRecentActivities,
  };
}
