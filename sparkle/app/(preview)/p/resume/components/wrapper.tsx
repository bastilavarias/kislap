'use client';

import useSWR from 'swr';
import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { FloatingToolbar } from '@/app/(preview)/p/resume/components/floating-toolbar';
import { Default } from './templates/default';
import { Default2 } from './templates/default-2';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Heart } from 'lucide-react';

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

  if (error) return <div>failed to load</div>;
  if (isLoading) return <LoadingDialog open={isLoading} />;

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
          className="relative"
        >
          <div className="container mx-auto max-w-5xl py-10">{renderTemplate()}</div>
        </div>
      </ComponentThemeProvider>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{' '}
            <span className="font-medium text-foreground">Kislap</span> — sparking ideas into
            reality ✨
          </p>
        </div>
      </footer>

      <FloatingToolbar />
    </div>
  );
}
