'use client';

import type React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Link from 'next/link';
import { Github } from 'lucide-react';

// 1. Restored ComingSoonWrapper
function ComingSoonWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-md', className)}>
      <div className="opacity-60 pointer-events-none select-none filter blur-[1px]">{children}</div>
      <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] flex items-center justify-center z-10 select-none">
        <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm text-muted-foreground">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

// Helper: Official Google Icon
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

export default function Form({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [_, setNewsletter] = useLocalStorage<boolean>('newsletter_opt_in', true);

  const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const githubRedirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=user:email`;

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20email%20profile`;

  return (
    <div className={cn('grid gap-8', className)} {...props}>
      {/* Header Section */}
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to Kislap</h1>
        <p className="text-base text-muted-foreground">Sign in to access your projects</p>
      </div>

      <div className="grid gap-6">
        {/* 1. Active Social Buttons */}
        <div className="grid gap-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              'h-12 w-full text-base relative border-zinc-200',
              !termsAccepted && 'opacity-50 cursor-not-allowed'
            )}
            asChild={termsAccepted}
            disabled={!termsAccepted}
          >
            {termsAccepted ? (
              <Link href={githubAuthUrl} className="flex items-center justify-center gap-3">
                <Github className="h-5 w-5" />
                <span className="font-medium">Continue with GitHub</span>
              </Link>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Github className="h-5 w-5" />
                <span className="font-medium">Continue with GitHub</span>
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className={cn(
              'h-12 w-full text-base relative border-zinc-200',
              !termsAccepted && 'opacity-50 cursor-not-allowed'
            )}
            asChild={termsAccepted}
            disabled={!termsAccepted}
          >
            {termsAccepted ? (
              <Link href={googleAuthUrl} className="flex items-center justify-center gap-3">
                <GoogleIcon className="h-5 w-5" />
                <span className="font-medium">Continue with Google</span>
              </Link>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <GoogleIcon className="h-5 w-5" />
                <span className="font-medium">Continue with Google</span>
              </span>
            )}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <ComingSoonWrapper>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="h-11 bg-background"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" className="h-11 bg-background" />
            </div>
            <Button className="h-11 w-full font-medium" type="submit">
              Sign In
            </Button>
          </div>
        </ComingSoonWrapper>

        {/* 4. Footer & Terms */}
        <div className="space-y-4 pt-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground leading-snug">
                You agree to our{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="newsletter"
              onCheckedChange={(checked) => setNewsletter(checked as boolean)}
            />
            <Label
              htmlFor="newsletter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Sign up for our newsletter
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
