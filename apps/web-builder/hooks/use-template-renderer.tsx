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

import { Default } from '@kislap/templates/src/components/portfolio/default';
import { Minimal } from '@kislap/templates/src/components/portfolio/minimal';
import { Bento } from '@kislap/templates/src/components/portfolio/bento';
import { NeoBrutalist } from '@kislap/templates/src/components/portfolio/neo-brutalist';
import { Glass } from '@kislap/templates/src/components/portfolio/glass';
import { Cyber } from '@kislap/templates/src/components/portfolio/cyber';
import { Newspaper } from '@kislap/templates/src/components/portfolio/newspaper';
import { Kinetic } from '@kislap/templates/src/components/portfolio/kinetic';
import { Vaporware } from '@kislap/templates/src/components/portfolio/vaporware';
import { LinktreeDefault } from '@kislap/templates/src/components/linktree/linktree-default';
import { LinktreeNeoBrutalist } from '@kislap/templates/src/components/linktree/linktree-neo-brutalist';
import { MenuDefault } from '@kislap/templates/src/components/menu/menu-default';
import { MenuEditorial } from '@kislap/templates/src/components/menu/menu-editorial';
import { MenuShowcase } from '@kislap/templates/src/components/menu/menu-showcase';
import { MenuBistro } from '@kislap/templates/src/components/menu/menu-bistro';
import { MenuRunway } from '@kislap/templates/src/components/menu/menu-runway';
import { MenuMosaic } from '@kislap/templates/src/components/menu/menu-mosaic';

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
