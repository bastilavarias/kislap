'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { ThemeCustomizer } from '@/components/customizer';
import { AuthUser, useAuth } from '@/hooks/api/use-auth';
import { useLocalStorage } from '@/hooks/use-local-storage';

export function SiteHeader() {
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [_, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [__, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const { logout, setAuthUser } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const titles: Record<string, string> = {
    '/dashboard': 'Projects',
    '/projects': 'Projects',
    '/settings': 'Settings',
  };

  const title = titles[pathname] ?? 'Dashboard';

  const onLogout = () => {
    setAccessToken(null);
    setAuthUser(null);
    setStorageAuthUser(null);
    router.push('/login');
    logout();
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://ui.shadcn.com/avatars/03.png" alt="User avatar" />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsThemeCustomizerOpen(true)}>
                Change theme
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://github.com/shadcn-ui/ui" target="_blank" rel="noopener noreferrer">
                  Support Us
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ThemeCustomizer open={isThemeCustomizerOpen} setOpen={setIsThemeCustomizerOpen} />
    </header>
  );
}
