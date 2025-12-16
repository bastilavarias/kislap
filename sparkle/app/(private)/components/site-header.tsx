'use client';

import * as React from 'react';
import { Home, Settings2, LogOut, Command, Sparkles, Sun, Moon, Check, Laptop } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ThemeCustomizer } from '@/components/customizer';
import { AuthUser, useAuth } from '@/hooks/api/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { getPresetThemeStyles, presets } from '@/lib/theme-presets';
import { useSettings } from '@/hooks/use-settings';
import { defaultThemeState } from '@/config/theme';
import { ThemeStyleProps } from '@/types/theme';
import { LogoVersion } from '@/components/logo-version';

const NAV_LINKS = [
  { title: 'Projects', url: '/dashboard', icon: Home },
  { title: 'Settings', url: '/settings', icon: Settings2 },
];

const ThemeSelector = () => {
  const { settings, updateSettings, applyThemePreset } = useSettings();

  const currentPreset = React.useMemo(
    () => settings.theme.preset || 'default',
    [settings.theme.preset]
  );

  const presetNames = React.useMemo(() => {
    const allPresets = Object.keys(presets);
    return ['default', ...allPresets.filter((k) => k !== 'default').sort()];
  }, []);

  const getThemeColor = (themeName: string, color: keyof ThemeStyleProps) => {
    const theme = themeName === 'default' ? defaultThemeState : presets[themeName];
    return theme?.light?.[color] || theme?.dark?.[color] || '#000000';
  };

  const onPresetChange = (preset: string) => {
    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        preset,
        styles: { ...getPresetThemeStyles(preset) },
      },
    });
    applyThemePreset(preset);
  };

  return (
    <div className="px-2 py-1.5">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Theme</label>
      <Select value={currentPreset} onValueChange={onPresetChange}>
        <SelectTrigger className="h-9 w-full bg-muted/50">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {presetNames.map((name) => (
            <SelectItem key={name} value={name}>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: getThemeColor(name, 'primary') }}
                />
                <span className="capitalize">{name.replace(/-/g, ' ')}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const ModeToggle = () => {
  const { settings, updateSettings } = useSettings();

  const setMode = (mode: 'light' | 'dark') => {
    updateSettings({
      ...settings,
      //@ts-ignore - Assuming mode is typed correctly in your config
      mode: mode,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2 px-2 pb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setMode('light')}
        className={cn(
          'h-8 justify-start px-3',
          settings.mode === 'light' && 'border-primary bg-primary/5 text-primary'
        )}
      >
        <Sun className="mr-2 h-4 w-4" />
        Light
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setMode('dark')}
        className={cn(
          'h-8 justify-start px-3',
          settings.mode === 'dark' && 'border-primary bg-primary/5 text-primary'
        )}
      >
        <Moon className="mr-2 h-4 w-4" />
        Dark
      </Button>
    </div>
  );
};

export function SiteHeader() {
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = React.useState(false);
  const [_, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [__, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const { logout, authUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const onLogout = () => {
    setAccessToken(null);
    setStorageAuthUser(null);
    router.push('/login');
    logout();
  };

  return (
    <header className="sticky top-0 z-50 flex h-[var(--header-height)] w-full items-center border-b bg-background/80 backdrop-blur-md py-10">
      <div className="container relative flex h-full items-center justify-between px-4 lg:px-6 mx-auto">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <LogoVersion />
        </div>

        {/* CENTER: Navigation Pills */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <nav className="flex items-center rounded-full border bg-background p-1 shadow-sm">
            {NAV_LINKS.map((item) => {
              const isActive = pathname.startsWith(item.url);
              const Icon = item.icon;

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    'relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-background shadow-md'
                      : 'text-muted-primary hover:bg-muted hover:text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>

                  {isActive && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-background bg-destructive"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsThemeCustomizerOpen(true)}
            className="hidden text-muted-foreground hover:text-foreground sm:flex"
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full ring-offset-2 hover:ring-2 hover:ring-border transition-all"
              >
                <Avatar className="h-9 w-9 border shadow-sm">
                  <AvatarImage src={authUser?.image_url} alt="User" />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-0" forceMount>
              <div className="flex items-center gap-2 p-3 pb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authUser?.image_url} />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 text-sm">
                  <span className="font-semibold">
                    {authUser?.first_name} {authUser?.last_name}
                  </span>
                  {authUser?.email && (
                    <span className="text-xs text-muted-foreground">{authUser?.email}</span>
                  )}
                </div>
              </div>

              <DropdownMenuSeparator />

              <ThemeSelector />
              <ModeToggle />

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onLogout}
                className="m-1 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ThemeCustomizer open={isThemeCustomizerOpen} setOpen={setIsThemeCustomizerOpen} />
    </header>
  );
}
