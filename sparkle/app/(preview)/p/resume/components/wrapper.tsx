'use client';

import useSWR from 'swr';
import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { Default } from './templates/default';
import { Default2 } from './templates/default-2';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useState } from 'react';
import { ThemeStyles } from '@/types/theme';
import { APIResponsePortfolio } from '@/types/api-response';

type TemplateName = 'default' | 'default-2';

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
  const { data, error, isLoading } = useSWR('http://api.kislap.test/api/projects/show/1', fetcher);
  const [themeMode, setThemeMode] = useState<Mode>('light');

  if (error) return <div>failed to load</div>;
  if (isLoading) return <LoadingDialog open={isLoading} />;

  const project = data.data;

  const settings = {
    theme: JSON.parse(JSON.stringify(project.portfolio.theme_object)),
    mode: themeMode,
  };

  const templates: Record<
    TemplateName,
    React.FC<{
      portfolio: APIResponsePortfolio;
      onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
      themeMode: Mode;
      themeStyles: ThemeStyles;
    }>
  > = {
    default: Default,
    'default-2': Default2,
  };

  const renderTemplate = (
    themeMode: Mode,
    themeStyles: ThemeStyles,
    onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>
  ) => {
    const layoutName = project.portfolio.layout_name ?? 'default';
    const Component = templates[layoutName as TemplateName];

    return Component ? (
      <Component
        portfolio={project.portfolio}
        themeMode={themeMode}
        themeStyles={themeStyles}
        onSetThemeMode={onSetThemeMode}
      />
    ) : null;
  };

  return (
    <div className="relative flex min-h-full w-full flex-auto flex-col gap-10">
      <ComponentThemeProvider themeStyles={settings.theme.styles} mode={themeMode}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
          }}
          className="relative bg-background"
        >
          <div className="container mx-auto max-w-5xl py-10">
            {renderTemplate(themeMode, settings.theme.styles, setThemeMode)}
          </div>
        </div>

        <footer className="border-t border-border py-8 bg-background">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()}{' '}
              <span className="font-medium text-foreground">Kislap</span> — sparking ideas into
              reality ✨
            </p>
          </div>
        </footer>
      </ComponentThemeProvider>
    </div>
  );
}
