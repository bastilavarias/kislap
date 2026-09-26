'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useForm, UseFormReturn, useFieldArray, UseFieldArrayReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinktreeFormValues, linktreeFormSchema } from '@/lib/schemas/linktree';
import { useProject } from '@/hooks/api/use-project';
import { useLinktree } from '@/hooks/api/use-linktree';
import { APIResponseProject } from '@/types/api-response';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { AuthUser } from '@/hooks/api/use-auth';
import { useAuthContext } from '@/contexts/auth-context';
import { mapToFormValues } from './linktree-form-mapper';
import { buildLinktreeSaveFormData } from './linktree-save-payload';
import { buildLinktreeStarterValues, createThemeObject, getStarterById } from '@/lib/project-starters';

interface LinktreeContextType {
  project: APIResponseProject | null;
  formMethods: UseFormReturn<LinktreeFormValues>;

  sectionsFieldArray: UseFieldArrayReturn<LinktreeFormValues, 'sections', 'id'>;

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
  hasContentSocialLinks: boolean;
  hasLayout: boolean;
  hasTheme: boolean;

  onAddSection: () => void;
}

const LinktreeContext = createContext<LinktreeContextType | undefined>(undefined);

export function LinktreeProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<APIResponseProject | null>(null);
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [linktreeID, setLinktreeID] = useState<number | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileProcessingError, setFileProcessingError] = useState('');

  const { authUser } = useAuthContext();
  const { getBySlug, publish: apiPublish } = useProject();
  const { create } = useLinktree();

  const formMethods = useForm<LinktreeFormValues>({
    resolver: zodResolver(linktreeFormSchema),

    defaultValues: {
      name: '',
      tagline: '',
      phone: '',
      email: '',
      logo: null,
      logo_url: '',
      background_style: 'grid',
      layout_name: 'linktree-default',
      composition_layout: 'classic',
      sections: [],
    },
  });

  const { control, handleSubmit, watch, reset } = formMethods;

  const sectionsFieldArray = useFieldArray({ control, name: 'sections' });

  const values = watch();

  useEffect(() => {
    if (authUser) setUser(authUser);
    const loadProject = async () => {
      const slug = params.slug as string;
      if (!slug) return;
      const { success, data } = await getBySlug(slug, 'full');
      if (success && data) {
        setProject(data);
        if (data.linktree?.id) {
          const mapped = mapToFormValues(data.linktree);
          reset(mapped);
          setLocalThemeSettings({ mode: 'light', theme: data.linktree.theme_object });
        } else {
          const starter = getStarterById('linktree', searchParams.get('starter'));
          const starterThemePreset = searchParams.get('theme') || starter.defaults.themePreset;

          reset(buildLinktreeStarterValues(starter.id, data.name || 'John Doe'));
          setLocalThemeSettings({ mode: 'light', theme: createThemeObject(starterThemePreset) });
        }
      }
      setIsLoading(false);
    };
    loadProject();
  }, [params.slug, authUser, reset, searchParams]);

  const save = async () => {
    setIsSaving(true);

    await handleSubmit(
      async (data) => {
        const formData = buildLinktreeSaveFormData(data, {
          projectID: project?.id,
          linktreeID: linktreeID || project?.linktree?.id,
          userID: user?.id,
          theme: { ...(localThemeSettings?.theme || {}) },
          layout: 'linktree-default',
        });

        const response = await create(formData as any);

        if (response.success) {
          const savedLinktree = response?.data?.linktree;
          setLinktreeID(savedLinktree?.id || null);

          if (savedLinktree) {
            reset(mapToFormValues(savedLinktree));
            setProject((current) =>
              current
                ? {
                    ...current,
                    linktree: savedLinktree,
                  }
                : current
            );
          }

          toast.success('Saved successfully');
        } else {
          toast.error(response.message || 'Error saving page');
        }
      },
      (errors) => {
        console.error('Validation failed:', errors);
        toast.error('Please check the form for errors.');
      }
    )();

    setIsSaving(false);
  };

  const publish = async (isPublished: boolean) => {
    if (!project?.id) return;
    setIsPublishing(true);
    const response = await apiPublish(project.id, isPublished);
    if (response.success) {
      setProject(response.data);
      toast.success(response?.data?.published ? 'Published' : 'Unpublished');
    }
    setIsPublishing(false);
  };

  const onAddSection = () => {
    sectionsFieldArray.append({
      type: 'link',
      title: '',
      description: '',
      layout: { width: 'auto', align: 'left' },
      style: { variant: 'default', padding: 'normal' },
    });
  };

  const hasContent = useMemo(
    () => !!values.name?.trim() && !!values.tagline?.trim() && !!(values.logo || values.logo_url),
    [values.name, values.tagline, values.logo, values.logo_url]
  );

  const hasContentSocialLinks = useMemo(
    () => (values.sections || []).some((item: any) => item?.type === 'link'),
    [values.sections]
  );

  const hasLayout = useMemo(() => {
    return !!values.composition_layout;
  }, [values.composition_layout]);

  const hasTheme = useMemo(() => {
    return !!localThemeSettings;
  }, [localThemeSettings]);

  return (
    <LinktreeContext.Provider
      value={{
        project,
        formMethods,
        sectionsFieldArray,
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
        hasContentSocialLinks,
        hasLayout,
        hasTheme,
        onAddSection,
      }}
    >
      {children}
    </LinktreeContext.Provider>
  );
}

export const useLinktreeBuilder = () => {
  const context = useContext(LinktreeContext);
  if (!context) throw new Error('useLinktreeBuilder must be used within LinktreeProvider');
  return context;
};
