'use client';

import {
  BriefcaseBusiness,
  CheckCircle2,
  LayoutGrid,
  Rows3,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { cn } from '@/lib/utils';
import { Settings } from '@/contexts/settings-context';
import {
  builderTabsListClass,
  builderTabsTriggerClass,
} from '@/components/builder/builder-ui';

const COMPOSITION_OPTIONS = [
  {
    id: 'classic',
    name: 'Classic',
    icon: Rows3,
    description: 'Simple single-column flow. Best for fast personal pages.',
  },
  {
    id: 'bento',
    name: 'Bento',
    icon: LayoutGrid,
    description: 'Mixed-width blocks that snap into a denser grid.',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: BriefcaseBusiness,
    description: 'Wide showcase blocks with supporting skills and links.',
  },
  {
    id: 'creator',
    name: 'Creator',
    icon: Sparkles,
    description: 'Profile-first layout with featured content and compact links.',
  },
] as const;

interface DesignPanelProps {
  compositionLayout: 'classic' | 'bento' | 'portfolio' | 'creator';
  setCompositionLayout: (layout: 'classic' | 'bento' | 'portfolio' | 'creator') => void;
  backgroundStyle: 'plain' | 'grid';
  setBackgroundStyle: (style: 'plain' | 'grid') => void;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
}

export function DesignPanel({
  compositionLayout,
  setCompositionLayout,
  backgroundStyle,
  setBackgroundStyle,
  localThemeSettings,
  setLocalThemeSettings,
}: DesignPanelProps) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <h2 className="mb-4 hidden text-xl font-black uppercase lg:block">Design</h2>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className={`${builderTabsListClass} mb-4 grid h-12 w-full grid-cols-2`}>
          <TabsTrigger value="layout" className={builderTabsTriggerClass}>
            Layout
          </TabsTrigger>
          <TabsTrigger value="theme" className={builderTabsTriggerClass}>
            Theme
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Page Layout</CardTitle>
              <CardDescription>
                Pick a starting composition. Individual blocks can still override their width.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {COMPOSITION_OPTIONS.map((option) => {
                  const isSelected = compositionLayout === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setCompositionLayout(option.id)}
                      className={cn(
                        'relative border-2 border-black p-3 text-left transition-all',
                        isSelected
                          ? 'bg-secondary shadow-[4px_4px_0_#000]'
                          : 'bg-card hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000]'
                      )}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-primary" />
                      ) : null}
                      <option.icon className="mb-4 h-5 w-5" />
                      <p className="text-sm font-black uppercase">{option.name}</p>
                      <p className="mt-1 text-[11px] font-medium leading-relaxed text-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Page Background</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['plain', 'grid'] as const).map((option) => {
                    const isSelected = backgroundStyle === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setBackgroundStyle(option)}
                        className={cn(
                          'border-2 border-black px-3 py-2 text-left text-sm font-black uppercase transition-colors',
                          isSelected ? 'bg-secondary' : 'bg-card hover:bg-muted'
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Theme</CardTitle>
              <CardDescription>
                Theme controls the page colors, typography, radius, shadows, and overall visual character.
              </CardDescription>
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
