'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ThemeStyleProps, ThemeStyles } from '@/types/theme';
import { colorFormatter } from '@/lib/color-converter';
import { getShadowVariables } from '@/lib/shadows';
import { COMMON_STYLES } from '@/config/theme';

type Theme = 'dark' | 'light';

type ComponentThemeProviderProps = {
  children: ReactNode;
  themeStyles: ThemeStyles;
  mode?: Theme;
  className?: string;
};

type ComponentThemesContext = {
  theme: Theme;
};

const COMMON_NON_COLOR_KEYS = COMMON_STYLES;

const ComponentThemesContext = createContext<ComponentThemesContext | null>(null);

function applyCommonStyles(themeStyles: ThemeStyleProps): Record<string, string> {
  const vars: Record<string, string> = {};

  Object.entries(themeStyles)
    .filter(([key]) =>
      COMMON_NON_COLOR_KEYS.includes(key as (typeof COMMON_NON_COLOR_KEYS)[number])
    )
    .forEach(([key, value]) => {
      if (typeof value === 'string') {
        vars[key === 'spacing' ? '--theme-spacing' : `--${key}`] = value;
      }
    });

  return vars;
}

function applyThemeColors(themeStyles: ThemeStyles, mode: Theme): Record<string, string> {
  const vars: Record<string, string> = {};

  Object.entries(themeStyles[mode]).forEach(([key, value]) => {
    if (
      typeof value === 'string' &&
      !COMMON_NON_COLOR_KEYS.includes(key as (typeof COMMON_NON_COLOR_KEYS)[number])
    ) {
      const hslValue = colorFormatter(value, 'oklch');
      vars[`--${key}`] = hslValue;
    }
  });

  Object.assign(vars, getShadowVariables(themeStyles[mode] as ThemeStyleProps));

  return vars;
}

export function ComponentThemeProvider({
  children,
  themeStyles,
  mode = 'light',
  className,
}: ComponentThemeProviderProps) {
  const styleVars = {
    ...applyCommonStyles(themeStyles.light),
    ...applyThemeColors(themeStyles as ThemeStyles, mode),
  };

  return (
    <ComponentThemesContext.Provider value={{ theme: mode }}>
      <div
        className={className}
        style={{
          ...styleVars,
          colorScheme: mode,
        }}
      >
        {children}
      </div>
    </ComponentThemesContext.Provider>
  );
}

export const useComponentTheme = () => {
  const ctx = useContext(ComponentThemesContext);
  if (!ctx) throw new Error('useComponentTheme must be used within ComponentThemeProvider');
  return ctx;
};
