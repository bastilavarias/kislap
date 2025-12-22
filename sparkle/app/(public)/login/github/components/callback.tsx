'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Github } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth, AuthUser } from '@/hooks/api/use-auth';

export function Callback() {
  const searchParams = useSearchParams();
  const { githubLogin, setAuthUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [__, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const authCalled = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code found.');
      return;
    }

    if (authCalled.current) return;
    authCalled.current = true;

    handleAuth(code);
  }, [searchParams]);

  const handleAuth = async (code: string) => {
    setError('');
    setLoading(true);

    try {
      const { success, data, message } = await githubLogin(code);

      if (success && data) {
        setAuthUser(data.user);
        setStorageAuthUser(data.user);
        setAccessToken(data.access_token);

        router.push('/dashboard');
      } else {
        setLoading(false);
        setError(message || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Github className="w-10 h-10 mx-auto" />
        <p className="text-lg flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {error ? <span className="text-red-500">{error}</span> : 'Signing you in…'}
        </p>
      </div>
    </div>
  );
}
