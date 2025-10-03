'use client';

import useSWR from 'swr';
import { Mode } from '@/contexts/settings-context';
import { Preview } from '@/app/(preview)/p/resume/components/preview';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { FloatingToolbar } from '@/app/(preview)/p/resume/components/floating-toolbar';
import { Default } from './templates/default';
import { Default2 } from './templates/default-2';

interface Portfolio {
  id: number;
  name: string;
  job_title: string | null;
  introduction: string;
  about: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin?: string;
  twitter?: string;
  work_experiences: {
    id: number;
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    about: string;
  }[];
  education: {
    id: number;
    school: string;
    level: string;
    degree: string;
    location: string;
    about: string;
  }[];
  showcases: {
    id: number;
    name: string;
    description: string;
    role: string;
  }[];
  skills: { id: number; name: string }[];
}

type TemplateName = 'default' | 'default-2';

export function Wrapper() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR('http://api.kislap.test/api/projects/show/1', fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const mode: Mode = 'light';

  const project = data.data;

  const settings = {
    theme: JSON.parse(JSON.stringify(project.portfolio.theme_object)),
    mode,
  };

  const templates: Record<TemplateName, React.FC<{ portfolio: Portfolio }>> = {
    default: Default,
    'default-2': Default2,
  };

  const renderTemplate = () => {
    const layoutName = project.portfolio.layout_name ?? 'default';
    const Component = templates[layoutName as TemplateName];

    return Component ? <Component portfolio={project.portfolio} /> : null;
  };

  return (
    <div className="relative flex min-h-full w-full flex-auto flex-col gap-10">
      <ComponentThemeProvider themeStyles={settings.theme.styles} mode={mode}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
          }}
          className="relative bg-card"
        >
          <div className="container mx-auto max-w-5xl">{renderTemplate()}</div>
        </div>
      </ComponentThemeProvider>

      <FloatingToolbar />
    </div>
  );
}
