export interface APIResponsePaginationMeta {
  last_page: number;
  limit: number;
  page: number;
  total: number;
}

export interface APIResponseDocumentResume {
  name: string;
  location: string;
  job_title: string;
  introduction: string;
  about: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  work_experiences: {
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string | null;
    about: string | null;
  }[];
  education: {
    school: string;
    level: string | null;
    degree: string | null;
    location: string | null;
    year_start: number | null;
    year_end: number | null;
    about: string | null;
  }[];
  skills: {
    name: string;
    url: string | null;
  }[];
  showcases: {
    name: string;
    description: string;
    role: string;
    technologies: {
      name: string;
    }[];
  }[];
}

interface APIResponseThemeStyles {
  card: string;
  ring: string;
  input: string;
  muted: string;
  accent: string;
  border: string;
  radius: string;
  'chart-1': string;
  'chart-2': string;
  'chart-3': string;
  'chart-4': string;
  'chart-5': string;
  popover: string;
  primary: string;
  sidebar: string;
  spacing: string;
  'font-mono': string;
  'font-sans': string;
  secondary: string;
  background: string;
  'font-serif': string;
  foreground: string;
  destructive: string;
  'shadow-blur': string;
  'shadow-color': string;
  'sidebar-ring': string;
  'shadow-spread': string;
  'letter-spacing': string;
  'shadow-opacity': string;
  'sidebar-accent': string;
  'sidebar-border': string;
  'card-foreground': string;
  'shadow-offset-x': string;
  'shadow-offset-y': string;
  'sidebar-primary': string;
  'muted-foreground': string;
  'accent-foreground': string;
  'popover-foreground': string;
  'primary-foreground': string;
  'sidebar-foreground': string;
  'secondary-foreground': string;
  'sidebar-accent-foreground': string;
  'sidebar-primary-foreground': string;
}

interface APIResponseThemeObject {
  preset: string;
  styles: {
    dark: APIResponseThemeStyles;
    light: APIResponseThemeStyles;
  };
}

interface APIResponseUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface APIResponseWorkExperience {
  id: number;
  portfolio_id: number;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  about: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface APIResponseEducation {
  id: number;
  portfolio_id: number;
  school: string;
  level: string;
  degree: string;
  location: string;
  about: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface APIResponseShowcase {
  id: number;
  portfolio_id: number;
  name: string;
  description: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface APIResponseSkill {
  id: number;
  portfolio_id: number;
  name: string;
  url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface APIResponsePortfolio {
  id: number;
  project_id: number;
  user_id: number;
  name: string;
  location: string | null;
  job_title: string | null;
  introduction: string;
  about: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  theme_name: string;
  theme_object: APIResponseThemeObject;
  layout_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: APIResponseUser;
  project: APIResponseProject;
  work_experiences: APIResponseWorkExperience[];
  education: APIResponseEducation[];
  showcases: APIResponseShowcase[];
  skills: APIResponseSkill[];
}

export interface APIResponseProject {
  id: number;
  name: string;
  description?: string;
  slug: string;
  sub_domain?: string | null;
  type: 'portfolio' | 'biz' | 'linktree' | 'menu' | 'waitlist';
  published: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  portfolio: APIResponsePortfolio;
  linktree?: APIResponseLinktree;
  biz?: APIResponseBiz;
  menu?: APIResponseMenu;
}
export interface APIResponseAppoinment {
  id: number;
  name: string;
  email: string;
  message: string | null;
  contact_number: string | null;
  date: string;
  time_from: string;
  time_to: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface APIResponsePageActivity {
  type: string;
  page_url: string;
  ip_address: string;
  model: Record<string, any> | null;
  created_at: string;
}

export interface APIResponsePageVisit {
  ip_address: string;
  created_at: string;
}

export interface APIResponseDashboardStats {
  total_views: number;
  total_clicks: number;
  unique_visitors: number;
}

export interface APIResponseTopLink {
  page_url: string;
  click_count: number;
  last_clicked_at: string;
}

export interface APIResponseBizSocialLink {
  id: number;
  biz_id: number;
  platform: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface APIResponseBizService {
  id: number;
  biz_id: number;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number | null;
  image: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface APIResponseBizProductImage {
  id: number;
  product_id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface APIResponseBizGallery {
  id: number;
  biz_id: number;
  image_url: string | null;
  placement_order: number;
  created_at: string;
  updated_at: string;
}

export interface APIResponseBizFAQ {
  id: number;
  biz_id: number;
  question: string;
  answer: string;
  placement_order: number;
  created_at: string;
  updated_at: string;
}

export interface APIResponseBizProduct {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  price: number;
  stock: number;
  is_active: boolean;
  image_url: string | null;
  placement_order: number;
  created_at: string;
  updated_at: string;
}
export interface APIResponseBizTestimonial {
  id: number;
  biz_id: number;
  author: string;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface APIResponseBiz {
  id: number;
  project_id: number;
  user_id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  logo_url?: string | null;
  hero_image: string | null;
  hero_image_url?: string | null;
  hero_title: string | null;
  hero_description: string | null;
  about_image_url: string | null;
  type: string | null;
  industry: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  map_link: string | null;
  schedule: string | null;
  operation_hours: string | null;
  services_enabled: boolean;
  products_enabled: boolean;
  booking_enabled: boolean;
  ordering_enabled: boolean;
  theme_name: string | null;
  theme_object: APIResponseThemeObject;
  layout_name: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user?: APIResponseUser;
  project?: APIResponseProject;
  social_links: APIResponseBizSocialLink[];
  services: APIResponseBizService[];
  products: APIResponseBizProduct[];
  testimonials: APIResponseBizTestimonial[];
  biz_gallery: APIResponseBizGallery[];
  biz_faqs: APIResponseBizFAQ[];
}

export interface APIResponseLinktreeLink {
  id: number;
  linktree_id: number;
  type?: 'link' | 'promo' | 'support' | 'quote' | 'banner';
  title: string;
  url: string;
  description?: string;
  app_url?: string;
  image_url?: string;
  icon_key?: string;
  accent_color?: string;
  quote_text?: string;
  quote_author?: string;
  banner_text?: string;
  support_note?: string;
  support_qr_image_url?: string;
  cta_label?: string;
  placement_order: number;
}

export interface APIResponseLinktreeSocialLink {
  id: number;
  linktree_id: number;
  platform: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface APIResponseLinktreeSection {
  id: number;
  linktree_id: number;
  type: 'promo' | 'support' | 'quote' | 'banner';
  title?: string;
  description?: string;
  url?: string;
  app_url?: string;
  image_url?: string;
  icon_key?: string;
  accent_color?: string;
  quote_text?: string;
  quote_author?: string;
  banner_text?: string;
  support_note?: string;
  support_qr_image_url?: string;
  cta_label?: string;
  placement_order: number;
}

export interface APIResponseLinktree {
  id: number;
  project_id: number;
  user_id: number;
  name: string;
  tagline?: string;
  about?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  background_style?: 'plain' | 'grid';
  theme_object: APIResponseThemeObject;
  layout_name?: string;
  links: APIResponseLinktreeLink[];
  sections: APIResponseLinktreeSection[];
  user?: APIResponseUser;
  project?: APIResponseProject;
}

export interface APIResponseMenuQRSettings {
  foreground_color?: string;
  background_color?: string;
  show_logo?: boolean;
}

export interface APIResponseMenuBusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface APIResponseMenuSocialLink {
  platform: string;
  url?: string | null;
}

export interface APIResponseMenuCategory {
  id: number;
  menu_id: number;
  client_key: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  placement_order: number;
  is_visible: boolean;
}

export interface APIResponseMenuItem {
  id: number;
  menu_id: number;
  menu_category_id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  badge?: string | null;
  price: string;
  placement_order: number;
  is_available: boolean;
  is_featured: boolean;
}

export interface APIResponseMenu {
  id: number;
  project_id: number;
  user_id: number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  phone?: string | null;
  email?: string | null;
  website_url?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  google_maps_url?: string | null;
  currency?: string | null;
  layout_name?: string | null;
  theme_name?: string | null;
  theme_object: APIResponseThemeObject;
  qr_settings?: APIResponseMenuQRSettings | null;
  search_enabled: boolean;
  hours_enabled: boolean;
  business_hours?: APIResponseMenuBusinessHour[] | null;
  social_links?: APIResponseMenuSocialLink[] | null;
  gallery_images?: string[] | null;
  categories: APIResponseMenuCategory[];
  items: APIResponseMenuItem[];
  user?: APIResponseUser;
  project?: APIResponseProject;
}
