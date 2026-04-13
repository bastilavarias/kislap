'use client';

import { useApi } from '@/lib/api';
import { APIResponseMenu, APIResponseMenuDisplayPosterSettings } from '@/types/api-response';

interface GenerateDisplayPosterPayload {
  menu_id?: number | null;
  project_id?: number;
  menu_url: string;
  name: string;
  phone?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  gallery_images?: string[];
  address?: string | null;
  city?: string | null;
  website_url?: string | null;
  theme?: Record<string, unknown> | null;
  qr_settings?: {
    foreground_color?: string;
    background_color?: string;
    show_logo?: boolean;
  } | null;
  display_poster_settings: APIResponseMenuDisplayPosterSettings;
}

interface GenerateDisplayPosterResponse {
  image_url: string;
  display_poster_settings: APIResponseMenuDisplayPosterSettings;
}

export function useMenu() {
  const { apiPost } = useApi();

  const create = async (form: FormData) => {
    return await apiPost<APIResponseMenu>('api/menu', form);
  };

  const generateDisplayPoster = async (payload: GenerateDisplayPosterPayload) => {
    return await apiPost<GenerateDisplayPosterResponse>('api/menu/display-poster', payload);
  };

  return {
    create,
    generateDisplayPoster,
  };
}
