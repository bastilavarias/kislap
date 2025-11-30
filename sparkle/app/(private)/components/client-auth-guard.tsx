'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuthContext } from '@/contexts/auth-context';

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { syncAuthUser } = useAuthContext();
  const router = useRouter();

  const [accessToken] = useLocalStorage<string | null>('access_token', null);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }

    syncAuthUser();
  }, [accessToken, router]);

  return <>{children}</>;
}
