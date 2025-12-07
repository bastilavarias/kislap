'use client';

import useSWR from 'swr';
import { Mode } from '@/contexts/settings-context';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { ThemeStyles } from '@/types/theme'; // Import ThemeStyles for useSWR data typing

import { renderTemplate } from '@/hooks/use-template-renderer';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch project data');
  }
  return res.json();
};

const LoadingDialog = ({ open }: { open: boolean }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-xs">
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <Spinner size={50} className="text-indigo-500" />
          <p className="text-gray-500">Loading Project...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function Wrapper() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<Mode>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      const parts = hostname.split('.');

      let extractedSubdomain: string | null = null;

      if (parts.length > 2 && parts[0].toLowerCase() !== 'www') {
        extractedSubdomain = parts[0];
      }

      if (!extractedSubdomain && (hostname.includes('localhost') || parts.length === 1)) {
        extractedSubdomain = 'sebastech';
      }

      setSubdomain(extractedSubdomain);
    }
  }, []);

  const apiUrl = subdomain
    ? `http://api.kislap.test/api/projects/show/sub-domain/${subdomain}`
    : null;

  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  if (isLoading || subdomain === null) return <LoadingDialog open={true} />;

  if (error)
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-lg">
        Error loading project: {error.message || 'Check API connection.'}
      </div>
    );

  if (!data || !data.data || !data.data.portfolio) {
    return <div className="p-10 text-center text-yellow-600">Project data is incomplete.</div>;
  }

  const project: Project = data.data;

  const settings = {
    theme: JSON.parse(JSON.stringify(project.portfolio.theme_object)),
    mode: themeMode,
  };

  const themeStyles: ThemeStyles = project.portfolio.theme_object.styles;

  const TemplateComponent = renderTemplate(project, themeMode, settings.theme.styles, setThemeMode);

  return (
    <div className="relative flex min-h-full w-full flex-auto flex-col gap-10">
      <ComponentThemeProvider themeStyles={themeStyles} mode={themeMode}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
          }}
          className="relative bg-background"
        >
          <div className="container mx-auto max-w-5xl pt-10">{TemplateComponent}</div>
        </div>
      </ComponentThemeProvider>
    </div>
  );
}
