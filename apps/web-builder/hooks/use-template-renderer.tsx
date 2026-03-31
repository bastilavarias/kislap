import React from 'react';
import { Mode } from '@/contexts/settings-context';
import { ThemeStyles } from '@/types/theme';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';

interface TemplateProps {
  project: Project;
  portfolio?: Portfolio;
  biz?: any;
  linktree?: any;
  menu?: any;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

import PortfolioTemplates from '../../../packages/templates/src/components/portfolio';
import LinktreeTemplates from '../../../packages/templates/src/components/linktree';
import MenuTemplates from '../../../packages/templates/src/components/menu';

const { Default, Minimal, Bento, NeoBrutalist, Glass, Cyber, Newspaper, Kinetic, Vaporware } =
  PortfolioTemplates;
const { LinktreeDefault, LinktreeNeoBrutalist } = LinktreeTemplates;
const { MenuDefault, MenuEditorial, MenuShowcase, MenuBistro, MenuRunway, MenuMosaic } =
  MenuTemplates;

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

const linktreeTemplates: Record<TemplateName, React.FC<TemplateProps>> = {
  'linktree-default': LinktreeDefault,
  'linktree-neo-brutalist': LinktreeNeoBrutalist,
};

const menuTemplates: Record<TemplateName, React.FC<TemplateProps>> = {
  'menu-default': MenuDefault,
  'menu-editorial': MenuEditorial,
  'menu-showcase': MenuShowcase,
  'menu-bistro': MenuBistro,
  'menu-runway': MenuRunway,
  'menu-mosaic': MenuMosaic,
};

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
  } else if (project.type === 'linktree') {
    layoutName = project.linktree.layout_name || 'linktree-default';
    Component = linktreeTemplates[layoutName as TemplateName];
  } else if (project.type === 'menu') {
    layoutName = project.menu.layout_name || 'menu-default';
    Component = menuTemplates[layoutName as TemplateName];
  }

  return Component ? (
    <Component
      project={project}
      portfolio={project.portfolio}
      biz={project.biz}
      linktree={project.linktree}
      menu={project.menu}
      themeMode={themeMode}
      themeStyles={themeStyles}
      onSetThemeMode={onSetThemeMode}
    />
  ) : null;
};
