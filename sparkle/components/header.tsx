'use client';

import { useState, useMemo } from 'react';
import { Home, Settings2, LogOut, Sun, Moon, LifeBuoy } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

import { useAuth } from '@/hooks/api/use-auth';
import { cn } from '@/lib/utils';
import { LogoVersion } from '@/components/logo-version';
import { useSettings } from '@/hooks/use-settings';
import { getPresetThemeStyles, presets } from '@/lib/theme-presets';
import { defaultThemeState } from '@/config/theme';
import { ThemeStyleProps } from '@/types/theme';

const DASHBOARD_LINKS = [
  { title: 'Projects', url: '/dashboard', icon: Home },
  { title: 'Settings', url: '/settings', icon: Settings2 },
];

const PUBLIC_LINKS = [{ title: 'About us', url: '/about', icon: LifeBuoy }];

const ThemeSelector = () => {
  const { settings, updateSettings, applyThemePreset } = useSettings();
  const currentPreset = useMemo(() => settings.theme.preset || 'default', [settings.theme.preset]);

  const presetNames = useMemo(() => {
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
      theme: { ...settings.theme, preset, styles: { ...getPresetThemeStyles(preset) } },
    });
    applyThemePreset(preset);
  };

  return (
    <div className="px-2 py-1.5">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Theme</label>
      <Select value={currentPreset} onValueChange={onPresetChange}>
        <SelectTrigger className="h-8 w-full bg-muted/50 text-xs">
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
    updateSettings({ ...settings, mode });
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

export function Header() {
  const { logout, authUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const hasUser = useMemo(() => {
    return !!authUser && Object.keys(authUser).length > 0;
  }, [authUser]);

  const onLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <LogoVersion url={hasUser ? '/dashboard' : '/'} />
          {!!hasUser}
        </div>

        {hasUser && (
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <nav className="flex items-center rounded-full border bg-background p-1 shadow-sm">
              {DASHBOARD_LINKS.map((item) => {
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
                        : 'text-muted-foreground hover:bg-muted hover:text-primary'
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
        )}

        <div className="flex items-center gap-3">
          {hasUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-offset-2 hover:ring-2 hover:ring-border transition-all"
                >
                  <Avatar className="h-9 w-9 border shadow-sm">
                    <AvatarImage src={authUser?.image_url} alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {authUser?.first_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-0" forceMount>
                <div className="flex items-center gap-2 p-3 pb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={authUser?.image_url} />
                    <AvatarFallback>{authUser?.first_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 text-sm">
                    <span className="font-semibold">
                      {authUser?.first_name} {authUser?.last_name}
                    </span>
                    {authUser?.email && (
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {authUser?.email}
                      </span>
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
          ) : (
            <div className="flex items-center gap-3">
              <Button className="shadow-none" variant="outline" size="sm" asChild>
                <Link href="/about">About us</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
