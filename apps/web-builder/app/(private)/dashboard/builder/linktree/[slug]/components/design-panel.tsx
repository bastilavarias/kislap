'use client';

import { CheckCircle2, CloudFog, Cpu, LayoutTemplate } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { cn } from '@/lib/utils';
import { Settings } from '@/contexts/settings-context';

const LAYOUT_OPTIONS = [
  {
    id: 'linktree-default',
    name: 'Default',
    icon: LayoutTemplate,
    description: 'Clean & balanced.',
  },
  {
    id: 'linktree-neo-brutalist',
    name: 'Neo Brutalist',
    icon: LayoutTemplate,
    description: 'Raw, bold, and high-contrast.',
  },
  { id: 'linktree-retro', name: 'Retro', icon: CloudFog, description: 'Vintage & nostalgic.' },
  { id: 'linktree-cyber', name: 'Cyber', icon: Cpu, description: 'Dark & futuristic.' },
];

interface DesignPanelProps {
  layout: string;
  setLayout: (layout: string) => void;
  backgroundStyle: 'plain' | 'grid';
  setBackgroundStyle: (style: 'plain' | 'grid') => void;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
}

export function DesignPanel({
  layout,
  setLayout,
  backgroundStyle,
  setBackgroundStyle,
  localThemeSettings,
  setLocalThemeSettings,
}: DesignPanelProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <h2 className="text-xl font-bold mb-4 hidden lg:block">Design & Style</h2>
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-4 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="layout"
            className="rounded-lg shadow-none data-[state=active]:bg-background"
          >
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="rounded-lg shadow-none data-[state=active]:bg-background"
          >
            Theme
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layout" className="mt-0">
          <Card className="shadow-none border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choose Layout</CardTitle>
              <CardDescription>Select a structure for your linktree page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <p className="text-sm font-semibold mb-2">Background</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['plain', 'grid'] as const).map((option) => {
                    const isSelected = backgroundStyle === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setBackgroundStyle(option)}
                        className={cn(
                          'rounded-xl border px-3 py-2 text-sm capitalize text-left transition-colors',
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-muted hover:border-muted-foreground/30'
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
              {LAYOUT_OPTIONS.map((option) => {
                const isSelected = layout === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setLayout(option.id)}
                    className={cn(
                      'cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30 hover:bg-muted/30'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-full mb-3 transition-colors',
                        isSelected
                          ? 'bg-background text-primary'
                          : 'bg-muted text-muted-foreground group-hover:bg-background'
                      )}
                    >
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className={cn('font-semibold text-sm', isSelected && 'text-primary')}>
                        {option.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="theme" className="mt-0">
          <Card className="shadow-none border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Choose Theme</CardTitle>
              <CardDescription>Customize colors, fonts, and radius.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeControlPanel
                stateless={true}
                themeSettings={localThemeSettings}
                setThemeSettings={setLocalThemeSettings}
                hideTopActionButtons={true}
                hideModeToggle={true}
                hideScrollArea={true}
                hideThemeSaverButton={false}
                hideImportButton={true}
                hideRandomButton={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
