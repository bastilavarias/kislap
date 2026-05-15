'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

function ComingSoonWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden border-y-4 border-black bg-white/70', className)}>
      <div className="pointer-events-none select-none opacity-45 blur-[1px]">{children}</div>
      <div className="absolute inset-0 z-10 flex select-none items-center justify-center bg-white/55">
        <span className="border-4 border-black bg-secondary px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-black shadow-[4px_4px_0_#000]">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

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
  const [, setNewsletter] = useLocalStorage<boolean>('newsletter_opt_in', true);

  const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const githubRedirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=user:email`;

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20email%20profile`;

  return (
    <div className={cn('w-full text-left lg:justify-self-end', className)} {...props}>
      <div className="grid max-w-md gap-7 lg:ml-auto">
        <div className="grid gap-4">
          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-normal text-foreground sm:text-5xl">
            Welcome back
          </h2>
          <p className="text-base font-semibold leading-relaxed text-zinc-700">
            Use your account to continue to the builder.
          </p>
        </div>

        <div className="grid gap-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              'relative h-16 w-full justify-between rounded-none border-4 border-black bg-black px-5 text-base font-black uppercase text-white shadow-[6px_6px_0_#ff3132] hover:translate-x-1 hover:translate-y-1 hover:bg-black hover:text-white hover:shadow-[2px_2px_0_#ff3132]',
              !termsAccepted && 'cursor-not-allowed opacity-50'
            )}
            asChild={termsAccepted}
            disabled={!termsAccepted}
          >
            {termsAccepted ? (
              <Link href={githubAuthUrl} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <Github className="h-5 w-5" />
                  <span>Continue with GitHub</span>
                </span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <Github className="h-5 w-5" />
                  <span>Continue with GitHub</span>
                </span>
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className={cn(
              'relative h-16 w-full justify-between rounded-none border-4 border-black bg-secondary px-5 text-base font-black uppercase text-black shadow-[6px_6px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:bg-[#ff5aa5] hover:text-black hover:shadow-[2px_2px_0_#000]',
              !termsAccepted && 'cursor-not-allowed opacity-50'
            )}
            asChild={termsAccepted}
            disabled={!termsAccepted}
          >
            {termsAccepted ? (
              <Link href={googleAuthUrl} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <GoogleIcon className="h-5 w-5" />
                  <span>Continue with Google</span>
                </span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <GoogleIcon className="h-5 w-5" />
                  <span>Continue with Google</span>
                </span>
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black">
          <span className="h-1 flex-1 bg-black" />
          Or continue with email
          <span className="h-1 flex-1 bg-black" />
        </div>

        <ComingSoonWrapper className="px-0">
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="font-mono text-xs font-black uppercase tracking-[0.16em]"
              >
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="h-12 rounded-none border-4 border-black bg-background"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="font-mono text-xs font-black uppercase tracking-[0.16em]"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-black text-primary underline decoration-2 underline-offset-4 hover:text-black"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" className="h-12 rounded-none border-4 border-black bg-background" />
            </div>
            <Button className="h-12 w-full justify-between rounded-none px-4" type="submit">
              <span className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Sign In
              </span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </ComingSoonWrapper>

        <div className="grid gap-4 border-t-4 border-black pt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-0.5 size-5 rounded-none border-2 border-black bg-white shadow-none data-[state=checked]:bg-primary data-[state=checked]:text-white"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-black uppercase leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </Label>
              <p className="text-xs font-semibold leading-snug text-black/75">
                You agree to our{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-black underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-black underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t-2 border-black pt-4">
            <Checkbox
              id="newsletter"
              onCheckedChange={(checked) => setNewsletter(checked as boolean)}
              className="size-5 rounded-none border-2 border-black bg-white shadow-none data-[state=checked]:bg-primary data-[state=checked]:text-white"
            />
            <Label
              htmlFor="newsletter"
              className="text-sm font-black uppercase leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Sign up for our newsletter
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
