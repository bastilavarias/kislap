'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import { defaultThemeState } from '@/config/theme';
import type { Settings } from '@/contexts/settings-context';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';

type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

const PREVIEW_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_PREVIEW_ORIGIN || 'https://preview.kislap.app';
const PREVIEW_URL = `${PREVIEW_ORIGIN}/builder-preview`;

const VIEWPORT_OPTIONS: Array<{
  id: PreviewViewport;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'desktop', label: 'Desktop', icon: Laptop },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
];

function getViewportWidth(viewport: PreviewViewport, deviceWidth: number) {
  if (viewport === 'mobile') return Math.min(480, Math.max(320, deviceWidth));
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
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [deviceWidth, setDeviceWidth] = useState(390);
  const [availableWidth, setAvailableWidth] = useState(1280);
  const [contentHeight, setContentHeight] = useState(900);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const viewportSelectionLocked = useRef(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const viewportWidth = getViewportWidth(viewport, deviceWidth);

  useEffect(() => {
    const syncDeviceViewport = () => {
      const width = window.innerWidth;
      setDeviceWidth(width);

      if (viewportSelectionLocked.current) return;
      if (width < 640) setViewport('mobile');
      else if (width < 1024) setViewport('tablet');
      else setViewport('desktop');
    };

    syncDeviceViewport();
    window.addEventListener('resize', syncDeviceViewport);
    return () => window.removeEventListener('resize', syncDeviceViewport);
  }, []);

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

  const postPreviewProject = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'kislap:preview-project',
        project: previewProject,
        mode: themeSettings?.mode || 'light',
      },
      PREVIEW_ORIGIN,
    );
  }, [previewProject, themeSettings?.mode]);

  useEffect(() => {
    postPreviewProject();
  }, [postPreviewProject]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== PREVIEW_ORIGIN || !event.data) return;

      if (event.data.type === 'kislap:preview-height') {
        const height = Number(event.data.height);
        if (Number.isFinite(height) && height > 0) {
          setContentHeight(height);
        }
      }

      if (event.data.type === 'kislap:preview-block-select') {
        const index = Number(event.data.index);
        if (Number.isInteger(index) && index >= 0) {
          onBlockSelect?.(index);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBlockSelect]);

  useEffect(() => {
    const node = scrollAreaRef.current;
    if (!node) return;

    const updateWidth = () => setAvailableWidth(node.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, Math.max(0.25, availableWidth / viewportWidth));
  const previewShellWidth = Math.ceil(viewportWidth * scale);
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
              This is the actual public-site renderer using your current unsaved draft.
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
                  onClick={() => {
                    viewportSelectionLocked.current = true;
                    setViewport(option.id);
                  }}
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
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-muted/10"
      >
        <div
          className="mx-auto"
          style={{ width: previewShellWidth, height: previewShellHeight }}
        >
          <iframe
            ref={iframeRef}
            src={PREVIEW_URL}
            title="Kislap public site preview"
            onLoad={postPreviewProject}
            scrolling="no"
            className="block border-0 bg-background"
            style={{
              width: viewportWidth,
              height: contentHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>
    </div>
  );
}
