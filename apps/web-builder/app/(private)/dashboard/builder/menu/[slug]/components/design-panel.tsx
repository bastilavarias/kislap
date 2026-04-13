'use client';

import { CheckCircle2, ImagePlus, LayoutTemplate, Newspaper, QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { Settings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { PosterPanel } from './poster-panel';
import { QRPanel } from './qr-panel';

const LAYOUT_OPTIONS = [
  {
    id: 'menu-default',
    name: 'Default',
    icon: LayoutTemplate,
    description: 'Poster-inspired menu with a strong brand header and clear sections.',
  },
  {
    id: 'menu-editorial',
    name: 'Editorial',
    icon: Newspaper,
    description: 'Magazine-like composition with a polished cover and softer reading rhythm.',
  },
  {
    id: 'menu-showcase',
    name: 'Showcase',
    icon: LayoutTemplate,
    description: 'Photo-forward layout for menus that want imagery to lead the first impression.',
  },
  {
    id: 'menu-bistro',
    name: 'Bistro',
    icon: Newspaper,
    description: 'An elegant split layout with flowing sections and a slower dinner-service feel.',
  },
  {
    id: 'menu-runway',
    name: 'Runway',
    icon: LayoutTemplate,
    description: 'Asymmetric layout with a strong brand rail and a long-form menu stream.',
  },
  {
    id: 'menu-mosaic',
    name: 'Mosaic',
    icon: Newspaper,
    description: 'A layered visual layout mixing cover imagery, gallery moments, and menu sections.',
  },
];

interface Props {
  layout: string;
  setLayout: (layout: string) => void;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  menuURL: string;
  businessName: string;
  posterSettings: PosterSettings;
  posterImageURL: string;
  setPosterField: <K extends keyof PosterSettings>(field: K, value: PosterSettings[K]) => void;
  generateDisplayPoster: () => Promise<void>;
  qrForegroundColor: string;
  qrBackgroundColor: string;
  setQRForegroundColor: (value: string) => void;
  setQRBackgroundColor: (value: string) => void;
}

interface PosterSettings {
  template: 'clean';
  size: 'a6';
  color_mode: 'light' | 'dark';
  headline: string;
  subtext: string;
  footer_note: string;
  show_logo: boolean;
  show_address: boolean;
  show_url: boolean;
}

export function DesignPanel(props: Props) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="mb-4 grid h-12 w-full grid-cols-4 rounded-xl bg-muted/50 p-1">
          <TabsTrigger value="layout" className="rounded-lg data-[state=active]:bg-background">
            Layout
          </TabsTrigger>
          <TabsTrigger value="theme" className="rounded-lg data-[state=active]:bg-background">
            Theme
          </TabsTrigger>
          <TabsTrigger value="poster" className="rounded-lg data-[state=active]:bg-background">
            Poster
          </TabsTrigger>
          <TabsTrigger value="qr" className="rounded-lg data-[state=active]:bg-background">
            QR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="mt-0">
          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choose Layout</CardTitle>
              <CardDescription>Choose the menu layout that fits your food, photos, and brand tone.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {LAYOUT_OPTIONS.map((option) => {
                  const isSelected = props.layout === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => props.setLayout(option.id)}
                      className={cn(
                        'group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 text-center transition-all duration-200',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/30 hover:bg-muted/30'
                      )}
                    >
                      {isSelected ? (
                        <div className="absolute right-2 top-2 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : null}
                      <div
                        className={cn(
                          'mb-3 rounded-full p-3 transition-colors',
                          isSelected
                            ? 'bg-background text-primary'
                            : 'bg-muted text-muted-foreground group-hover:bg-background'
                        )}
                      >
                        <option.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={cn('text-sm font-semibold', isSelected && 'text-primary')}>
                          {option.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-0">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Theme</CardTitle>
              <CardDescription>Reuse the same theme system as the rest of Kislap.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeControlPanel
                stateless={true}
                themeSettings={props.localThemeSettings}
                setThemeSettings={props.setLocalThemeSettings}
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

        <TabsContent value="poster" className="mt-0">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImagePlus className="h-4 w-4" />
                Generate Display Poster
              </CardTitle>
              <CardDescription>
                Create a ready-made poster for A4, A5, or A6 acrylic stands and counter displays.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PosterPanel
                businessName={props.businessName}
                menuURL={props.menuURL}
                posterSettings={props.posterSettings}
                posterImageURL={props.posterImageURL}
                setPosterField={props.setPosterField}
                generateDisplayPoster={props.generateDisplayPoster}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="mt-0">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <QrCode className="h-4 w-4" />
                QR Code
              </CardTitle>
              <CardDescription>Basic now, isolated and customization-ready for later.</CardDescription>
            </CardHeader>
            <CardContent>
              <QRPanel
                menuURL={props.menuURL}
                foregroundColor={props.qrForegroundColor}
                backgroundColor={props.qrBackgroundColor}
                setForegroundColor={props.setQRForegroundColor}
                setBackgroundColor={props.setQRBackgroundColor}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
