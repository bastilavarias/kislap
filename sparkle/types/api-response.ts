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
  type: 'portfolio' | 'biz' | 'links' | 'waitlist';
  published: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  portfolio: APIResponsePortfolio;
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
