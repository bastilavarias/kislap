import React from 'react';
import { Mode } from '@/contexts/settings-context';
import { ThemeStyles } from '@/types/theme';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';

interface TemplateProps {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

import { Default } from '@/components/web-templates/default';
import { Bento } from '@/components/web-templates/bento';
import { NeoBrutalist } from '@/components/web-templates/neo-brutalist';
import { Minimal } from '@/components/web-templates/minimal';
import { Glass } from '@/components/web-templates/glass';
import { Cyber } from '@/components/web-templates/cyber';
import { Newspaper } from '@/components/web-templates/newspaper';
import { Kinetic } from '@/components/web-templates/kinetic';
import { Vaporware } from '@/components/web-templates/vaporware';

type TemplateName = string;

const templates: Record<TemplateName, React.FC<TemplateProps>> = {
  default: Default,
  minimal: Minimal,
  bento: Bento,
  'neo-brutalist': NeoBrutalist,
  glass: Glass,
  cyber: Cyber,
  newspaper: Newspaper,
  kinetic: Kinetic,
  vaporware: Vaporware,
};

/**
 * A utility function to render the correct template component based on layout_name.
 * @param project The project data containing the portfolio and layout_name.
 * @param themeMode The current theme mode ('light' or 'dark').
 * @param themeStyles The current theme styles.
 * @param onSetThemeMode The state setter for theme mode.
 * @returns The rendered template component or null.
 */
export const renderTemplate = (
  project: Project,
  themeMode: Mode,
  themeStyles: ThemeStyles,
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>
): JSX.Element | null => {
  const layoutName = project.portfolio.layout_name ?? 'default';
  const Component = templates[layoutName as TemplateName];

  return Component ? (
    <Component
      project={project}
      portfolio={project.portfolio}
      themeMode={themeMode}
      themeStyles={themeStyles}
      onSetThemeMode={onSetThemeMode}
    />
  ) : null;
};
