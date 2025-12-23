'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Hammer, Search, AlertTriangle, Home } from 'lucide-react';

interface SiteErrorProps {
  type: 'not-found' | 'not-published' | 'invalid-domain';
}

export function SiteError({ type }: SiteErrorProps) {
  const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'http://kislap.test';
  const url = `${urlPrefix}/${rootDomain}`;

  const config = {
    'not-found': {
      icon: Search,
      badge: '404 Error',
      title: 'Nothing to see here.',
      description:
        'The page you are looking for has vanished into the void. It might have been moved or deleted.',
      colorClass: 'text-violet-500',
      bgClass: 'bg-violet-500/10',
      buttonVariant: 'default' as const,
    },
    'not-published': {
      icon: Hammer,
      badge: 'Work in Progress',
      title: 'Coming Soon.',
      description:
        "This site is currently being built. The creator hasn't flipped the 'Publish' switch just yet.",
      colorClass: 'text-orange-500',
      bgClass: 'bg-orange-500/10',
      buttonVariant: 'default' as const,
    },
    'invalid-domain': {
      icon: AlertTriangle,
      badge: 'Invalid Domain',
      title: 'Wrong Coordinates.',
      description: "We couldn't connect you to a project at this address. Double check the URL.",
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-500/10',
      buttonVariant: 'destructive' as const,
    },
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* 1. Technical Dot Pattern Background */}
      <div className="absolute inset-0 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

      <div className="z-10 w-full max-w-md px-4 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* 2. Floating Icon Container */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 relative group">
          <div
            className={cn(
              'absolute inset-0 rounded-2xl opacity-20 blur-xl transition-all group-hover:blur-2xl group-hover:opacity-40',
              current.colorClass,
              current.bgClass
            )}
          ></div>
          <Icon
            className={cn(
              'h-10 w-10 transition-transform duration-300 group-hover:scale-110',
              current.colorClass
            )}
          />
        </div>

        <div className="mb-8 space-y-3">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
              current.bgClass,
              current.colorClass
            )}
          >
            {current.badge}
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 pb-1">
            {current.title}
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed">{current.description}</p>
        </div>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <a href={`${url}/login`}>
              Claim this Domain
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
          >
            <a href={url}>
              <Home className="mr-2 h-4 w-4" />
              Kislap Home
            </a>
          </Button>
        </div>

        <div className="mt-12">
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] font-medium">
            Powered by Kislap Engine
          </p>
        </div>
      </div>
    </div>
  );
}
