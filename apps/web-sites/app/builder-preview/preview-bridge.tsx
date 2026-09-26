'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import type { Mode } from '@/contexts/settings-context';
import type { Project } from '@/types/project';
import { Builder } from '@/app/components/builder';

type PreviewProjectMessage = {
  type: 'kislap:preview-project';
  project: Project;
  mode?: Mode;
};

type PreviewHeightMessage = {
  type: 'kislap:preview-height';
  height: number;
};

type PreviewBlockMessage = {
  type: 'kislap:preview-block-select';
  index: number;
};

function isAllowedParent(origin: string) {
  return (
    origin === 'https://builder.kislap.app' ||
    origin === 'https://kislap.app' ||
    origin.startsWith('http://localhost') ||
    origin.startsWith('http://127.0.0.1') ||
    origin.endsWith('.kislap.test')
  );
}

export function PreviewBridge() {
  const [project, setProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<Mode>('light');
  const [parentOrigin, setParentOrigin] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<PreviewProjectMessage>) => {
      if (!isAllowedParent(event.origin)) return;
      if (!event.data || event.data.type !== 'kislap:preview-project') return;

      setParentOrigin(event.origin);
      setProject(event.data.project);
      setMode(event.data.mode || 'light');
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!project || !parentOrigin) return;

    const reportHeight = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        rootRef.current?.scrollHeight || 0,
      );

      const message: PreviewHeightMessage = {
        type: 'kislap:preview-height',
        height,
      };

      window.parent.postMessage(message, parentOrigin);
    };

    reportHeight();
    const frame = window.requestAnimationFrame(reportHeight);
    const timeout = window.setTimeout(reportHeight, 100);

    const observer = new ResizeObserver(reportHeight);
    if (rootRef.current) observer.observe(rootRef.current);
    observer.observe(document.body);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [project, mode, parentOrigin]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!parentOrigin) return;

    const target = event.target as HTMLElement;
    const block = target.closest<HTMLElement>('[data-kislap-block-order]');
    if (!block) return;

    const index = Number(block.dataset.kislapBlockOrder);
    if (!Number.isInteger(index) || index < 0) return;

    event.preventDefault();
    event.stopPropagation();

    const message: PreviewBlockMessage = {
      type: 'kislap:preview-block-select',
      index,
    };

    window.parent.postMessage(message, parentOrigin);
  };

  if (!project) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div ref={rootRef} onClickCapture={handleClick}>
      <Builder
        initialProject={project}
        initialSubdomain="preview"
        preview
        controlledThemeMode={mode}
      />
    </div>
  );
}
