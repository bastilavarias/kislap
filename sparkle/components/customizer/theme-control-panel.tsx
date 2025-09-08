// React Imports
import { useCallback, useEffect, useState } from 'react';

// Next Imports
import Link from 'next/link';

// Third-party Imports
import { useTheme } from 'next-themes';
import { Copy, RotateCcw, Sun, Moon, AlertCircle } from 'lucide-react';

// Type Imports
import type { ThemeStyleProps } from '@/types/theme';

// Component Imports
import ShadowControl from './shadow-control';
import ThemeFontSelect from './theme-font-select';
import SliderWithInput from './slider-with-input';
import ThemeColorPanel from './theme-color-panel';
import HoldToSaveTheme from './hold-to-save-theme';
import ThemePresetSelect from './theme-preset-select';
import ThemeVariablesDialog from './theme-variables-dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Config Imports
import { DEFAULT_FONT_SANS, DEFAULT_FONT_SERIF, DEFAULT_FONT_MONO } from '@/config/theme';

// Hook Imports
import { useSettings } from '@/hooks/useSettings';

// Util Imports
import { getPresetThemeStyles, presets } from '@/lib/theme-presets';
import { getAppliedThemeFont, sansSerifFonts, serifFonts, monoFonts } from '@/lib/theme-fonts';

type Mode = 'light' | 'dark';

type Props = {
  stateless?: boolean;
  hideTopActionButtons?: boolean;
  hideScrollArea?: boolean;
  hideThemeSaverButton?: boolean;
};

const ThemeControlPanel = ({
  stateless = false,
  hideTopActionButtons = false,
  hideScrollArea = false,
  hideThemeSaverButton = false,
}: Props) => {
  // Hooks
  const { setTheme } = useTheme();
  const { settings, updateSettings, applyThemePreset, resetToDefault } = useSettings();

  const [localSettings, setLocalSettings] = useState({ ...settings });

  const handleModeChange = (value: string) => {
    if (value) {
      const newMode = value as Mode;

      // Ensure both themes exist before switching
      const updatedSettings = {
        ...localSettings,
        mode: newMode,
        theme: {
          ...localSettings.theme,
          styles: {
            light: localSettings.theme.styles?.light || {},
            dark: localSettings.theme.styles?.dark || {},
          },
        },
      };

      updateSettings(updatedSettings);

      setTheme(newMode);
    }
  };

  // Helper function to ensure both themes are updated together
  const updateBothThemes = (updates: Partial<ThemeStyleProps>) => {
    const currentLight = localSettings.theme.styles?.light || {};
    const currentDark = localSettings.theme.styles?.dark || {};

    const updatedSettings = {
      ...localSettings,
      theme: {
        ...localSettings.theme,
        styles: {
          light: { ...currentLight, ...updates },
          dark: { ...currentDark, ...updates },
        },
      },
    };

    // Update settings and persist to storage
    updateSettings(updatedSettings);
  };

  // Update font change handlers to use the new helper
  const handleFontChange = (fontType: 'font-sans' | 'font-serif' | 'font-mono', value: string) => {
    updateBothThemes({ [fontType]: value });
  };

  // Update radius change handler to use the new helper
  const handleRadiusChange = (value: number) => {
    updateBothThemes({ radius: `${value}rem` });
  };

  const handleStyleChange = useCallback(
    (key: keyof ThemeStyleProps, value: string) => {
      if (!localSettings.mode) return;

      updateSettings({
        theme: {
          ...localSettings.theme,
          styles: {
            ...localSettings.theme.styles,
            [localSettings.mode as Mode]: {
              ...localSettings.theme.styles?.[localSettings.mode as Mode],
              [key]: value,
            },
          },
        },
      });
    },
    [localSettings.theme, localSettings.mode, updateSettings]
  );

  const handleLetterSpacingChange = (value: number) => {
    updateBothThemes({ 'letter-spacing': `${value}em` });
  };

  const handleSpacingChange = (value: number) => {
    updateBothThemes({ spacing: `${value}rem` });
  };

  const handleApplyThemePreset = (preset: string) => {
    if (stateless) {
      const updatedSettings = {
        ...localSettings,
        theme: {
          preset,
          styles: getPresetThemeStyles(preset),
        },
      };

      setLocalSettings({
        ...localSettings,
        ...updatedSettings,
      });
      return;
    }

    applyThemePreset(preset);
  };

  useEffect(() => {
    // Ensure theme styles exist when component mounts
    if (!settings.theme.styles?.light || !settings.theme.styles?.dark) {
      const updatedSettings = {
        ...settings,
        theme: {
          ...localSettings.theme,
          styles: {
            light: localSettings.theme.styles?.light || {},
            dark: localSettings.theme.styles?.dark || {},
          },
        },
      };

      updateSettings(updatedSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localSettings.mode) {
      setTheme(localSettings.mode);
    }
  }, [localSettings.mode, setTheme]);

  const currentStyles = localSettings.theme.styles?.[localSettings.mode as Mode] || {};

  const form = (
    <div className="flex flex-col gap-6 p-6">
      {!hideTopActionButtons && (
        <div className="flex gap-3">
          <ThemeVariablesDialog
            lightTheme={localSettings.theme.styles?.light}
            darkTheme={localSettings.theme.styles?.dark}
            trigger={
              <Button variant="outline" className="flex-1 cursor-pointer gap-2" size="lg">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            }
            activeTheme={localSettings.theme.preset ?? ''}
          />
          <Button
            variant="outline"
            className="flex-1 cursor-pointer gap-2"
            size="lg"
            onClick={resetToDefault}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Mode</h3>
        <ToggleGroup
          type="single"
          value={localSettings.mode}
          onValueChange={handleModeChange}
          className="gap-4"
        >
          <ToggleGroupItem
            value="light"
            aria-label="Toggle light"
            className="hover:text-foreground cursor-pointer rounded-md border px-4 py-2"
          >
            <Sun className="size-4" />
            <span>Light</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="dark"
            aria-label="Toggle dark"
            className="hover:text-foreground cursor-pointer rounded-md border px-4 py-2"
          >
            <Moon className="size-4" />
            <span>Dark</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Themes Selection */}
      <ThemePresetSelect
        presets={presets}
        currentPreset={localSettings.theme.preset || null}
        onPresetChange={handleApplyThemePreset}
      />

      <Tabs defaultValue="colors" className="h-full w-full">
        <TabsList className="mb-3 grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="cursor-pointer">
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="cursor-pointer">
            Typography
          </TabsTrigger>
          <TabsTrigger value="other" className="cursor-pointer">
            Other
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          {/* CSS Variables Section */}
          <ThemeColorPanel stateless={stateless} settings={localSettings} />
        </TabsContent>

        {/* Text Selection */}
        <TabsContent value="typography">
          <div className="mb-4">
            <Label htmlFor="font-sans" className="mb-1.5 block text-xs">
              Sans-Serif Font
            </Label>
            <ThemeFontSelect
              fonts={sansSerifFonts}
              defaultValue={DEFAULT_FONT_SANS}
              currentFont={getAppliedThemeFont(
                localSettings.theme.styles?.[localSettings.mode as Mode],
                'font-sans'
              )}
              onFontChange={(value) => handleFontChange('font-sans', value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="font-serif" className="mb-1.5 block text-xs">
              Serif Font
            </Label>
            <ThemeFontSelect
              fonts={serifFonts}
              defaultValue={DEFAULT_FONT_SERIF}
              currentFont={getAppliedThemeFont(
                localSettings.theme.styles?.[localSettings.mode as Mode],
                'font-serif'
              )}
              onFontChange={(value) => handleFontChange('font-serif', value)}
            />
          </div>

          <div>
            <Label htmlFor="font-mono" className="mb-1.5 block text-xs">
              Monospace Font
            </Label>
            <ThemeFontSelect
              fonts={monoFonts}
              defaultValue={DEFAULT_FONT_MONO}
              currentFont={getAppliedThemeFont(
                localSettings.theme.styles?.[localSettings.mode as Mode],
                'font-mono'
              )}
              onFontChange={(value) => handleFontChange('font-mono', value)}
            />
          </div>

          <div className="mt-6">
            <SliderWithInput
              value={parseFloat(
                localSettings.theme.styles?.[localSettings.mode as Mode]?.[
                  'letter-spacing'
                ]?.replace('em', '') || '0'
              )}
              onChange={handleLetterSpacingChange}
              min={-0.25}
              max={0.25}
              step={0.025}
              unit="em"
              label="Letter Spacing"
            />
          </div>

          <Alert className="mt-6">
            <AlertCircle className="size-4" />
            <AlertDescription className="block">
              To use custom fonts, embed them in your project. See{' '}
              <Link
                href="https://tailwindcss.com/docs/font-family"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground/90 underline underline-offset-2"
              >
                Tailwind docs
              </Link>{' '}
              for details.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="other">
          {/* Radius Selection */}
          <div className="flex flex-col gap-4">
            <SliderWithInput
              value={parseFloat(currentStyles.radius?.replace('rem', '') || '0')}
              onChange={handleRadiusChange}
              min={0}
              max={2.5}
              step={0.025}
              unit="rem"
              label="Radius"
            />
          </div>

          <div className="mt-6">
            <SliderWithInput
              value={parseFloat(
                localSettings.theme.styles?.[localSettings.mode as Mode]?.spacing?.replace(
                  'rem',
                  ''
                ) || '0.25'
              )}
              onChange={handleSpacingChange}
              min={0.15}
              max={0.35}
              step={0.01}
              unit="rem"
              label="Spacing"
            />
          </div>

          <div className="mt-6">
            <ShadowControl
              shadowColor={currentStyles['shadow-color'] || '#000000'}
              shadowOpacity={parseFloat(currentStyles['shadow-opacity'] || '0.1')}
              shadowBlur={parseFloat(currentStyles['shadow-blur']?.replace('px', '') || '0')}
              shadowSpread={parseFloat(currentStyles['shadow-spread']?.replace('px', '') || '0')}
              shadowOffsetX={parseFloat(currentStyles['shadow-offset-x']?.replace('px', '') || '0')}
              shadowOffsetY={parseFloat(currentStyles['shadow-offset-y']?.replace('px', '') || '0')}
              onChange={(key, value) => {
                if (key === 'shadow-color') {
                  handleStyleChange(key as keyof ThemeStyleProps, value as string);
                } else if (
                  key === 'shadow-opacity' ||
                  key === 'shadow-depth' ||
                  key === 'shadow-noise'
                ) {
                  handleStyleChange(key as keyof ThemeStyleProps, value.toString());
                } else {
                  handleStyleChange(key as keyof ThemeStyleProps, `${value}px`);
                }
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {hideThemeSaverButton ?? <HoldToSaveTheme />}
    </div>
  );

  return hideScrollArea ? (
    form
  ) : (
    <ScrollArea className="h-[calc(100vh-6.3125rem)]">{form}</ScrollArea>
  );
};

export default ThemeControlPanel;
