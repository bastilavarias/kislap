import { User } from './user';

export interface Portfolio {
  id: number;
  name: string;
  location: string | null;
  job_title: string | null;
  introduction: string | null;
  about: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  theme_object: string;
  layout_name: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  user: User;

  work_experiences: {
    id: number;
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    about: string;
  }[];

  education: {
    id: number;
    school: string;
    level: string;
    degree: string;
    location: string;
    about: string;
    year_start: string;
    year_end: string;
  }[];

  showcases: {
    id: number;
    name: string;
    description: string;
    role: string;
    url: string;
    technologies: { id: number; name: string }[];
  }[];

  skills: { id: number; name: string }[];
}
