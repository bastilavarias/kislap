export const MENU_HOUR_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const MENU_SOCIAL_PLATFORMS = ['instagram', 'facebook', 'tiktok', 'website'] as const;

export interface DefaultDisplayPosterSettings {
  template: 'clean' | 'brand';
  size: 'a6';
  color_mode: 'light' | 'dark';
  headline: string;
  subtext: string;
  footer_note: string;
  preferred_images: string[];
  show_logo: boolean;
  show_address: boolean;
  show_url: boolean;
}

export function createDefaultBusinessHours() {
  return MENU_HOUR_DAYS.map((day) => ({
    day,
    open: '09:00',
    close: '18:00',
    closed: false,
  }));
}

export function createDefaultSocialLinks() {
  return MENU_SOCIAL_PLATFORMS.map((platform) => ({
    platform,
    url: '',
  }));
}

export function createDefaultDisplayPosterSettings(): DefaultDisplayPosterSettings {
  return {
    template: 'clean',
    size: 'a6',
    color_mode: 'light',
    headline: '',
    subtext: '',
    footer_note: '',
    preferred_images: [],
    show_logo: true,
    show_address: false,
    show_url: true,
  };
}
