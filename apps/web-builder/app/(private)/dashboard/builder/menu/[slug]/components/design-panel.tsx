'use client';

import { CheckCircle2, LayoutTemplate, QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { Settings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { QRPanel } from './qr-panel';

const LAYOUT_OPTIONS = [
  {
    id: 'menu-default',
    name: 'Default',
    icon: LayoutTemplate,
    description: 'Mobile-first menu with category tabs and responsive item cards.',
    preview: {
      heroClassName: 'from-primary/80 to-primary/30',
      cardClassName: 'bg-card',
    },
  },
];

interface Props {
  layout: string;
  setLayout: (layout: string) => void;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  menuURL: string;
  qrForegroundColor: string;
  qrBackgroundColor: string;
  setQRForegroundColor: (value: string) => void;
  setQRBackgroundColor: (value: string) => void;
}

export function DesignPanel(props: Props) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <h2 className="mb-4 hidden text-xl font-bold lg:block">Design, Theme & QR</h2>
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="mb-4 grid h-12 w-full grid-cols-3 rounded-xl bg-muted/50 p-1">
          <TabsTrigger value="layout" className="rounded-lg data-[state=active]:bg-background">
            Layout
          </TabsTrigger>
          <TabsTrigger value="theme" className="rounded-lg data-[state=active]:bg-background">
            Theme
          </TabsTrigger>
          <TabsTrigger value="qr" className="rounded-lg data-[state=active]:bg-background">
            QR
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="mt-0">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Choose Layout</CardTitle>
              <CardDescription>Start with one strong responsive menu structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {LAYOUT_OPTIONS.map((option) => {
                const isSelected = props.layout === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => props.setLayout(option.id)}
                    className={cn(
                      'relative flex w-full flex-col gap-4 rounded-xl border-2 p-4 text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30'
                    )}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
                    ) : null}
                    <div className="w-full overflow-hidden rounded-lg border bg-background">
                      <div className={cn('h-20 w-full bg-gradient-to-br', option.preview.heroClassName)} />
                      <div className="space-y-2 p-3">
                        <div className="h-2.5 w-20 rounded-full bg-muted-foreground/20" />
                        <div className="flex gap-2">
                          <div className="h-6 flex-1 rounded-full bg-primary/15" />
                          <div className="h-6 w-16 rounded-full bg-muted" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className={cn('h-18 rounded-md border', option.preview.cardClassName)} />
                          <div className={cn('h-18 rounded-md border', option.preview.cardClassName)} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-muted p-3 text-muted-foreground">
                        <option.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
                })}
              </div>
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
