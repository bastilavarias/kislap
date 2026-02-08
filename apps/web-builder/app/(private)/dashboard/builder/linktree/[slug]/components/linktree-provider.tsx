'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useForm, UseFormReturn, useFieldArray, UseFieldArrayReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinktreeFormValues, linktreeFormSchema } from '@/lib/schemas/linktree';
import { useProject } from '@/hooks/api/use-project';
import { useLinktree } from '@/hooks/api/use-linktree';
import { APIResponseLinktree, APIResponseProject } from '@/types/api-response';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { AuthUser } from '@/hooks/api/use-auth';
import { useAuthContext } from '@/contexts/auth-context';

interface LinktreeContextType {
  project: APIResponseProject | null;
  formMethods: UseFormReturn<LinktreeFormValues>;
  layout: string;
  setLayout: React.Dispatch<React.SetStateAction<string>>;

  socialLinksFieldArray: UseFieldArrayReturn<LinktreeFormValues, 'social_links', 'id'>;

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

  onAddSocialLink: () => void;
}

const LinktreeContext = createContext<LinktreeContextType | undefined>(undefined);

function mapToFormValues(source: APIResponseLinktree): LinktreeFormValues {
  return {
    name: source.name || '',
    tagline: source.tagline || '',
    logo: null,
    logo_url: source.logo_url || null,
    layout_name: source.layout_name ?? 'default-linktree',

    social_links: (source.social_links || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((socialLink: any) => ({
        id: socialLink.id || null,
        platform: socialLink.platform || '',
        url: socialLink.url || '',
      })),
  };
}

export function LinktreeProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const [project, setProject] = useState<APIResponseProject | null>(null);
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);
  const [layout, setLayout] = useState<string>('default-linktree');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [linktreeID, setLinktreeID] = useState(null);

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
      logo: null,
      logo_url: '',
      layout_name: 'default-linktree',
      social_links: [],
    },
  });

  const { control, setValue, handleSubmit, watch, reset } = formMethods;

  const socialLinksFieldArray = useFieldArray({ control, name: 'social_links' });

  const values = watch();

  useEffect(() => {
    if (authUser) setUser(authUser);
    const loadProject = async () => {
      const slug = params.slug as string;
      if (!slug) return;
      const { success, data } = await getBySlug(slug, 'full');
      if (success && data) {
        setProject(data);
        if (data.linktree) {
          const mapped = mapToFormValues(data.linktree);
          reset(mapped);
          setLocalThemeSettings({ mode: 'light', theme: data.linktree.theme_object });
          setLayout(data.linktree.layout_name ?? 'default-linktree');
        }
      }
      setIsLoading(false);
    };
    loadProject();
  }, [params.slug, authUser]);

  const save = async () => {
    setIsSaving(true);

    await handleSubmit(
      async (data) => {
        const formattedData = Object.assign({
          ...data,
          social_links: data.social_links?.map((socialLink: any, index: any) => ({
            ...socialLink,
            placement_order: index,
          })),
        });

        const fullPayload = {
          project_id: project?.id,
          linktree_id: linktreeID || project?.linktree?.id,
          user_id: user?.id,
          ...formattedData,
          theme: { ...localThemeSettings?.theme },
          layout_name: layout,
        };

        const formData = new FormData();
        const jsonPayload = JSON.parse(JSON.stringify(fullPayload));

        console.log(data['social_links']);

        const attachFiles = (listName: 'social_links', fileKey: string) => {
          const list = data[listName];
          if (!list || !Array.isArray(list)) return;

          list.forEach((item, index) => {
            const file = (item as any)[fileKey];

            if (file instanceof File) {
              formData.append(`${listName}[${index}].${fileKey}`, file);

              if (jsonPayload[listName] && jsonPayload[listName][index]) {
                jsonPayload[listName][index][fileKey] = null;
              }
            }
          });
        };

        attachFiles('links', 'image');

        if (data.logo instanceof File) {
          formData.append('logo', data.logo);
          jsonPayload.logo = null;
        }

        formData.append('json_body', JSON.stringify(jsonPayload));

        const response = await create(formData as any);

        if (response.success) {
          // @ts-ignore
          setLinktreeID(response?.data?.linktree?.id || null);
          toast.success('Saved successfully');
        } else {
          toast.error(response.message || 'Error saving linktree');
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

  const onAddSocialLink = () => {
    socialLinksFieldArray.append({ platform: '', url: '' });
  };

  const hasContent = useMemo(
    () => !!values.name?.trim() && !!values.tagline?.trim() && !!(values.logo || values.logo_url),
    [values.name, values.tagline, values.logo, values.logo_url]
  );

  const hasContentSocialLinks = useMemo(
    () => (values.social_links?.length ?? 0) > 0,
    [values.social_links]
  );

  const hasLayout = useMemo(() => {
    return !!layout;
  }, [layout]);

  const hasTheme = useMemo(() => {
    return !!localThemeSettings;
  }, [localThemeSettings]);

  return (
    <LinktreeContext.Provider
      value={{
        project,
        formMethods,
        layout,
        setLayout,
        socialLinksFieldArray,
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
        onAddSocialLink,
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
