'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  LinktreeTemplates,
  MenuTemplates,
  PortfolioTemplates,
} from '@kislap/templates';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { createMockProject, getPreviewThemeStyles, type PreviewProjectParams } from '@/lib/project-preview-data';

const portfolioTemplateMap: Record<string, React.ComponentType<any>> = {
  default: PortfolioTemplates.Default,
  'neo-brutalist': PortfolioTemplates.NeoBrutalist,
  newspaper: PortfolioTemplates.Newspaper,
};

const linktreeTemplateMap: Record<string, React.ComponentType<any>> = {
  'linktree-default': LinktreeTemplates.LinktreeDefault,
  'linktree-neo-brutalist': LinktreeTemplates.LinktreeNeoBrutalist,
};

const menuTemplateMap: Record<string, React.ComponentType<any>> = {
  'menu-default': MenuTemplates.MenuDefault,
  'menu-editorial': MenuTemplates.MenuEditorial,
  'menu-showcase': MenuTemplates.MenuShowcase,
  'menu-runway': MenuTemplates.MenuRunway,
};

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

export function ProjectPreviewFrame(props: PreviewProjectParams) {
  const previewProject = useMemo(() => createMockProject(props), [props]);
  const themeStyles = useMemo(() => getPreviewThemeStyles(props.themePreset), [props.themePreset]);

  const PreviewComponent = useMemo(() => {
    if (props.type === 'portfolio') {
      return portfolioTemplateMap[props.layoutName] ?? PortfolioTemplates.Default;
    }

    if (props.type === 'linktree') {
      return linktreeTemplateMap[props.layoutName] ?? LinktreeTemplates.LinktreeDefault;
    }

    return menuTemplateMap[props.layoutName] ?? MenuTemplates.MenuDefault;
  }, [props.layoutName, props.type]);

  return (
    <ComponentThemeProvider themeStyles={themeStyles} mode="light">
      <div
        className="relative flex min-h-full w-full flex-auto flex-col gap-10 bg-background"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <PreviewAcknowledgementBanner />
        <div className="relative min-h-screen bg-background">
          <PreviewComponent
            project={previewProject}
            portfolio={previewProject.portfolio}
            linktree={previewProject.linktree}
            menu={previewProject.menu}
            biz={previewProject.biz}
            themeMode="light"
            themeStyles={themeStyles}
            onSetThemeMode={() => undefined}
          />
        </div>
      </div>
    </ComponentThemeProvider>
  );
}
