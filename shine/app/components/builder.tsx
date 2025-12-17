'use client';

import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { useState, useEffect } from 'react'; // useEffect kept only for page view tracking
import { Project } from '@/types/project';
import { ThemeStyles } from '@/types/theme';

import { renderTemplate } from '@/hooks/use-template-renderer';
import { usePageActivity } from '@/hooks/api/use-page-activity';

interface BuilderProps {
  initialProject: Project | null;
  initialSubdomain: string;
}

export function Builder({ initialProject, initialSubdomain }: BuilderProps) {
  const [project] = useState<Project | null>(initialProject);
  const [subdomain] = useState<string | null>(initialSubdomain);
  const [themeMode, setThemeMode] = useState<Mode>('light');

  const { trackPageView } = usePageActivity();

  useEffect(() => {
    if (project?.id) {
      trackPageView(project.id);
    }
  }, [project, trackPageView]);

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

  const themeObject = project.portfolio?.theme_object || {};
  //@ts-ignore
  const themeStyles: ThemeStyles = themeObject?.styles || {};

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
