'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth, AuthUser } from '@/hooks/api/use-auth';

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export function Callback() {
  const searchParams = useSearchParams();
  const { googleLogin, setAuthUser } = useAuth();
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
      const { success, data, message } = await googleLogin(code);

      if (success && data) {
        setAuthUser(data.user);
        setStorageAuthUser(data.user);
        setAccessToken(data.access_token);

        router.push('/dashboard');
      } else {
        setLoading(false);
        setError(message || 'Google login failed');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <GoogleIcon className="w-10 h-10 mx-auto" />
        <p className="text-lg flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {error ? <span className="text-red-500">{error}</span> : 'Signing you in with Google…'}
        </p>
      </div>
    </div>
  );
}
