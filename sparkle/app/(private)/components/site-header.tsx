'use client';

import { Home, Settings2, LogOut, Command, Sparkles } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

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
import { ThemeCustomizer } from '@/components/customizer';
import { AuthUser, useAuth } from '@/hooks/api/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { LogoVersion } from '@/components/logo-version';

// --- Configuration ---
const NAV_LINKS = [
  {
    title: 'Projects',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
  },
];

export function SiteHeader() {
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [_, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [__, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const { logout } = useAuth();
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

          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold hover:opacity-90 transition-opacity"
          >
            <LogoVersion />
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <nav className="flex items-center gap-1 rounded-full border bg-background px-2 py-2 shadow-sm">
            {NAV_LINKS.map((item) => {
              const isActive = pathname.startsWith(item.url);
              const Icon = item.icon;

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-foreground text-background shadow-sm' // Active: Black pill, white text
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground' // Inactive: Gray text
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* --- RIGHT SECTION: User & Actions --- */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsThemeCustomizerOpen(true)}
            className="hidden text-muted-foreground hover:text-foreground sm:flex"
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full ring-offset-2 hover:ring-2 hover:ring-border"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="https://ui.shadcn.com/avatars/03.png" alt="User" />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsThemeCustomizerOpen(true)}>
                Appearance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ThemeCustomizer open={isThemeCustomizerOpen} setOpen={setIsThemeCustomizerOpen} />
    </header>
  );
}
