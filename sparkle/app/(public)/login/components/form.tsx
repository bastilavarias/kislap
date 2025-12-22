'use client';

import type React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Link from 'next/link';

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

export default function Form({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [_, setNewsletter] = useLocalStorage<boolean>('newsletter_opt_in', false);

  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Kislap</CardTitle>
          <CardDescription>Login with your GitHub account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full h-12 text-lg flex items-center justify-center gap-3 relative"
              disabled={!termsAccepted}
              asChild
            >
              <Link href={githubAuthUrl}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                </svg>
                Login with GitHub
              </Link>
            </Button>

            <ComingSoonWrapper>
              <Button variant="outline" className="w-full h-12 gap-2" disabled>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-google"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945z" />
                </svg>
                Login with Google
              </Button>
            </ComingSoonWrapper>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Inactive: Manual Form */}
          <ComingSoonWrapper>
            <div className="grid gap-6 p-1">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" disabled />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline pointer-events-none"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" disabled />
              </div>
              <Button type="submit" className="w-full" disabled>
                Login
              </Button>
            </div>
          </ComingSoonWrapper>

          {/* Active: Terms & Newsletter */}
          <div className="grid gap-4 mt-2">
            <div className="flex items-top space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </Label>
                <p className="text-xs text-muted-foreground">
                  You agree to our{' '}
                  <a href="#" className="underline hover:text-primary">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="underline hover:text-primary">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
