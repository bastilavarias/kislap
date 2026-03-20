import { useApi } from '@/lib/api';
import {
  APIResponseDashboardStats,
  APIResponsePageActivity,
  APIResponsePageVisit,
  APIResponsePaginationMeta,
  APIResponseTopLink,
} from '@/types/api-response';

const TRACKING_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api.kislap.app/api';

type TrackingPayload = {
  project_id: number;
  type: 'view' | 'click';
  page_url: string;
  model_name?: string;
  model_id?: number;
};

export function usePageActivity() {
  const { apiGet, apiPost } = useApi();

  const sendTrackingEvent = async (payload: TrackingPayload) => {
    const endpoint = `${TRACKING_API_BASE_URL}/page-activities`;
    const body = JSON.stringify(payload);

    if (typeof fetch !== 'undefined') {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body,
          keepalive: true,
          mode: 'cors',
        });

        if (response.ok) {
          return { success: true, status: response.status, message: 'Sent', data: null };
        }

        return {
          success: false,
          status: response.status,
          message: `Tracking failed with status ${response.status}`,
          data: null,
        };
      } catch (error) {
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
          const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
          const queued = navigator.sendBeacon(endpoint, blob);

          if (queued) {
            return { success: true, status: 200, message: 'Queued', data: null };
          }
        }

        return {
          success: false,
          status: 500,
          message: error instanceof Error ? error.message : 'Tracking failed',
          data: null,
        };
      }
    }

    return { success: false, status: 500, message: 'Tracking unavailable', data: null };
  };

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

  const getTopLinks = async (projectID: number, limit: number) => {
    return await apiGet<APIResponseTopLink[]>(
      `api/page-activities/${projectID}/top-links?limit=${limit}`
    );
  };

  const trackPageView = async (projectID: number) => {
    return await apiPost('api/page-activities', {
      project_id: projectID,
      type: 'view',
      page_url: '/',
    });
  };

  const trackPageProjectClick = async (projectID: number, showcaseID: number) => {
    return await sendTrackingEvent({
      project_id: projectID,
      type: 'click',
      page_url: '/',
      model_name: 'Showcase',
      model_id: showcaseID,
    });
  };

  const trackPageLinkClick = async (projectID: number, targetURL: string) => {
    return await sendTrackingEvent({
      project_id: projectID,
      type: 'click',
      page_url: targetURL,
    });
  };

  return {
    getOverview,
    getTopLinks,
    getVisits,
    getRecentActivities,
    trackPageView,
    trackPageProjectClick,
    trackPageLinkClick,
  };
}
