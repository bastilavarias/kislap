'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Github, Loader2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth, AuthUser } from '@/hooks/api/use-auth';
import { Button } from '@/components/ui/button';

export function Callback() {
  const searchParams = useSearchParams();
  const { githubLogin, setAuthUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  const authCalled = useRef(false);

  const handleAuth = useCallback(
    async (code: string) => {
      setError('');
      setLoading(true);

      try {
        const { success, data, message } = await githubLogin(code);

        if (success && data) {
          setAuthUser(data.user);
          setStorageAuthUser(data.user);
          setAccessToken(data.access_token);

          const pendingRedirect = window.sessionStorage.getItem('post_auth_redirect');
          if (pendingRedirect) {
            window.sessionStorage.removeItem('post_auth_redirect');
            await router.push(pendingRedirect);
            return;
          }

          await router.push('/dashboard');
        } else {
          setLoading(false);
          setError(message || 'GitHub login failed');
        }
      } catch {
        setLoading(false);
        setError('An unexpected error occurred');
      }
    },
    [githubLogin, router, setAccessToken, setAuthUser, setStorageAuthUser]
  );

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code found.');
      return;
    }

    if (authCalled.current) return;
    authCalled.current = true;

    handleAuth(code);
  }, [handleAuth, searchParams]);

  return (
    <div className="flex min-h-[calc(100svh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl border-4 border-black bg-white text-left shadow-[10px_10px_0_#000]">
        <div className="flex items-center justify-between border-b-4 border-black bg-black px-5 py-4 text-white sm:px-7">
          <div className="font-mono text-xs font-black uppercase tracking-[0.22em]">
            GitHub sign in
          </div>
          <Github className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="grid gap-6 p-5 sm:p-7">
          <div className="flex h-20 w-20 items-center justify-center border-4 border-black bg-secondary shadow-[5px_5px_0_#000]">
            {error ? (
              <AlertTriangle className="h-9 w-9 text-black" aria-hidden="true" />
            ) : (
              <Loader2 className="h-9 w-9 animate-spin text-black" aria-hidden="true" />
            )}
          </div>

          <div className="grid gap-3">
            <h1 className="text-4xl font-black leading-none tracking-normal text-foreground sm:text-5xl">
              {error ? 'Sign-in hit a wall' : 'Signing you in'}
            </h1>
            <p className="max-w-md text-base font-semibold text-muted-foreground">
              {error
                ? error
                : 'GitHub approved the request. We are finishing your workspace session.'}
            </p>
          </div>

          <div className="border-4 border-black bg-[#7dd3fc] p-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-black shadow-[5px_5px_0_#000]">
            {loading ? 'Checking credentials' : error ? 'Action needed' : 'Waiting for provider'}
          </div>

          {error ? (
            <Button asChild size="lg" className="h-14 w-full justify-between px-4">
              <Link href="/">
                <span>Back to sign in</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
