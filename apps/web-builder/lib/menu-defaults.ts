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

export function createDefaultDisplayPosterSettings() {
  return {
    template: 'clean',
    size: 'a6',
    color_mode: 'light',
    headline: 'Scan to view our menu',
    subtext: 'Browse our latest dishes, drinks, and prices on your phone.',
    footer_note: 'Updated live for dine-in and takeaway.',
    show_logo: true,
    show_address: false,
    show_url: true,
  };
}
