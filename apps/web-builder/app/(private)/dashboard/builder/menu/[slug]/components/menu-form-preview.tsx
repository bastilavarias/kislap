'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import { defaultThemeState } from '@/config/theme';
import { Settings } from '@/contexts/settings-context';
import { MenuFormValues } from '@/lib/schemas/menu';
import { PreviewSiteBuilder } from '@/app/(private)/dashboard/projects/new/components/preview-site-builder';

type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_OPTIONS: Array<{
  id: PreviewViewport;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'desktop', label: 'Desktop', icon: Laptop },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
];

function getViewportWidth(viewport: PreviewViewport) {
  if (viewport === 'mobile') return 430;
  if (viewport === 'tablet') return 960;
  return 1440;
}

export function MenuFormPreview({
  values,
  layout,
  themeSettings,
}: {
  values: MenuFormValues;
  layout: string;
  themeSettings: Settings | null;
}) {
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<Record<number, string>>({});
  const [itemPreviewUrls, setItemPreviewUrls] = useState<Record<number, string>>({});
  const [categoryPreviewUrls, setCategoryPreviewUrls] = useState<Record<number, string>>({});
  const viewportWidth = getViewportWidth(viewport);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(viewportWidth);
  const [contentHeight, setContentHeight] = useState(960);

  useEffect(() => {
    const logoFile = values.logo instanceof File ? values.logo : null;
    if (!logoFile) {
      setLogoPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [values.logo]);

  useEffect(() => {
    const coverFile = values.cover_image instanceof File ? values.cover_image : null;
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [values.cover_image]);

  useEffect(() => {
    const nextUrls: Record<number, string> = {};
    const objectUrls: string[] = [];
    (values.gallery_images || []).forEach((entry, index) => {
      const file = entry.image instanceof File ? entry.image : null;
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      nextUrls[index] = objectUrl;
      objectUrls.push(objectUrl);
    });
    setGalleryPreviewUrls(nextUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [values.gallery_images]);

  useEffect(() => {
    const nextUrls: Record<number, string> = {};
    const objectUrls: string[] = [];
    (values.items || []).forEach((entry, index) => {
      const file = entry.image instanceof File ? entry.image : null;
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      nextUrls[index] = objectUrl;
      objectUrls.push(objectUrl);
    });
    setItemPreviewUrls(nextUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [values.items]);

  useEffect(() => {
    const nextUrls: Record<number, string> = {};
    const objectUrls: string[] = [];
    (values.categories || []).forEach((entry, index) => {
      const file = entry.image instanceof File ? entry.image : null;
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      nextUrls[index] = objectUrl;
      objectUrls.push(objectUrl);
    });
    setCategoryPreviewUrls(nextUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [values.categories]);

  const previewProject = useMemo(() => {
    const now = new Date().toISOString();
    const projectName = values.name?.trim() || 'Menu Preview';
    const slug =
      projectName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') || 'menu-preview';
    const themeObject = themeSettings?.theme || { preset: null, styles: defaultThemeState };
    const categories = (values.categories || []).map((category, index) => ({
      id: index + 1,
      menu_id: 1,
      client_key: category.client_key,
      name: category.name,
      description: category.description || '',
      image_url: categoryPreviewUrls[index] || category.image_url || '',
      placement_order: category.placement_order || index,
      is_visible: category.is_visible,
    }));
    const categoryIdByKey = new Map(categories.map((category) => [category.client_key, category.id]));

    return {
      id: 1,
      name: projectName,
      description: values.description || '',
      slug,
      sub_domain: slug,
      type: 'menu' as const,
      published: 0,
      created_at: now,
      updated_at: now,
      menu: {
        id: 1,
        project_id: 1,
        user_id: 1,
        name: values.name || projectName,
        description: values.description || '',
        logo_url: logoPreviewUrl || values.logo_url || '',
        cover_image_url: coverPreviewUrl || values.cover_image_url || '',
        phone: values.phone || '',
        email: values.email || '',
        website_url: values.website_url || '',
        address: values.address || '',
        city: values.city || '',
        google_maps_url: values.google_maps_url || '',
        layout_name: layout || 'menu-default',
        theme_name: themeSettings?.theme?.preset || 'custom',
        theme_object: themeObject,
        qr_settings: values.qr_settings,
        search_enabled: values.search_enabled,
        hours_enabled: values.hours_enabled,
        business_hours: values.business_hours || [],
        social_links: values.social_links || [],
        gallery_images: (values.gallery_images || [])
          .map((entry, index) => galleryPreviewUrls[index] || entry.image_url || '')
          .filter(Boolean),
        categories,
        items: (values.items || []).map((item, index) => ({
          id: index + 1,
          menu_id: 1,
          menu_category_id: categoryIdByKey.get(item.category_key || '') || null,
          name: item.name,
          description: item.description || '',
          image_url: itemPreviewUrls[index] || item.image_url || '',
          badge: item.badge || '',
          price: item.price,
          variants: item.variants || [],
          placement_order: item.placement_order || index,
          is_available: item.is_available,
          is_featured: item.is_featured,
        })),
      },
    };
  }, [
    categoryPreviewUrls,
    coverPreviewUrl,
    galleryPreviewUrls,
    itemPreviewUrls,
    layout,
    logoPreviewUrl,
    themeSettings,
    values,
  ]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const contentNode = contentRef.current;
    if (!scrollArea || !contentNode) return;

    const updateMeasurements = () => {
      setAvailableWidth(scrollArea.clientWidth);
      setContentHeight(contentNode.scrollHeight);
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements();
    });

    resizeObserver.observe(scrollArea);
    resizeObserver.observe(contentNode);

    return () => resizeObserver.disconnect();
  }, [previewProject, layout, themeSettings, viewport]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    scrollArea.scrollTop = 0;
    scrollArea.scrollLeft = 0;
  }, [layout, themeSettings, viewport]);

  const useHorizontalDesktopScroll =
    viewport === 'desktop' && availableWidth < 1024 && availableWidth < viewportWidth;
  const scale = useHorizontalDesktopScroll
    ? 1
    : Math.min(1, Math.max(0.5, availableWidth / viewportWidth));
  const scaledHeight = Math.ceil(contentHeight * scale);
  const previewShellWidth = useHorizontalDesktopScroll ? viewportWidth : viewportWidth * scale;
  const previewShellHeight = useHorizontalDesktopScroll ? contentHeight : scaledHeight;

  return (
    <div className="flex min-w-0 max-w-full flex-col overflow-hidden border border-border/70 bg-card/60 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Live preview
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on your current form values, layout, and theme. No save needed.
            </p>
          </div>

          <div className="inline-flex border border-border/70 bg-background">
            {VIEWPORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = viewport === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setViewport(option.id)}
                  className={[
                    'inline-flex items-center gap-2 border-r border-border/70 px-3 py-2 text-xs font-medium transition last:border-r-0',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ].join(' ')}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        ref={scrollAreaRef}
        className={[
          'min-h-0 flex-1 bg-muted/10',
          useHorizontalDesktopScroll ? 'overflow-x-auto overflow-y-auto' : 'overflow-auto',
        ].join(' ')}
      >
        <div
          className={useHorizontalDesktopScroll ? 'min-w-max' : 'mx-auto'}
          style={{ width: previewShellWidth, height: previewShellHeight }}
        >
          <div
            ref={contentRef}
            style={{
              width: viewportWidth,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <PreviewSiteBuilder project={previewProject as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
