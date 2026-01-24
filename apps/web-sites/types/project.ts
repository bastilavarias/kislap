import { Portfolio } from './portfolio';

export interface Project {
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

  portfolio: Portfolio;
  biz: any; // Create a type here
}
