'use client';

import useSWR from 'swr';
import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useState } from 'react';
import { ThemeStyles } from '@/types/theme';
import { Project } from '@/types/project';

import { renderTemplate } from '@/hooks/use-template-renderer';

const LoadingDialog = ({ open }: { open: boolean }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="w-full h-full flex items-center justify-center">
          <Spinner size={50} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function Wrapper() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  //@TODO: Get the id of the project in token passed and check it if expired or something.
  const { data, error, isLoading } = useSWR('http://api.kislap.test/api/projects/show/1', fetcher);
  const [themeMode, setThemeMode] = useState<Mode>('light');

  if (error) return <div>failed to load</div>;
  if (isLoading) return <LoadingDialog open={isLoading} />;

  const project: Project = data.data;

  const settings = {
    theme: JSON.parse(JSON.stringify(project.portfolio.theme_object)),
    mode: themeMode,
  };

  const TemplateComponent = renderTemplate(project, themeMode, settings.theme.styles, setThemeMode);

  return (
    <div className="relative flex min-h-full w-full flex-auto flex-col gap-10">
      <ComponentThemeProvider themeStyles={settings.theme.styles} mode={themeMode}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
          }}
          className="relative bg-background"
        >
          <div className="container mx-auto max-w-5xl pt-10">{TemplateComponent}</div>
        </div>
      </ComponentThemeProvider>
      //@TODO: Implement quick action buttons here if preview mode.
    </div>
  );
}
