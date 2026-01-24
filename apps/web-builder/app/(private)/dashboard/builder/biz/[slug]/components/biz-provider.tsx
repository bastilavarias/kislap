'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useForm, UseFormReturn, useFieldArray, UseFieldArrayReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BizFormValues, BizSchema } from '@/lib/schemas/biz';
import { useProject } from '@/hooks/api/use-project';
import { useBiz } from '@/hooks/api/use-biz';
import { APIResponseBiz, APIResponseProject } from '@/types/api-response';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { AuthUser } from '@/hooks/api/use-auth';
import { useAuthContext } from '@/contexts/auth-context';

interface BizContextType {
  project: APIResponseProject | null;
  formMethods: UseFormReturn<BizFormValues>;
  layout: string;
  setLayout: React.Dispatch<React.SetStateAction<string>>;

  socialLinksFieldArray: UseFieldArrayReturn<BizFormValues, 'social_links', 'id'>;
  servicesFieldArray: UseFieldArrayReturn<BizFormValues, 'services', 'id'>;
  productsFieldArray: UseFieldArrayReturn<BizFormValues, 'products', 'id'>;
  testimonialsFieldArray: UseFieldArrayReturn<BizFormValues, 'testimonials', 'id'>;

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
  hasContentServices: boolean;
  hasContentProducts: boolean;
  hasContentTestimonials: boolean;
  hasLayout: boolean;
  hasTheme: boolean;

  onAddSocialLink: () => void;
  onAddService: () => void;
  onAddProduct: () => void;
  onAddTestimonial: () => void;
}

const BizContext = createContext<BizContextType | undefined>(undefined);

function mapToFormValues(source: APIResponseBiz): BizFormValues {
  return {
    name: source.name || '',
    tagline: source.tagline || '',
    description: source.description || '',

    email: source.email || '',
    phone: source.phone || '',
    address: source.address || '',
    map_link: source.map_link || '',
    website: source.domain || source.website || '',

    logo: source.logo,
    hero_image: source.hero_image,

    services_enabled: source.services_enabled ?? false,
    products_enabled: source.products_enabled ?? false,
    booking_enabled: source.booking_enabled ?? false,
    ordering_enabled: source.ordering_enabled ?? false,
    layout_name: source.layout_name ?? 'default',

    social_links: (source.social_links || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((socialLink: any) => ({
        id: socialLink.id || null,
        platform: socialLink.platform || '',
        url: socialLink.url || '',
      })),

    services: (source.services || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((service: any) => ({
        id: service.id || null,
        name: service.name || '',
        description: service.description || '',
        price: service.price || 0,
        duration_minutes: service.duration_minutes || 0,
        image: service.image || null,
        image_url: service.image_url || null,
        is_featured: service.is_featured ?? false,
      })),

    products: (source.products || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((product: any) => ({
        id: product.id || null,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        is_active: product.is_active ?? true,
        image: product.image || null,
        image_url: product.image_url || null,
      })),

    testimonials: (source.testimonials || [])
      .sort((prev: any, after: any) => (prev.placement_order ?? 0) - (after.placement_order ?? 0))
      .map((testimonial: any) => ({
        id: testimonial.id || null,
        author: testimonial.author || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        avatar: testimonial.avatar || null,
        avatar_url: testimonial.avatar_url || null,
      })),

    type: source.type || null,
    industry: source.industry || null,
    domain: source.domain || null,
    subdomain: source.subdomain || null,
  };
}

export function BizProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const [project, setProject] = useState<APIResponseProject | null>(null);
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);
  const [layout, setLayout] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bizID, setBizID] = useState(null);

  const [files, setFiles] = useState<File[]>([]);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileProcessingError, setFileProcessingError] = useState('');

  const { authUser } = useAuthContext();
  const { getBySlug, publish: apiPublish } = useProject();
  const { create } = useBiz();

  const formMethods = useForm<BizFormValues>({
    resolver: zodResolver(BizSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      type: '',
      industry: '',
      logo: '',
      hero_image: '',
      email: '',
      phone: '',
      address: '',
      map_link: '',
      domain: '',
      subdomain: '',
      website: '',
      services_enabled: false,
      products_enabled: false,
      booking_enabled: false,
      ordering_enabled: false,
      layout_name: 'default',
      social_links: [],
      services: [],
      products: [],
      testimonials: [],
    },
  });

  const { control, setValue, handleSubmit, watch, reset } = formMethods;

  const socialLinksFieldArray = useFieldArray({ control, name: 'social_links' });
  const servicesFieldArray = useFieldArray({ control, name: 'services' });
  const productsFieldArray = useFieldArray({ control, name: 'products' });
  const testimonialsFieldArray = useFieldArray({ control, name: 'testimonials' });

  const values = watch();

  useEffect(() => {
    if (authUser) setUser(authUser);
    const loadProject = async () => {
      const slug = params.slug as string;
      if (!slug) return;
      const { success, data } = await getBySlug(slug, 'full');
      if (success && data) {
        setProject(data);
        if (data.biz) {
          const mapped = mapToFormValues(data.biz);

          reset(mapped);

          setLocalThemeSettings({ mode: 'light', theme: data.biz.theme_object });
          setLayout(data.biz.layout_name ?? 'default');
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
          services: data.services?.map((service: any, index: any) => ({
            ...service,
            placement_order: index,
          })),
          products: data.products?.map((product: any, index: any) => ({
            ...product,
            placement_order: index,
          })),
          testimonials: data.testimonials?.map((testimonial: any, index: any) => ({
            ...testimonial,
            placement_order: index,
          })),
          social_links: data.social_links?.map((socialLink: any, index: any) => ({
            ...socialLink,
            placement_order: index,
          })),
        });

        const fullPayload = {
          project_id: project?.id,
          biz_id: bizID || project?.biz?.id,
          user_id: user?.id,
          ...formattedData,
          theme: { ...localThemeSettings?.theme },
          layout_name: layout,
        };

        const formData = new FormData();
        const jsonPayload = JSON.parse(JSON.stringify(fullPayload));
        const attachFiles = (
          listName: 'services' | 'products' | 'testimonials',
          fileKey: string
        ) => {
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

        attachFiles('services', 'image');
        attachFiles('products', 'image');
        attachFiles('testimonials', 'avatar');

        formData.append('json_body', JSON.stringify(jsonPayload));

        const response = await create(formData as any);

        if (response.success) {
          // @ts-ignore
          setBizID(response?.data?.biz?.id || null);
          toast.success('Saved successfully');
        } else {
          toast.error(response.message || 'Error saving business');
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

  const onAddService = () => {
    servicesFieldArray.append({
      name: 'New Service',
      description: '',
      price: 0,
      duration_minutes: 30,
      is_featured: false,
      image: null,
    });
  };

  const onAddProduct = () => {
    productsFieldArray.append({
      name: 'New Product',
      description: '',
      price: 0,
      stock: 1,
      is_active: true,
    });
  };

  const onAddTestimonial = () => {
    testimonialsFieldArray.append({
      author: '',
      content: '',
      rating: 5,
    });
  };

  const hasContent = useMemo(() => {
    return !!(values.name?.trim() && values.slug?.trim());
  }, [values.name, values.slug]);

  const hasContentServices = useMemo(() => {
    return (values.services?.length ?? 0) > 0;
  }, [values.services]);

  const hasContentProducts = useMemo(() => {
    return (values.products?.length ?? 0) > 0;
  }, [values.products]);

  const hasContentTestimonials = useMemo(() => {
    return (values.testimonials?.length ?? 0) > 0;
  }, [values.testimonials]);

  const hasLayout = useMemo(() => {
    return !!layout;
  }, [layout]);

  const hasTheme = useMemo(() => {
    return !!localThemeSettings;
  }, [localThemeSettings]);

  return (
    <BizContext.Provider
      value={{
        project,
        formMethods,
        layout,
        setLayout,

        socialLinksFieldArray,
        servicesFieldArray,
        productsFieldArray,
        testimonialsFieldArray,

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
        hasContentServices,
        hasContentProducts,
        hasContentTestimonials,
        hasLayout,
        hasTheme,

        onAddSocialLink,
        onAddService,
        onAddProduct,
        onAddTestimonial,
      }}
    >
      {children}
    </BizContext.Provider>
  );
}

export const useBizBuilder = () => {
  const context = useContext(BizContext);
  if (!context) throw new Error('useBizBuilder must be used within BizProvider');
  return context;
};
