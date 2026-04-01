'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import { defaultThemeState } from '@/config/theme';
import { Settings } from '@/contexts/settings-context';
import { PortfolioFormValues } from '@/lib/schemas/portfolio';
import { PreviewSiteBuilder } from '@/app/(private)/dashboard/projects/new/components/preview-site-builder';
import type { Project } from '@/types/project';

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

function createPortfolioPreviewProject({
  values,
  layout,
  themeSettings,
  projectName,
  avatarUrl,
  resumeUrl,
}: {
  values: PortfolioFormValues;
  layout: string;
  themeSettings: Settings | null;
  projectName: string;
  avatarUrl: string;
  resumeUrl: string;
}): Project {
  const now = new Date().toISOString();
  const themeObject = JSON.stringify(themeSettings?.theme || { preset: null, styles: defaultThemeState });
  const slug =
    projectName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'portfolio-preview';
  const nameParts = projectName.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || 'Portfolio';
  const lastName = nameParts.slice(1).join(' ') || 'Preview';

  return {
    id: 1,
    name: projectName,
    description: values.introduction || '',
    slug,
    sub_domain: slug,
    type: 'portfolio',
    published: 0,
    created_at: now,
    updated_at: now,
    portfolio: {
      id: 1,
      name: values.name || projectName,
      avatar_url: avatarUrl || null,
      resume_url: resumeUrl || null,
      location: values.location || null,
      job_title: values.job_title || null,
      introduction: values.introduction || null,
      about: values.about || null,
      email: values.email || null,
      phone: values.phone || null,
      website: values.website || null,
      github: values.github || null,
      linkedin: values.linkedin || null,
      twitter: values.twitter || null,
      theme_object: themeObject,
      layout_name: layout || 'default',
      created_at: now,
      updated_at: now,
      deleted_at: null,
      user: {
        id: 1,
        first_name: firstName,
        last_name: lastName,
        email: values.email || `${slug}@example.com`,
        role: 'user',
        image_url: avatarUrl || '',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      work_experiences:
        values.work_experiences?.map((work, index) => ({
          id: index + 1,
          company: work.company || '',
          role: work.role || '',
          location: work.location || '',
          start_date: work.startDate || '',
          end_date: work.endDate || '',
          about: work.about || '',
        })) || [],
      education:
        values.education?.map((item, index) => ({
          id: index + 1,
          school: item.school || '',
          level: item.level || '',
          degree: item.degree || '',
          location: item.location || '',
          about: item.about || '',
          year_start: item.yearStart || '',
          year_end: item.yearEnd || '',
        })) || [],
      showcases:
        values.showcases?.map((showcase, index) => ({
          id: index + 1,
          name: showcase.name || '',
          description: showcase.description || '',
          role: showcase.role || '',
          url: showcase.url || '',
          technologies:
            showcase.technologies?.map((tech, techIndex) => ({
              id: techIndex + 1,
              name: tech.name || '',
            })) || [],
        })) || [],
      skills:
        values.skills?.map((skill, index) => ({
          id: index + 1,
          name: skill.name || '',
        })) || [],
    },
  };
}

export function PortfolioFormPreview({
  values,
  layout,
  themeSettings,
  fallbackAvatarUrl,
}: {
  values: PortfolioFormValues;
  layout: string;
  themeSettings: Settings | null;
  fallbackAvatarUrl: string | null;
}) {
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
  const viewportWidth = getViewportWidth(viewport);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(viewportWidth);
  const [contentHeight, setContentHeight] = useState(960);

  useEffect(() => {
    const avatarFile = values.avatar instanceof File ? values.avatar : null;
    if (!avatarFile) {
      setFilePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setFilePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [values.avatar]);

  useEffect(() => {
    const resumeFile = values.resume instanceof File ? values.resume : null;
    if (!resumeFile) {
      setResumePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(resumeFile);
    setResumePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [values.resume]);

  const previewProject = useMemo(
    () =>
      createPortfolioPreviewProject({
        values,
        layout,
        themeSettings,
        projectName: values.name?.trim() || 'Portfolio Preview',
        avatarUrl: filePreviewUrl || values.avatar_url || fallbackAvatarUrl || '',
        resumeUrl: resumePreviewUrl || values.resume_url || '',
      }),
    [fallbackAvatarUrl, filePreviewUrl, layout, resumePreviewUrl, themeSettings, values]
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
            <PreviewSiteBuilder project={previewProject} />
          </div>
        </div>
      </div>
    </div>
  );
}
