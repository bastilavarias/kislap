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

import { BizTemplates, PortfolioTemplates } from '@kislap/templates';

const { Default, Minimal, Bento, NeoBrutalist, Glass, Cyber, Newspaper, Kinetic, Vaporware } =
  PortfolioTemplates;
const { BizDefault, BizCyber, BizRetro } = BizTemplates;

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

const bizTemplates: Record<TemplateName, React.FC<TemplateProps>> = {
  'biz-default': BizDefault,
  'biz-cyber': BizCyber,
  'biz-retro': BizRetro,
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
  let layoutName = 'default';
  let Component = null;

  if (project.type === 'portfolio') {
    layoutName = project.portfolio.layout_name || 'default';
    Component = templates[layoutName as TemplateName];
  } else if (project.type === 'biz') {
    layoutName = project.biz.layout_name || 'biz-default';
    Component = bizTemplates[layoutName as TemplateName];
  }

  return Component ? (
    <Component
      project={project}
      portfolio={project.portfolio}
      biz={project.biz}
      themeMode={themeMode}
      themeStyles={themeStyles}
      onSetThemeMode={onSetThemeMode}
    />
  ) : null;
};
