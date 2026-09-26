'use client';

import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Project } from '@/types/project';
import { ThemeStyles } from '@/types/theme';
import { defaultThemeState } from '@/config/theme';

import { renderTemplate } from '@/hooks/use-template-renderer';
import { usePageActivity } from '@/hooks/api/use-page-activity';
import AcknowledgementBanner from './acknowledgement-banner';

interface BuilderProps {
  initialProject: Project | null;
  initialSubdomain: string;
  preview?: boolean;
  controlledThemeMode?: Mode;
}

function isValidMode(value: string | null): value is Mode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function Builder({
  initialProject,
  initialSubdomain,
  preview = false,
  controlledThemeMode,
}: BuilderProps) {
  const project = initialProject;
  const [themeMode, setThemeMode] = useState<Mode>(controlledThemeMode || 'system');
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light');

  const { trackPageView } = usePageActivity();

  const storageKey = useMemo(() => {
    if (preview || !project) return null;
    return `kislap:site-theme-mode:${project.type}:${project.id ?? initialSubdomain}`;
  }, [preview, project, initialSubdomain]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemMode = () => setSystemMode(mediaQuery.matches ? 'dark' : 'light');

    syncSystemMode();
    mediaQuery.addEventListener('change', syncSystemMode);

    return () => mediaQuery.removeEventListener('change', syncSystemMode);
  }, []);

  useEffect(() => {
    if (controlledThemeMode) {
      setThemeMode(controlledThemeMode);
      return;
    }

    if (!storageKey || typeof window === 'undefined') return;

    const savedMode = window.localStorage.getItem(storageKey);
    setThemeMode(isValidMode(savedMode) ? savedMode : 'system');
  }, [controlledThemeMode, storageKey]);

  const setPersistedThemeMode = useCallback<React.Dispatch<React.SetStateAction<Mode>>>(
    (value) => {
      setThemeMode((previousMode) => {
        const nextMode = typeof value === 'function' ? value(previousMode) : value;

        if (!preview && storageKey && typeof window !== 'undefined') {
          window.localStorage.setItem(storageKey, nextMode);
        }

        return nextMode;
      });
    },
    [preview, storageKey]
  );

  useEffect(() => {
    if (!preview && project?.id) {
      trackPageView(project.id);
    }
  }, [preview, project, trackPageView]);

  if (!project) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-10 bg-background">
        <div className="flex flex-col items-center text-center max-w-md gap-4">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-red-500 font-bold">!</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Unable to Load Site</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Project data could not be retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
  const themeStyles: ThemeStyles =
    rawStyles && typeof rawStyles === 'object' ? (rawStyles as ThemeStyles) : defaultThemeState;

  const effectiveThemeMode = controlledThemeMode || themeMode;
  const resolvedThemeMode: 'light' | 'dark' =
    effectiveThemeMode === 'system' ? systemMode : effectiveThemeMode;

  const TemplateComponent = renderTemplate(
    project,
    resolvedThemeMode,
    themeStyles,
    setPersistedThemeMode
  );

  return (
    <div className="relative flex min-h-full w-full flex-auto flex-col">
      <ComponentThemeProvider themeStyles={themeStyles} mode={resolvedThemeMode}>
        <AcknowledgementBanner />
        <div
          style={{
            fontFamily: 'var(--font-sans)',
          }}
          className="relative bg-background min-h-screen animate-in fade-in duration-700"
        >
          <div className="">{TemplateComponent}</div>
        </div>
      </ComponentThemeProvider>
    </div>
  );
}
