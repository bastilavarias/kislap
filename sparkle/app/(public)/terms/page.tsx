'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Bot, HeartHandshake, ArrowLeft } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
            The "No Legalese" Edition
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                "Just use this platform like a human being."
              </h2>
              <p className="text-lg text-muted-foreground">
                That is the entire contract. But if you need us to spell it out:
              </p>
            </div>

            <div className="grid gap-4 text-left">
              <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-red-500/20 transition-colors group">
                <div className="shrink-0 mt-1">
                  <Bot className="w-6 h-6 text-muted-foreground group-hover:text-red-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Don't be a bot.</h3>
                  <p className="text-sm text-muted-foreground">
                    Don't scrape us, don't spam us, and don't try to crash our servers. We are
                    developers; we will find you, and we will ban you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-blue-500/20 transition-colors group">
                <div className="shrink-0 mt-1">
                  <ShieldCheck className="w-6 h-6 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Don't be illegal.</h3>
                  <p className="text-sm text-muted-foreground">
                    Don't host malware, phishing scams, or anything that would make your mother
                    ashamed of you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-green-500/20 transition-colors group">
                <div className="shrink-0 mt-1">
                  <HeartHandshake className="w-6 h-6 text-muted-foreground group-hover:text-green-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Be nice.</h3>
                  <p className="text-sm text-muted-foreground">
                    This is an open source project. Don't exploit the free tier just because you
                    can. Support the community and we will support you.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="w-full md:w-auto font-bold">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />I Agree, Let me Build
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/40 mt-8">
          By clicking the button above, you legally agree to not be a jerk.
        </p>
      </div>
    </div>
  );
}
