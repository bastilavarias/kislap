'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UseFieldArrayReturn, UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { useAuthContext } from '@/contexts/auth-context';
import { defaultThemeState } from '@/config/theme';
import { useMenu } from '@/hooks/api/use-menu';
import { useProject } from '@/hooks/api/use-project';
import {
  createDefaultBusinessHours,
  createDefaultDisplayPosterSettings,
  createDefaultSocialLinks,
} from '@/lib/menu-defaults';
import { MenuFormValues, menuFormSchema } from '@/lib/schemas/menu';
import { APIResponseProject } from '@/types/api-response';
import { buildMenuSaveFormData } from './menu-save-payload';
import { mapParsedMenuToFormValues, mapToFormValues } from './menu-form-mapper';
import { buildMenuStarterValues, createThemeObject, getStarterById } from '@/lib/project-starters';

const defaultMenuThemeSettings: Settings = {
  mode: 'light',
  theme: {
    preset: 'menu-board',
    styles: {
      light: {
        ...defaultThemeState.light,
        background: 'oklch(0.17 0 0)',
        foreground: 'oklch(0.95 0.01 85)',
        card: 'oklch(0.17 0 0)',
        'card-foreground': 'oklch(0.95 0.01 85)',
        popover: 'oklch(0.17 0 0)',
        'popover-foreground': 'oklch(0.95 0.01 85)',
        primary: 'oklch(0.95 0.01 85)',
        'primary-foreground': 'oklch(0.17 0 0)',
        secondary: 'oklch(0.28 0.01 85)',
        'secondary-foreground': 'oklch(0.95 0.01 85)',
        muted: 'oklch(0.23 0.01 85)',
        'muted-foreground': 'oklch(0.78 0.01 85)',
        accent: 'oklch(0.70 0.04 60)',
        'accent-foreground': 'oklch(0.17 0 0)',
        border: 'oklch(0.87 0.01 85 / 0.22)',
        input: 'oklch(0.87 0.01 85 / 0.22)',
        ring: 'oklch(0.95 0.01 85)',
        'chart-1': 'oklch(0.95 0.01 85)',
        'chart-2': 'oklch(0.70 0.04 60)',
        'chart-3': 'oklch(0.78 0.01 85)',
        'chart-4': 'oklch(0.56 0.04 45)',
        'chart-5': 'oklch(0.44 0.03 55)',
        sidebar: 'oklch(0.15 0 0)',
        'sidebar-foreground': 'oklch(0.95 0.01 85)',
        'sidebar-primary': 'oklch(0.95 0.01 85)',
        'sidebar-primary-foreground': 'oklch(0.17 0 0)',
        'sidebar-accent': 'oklch(0.28 0.01 85)',
        'sidebar-accent-foreground': 'oklch(0.95 0.01 85)',
        'sidebar-border': 'oklch(0.87 0.01 85 / 0.22)',
        'sidebar-ring': 'oklch(0.95 0.01 85)',
        'font-sans': 'DM Sans, sans-serif',
        'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        'font-mono': 'Space Mono, monospace',
        radius: '1rem',
        'shadow-color': 'hsl(0 0% 0%)',
        'shadow-opacity': '0.25',
        'shadow-blur': '0px',
        'shadow-spread': '0px',
        'shadow-offset-x': '0px',
        'shadow-offset-y': '0px',
        'letter-spacing': '0.02em',
        spacing: '0.25rem',
      },
      dark: {
        ...defaultThemeState.dark,
        background: 'oklch(0.12 0 0)',
        foreground: 'oklch(0.95 0.01 85)',
        card: 'oklch(0.14 0 0)',
        'card-foreground': 'oklch(0.95 0.01 85)',
        popover: 'oklch(0.14 0 0)',
        'popover-foreground': 'oklch(0.95 0.01 85)',
        primary: 'oklch(0.95 0.01 85)',
        'primary-foreground': 'oklch(0.12 0 0)',
        secondary: 'oklch(0.24 0.01 85)',
        'secondary-foreground': 'oklch(0.95 0.01 85)',
        muted: 'oklch(0.19 0.01 85)',
        'muted-foreground': 'oklch(0.78 0.01 85)',
        accent: 'oklch(0.70 0.04 60)',
        'accent-foreground': 'oklch(0.12 0 0)',
        border: 'oklch(0.87 0.01 85 / 0.18)',
        input: 'oklch(0.87 0.01 85 / 0.18)',
        ring: 'oklch(0.95 0.01 85)',
        'chart-1': 'oklch(0.95 0.01 85)',
        'chart-2': 'oklch(0.70 0.04 60)',
        'chart-3': 'oklch(0.78 0.01 85)',
        'chart-4': 'oklch(0.56 0.04 45)',
        'chart-5': 'oklch(0.44 0.03 55)',
        sidebar: 'oklch(0.10 0 0)',
        'sidebar-foreground': 'oklch(0.95 0.01 85)',
        'sidebar-primary': 'oklch(0.95 0.01 85)',
        'sidebar-primary-foreground': 'oklch(0.12 0 0)',
        'sidebar-accent': 'oklch(0.24 0.01 85)',
        'sidebar-accent-foreground': 'oklch(0.95 0.01 85)',
        'sidebar-border': 'oklch(0.87 0.01 85 / 0.18)',
        'sidebar-ring': 'oklch(0.95 0.01 85)',
        'font-sans': 'DM Sans, sans-serif',
        'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        'font-mono': 'Space Mono, monospace',
        radius: '1rem',
        'shadow-color': 'hsl(0 0% 0%)',
        'shadow-opacity': '0.35',
        'shadow-blur': '0px',
        'shadow-spread': '0px',
        'shadow-offset-x': '0px',
        'shadow-offset-y': '0px',
        'letter-spacing': '0.02em',
        spacing: '0.25rem',
      },
      css: {},
      meta: {
        badge: 'Cafe Board',
      },
    },
  },
};

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
  isParserOpen: boolean;
  setIsParserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  applyParsedMenu: (data: Record<string, any>) => void;
  hasContent: boolean;
  hasCategories: boolean;
  hasItems: boolean;
  hasLayout: boolean;
  hasTheme: boolean;
  generateDisplayPoster: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string | undefined);
  const { authUser } = useAuthContext();
  const { getBySlug, publish: apiPublish } = useProject();
  const { create, generateDisplayPoster: apiGenerateDisplayPoster } = useMenu();
  const [project, setProject] = useState<APIResponseProject | null>(null);
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(defaultMenuThemeSettings);
  const [layout, setLayout] = useState('menu-default');
  const [menuID, setMenuID] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParserOpen, setIsParserOpen] = useState(false);
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
      address: '',
      city: '',
      google_maps_url: '',
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
      display_poster_settings: createDefaultDisplayPosterSettings(),
      display_poster_image_url: '',
      categories: [],
      items: [],
    },
  });

  const { control, handleSubmit, watch, reset, setValue } = formMethods;
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
        if (data.menu?.id) {
          reset(mapToFormValues(data.menu));
          setMenuID(data.menu.id);
          setLayout(data.menu.layout_name || 'menu-default');
          setLocalThemeSettings({
            mode: 'light',
            theme: data.menu.theme_object || defaultMenuThemeSettings.theme,
          });
        } else {
          const starter = getStarterById('menu', searchParams.get('starter'));
          const starterLayout = searchParams.get('layout') || starter.defaults.layoutName;
          const starterThemePreset = searchParams.get('theme') || starter.defaults.themePreset;

          reset(buildMenuStarterValues(starter.id, data.name || 'John Doe Cafe'));
          setLayout(starterLayout);
          setLocalThemeSettings({
            mode: 'light',
            theme: createThemeObject(starterThemePreset),
          });
        }
        loadedSlugRef.current = slug;
      } else {
        loadedSlugRef.current = null;
      }
      isLoadingSlugRef.current = null;
      setIsLoading(false);
    };

    void loadProject();
  }, [slug, reset, searchParams]);

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
        const savedMenuID = response.data.menu?.id ?? response.data.id ?? null;
        if (savedMenuID) {
          setMenuID(savedMenuID);
        }
        if (response.data.menu) {
          reset(mapToFormValues(response.data.menu));
          setLayout(response.data.menu.layout_name || 'menu-default');
          setProject((prev) =>
            prev
              ? {
                  ...prev,
                  menu: response.data.menu,
                  published: prev.published,
                }
              : prev
          );
        }
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

  const generateDisplayPoster = async () => {
    if (!project?.id) {
      toast.error('Save the project first before generating a display poster.');
      return;
    }

    const currentValues = formMethods.getValues();
    const rootDomain = process.env.NEXT_PUBLIC_SHINE_SUFFIX_URL || 'kislap.test';
    const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
    const menuURL = project?.sub_domain ? `${urlPrefix}${project.sub_domain}.${rootDomain}` : '';

    if (!menuURL) {
      toast.error('Set a subdomain first so the poster can point to the live menu.');
      return;
    }

    const response = await apiGenerateDisplayPoster({
      menu_id: menuID,
      project_id: project.id,
      menu_url: menuURL,
      name: currentValues.name,
      logo_url: currentValues.logo_url || null,
      cover_image_url: currentValues.cover_image_url || null,
      address: currentValues.address || null,
      city: currentValues.city || null,
      website_url: currentValues.website_url || null,
      theme: localThemeSettings?.theme || null,
      qr_settings: currentValues.qr_settings,
      display_poster_settings: currentValues.display_poster_settings,
    });

    if (!response.success || !response.data) {
      toast.error(response.message || 'Failed to generate display poster');
      return;
    }

    setValue('display_poster_settings', {
      ...createDefaultDisplayPosterSettings(),
      ...(response.data.display_poster_settings || {}),
    }, { shouldDirty: true });
    setValue('display_poster_image_url', response.data.image_url, { shouldDirty: true });
    toast.success('Display poster generated');
  };

  const applyParsedMenu = (data: Record<string, any>) => {
    const current = formMethods.getValues();
    const mapped = mapParsedMenuToFormValues(data, current);
    reset(mapped);

    toast.success('Menu parsed!');
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
        isParserOpen,
        setIsParserOpen,
        applyParsedMenu,
        hasContent,
        hasCategories,
        hasItems,
        hasLayout,
        hasTheme,
        generateDisplayPoster,
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
