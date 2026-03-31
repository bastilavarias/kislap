'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import { type StarterProjectType } from '@/lib/project-starters';
import { createMockProject } from '@/lib/project-preview-data';
import { PreviewSiteBuilder } from './preview-site-builder';

type PreviewProps = {
  type: StarterProjectType;
  starterId: string;
  layoutName: string;
  themePreset: string;
  projectName: string;
};

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

function getViewportWidth(type: StarterProjectType, viewport: PreviewViewport) {
  if (viewport === 'mobile') return type === 'menu' ? 430 : 390;
  if (viewport === 'tablet') return type === 'menu' ? 960 : 900;
  return type === 'menu' ? 1440 : 1280;
}

export function ProjectTemplatePreview(props: PreviewProps) {
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const viewportWidth = getViewportWidth(props.type, viewport);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(viewportWidth);
  const [contentHeight, setContentHeight] = useState(960);
  const previewProject = useMemo(() => createMockProject(props), [props]);

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
  }, [previewProject, props.layoutName, props.projectName, props.starterId, props.themePreset, props.type]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    scrollArea.scrollTop = 0;
    scrollArea.scrollLeft = 0;
  }, [props.type, props.starterId, props.layoutName, props.themePreset, viewport]);

  const scale = Math.min(1, Math.max(0.5, availableWidth / viewportWidth));
  const scaledHeight = Math.ceil(contentHeight * scale);

  return (
    <div className="flex h-full flex-col overflow-hidden border border-border/70 bg-card/60 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Live preview
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Sample content only. You can edit everything after the project is created.
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

      <div ref={scrollAreaRef} className="min-h-0 flex-1 overflow-auto bg-muted/10">
        <div className="mx-auto" style={{ width: viewportWidth * scale, height: scaledHeight }}>
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
