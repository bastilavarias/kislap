'use client';

import useSWR from 'swr';
import { Mode } from '@/contexts/settings-context';
import { Preview } from '@/app/(preview)/p/resume/components/preview';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { FloatingToolbar } from '@/app/(preview)/p/resume/components/floating-toolbar';

export function Wrapper() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR('http://api.kislap.test/api/projects/show/1', fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  console.log(data);

  const mode: Mode = 'light';
  const settings = {
    theme: {
      preset: 'nature',
      styles: JSON.parse(JSON.stringify(data.theme_object)),
    },
    mode,
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
          <div className="container mx-auto max-w-5xl">
            <Preview />
          </div>
        </div>
      </ComponentThemeProvider>

      <FloatingToolbar />
    </div>
  );
}
