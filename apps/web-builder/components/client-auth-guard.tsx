'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/auth-context';
import { GlobalLoader } from '@/components/global-loader';

const GUEST_ONLY_ROUTES = [
  '/',
  '/login/github',
  '/login/google',
  '/about',
  '/terms',
  '/privacy',
  '/showcase',
];

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { authUser, syncAuthUser } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (authUser) {
        setIsInitializing(false);
        return;
      }
      try {
        await syncAuthUser();
      } catch (error) {
        // Ignored: failure just means no user
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, [authUser, syncAuthUser]);

  const isGuestRoute = GUEST_ONLY_ROUTES.includes(pathname);
  const isCallbackRoute = pathname.includes('callback');
  const isProtectedRoute = !isGuestRoute && !isCallbackRoute;

  let redirectPath = null;

  if (!isInitializing) {
    if (authUser) {
      if (isGuestRoute || isCallbackRoute) {
        redirectPath = '/dashboard';
      }
    } else {
      if (isProtectedRoute) {
        redirectPath = '/';
      }
    }
  }

  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);

  // 4. Render Logic: Show loader if initializing OR if a redirect is pending
  if (isInitializing || redirectPath) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}
