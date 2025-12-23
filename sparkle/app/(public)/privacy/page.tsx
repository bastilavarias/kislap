'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Fingerprint, EyeOff, Lock, Ghost, ArrowLeft } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <Fingerprint className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
            TL;DR Edition
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                "We don't dox you, you don't dox us."
              </h2>
              <p className="text-lg text-muted-foreground">
                We are building a portfolio tool, not a surveillance state.
              </p>
            </div>

            <div className="grid gap-4 text-left">
              <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors group">
                <div className="shrink-0 mt-1">
                  <Ghost className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">We collect almost nothing.</h3>
                  <p className="text-sm text-muted-foreground">
                    Just your GitHub profile and the content you explicitly type into the builder.
                    That's it. We don't want your cookies, we have enough.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors group">
                <div className="shrink-0 mt-1">
                  <EyeOff className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">We don't sell your data.</h3>
                  <p className="text-sm text-muted-foreground">
                    Seriously. We are too busy writing code to figure out how to run an ad network.
                    Your email stays with us.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors group">
                <div className="shrink-0 mt-1">
                  <Lock className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Don't be stupid with keys.</h3>
                  <p className="text-sm text-muted-foreground">
                    Please don't paste your AWS Secret Keys or API tokens into your public portfolio
                    description. If you dox yourself, that's on you.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" variant="secondary" className="w-full md:w-auto font-bold">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Got it, Take me Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/40 mt-8">
          Last updated: Whenever we feel like it.
        </p>
      </div>
    </div>
  );
}
