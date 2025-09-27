'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth } from '@/hooks/api/use-auth';

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [accessToken] = useLocalStorage<string | null>('access_token', null);
  const { syncAuthUser } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }

    syncAuthUser();
  }, [accessToken, router]);

  return <>{children}</>;
}
