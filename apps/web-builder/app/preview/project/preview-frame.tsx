'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Default } from '../../../../../packages/templates/src/components/portfolio/default';
import { NeoBrutalist } from '../../../../../packages/templates/src/components/portfolio/neo-brutalist';
import { Newspaper } from '../../../../../packages/templates/src/components/portfolio/newspaper';
import { LinktreeDefault } from '../../../../../packages/templates/src/components/linktree/linktree-default';
import { LinktreeNeoBrutalist } from '../../../../../packages/templates/src/components/linktree/linktree-neo-brutalist';
import { MenuDefault } from '../../../../../packages/templates/src/components/menu/menu-default';
import { MenuEditorial } from '../../../../../packages/templates/src/components/menu/menu-editorial';
import { MenuShowcase } from '../../../../../packages/templates/src/components/menu/menu-showcase';
import { MenuRunway } from '../../../../../packages/templates/src/components/menu/menu-runway';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { createMockProject, getPreviewThemeStyles, type PreviewProjectParams } from '@/lib/project-preview-data';

const portfolioTemplateMap: Record<string, React.ComponentType<any>> = {
  default: Default,
  'neo-brutalist': NeoBrutalist,
  newspaper: Newspaper,
};

const linktreeTemplateMap: Record<string, React.ComponentType<any>> = {
  'linktree-default': LinktreeDefault,
  'linktree-neo-brutalist': LinktreeNeoBrutalist,
};

const menuTemplateMap: Record<string, React.ComponentType<any>> = {
  'menu-default': MenuDefault,
  'menu-editorial': MenuEditorial,
  'menu-showcase': MenuShowcase,
  'menu-runway': MenuRunway,
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
      return portfolioTemplateMap[props.layoutName] ?? Default;
    }

    if (props.type === 'linktree') {
      return linktreeTemplateMap[props.layoutName] ?? LinktreeDefault;
    }

    return menuTemplateMap[props.layoutName] ?? MenuDefault;
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
