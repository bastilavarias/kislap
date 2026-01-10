'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoVersion } from '@/components/logo-version';
import { Github, Heart, ArrowUpRight, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1 space-y-4">
            <LogoVersion url="/" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Turn your forms into stunning portfolios. The open source website builder for
              developers who value their time.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Product</h4>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              Builder
            </Link>
            <Link
              href="https://kislap.app/showcase"
              className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              Showcase
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <Link
              href="https://kislap.app/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              About Us
            </Link>
            <a
              href="https://github.com/bastilavarias/kislap"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center w-fit"
            >
              Open Source
              <ArrowUpRight className="ml-1 w-3 h-3 opacity-50" />
            </a>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
              Community
            </h4>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
                <a href="https://github.com/bastilavarias/kislap" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
                <a href="https://discord.gg/YcmUebEWhT" target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Discord</span>
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Join our discord to get help with your portfolio.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Kislap. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://github.com/bastilavarias"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              bastilavarias
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
