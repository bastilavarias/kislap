'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useForm, UseFormReturn, useFieldArray, UseFieldArrayReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PortfolioFormValues, PortfolioSchema } from '@/lib/schemas/portfolio';
import { useProject } from '@/hooks/api/use-project';
import { usePortfolio } from '@/hooks/api/use-portfolio';
import { useDocument } from '@/hooks/api/use-document';
import {
  APIResponseDocumentResume,
  APIResponsePortfolio,
  APIResponseProject,
} from '@/types/api-response';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { AuthUser, useAuth } from '@/hooks/api/use-auth';
import { useAuthContext } from '@/contexts/auth-context';

interface PortfolioContextType {
  project: APIResponseProject | null;
  formMethods: UseFormReturn<PortfolioFormValues>;
  layout: string;
  setLayout: React.Dispatch<React.SetStateAction<string>>;

  workFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'work_experiences', 'id'>;
  educationFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'education', 'id'>;
  showcaseFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'showcases', 'id'>;
  skillFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'skills', 'id'>;

  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;

  save: () => Promise<void>;
  publish: (isPublished: boolean) => Promise<void>;

  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isFileUploadDialogOpen: boolean;
  setIsFileUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFileProcessing: boolean;
  fileProcessingError: string;
  processResumeFile: () => Promise<void>;

  // Handlers for Form
  onAddWorkExperience: () => void;
  onAddEducation: () => void;
  onAddShowcase: () => void;
  onAddTechnologyToShowcase: (index: number, name: string) => void;
  onRemoveTechnologyFromShowcase: (showcaseIndex: number, technologyIndex: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Helper to map API data to Form
function mapToFormValues(
  source: APIResponseDocumentResume | APIResponsePortfolio
): PortfolioFormValues {
  return {
    name: source.name || '',
    job_title: source.job_title || '',
    location: source.location || '',
    introduction: source.introduction || '',
    about: source.about || '',
    email: source.email || '',
    phone: source.phone || '',
    website: source.website || '',
    github: source.github || '',
    linkedin: source.linkedin || '',
    twitter: source.twitter || '',
    work_experiences: (source.work_experiences || []).map((work: any) => ({
      company: work.company || '',
      role: work.role || '',
      location: work.location || '',
      startDate: work.start_date || null,
      endDate: work.end_date || null,
      about: work.about || '',
      url: work.url || '',
    })),
    education: (source.education || []).map((education: any) => ({
      school: education.school,
      level: education.level || '',
      degree: education.degree || '',
      location: education.location || '',
      yearStart: education.year_start || null,
      yearEnd: education.year_end || null,
      about: education.about || '',
    })),
    showcases: (source.showcases || []).map((showcase: any) => ({
      name: showcase.name,
      description: showcase.description || '',
      role: showcase.role || '',
      technologies: showcase.technologies || [],
      url: showcase.url || '',
    })),
    skills: (source.skills || []).map((skill: { name: string }) => ({ name: skill.name })),
  };
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const [project, setProject] = useState<APIResponseProject | null>(null);
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);
  const [layout, setLayout] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileProcessingError, setFileProcessingError] = useState('');

  const { authUser } = useAuthContext();
  const { getBySlug, publish: apiPublish } = useProject();
  const { create } = usePortfolio();
  const { parse } = useDocument();

  const formMethods = useForm<PortfolioFormValues>({
    resolver: zodResolver(PortfolioSchema),
    defaultValues: {
      name: '',
      job_title: '',
      introduction: '',
      about: '',
      email: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
      work_experiences: [],
      education: [],
      showcases: [],
      skills: [],
    },
  });

  const { control, setValue, handleSubmit, watch } = formMethods;

  const workFieldArray = useFieldArray({ control, name: 'work_experiences' });
  const educationFieldArray = useFieldArray({ control, name: 'education' });
  const showcaseFieldArray = useFieldArray({ control, name: 'showcases' });
  const skillFieldArray = useFieldArray({ control, name: 'skills' });

  useEffect(() => {
    if (authUser) setUser(authUser);
    const loadProject = async () => {
      const slug = params.slug as string;
      if (!slug) return;
      const { success, data } = await getBySlug(slug, 'full');
      if (success && data) {
        setProject(data);
        if (data.portfolio) {
          const mapped = mapToFormValues(data.portfolio);
          Object.entries(mapped).forEach(([key, val]) => setValue(key as any, val));
          setLocalThemeSettings({ mode: 'light', theme: data.portfolio.theme_object });
          setLayout(data.portfolio.layout_name ?? 'default');
        }
      }
      setIsLoading(false);
    };
    loadProject();
  }, [params.slug, authUser]);

  const save = async () => {
    setIsSaving(true);
    await handleSubmit(async (data) => {
      const res = await create({
        portfolio_id: project?.portfolio?.id,
        user_id: user?.id,
        project_id: project?.id,
        ...data,
        theme: { ...localThemeSettings?.theme },
        layout_name: layout,
      });
      if (res.success) toast.success('Saved successfully');
      else toast.error(res.message || 'Error saving');
    })();
    setIsSaving(false);
  };

  const publish = async (isPublished: boolean) => {
    if (!project?.id) return;
    setIsPublishing(true);
    const res = await apiPublish(project.id, isPublished);
    if (res.success) {
      setProject(res.data);
      toast.success(res.data.published ? 'Published' : 'Unpublished');
    }
    setIsPublishing(false);
  };

  const processResumeFile = async () => {
    setIsFileProcessing(true);
    const { success, data, message } = await parse(files[0], 'resume');
    if (success && data) {
      const mapped = mapToFormValues(data);
      Object.entries(mapped).forEach(([key, val]) => setValue(key as any, val));
      toast.success('Resume parsed!');
      setIsFileUploadDialogOpen(false);
      setFiles([]);
    } else {
      setFileProcessingError(message);
    }
    setIsFileProcessing(false);
  };

  // Field Handlers
  const onAddWorkExperience = () =>
    workFieldArray.append({
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      about: '',
      url: '',
    });
  const onAddEducation = () =>
    educationFieldArray.append({
      school: '',
      degree: '',
      level: '',
      location: '',
      yearStart: '',
      yearEnd: '',
      about: '',
    });
  const onAddShowcase = () =>
    showcaseFieldArray.append({ name: '', description: '', role: '', technologies: [] });
  const onAddTechnologyToShowcase = (idx: number, name: string) => {
    const current = watch('showcases')?.[idx]?.technologies || [];
    setValue(`showcases.${idx}.technologies`, [...current, { name }]);
  };
  const onRemoveTechnologyFromShowcase = (sIdx: number, tIdx: number) => {
    const current = watch('showcases')?.[sIdx]?.technologies || [];
    setValue(
      `showcases.${sIdx}.technologies`,
      current.filter((_, i) => i !== tIdx)
    );
  };

  return (
    <PortfolioContext.Provider
      value={{
        project,
        formMethods,
        layout,
        setLayout,
        workFieldArray,
        educationFieldArray,
        showcaseFieldArray,
        skillFieldArray,
        isLoading,
        isSaving,
        isPublishing,
        localThemeSettings,
        setLocalThemeSettings,
        save,
        publish,
        files,
        setFiles,
        isFileUploadDialogOpen,
        setIsFileUploadDialogOpen,
        isFileProcessing,
        fileProcessingError,
        processResumeFile,
        onAddWorkExperience,
        onAddEducation,
        onAddShowcase,
        onAddTechnologyToShowcase,
        onRemoveTechnologyFromShowcase,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolioBuilder = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolioBuilder must be used within PortfolioProvider');
  return context;
};
