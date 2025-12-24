'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useProject } from '@/hooks/api/use-project';
import type { APIResponseProject } from '@/types/api-response';
import { cn } from '@/lib/utils';
import {
  Loader2,
  ExternalLink,
  Globe,
  Layout,
  BarChart3,
  Zap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LivePreviewFrame } from '@/components/live-preview';

const ITEMS_PER_PAGE = 9;

const styleConfig: Record<string, { label: string; gradient: string; icon: any; glow: string }> = {
  portfolio: {
    label: 'Portfolio',
    gradient: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
    glow: 'group-hover:shadow-indigo-500/20',
    icon: Layout,
  },
  biz: {
    label: 'Business',
    gradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    glow: 'group-hover:shadow-emerald-500/20',
    icon: BarChart3,
  },
  waitlist: {
    label: 'Waitlist',
    gradient: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
    glow: 'group-hover:shadow-orange-500/20',
    icon: Zap,
  },
  default: {
    label: 'Project',
    gradient: 'from-zinc-500/20 via-slate-500/20 to-gray-500/20',
    glow: 'group-hover:shadow-zinc-500/20',
    icon: Globe,
  },
};

function ShowcaseCard({ project }: { project: APIResponseProject }) {
  const [isHovered, setIsHovered] = useState(false);

  const styles = styleConfig[project.type] || styleConfig.portfolio;

  const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'kislap.test';

  const liveUrl = project?.sub_domain ? `${urlPrefix}${project.sub_domain}.${rootDomain}` : null;

  const displayUrl = liveUrl ? liveUrl.replace(/^https?:\/\//, '') : 'loading...';

  return (
    <div
      className={cn(
        'group relative flex flex-col h-[380px] rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/30',
        styles.glow,
        'hover:shadow-xl'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-muted/30 group-hover:bg-muted/40 transition-colors">
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-20 transition-transform duration-700 group-hover:scale-110',
            styles.gradient
          )}
        />

        <div className="absolute top-8 left-8 right-8 bottom-0 bg-background/40 backdrop-blur-md rounded-t-xl border border-border/40 shadow-2xl transition-transform duration-500 group-hover:translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-md border-b border-border/40 z-20 flex items-center px-3 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            <div className="ml-2 h-4 flex-1 max-w-[140px] rounded-sm bg-muted/60 text-[9px] flex items-center px-2 text-muted-foreground truncate font-mono opacity-70">
              {displayUrl}
            </div>
          </div>

          <div className="absolute top-8 left-0 right-0 bottom-0 bg-white">
            <LivePreviewFrame url={liveUrl} isHovered={isHovered} />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6 relative z-10 bg-card">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-wider opacity-70"
          >
            {styles.label}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date(project.created_at).getFullYear()}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
          {project.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description ||
            'A digital experience crafted with precision. Check out the live version to see more.'}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="w-full font-semibold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all"
          >
            <a href={liveUrl || '#'} target="_blank" rel="noopener noreferrer">
              Visit Site{' '}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ShowcaseFeed() {
  const { getPublicList } = useProject();

  const [allProjects, setAllProjects] = useState<APIResponseProject[]>([]);

  const [displayedProjects, setDisplayedProjects] = useState<APIResponseProject[]>([]);

  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { success, data } = await getPublicList();

      if (success && data) {
        setAllProjects(data);
        setDisplayedProjects(data.slice(0, ITEMS_PER_PAGE));
        setHasMore(data.length > ITEMS_PER_PAGE);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setTimeout(() => {
      const nextCount = visibleCount + ITEMS_PER_PAGE;
      const nextBatch = allProjects.slice(0, nextCount);

      setDisplayedProjects(nextBatch);
      setVisibleCount(nextCount);

      if (nextCount >= allProjects.length) {
        setHasMore(false);
      }
    }, 500);
  }, [loading, hasMore, allProjects, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16 space-y-4">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-colors mb-2">
          <Sparkles className="w-3 h-3 mr-2" /> Community Showcase
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
          Made with Kislap
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore thousands of portfolios, landing pages, and waitlists built by our community.
        </p>
      </div>

      {loading && allProjects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[380px] rounded-2xl border border-border/40 bg-muted/10 animate-pulse relative overflow-hidden"
            >
              <div className="h-[220px] bg-muted/20 w-full" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted/20 rounded w-1/3" />
                <div className="h-6 bg-muted/20 rounded w-2/3" />
                <div className="h-4 bg-muted/20 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <ShowcaseCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <div ref={observerTarget} className="h-20 w-full flex items-center justify-center mt-8">
        {hasMore && !loading && (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground opacity-50" />
        )}
      </div>

      {!hasMore && displayedProjects.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>You've reached the end of the universe. 🌌</p>
        </div>
      )}

      {!loading && displayedProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">No published projects found.</p>
        </div>
      )}
    </div>
  );
}
