'use client';

import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';

type PreviewWrapperProps = {
  children: React.ReactNode;
  settings: any;
  mode: any;
  className?: string;
};

export function PreviewWrapper({ children, settings, mode }: PreviewWrapperProps) {
  return (
    <ComponentThemeProvider themeStyles={settings.theme.styles} mode={mode}>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
        }}
      >
        {children}
      </div>
    </ComponentThemeProvider>
  );
}
