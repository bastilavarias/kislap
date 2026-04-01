'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import { defaultThemeState } from '@/config/theme';
import { Settings } from '@/contexts/settings-context';
import { LinktreeFormValues } from '@/lib/schemas/linktree';
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
  if (viewport === 'mobile') return 390;
  if (viewport === 'tablet') return 900;
  return 1280;
}

function createLinktreePreviewProject({
  values,
  layout,
  themeSettings,
  projectName,
  logoUrl,
}: {
  values: LinktreeFormValues;
  layout: string;
  themeSettings: Settings | null;
  projectName: string;
  logoUrl: string;
}) {
  const now = new Date().toISOString();
  const slug =
    projectName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'link-preview';
  const themeObject = themeSettings?.theme || { preset: null, styles: defaultThemeState };

  const sections =
    values.sections?.map((section, index) => ({
      id: index + 1,
      linktree_id: 1,
      type: section.type || 'link',
      title: section.title || '',
      url: section.url || '',
      description: section.description || '',
      app_url: section.app_url || '',
      image_url: section.image_url || '',
      icon_key: section.icon_key || '',
      accent_color: section.accent_color || '',
      quote_text: section.quote_text || '',
      quote_author: section.quote_author || '',
      banner_text: section.banner_text || '',
      support_note: section.support_note || '',
      support_qr_image_url: section.support_qr_image_url || '',
      cta_label: section.cta_label || '',
      placement_order: index,
    })) || [];

  return {
    id: 1,
    name: projectName,
    description: values.about || '',
    slug,
    sub_domain: slug,
    type: 'linktree' as const,
    published: 0,
    created_at: now,
    updated_at: now,
    linktree: {
      id: 1,
      project_id: 1,
      user_id: 1,
      name: values.name || projectName,
      tagline: values.tagline || '',
      about: values.about || '',
      phone: values.phone || '',
      email: values.email || '',
      logo_url: logoUrl || '',
      background_style: values.background_style || 'grid',
      theme_object: themeObject,
      layout_name: layout || 'linktree-default',
      links: sections.filter((section) => section.type === 'link'),
      sections: sections.filter((section) => section.type !== 'link'),
    },
  };
}

export function LinktreeFormPreview({
  values,
  layout,
  themeSettings,
}: {
  values: LinktreeFormValues;
  layout: string;
  themeSettings: Settings | null;
}) {
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
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

  const previewProject = useMemo(
    () =>
      createLinktreePreviewProject({
        values,
        layout,
        themeSettings,
        projectName: values.name?.trim() || 'Link Preview',
        logoUrl: logoPreviewUrl || values.logo_url || '',
      }),
    [layout, logoPreviewUrl, themeSettings, values]
  );

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
