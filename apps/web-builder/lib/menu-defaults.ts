export const MENU_HOUR_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const MENU_SOCIAL_PLATFORMS = [
  'instagram',
  'facebook',
  'tiktok',
  'tripadvisor',
  'google-reviews',
  'website',
] as const;

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
