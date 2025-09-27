import { useApi } from '@/lib/api';
import { useFormData } from '../use-form-data';

export interface DocumentResume {
  name: string;
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

export function useDocument() {
  const { apiPost } = useApi();

  const parse = async (file: File, type: string) => {
    return await apiPost<DocumentResume>(
      'api/documents',
      useFormData({
        file,
        type,
      })
    );
  };

  return {
    parse,
  };
}
