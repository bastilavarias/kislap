'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UseFieldArrayReturn, UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { useAuthContext } from '@/contexts/auth-context';
import { useMenu } from '@/hooks/api/use-menu';
import { useProject } from '@/hooks/api/use-project';
import { createDefaultBusinessHours, createDefaultSocialLinks } from '@/lib/menu-defaults';
import { MenuFormValues, menuFormSchema } from '@/lib/schemas/menu';
import { APIResponseProject } from '@/types/api-response';
import { buildMenuSaveFormData } from './menu-save-payload';
import { mapToFormValues } from './menu-form-mapper';

interface MenuContextType {
  project: APIResponseProject | null;
  formMethods: UseFormReturn<MenuFormValues>;
  categoriesFieldArray: UseFieldArrayReturn<MenuFormValues, 'categories', 'id'>;
  itemsFieldArray: UseFieldArrayReturn<MenuFormValues, 'items', 'id'>;
  layout: string;
  setLayout: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  save: () => Promise<void>;
  publish: (isPublished: boolean) => Promise<void>;
  hasContent: boolean;
  hasCategories: boolean;
  hasItems: boolean;
  hasLayout: boolean;
  hasTheme: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string | undefined);
  const { authUser } = useAuthContext();
  const { getBySlug, publish: apiPublish } = useProject();
  const { create } = useMenu();
  const [project, setProject] = useState<APIResponseProject | null>(null);
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);
  const [layout, setLayout] = useState('menu-default');
  const [menuID, setMenuID] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadedSlugRef = useRef<string | null>(null);
  const isLoadingSlugRef = useRef<string | null>(null);

  const formMethods = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: null,
      logo_url: '',
      cover_image: null,
      cover_image_url: '',
      phone: '',
      email: '',
      website_url: '',
      whatsapp: '',
      address: '',
      city: '',
      country: '',
      google_maps_url: '',
      currency: 'PHP',
      search_enabled: true,
      hours_enabled: false,
      business_hours: createDefaultBusinessHours(),
      social_links: createDefaultSocialLinks(),
      gallery_images: [],
      layout_name: 'menu-default',
      qr_settings: {
        foreground_color: '#111111',
        background_color: '#ffffff',
        show_logo: false,
      },
      categories: [],
      items: [],
    },
  });

  const { control, handleSubmit, watch, reset } = formMethods;
  const categoriesFieldArray = useFieldArray({ control, name: 'categories' });
  const itemsFieldArray = useFieldArray({ control, name: 'items' });
  const values = watch();

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) return;
      if (loadedSlugRef.current === slug || isLoadingSlugRef.current === slug) return;

      isLoadingSlugRef.current = slug;

      const { success, data } = await getBySlug(slug, 'full');
      if (success && data) {
        setProject(data);
        if (data.menu) {
          reset(mapToFormValues(data.menu));
          setMenuID(data.menu.id);
          setLayout(data.menu.layout_name || 'menu-default');
          setLocalThemeSettings({ mode: 'light', theme: data.menu.theme_object });
        }
        loadedSlugRef.current = slug;
      } else {
        loadedSlugRef.current = null;
      }
      isLoadingSlugRef.current = null;
      setIsLoading(false);
    };

    void loadProject();
  }, [slug]);

  const save = async () => {
    await handleSubmit(async (data) => {
      const response = await create(
        buildMenuSaveFormData(data, {
          projectID: project?.id,
          menuID,
          userID: authUser?.id,
          theme: { ...(localThemeSettings?.theme || {}) },
          layout,
        })
      );

      if (response.success && response.data) {
        setMenuID(response.data.id);
        toast.success('Menu saved successfully');
      } else {
        toast.error(response.message || 'Error saving menu');
      }
    })();
  };

  const publish = async (isPublished: boolean) => {
    if (!project?.id) return;
    const response = await apiPublish(project.id, isPublished);
    if (response.success) {
      setProject(response.data);
      toast.success(response.data?.published ? 'Published' : 'Unpublished');
    }
  };

  const hasContent = useMemo(() => !!values.name?.trim(), [values.name]);
  const hasCategories = useMemo(() => (values.categories?.length ?? 0) > 0, [values.categories]);
  const hasItems = useMemo(() => (values.items?.length ?? 0) > 0, [values.items]);
  const hasLayout = useMemo(() => !!layout, [layout]);
  const hasTheme = useMemo(() => !!localThemeSettings, [localThemeSettings]);

  return (
    <MenuContext.Provider
      value={{
        project,
        formMethods,
        categoriesFieldArray,
        itemsFieldArray,
        layout,
        setLayout,
        isLoading,
        localThemeSettings,
        setLocalThemeSettings,
        save,
        publish,
        hasContent,
        hasCategories,
        hasItems,
        hasLayout,
        hasTheme,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuBuilder() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuBuilder must be used within MenuProvider');
  }
  return context;
}
