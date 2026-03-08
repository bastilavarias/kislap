import { cn } from "@/lib/utils";
import type { APIResponseProject } from "@/types/api-response";
import {
  Layout,
  BarChart3,
  Zap,
  Globe,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LivePreviewFrame } from "./live-preview";

const PAGE_LIMIT = 9;

const styleConfig: Record<
  string,
  { label: string; gradient: string; icon: any; glow: string }
> = {
  portfolio: {
    label: "Portfolio",
    gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    glow: "group-hover:shadow-indigo-500/20",
    icon: Layout,
  },
  biz: {
    label: "Business",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    glow: "group-hover:shadow-emerald-500/20",
    icon: BarChart3,
  },
  waitlist: {
    label: "Waitlist",
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    glow: "group-hover:shadow-orange-500/20",
    icon: Zap,
  },
  default: {
    label: "Project",
    gradient: "from-zinc-500/20 via-slate-500/20 to-gray-500/20",
    glow: "group-hover:shadow-zinc-500/20",
    icon: Globe,
  },
};

function ShowcaseCard({ project }: { project: APIResponseProject }) {
  const [isHovered, setIsHovered] = useState(false);
  const [ogImageFailed, setOgImageFailed] = useState(false);
  const styles = styleConfig[project.type] || styleConfig.default;
  const liveUrl = project.sub_domain ? `https://${project.sub_domain}.kislap.app` : "#";
  const displayUrl = liveUrl.replace(/^https?:\/\//, "");
  const hasOgImage = !!project.og_image_url && !ogImageFailed;

  return (
    <div
      className={cn(
        "group relative flex h-[380px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/30",
        styles.glow,
        "hover:shadow-xl",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-muted/30 transition-colors group-hover:bg-muted/40">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-20 transition-transform duration-700 group-hover:scale-110",
            styles.gradient,
          )}
        />
        <div className="absolute bottom-0 left-0 right-0 top-8 overflow-hidden rounded-t-xl border border-border/40 bg-background/40 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:translate-y-1">
          <div className="absolute left-0 right-0 top-0 z-20 flex h-8 items-center gap-1.5 border-b border-border/40 bg-background/80 px-3 backdrop-blur-md">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <div className="ml-2 flex h-4 max-w-[140px] flex-1 items-center truncate rounded-sm bg-muted/60 px-2 font-mono text-[9px] text-muted-foreground opacity-70">
              {displayUrl}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 top-8 bg-white">
            {hasOgImage ? (
              <img
                src={project.og_image_url as string}
                alt={`${project.name} preview`}
                className="h-full w-full object-cover object-top"
                loading="lazy"
                onError={() => setOgImageFailed(true)}
              />
            ) : (
              <LivePreviewFrame url={liveUrl} isHovered={isHovered} />
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-grow flex-col bg-card p-6">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {styles.label}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {new Date(project.created_at).getFullYear()}
          </span>
        </div>

        <h3 className="mb-1 line-clamp-1 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {project.name}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {project.description || "A digital experience crafted with precision."}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="w-full font-semibold shadow-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              Visit Site{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

interface ShowcaseFeedProps {
  projects: APIResponseProject[];
  apiBaseUrl: string;
}

export function ShowcaseFeed({ projects, apiBaseUrl }: ShowcaseFeedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCache, setPageCache] = useState<Record<number, APIResponseProject[]>>({
    1: projects ?? [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState((projects?.length || 0) === PAGE_LIMIT);

  const currentProjects = useMemo(() => pageCache[currentPage] || [], [pageCache, currentPage]);
  const loadedPages = useMemo(
    () => Object.keys(pageCache).map(Number).sort((a, b) => a - b),
    [pageCache],
  );

  const fetchPage = async (page: number) => {
    if (pageCache[page] || isLoading || !apiBaseUrl) {
      setCurrentPage(page);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/projects/list/public?page=${page}&limit=${PAGE_LIMIT}`);
      if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
      const json = await res.json();
      const nextItems: APIResponseProject[] = json?.data || [];

      setPageCache((prev) => ({ ...prev, [page]: nextItems }));
      setCurrentPage(page);
      setHasNextPage(nextItems.length === PAGE_LIMIT);
    } catch {
      setLoadError("Unable to load more showcase projects right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const goPrev = () => {
    if (currentPage <= 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const goNext = async () => {
    const nextPage = currentPage + 1;
    if (!hasNextPage && !pageCache[nextPage]) return;
    await fetchPage(nextPage);
  };

  return (
    <motion.div
      className="flex flex-col space-y-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto flex max-w-3xl flex-col items-center space-y-8 text-center"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center rounded-full border border-secondary-foreground/10 bg-secondary/50 px-4 py-1.5 text-sm font-semibold text-secondary-foreground backdrop-blur-sm"
          >
            Our Samples
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Kislap <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Showcase
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
            Explore sites builth with Kislap. Take a look for inspiration!
          </motion.p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        {!currentProjects || currentProjects.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">
              No projects found. Be the first to build one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentProjects.map((project) => (
              <ShowcaseCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            {loadedPages.map((page) => (
              <Button
                key={page}
                type="button"
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => fetchPage(page)}
                disabled={isLoading}
              >
                {page}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={isLoading || (!hasNextPage && !pageCache[currentPage + 1])}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? <p className="text-sm text-muted-foreground">Loading page {currentPage + 1}...</p> : null}
          {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
