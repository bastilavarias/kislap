'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuthContext } from '@/contexts/auth-context';

const GUEST_ONLY_ROUTES = ['/', '/login', '/login/github', '/about-us'];

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { syncAuthUser } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const [accessToken] = useLocalStorage<string | null>('access_token', null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isGuestRoute = GUEST_ONLY_ROUTES.includes(pathname);
    const isCallbackRoute = pathname.includes('callback');

    if (accessToken) {
      if (isGuestRoute || isCallbackRoute) {
        router.replace('/dashboard');
      } else {
        //@ts-ignore
        syncAuthUser();
      }
      return;
    }

    if (!accessToken) {
      if (isGuestRoute || isCallbackRoute) {
        return;
      }

      router.replace('/login');
    }
  }, [accessToken, router, pathname, mounted]);

  if (!mounted) return null;

  return <>{children}</>;
}
