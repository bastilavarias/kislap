'use client';
import { Mode } from '@/contexts/settingsContext';
import { Preview } from '@/app/(preview)/p/resume/components/preview';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { FloatingToolbar } from '@/app/(preview)/p/resume/components/floating-toolbar';

export function Wrapper() {
  const mode: Mode = 'light';
  const settings = {
    theme: {
      preset: 'nature',
      styles: {
        light: {
          background: 'oklch(0.97 0.01 80.72)',
          foreground: 'oklch(0.30 0.04 30.20)',
          card: 'oklch(0.97 0.01 80.72)',
          'card-foreground': 'oklch(0.30 0.04 30.20)',
          popover: 'oklch(0.97 0.01 80.72)',
          'popover-foreground': 'oklch(0.30 0.04 30.20)',
          primary: 'oklch(0.52 0.13 144.17)',
          'primary-foreground': 'oklch(1.00 0 0)',
          secondary: 'oklch(0.96 0.02 147.64)',
          'secondary-foreground': 'oklch(0.43 0.12 144.31)',
          muted: 'oklch(0.94 0.01 74.42)',
          'muted-foreground': 'oklch(0.45 0.05 39.21)',
          accent: 'oklch(0.90 0.05 146.04)',
          'accent-foreground': 'oklch(0.43 0.12 144.31)',
          destructive: 'oklch(0.54 0.19 26.72)',
          border: 'oklch(0.88 0.02 74.64)',
          input: 'oklch(0.88 0.02 74.64)',
          ring: 'oklch(0.52 0.13 144.17)',
          'chart-1': 'oklch(0.67 0.16 144.21)',
          'chart-2': 'oklch(0.58 0.14 144.18)',
          'chart-3': 'oklch(0.52 0.13 144.17)',
          'chart-4': 'oklch(0.43 0.12 144.31)',
          'chart-5': 'oklch(0.22 0.05 145.73)',
          radius: '0.5rem',
          sidebar: 'oklch(0.94 0.01 74.42)',
          'sidebar-foreground': 'oklch(0.30 0.04 30.20)',
          'sidebar-primary': 'oklch(0.52 0.13 144.17)',
          'sidebar-primary-foreground': 'oklch(1.00 0 0)',
          'sidebar-accent': 'oklch(0.90 0.05 146.04)',
          'sidebar-accent-foreground': 'oklch(0.43 0.12 144.31)',
          'sidebar-border': 'oklch(0.88 0.02 74.64)',
          'sidebar-ring': 'oklch(0.52 0.13 144.17)',
          'font-sans': 'Montserrat, sans-serif',
          'font-serif': 'Merriweather, serif',
          'font-mono': 'Source Code Pro, monospace',
          'shadow-color': 'hsl(0 0% 0%)',
          'shadow-opacity': '0.1',
          'shadow-blur': '3px',
          'shadow-spread': '0px',
          'shadow-offset-x': '0',
          'shadow-offset-y': '1px',
          'letter-spacing': '0em',
          spacing: '0.25rem',
        },
        dark: {
          background: 'oklch(0.27 0.03 150.77)',
          foreground: 'oklch(0.94 0.01 72.66)',
          card: 'oklch(0.33 0.03 146.99)',
          'card-foreground': 'oklch(0.94 0.01 72.66)',
          popover: 'oklch(0.33 0.03 146.99)',
          'popover-foreground': 'oklch(0.94 0.01 72.66)',
          primary: 'oklch(0.67 0.16 144.21)',
          'primary-foreground': 'oklch(0.22 0.05 145.73)',
          secondary: 'oklch(0.39 0.03 142.99)',
          'secondary-foreground': 'oklch(0.90 0.02 142.55)',
          muted: 'oklch(0.33 0.03 146.99)',
          'muted-foreground': 'oklch(0.86 0.02 76.10)',
          accent: 'oklch(0.58 0.14 144.18)',
          'accent-foreground': 'oklch(0.94 0.01 72.66)',
          destructive: 'oklch(0.54 0.19 26.72)',
          border: 'oklch(0.39 0.03 142.99)',
          input: 'oklch(0.39 0.03 142.99)',
          ring: 'oklch(0.67 0.16 144.21)',
          'chart-1': 'oklch(0.77 0.12 145.30)',
          'chart-2': 'oklch(0.72 0.14 144.89)',
          'chart-3': 'oklch(0.67 0.16 144.21)',
          'chart-4': 'oklch(0.63 0.15 144.20)',
          'chart-5': 'oklch(0.58 0.14 144.18)',
          sidebar: 'oklch(0.27 0.03 150.77)',
          'sidebar-foreground': 'oklch(0.94 0.01 72.66)',
          'sidebar-primary': 'oklch(0.67 0.16 144.21)',
          'sidebar-primary-foreground': 'oklch(0.22 0.05 145.73)',
          'sidebar-accent': 'oklch(0.58 0.14 144.18)',
          'sidebar-accent-foreground': 'oklch(0.94 0.01 72.66)',
          'sidebar-border': 'oklch(0.39 0.03 142.99)',
          'sidebar-ring': 'oklch(0.67 0.16 144.21)',
          'shadow-color': 'hsl(0 0% 0%)',
          'shadow-opacity': '0.1',
          'shadow-blur': '3px',
          'shadow-spread': '0px',
          'shadow-offset-x': '0',
          'shadow-offset-y': '1px',
          'letter-spacing': '0em',
          spacing: '0.25rem',
        },
        css: {},
      },
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
