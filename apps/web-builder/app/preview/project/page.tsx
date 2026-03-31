import type { Metadata } from 'next';
import { ProjectPreviewFrame } from './preview-frame';
import type { StarterProjectType } from '@/lib/project-starters';

export const metadata: Metadata = {
  title: 'Project Preview',
  robots: {
    index: false,
    follow: false,
  },
};

function isProjectType(value: string | null): value is StarterProjectType {
  return value === 'portfolio' || value === 'linktree' || value === 'menu';
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const type = isProjectType(typeof params.type === 'string' ? params.type : null)
    ? params.type
    : 'portfolio';
  const starterId = typeof params.starter === 'string' ? params.starter : '';
  const layoutName = typeof params.layout === 'string' ? params.layout : '';
  const themePreset = typeof params.theme === 'string' ? params.theme : '';
  const projectName = typeof params.name === 'string' ? params.name : 'John Doe';

  return (
    <ProjectPreviewFrame
      type={type}
      starterId={starterId}
      layoutName={layoutName}
      themePreset={themePreset}
      projectName={projectName}
    />
  );
}

