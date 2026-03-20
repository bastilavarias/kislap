'use client';

import { useMemo, useState } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { MenuDefault } from '@kislap/templates/src/components/menu/menu-default';
import { Button } from '@/components/ui/button';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { Settings } from '@/contexts/settings-context';
import { defaultThemeState } from '@/config/theme';
import { APIResponseProject } from '@/types/api-response';
import { buildMenuPreviewData } from './menu-preview-mapper';
import { MenuFormValues } from '@/lib/schemas/menu';

type PreviewViewport = 'desktop' | 'tablet' | 'mobile';

interface Props {
  project: APIResponseProject | null;
  values: MenuFormValues;
  themeSettings: Settings | null;
}

const viewportOptions: Array<{
  id: PreviewViewport;
  label: string;
  icon: typeof Monitor;
  frameClassName: string;
}> = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, frameClassName: 'mx-auto w-full max-w-[1200px]' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, frameClassName: 'mx-auto w-full max-w-[820px]' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, frameClassName: 'mx-auto w-full max-w-[390px]' },
];

export function MenuLivePreview({
  project,
  values,
  themeSettings,
}: Props) {
  const [viewport, setViewport] = useState<PreviewViewport>('mobile');
  const previewMenu = useMemo(() => buildMenuPreviewData(values, project), [project, values]);
  const themeMode = themeSettings?.mode === 'dark' ? 'dark' : 'light';
  const themeStyles = themeSettings?.theme?.styles || defaultThemeState;
  const activeViewport = viewportOptions.find((option) => option.id === viewport) || viewportOptions[2];
  const Template = MenuDefault;

  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      {viewportOptions.map((option) => {
        const Icon = option.icon;
        return (
          <Button
            key={option.id}
            type="button"
            variant={viewport === option.id ? 'secondary' : 'outline'}
            size="sm"
            className="gap-2 shadow-none"
            onClick={() => setViewport(option.id)}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </Button>
        );
      })}
    </div>
  );

  const templateContent = (
    <ComponentThemeProvider themeStyles={themeStyles} mode={themeMode}>
      <div style={{ fontFamily: 'var(--font-sans)' }}>
        <Template
          project={project as any}
          menu={previewMenu}
          themeMode={themeMode}
          onSetThemeMode={() => {}}
        />
      </div>
    </ComponentThemeProvider>
  );

  return (
    <div className="space-y-4">
      {controls}
      <div className={activeViewport.frameClassName}>{templateContent}</div>
    </div>
  );
}
