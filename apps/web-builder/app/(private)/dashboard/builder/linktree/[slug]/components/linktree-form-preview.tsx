'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Expand, Laptop, Smartphone, Tablet } from 'lucide-react';
import { defaultThemeState } from '@/config/theme';
import type { Settings } from '@/contexts/settings-context';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import { PreviewSiteBuilder } from '@/app/(private)/dashboard/projects/new/components/preview-site-builder';

type PreviewViewport = 'fit' | 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_OPTIONS: Array<{
  id: PreviewViewport;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'fit', label: 'Fit', icon: Expand },
  { id: 'desktop', label: 'Desktop', icon: Laptop },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
];

function getViewportWidth(viewport: PreviewViewport, availableWidth: number) {
  if (viewport === 'fit') return Math.max(320, availableWidth);
  if (viewport === 'mobile') return 390;
  if (viewport === 'tablet') return 768;
  return 1280;
}

function createLinktreePreviewProject({
  values,
  themeSettings,
  projectName,
  logoUrl,
}: {
  values: LinktreeFormValues;
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
      content_json: section.content || null,
      layout_json: section.layout || null,
      style_json: section.style || null,
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
    portfolio: null,
    biz: null,
    menu: null,
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
      layout_name: 'linktree-default',
      composition_layout: values.composition_layout || 'classic',
      links: sections.filter((section) => section.type === 'link'),
      sections: sections.filter((section) => section.type !== 'link'),
    },
  };
}

export function LinktreeFormPreview({
  values,
  themeSettings,
  onBlockSelect,
}: {
  values: LinktreeFormValues;
  themeSettings: Settings | null;
  onBlockSelect?: (index: number) => void;
}) {
  const [viewport, setViewport] = useState<PreviewViewport>('fit');
  const [availableWidth, setAvailableWidth] = useState(720);
  const [contentHeight, setContentHeight] = useState(900);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const viewportWidth = getViewportWidth(viewport, availableWidth);

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
        themeSettings,
        projectName: values.name?.trim() || 'Page Preview',
        logoUrl: logoPreviewUrl || values.logo_url || '',
      }),
    [logoPreviewUrl, themeSettings, values],
  );

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const updateWidth = () => setAvailableWidth(Math.max(320, scrollArea.clientWidth));
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(scrollArea);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateHeight = () => setContentHeight(content.scrollHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);
    return () => observer.disconnect();
  }, [previewProject, viewport, themeSettings, viewportWidth]);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: 0, left: 0 });
  }, [viewport]);

  const handlePreviewClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onBlockSelect) return;

    const target = event.target as HTMLElement;
    const block = target.closest<HTMLElement>('[data-kislap-block-order]');
    if (!block) return;

    const index = Number(block.dataset.kislapBlockOrder);
    if (!Number.isInteger(index) || index < 0) return;

    event.preventDefault();
    event.stopPropagation();
    onBlockSelect(index);
  };

  const scale =
    viewport === 'fit'
      ? 1
      : Math.min(1, Math.max(0.25, availableWidth / viewportWidth));
  const previewShellWidth =
    viewport === 'fit' ? availableWidth : Math.ceil(viewportWidth * scale);
  const previewShellHeight = Math.ceil(contentHeight * scale);

  return (
    <div className="flex h-full min-w-0 max-w-full flex-col overflow-hidden border-2 border-black bg-card">
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Live preview
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fit renders the shared public Page component at 1:1 inside this editor.
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
        onClickCapture={handlePreviewClick}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-muted/10"
      >
        <div
          className="mx-auto"
          style={{ width: previewShellWidth, height: previewShellHeight }}
        >
          <div
            ref={contentRef}
            style={{
              width: viewportWidth,
              transform: scale === 1 ? undefined : `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <PreviewSiteBuilder
              project={previewProject as any}
              mode={themeSettings?.mode || 'light'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
