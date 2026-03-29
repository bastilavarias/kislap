import { Portfolio } from './portfolio';

export interface Project {
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

  portfolio: Portfolio;
}
