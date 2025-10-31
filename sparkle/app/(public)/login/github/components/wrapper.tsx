'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Github } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useAuth, AuthUser } from '@/hooks/api/use-auth';

export default function GithubCallbackPage() {
  const searchParams = useSearchParams();
  const { githubLogin, setAuthUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_, setAccessToken] = useLocalStorage<string | null>('access_token', null);
  const [__, setStorageAuthUser] = useLocalStorage<AuthUser | null>('auth_user', null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code found.');
      return;
    }

    handleAuth(code);
  }, [searchParams, router]);

  const handleAuth = async (code: string) => {
    setError('');
    setLoading(true);
    const { success, data, message } = await githubLogin(code);

    if (success && data) {
      setAccessToken(data.access_token);
      setAuthUser(data.user);
      setStorageAuthUser(data.user);
      router.push(`/dashboard`);
      return;
    }

    setLoading(false);
    setError(message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Github className="w-10 h-10 mx-auto" />
        <p className="text-lg flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          {error}
        </p>
      </div>
    </div>
  );
}
