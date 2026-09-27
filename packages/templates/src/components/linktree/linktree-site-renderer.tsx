"use client";

import type React from "react";
import { LinktreeDefault } from "./linktree-default";

type Mode = "light" | "dark" | "system";
type ThemeStyle = Record<string, string | undefined>;
type ThemeStyles = {
  light: ThemeStyle;
  dark: ThemeStyle;
};

const COMMON_STYLE_KEYS = new Set([
  "font-sans",
  "font-serif",
  "font-mono",
  "radius",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
  "letter-spacing",
  "spacing",
]);

function shadowVars(styles: ThemeStyle) {
  const color = styles["shadow-color"] || "hsl(0 0% 0%)";
  const opacity = Math.max(0, Math.min(1, Number.parseFloat(styles["shadow-opacity"] || "0.1")));
  const shadowColor = `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
  const offsetX = styles["shadow-offset-x"] || "0px";
  const offsetY = styles["shadow-offset-y"] || "1px";
  const blur = styles["shadow-blur"] || "2px";
  const spread = styles["shadow-spread"] || "0px";
  const base = `${offsetX} ${offsetY} ${blur} ${spread} ${shadowColor}`;

  return {
    "--shadow-color": color,
    "--shadow-2xs": base,
    "--shadow-xs": base,
    "--shadow-sm": base,
    "--shadow": base,
    "--shadow-md": base,
    "--shadow-lg": base,
    "--shadow-xl": base,
    "--shadow-2xl": base,
  };
}

function normalizeSpacing(value: string) {
  const remMatch = value.trim().match(/^(-?\d*\.?\d+)rem$/);
  if (!remMatch) return value;

  return `${Number.parseFloat(remMatch[1]) * 16}px`;
}

function themeVariables(themeStyles: ThemeStyles, mode: "light" | "dark") {
  const vars: Record<string, string> = {};
  const common = themeStyles.light || {};
  const active = themeStyles[mode] || themeStyles.light || {};

  Object.entries(common).forEach(([key, value]) => {
    if (!value || !COMMON_STYLE_KEYS.has(key)) return;
    vars[key === "spacing" ? "--theme-spacing" : `--${key}`] =
      key === "spacing" ? normalizeSpacing(value) : value;
  });

  Object.entries(active).forEach(([key, value]) => {
    if (!value || COMMON_STYLE_KEYS.has(key)) return;
    vars[`--${key}`] = value;
  });

  Object.assign(vars, shadowVars(active));
  return vars;
}

function AcknowledgementBar({ builderUrl }: { builderUrl: string }) {
  return (
    <div className="w-full border-b border-border bg-background py-2.5 text-center text-xs text-muted-foreground backdrop-blur-sm">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 md:justify-between">
          <div>
            <span className="opacity-80">This site is powered by</span>{" "}
            <span className="font-bold tracking-tight text-primary">✨KISLAP✨</span>
          </div>
          <div>
            Visit{" "}
            <a
              href={builderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline decoration-primary decoration-2 underline-offset-2 transition-colors hover:text-primary hover:decoration-accent"
            >
              {builderUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  linktree: any;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  builderUrl?: string;
};

export function LinktreeSiteRenderer({
  linktree,
  themeMode,
  themeStyles,
  onSetThemeMode,
  builderUrl = "https://kislap.app/",
}: Props) {
  const mode: "light" | "dark" = themeMode === "dark" ? "dark" : "light";
  const vars = themeVariables(themeStyles, mode);

  return (
    <div
      className="relative flex min-h-full w-full flex-auto flex-col [box-sizing:border-box]"
      style={{
        ...vars,
        colorScheme: mode,
        fontFamily: "var(--font-sans)",
      } as React.CSSProperties}
    >
      <AcknowledgementBar builderUrl={builderUrl} />
      <div className="relative min-h-screen bg-background">
        <LinktreeDefault
          linktree={linktree}
          themeMode={mode as any}
          onSetThemeMode={onSetThemeMode as any}
        />
      </div>
    </div>
  );
}
