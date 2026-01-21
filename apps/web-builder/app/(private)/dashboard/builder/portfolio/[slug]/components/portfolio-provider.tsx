'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
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
import { useParams } from 'next/navigation';
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
  hasContent: boolean;
  hasContentWorkExperience: boolean;
  hasContentEducation: boolean;
  hasContentProjects: boolean;
  hasContentSkills: boolean;
  hasLayout: boolean;
  hasTheme: boolean;

  onAddWorkExperience: () => void;
  onAddEducation: () => void;
  onAddShowcase: () => void;
  onAddTechnologyToShowcase: (index: number, name: string) => void;
  onRemoveTechnologyFromShowcase: (showcaseIndex: number, technologyIndex: number) => void;

  processResumeFile: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

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
    work_experiences: (source.work_experiences || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((work: any) => ({
        company: work.company || '',
        role: work.role || '',
        location: work.location || '',
        startDate: work.start_date || null,
        endDate: work.end_date || null,
        about: work.about || '',
        url: work.url || '',
        placement_order: work.placement_order || 0,
      })),
    education: (source.education || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((education: any) => ({
        school: education.school,
        level: education.level || '',
        degree: education.degree || '',
        location: education.location || '',
        yearStart: education.year_start || null,
        yearEnd: education.year_end || null,
        about: education.about || '',
        placement_order: education.placement_order || 0,
      })),
    showcases: (source.showcases || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((showcase: any) => ({
        name: showcase.name,
        description: showcase.description || '',
        role: showcase.role || '',
        technologies: showcase.technologies || [],
        url: showcase.url || '',
        placement_order: showcase.placement_order || 0,
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

  const values = watch();

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
      const formattedData = Object.assign({
        ...data,
        work_experiences: data.work_experiences?.map((workExp, index) => ({
          placement_order: index,
          ...workExp,
        })),
        education: data.education?.map((education, index) => ({
          placement_order: index,
          ...education,
        })),
        showcases: data.showcases?.map((showcase, index) => ({
          placement_order: index,
          ...showcase,
        })),
      });

      const res = await create({
        portfolio_id: project?.portfolio?.id,
        user_id: user?.id,
        project_id: project?.id,
        ...formattedData,
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

  const hasContent = useMemo(() => {
    return !!(values.name?.trim() && values.job_title?.trim());
  }, [values.name, values.job_title]);

  const hasContentWorkExperience = useMemo(() => {
    return (values.work_experiences?.length ?? 0) > 0;
  }, [values.work_experiences]);

  const hasContentEducation = useMemo(() => {
    return (values.education?.length ?? 0) > 0;
  }, [values.education]);

  const hasContentProjects = useMemo(() => {
    return (values.showcases?.length ?? 0) > 0;
  }, [values.showcases]);

  const hasContentSkills = useMemo(() => {
    return (values.skills?.length ?? 0) > 0;
  }, [values.skills]);

  const hasLayout = useMemo(() => {
    return !!layout;
  }, [layout]);

  const hasTheme = useMemo(() => {
    return !!localThemeSettings;
  }, [localThemeSettings]);

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
        hasContent,
        hasContentWorkExperience,
        hasContentEducation,
        hasContentProjects,
        hasContentSkills,
        hasLayout,
        hasTheme,
        onAddWorkExperience,
        onAddEducation,
        onAddShowcase,
        onAddTechnologyToShowcase,
        onRemoveTechnologyFromShowcase,
        processResumeFile,
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
