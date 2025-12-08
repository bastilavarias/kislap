'use client';

import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { ThemeStyles } from '@/types/theme';

import { renderTemplate } from '@/hooks/use-template-renderer';
import { usePageActivity } from '@/hooks/api/use-page-activity';

const extractSubDomain = () => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  let subDomain: string | null = null;

  if (parts.length > 2 && parts[0].toLowerCase() !== 'www') {
    subDomain = parts[0];
  }

  if (!subDomain && (hostname.includes('localhost') || parts.length === 1)) {
    subDomain = 'sebastech';
  }

  return subDomain;
};

export function Builder() {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<Mode>('light');

  const { trackPageView } = usePageActivity();

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const currentSubdomain = extractSubDomain();
        setSubdomain(currentSubdomain);
        if (!currentSubdomain) {
          throw new Error('No subdomain found.');
        }
        const [response] = await Promise.all([
          fetch(`http://api.kislap.test/api/projects/show/sub-domain/${currentSubdomain}`),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
        if (!response.ok) {
          throw new Error(`Failed to load project: ${response.statusText}`);
        }
        const json = await response.json();
        if (!json.data) {
          throw new Error('Project data is missing.');
        }
        setProject(json.data);
        trackPageView(json.data.id);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 ease-out">
          <div className="mb-4 text-4xl md:text-5xl font-black tracking-wider text-foreground">
            ✨KISLAP✨
          </div>
          <div className="text-sm md:text-base text-muted-foreground font-medium text-center px-4">
            ✨ Transform your forms into beautiful websites.
          </div>
          <div className="mt-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary ease-in-out" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-10 bg-background">
        <div className="flex flex-col items-center text-center max-w-md gap-4">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-red-500 font-bold">!</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Unable to Load Site</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {error || 'Please check your connection.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const themeObject = project.portfolio?.theme_object || {};
  const themeStyles: ThemeStyles = themeObject.styles || {};

  const settings = {
    theme: JSON.parse(JSON.stringify(themeObject)),
    mode: themeMode,
  };

  const TemplateComponent = renderTemplate(project, themeMode, settings.theme.styles, setThemeMode);

  return (
    <div className="relative flex min-h-full w-full flex-auto flex-col gap-10">
      <ComponentThemeProvider themeStyles={themeStyles} mode={themeMode}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
          }}
          className="relative bg-background min-h-screen animate-in fade-in duration-700"
        >
          <div className="container mx-auto max-w-5xl pt-10">{TemplateComponent}</div>
        </div>
      </ComponentThemeProvider>
    </div>
  );
}
