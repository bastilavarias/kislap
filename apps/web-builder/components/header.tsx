'use client';

import { useMemo, useState } from 'react';
import {
  Home,
  Settings2,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
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
import { builderTabsListClass } from '@/components/builder/builder-ui';

const marketingNavButtonClass =
  'inline-flex h-12 items-center border-4 border-black bg-white px-4 font-mono text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 hover:bg-secondary hover:text-black';
const marketingCtaButtonClass =
  'rounded-none border-4 border-black bg-primary font-mono text-sm font-black uppercase text-white shadow-[5px_5px_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-primary/90 hover:text-white hover:shadow-[2px_2px_0_#000]';

const DASHBOARD_LINKS = [
  { title: 'Projects', url: '/dashboard', icon: Home },
  { title: 'Settings', url: '/settings', icon: Settings2 },
];

const PUBLIC_LINKS = [
  { title: 'Showcase', url: 'https://kislap.app/showcase' },
  { title: 'About us', url: 'https://kislap.app/about' },
  { title: 'Help', url: 'https://kislap.app/help' },
];

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
      <label className="mb-1.5 block font-mono text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
        Theme
      </label>
      <Select value={currentPreset} onValueChange={onPresetChange}>
        <SelectTrigger className="h-9 w-full rounded-none border-2 border-black bg-white text-xs font-bold">
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
          'h-8 justify-start rounded-none border-2 border-black px-3 font-bold',
          settings.mode === 'light' && 'bg-secondary text-black'
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
          'h-8 justify-start rounded-none border-2 border-black px-3 font-bold',
          settings.mode === 'dark' && 'bg-secondary text-black'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasUser = useMemo(() => {
    return !!authUser && Object.keys(authUser).length > 0;
  }, [authUser]);

  const onLogout = async () => {
    await logout();
    await router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-secondary">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-8">
          <LogoVersion url={hasUser ? '/dashboard' : '/'} />
        </div>

        {hasUser && (
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <nav
              className={cn(
                'flex items-center border-4 shadow-[5px_5px_0_#000]',
                builderTabsListClass
              )}
            >
              {DASHBOARD_LINKS.map((item) => {
                const isActive = pathname.startsWith(item.url);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={cn(
                      'relative flex h-11 items-center gap-2 border-r-2 border-black px-5 py-2 text-sm font-black uppercase transition-all duration-200 last:border-r-0',
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-primary hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
                  className="relative h-12 w-12 rounded-none border-4 border-black bg-white p-0 shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000]"
                >
                  <Avatar className="h-full w-full rounded-none border-0">
                    <AvatarImage src={authUser?.image_url} alt="User" />
                    <AvatarFallback className="rounded-none bg-primary text-white font-black">
                      {authUser?.first_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 rounded-none border-2 border-black p-0 shadow-[6px_6px_0_#000]"
                forceMount
              >
                <div className="flex items-center gap-2 p-3 pb-2">
                  <Avatar className="h-8 w-8 rounded-none border-2 border-black">
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

                <div className="md:hidden">
                  {DASHBOARD_LINKS.map((link) => (
                    <DropdownMenuItem key={link.url} asChild>
                      <Link href={link.url} className="cursor-pointer">
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </div>

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
            <>
              <nav className="hidden items-center gap-3 md:flex" aria-label="Main Navigation">
                <ul className="m-0 flex list-none items-center gap-3 p-0">
                  {PUBLIC_LINKS.map((link) => (
                    <li key={link.url}>
                      <Link href={link.url} className={marketingNavButtonClass}>
                        {link.title}
                      </Link>
                    </li>
                  ))}

                  <li>
                    <Button
                      asChild
                      variant="default"
                      size="lg"
                      className={cn('h-12 px-5', marketingCtaButtonClass)}
                    >
                      <Link href="https://kislap.app">Home</Link>
                    </Button>
                  </li>
                </ul>
              </nav>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="border-4 border-black bg-white p-2 text-black shadow-[4px_4px_0_#000] md:hidden"
                aria-expanded={mobileMenuOpen}
                aria-controls="builder-public-mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
                <span className="sr-only">Toggle navigation</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!hasUser && mobileMenuOpen ? (
        <div
          id="builder-public-mobile-menu"
          className="space-y-3 border-t-4 border-black bg-white px-4 py-5 text-center shadow-[0_8px_0_#000] md:hidden"
        >
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="flex items-center justify-center border-4 border-black bg-white px-4 py-3 font-mono text-sm font-black uppercase text-black shadow-[5px_5px_0_#000]"
            >
              {link.title}
            </Link>
          ))}

          <Button
            asChild
            variant="default"
            size="lg"
            className={cn('h-14 w-full', marketingCtaButtonClass)}
          >
            <Link href="https://kislap.app">Home</Link>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
