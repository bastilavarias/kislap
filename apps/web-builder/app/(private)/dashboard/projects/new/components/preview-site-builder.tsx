'use client';

import { useMemo, useState } from 'react';
import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { ThemeStyles } from '@/types/theme';
import { defaultThemeState } from '@/config/theme';
import { renderTemplate } from '@/hooks/use-template-renderer';
import type { Project } from '@/types/project';
import Link from 'next/link';

interface PreviewSiteBuilderProps {
  project: Project | null;
}

function PreviewAcknowledgementBanner() {
  const builderUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kislap.app/';

  return (
    <div className="w-full border-b border-border bg-background py-2.5 text-center text-xs text-muted-foreground backdrop-blur-sm">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 md:justify-between">
          <div>
            <span className="opacity-80">This site is powered by</span>{' '}
            <span className="font-bold tracking-tight text-primary">KISLAP</span>
          </div>

          <div>
            Visit{' '}
            <Link
              href={builderUrl}
              target="_blank"
              className="font-medium underline decoration-primary decoration-2 underline-offset-2 transition-colors hover:text-primary"
            >
              {builderUrl}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreviewSiteBuilder({ project }: PreviewSiteBuilderProps) {
  const [themeMode, setThemeMode] = useState<Mode>('light');

  const themeStyles = useMemo<ThemeStyles>(() => {
    if (!project) return defaultThemeState;

    let themeObject: unknown = null;
    if (project.type === 'portfolio') {
      themeObject = project.portfolio?.theme_object;
    } else if (project.type === 'biz') {
      themeObject = project.biz?.theme_object || {};
    } else if (project.type === 'linktree') {
      themeObject = project.linktree?.theme_object || {};
    } else if (project.type === 'menu') {
      themeObject = project.menu?.theme_object || {};
    }

    let normalizedThemeObject: Record<string, unknown> = {};
    if (typeof themeObject === 'string') {
      try {
        const parsedThemeObject = JSON.parse(themeObject);
        if (parsedThemeObject && typeof parsedThemeObject === 'object') {
          normalizedThemeObject = parsedThemeObject as Record<string, unknown>;
        }
      } catch {
        normalizedThemeObject = {};
      }
    } else if (themeObject && typeof themeObject === 'object') {
      normalizedThemeObject = themeObject as Record<string, unknown>;
    }

    const rawStyles = normalizedThemeObject.styles;
    return rawStyles && typeof rawStyles === 'object'
      ? (rawStyles as ThemeStyles)
      : defaultThemeState;
  }, [project]);

  if (!project) {
    return null;
  }

  const TemplateComponent = renderTemplate(project, themeMode, themeStyles, setThemeMode);

  return (
    <div className="relative flex min-h-full w-full flex-auto flex-col gap-10">
      <ComponentThemeProvider themeStyles={themeStyles} mode={themeMode === 'system' ? 'light' : themeMode}>
        <PreviewAcknowledgementBanner />
        <div
          style={{ fontFamily: 'var(--font-sans)' }}
          className="relative min-h-screen animate-in fade-in duration-700 bg-background"
        >
          <div>{TemplateComponent}</div>
        </div>
      </ComponentThemeProvider>
    </div>
  );
}

