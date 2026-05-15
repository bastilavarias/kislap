import { cn } from "@/lib/utils";
import type { APIResponsePaginationMeta, APIResponseProject } from "@/types/api-response";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShowcaseCard } from "@/components/showcase/showcase-card";

const PAGE_LIMIT = 9;
type ProjectTypeFilter = "all" | "portfolio" | "linktree" | "menu";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
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

const filterOptions: Array<{ value: ProjectTypeFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "portfolio", label: "Portfolio" },
  { value: "linktree", label: "Link Page" },
  { value: "menu", label: "Menu" },
];

function getFilterHref(filter: ProjectTypeFilter) {
  return filter === "all" ? "/showcase" : `/showcase?type=${filter}`;
}

interface ShowcaseFeedProps {
  projects: APIResponseProject[];
  apiBaseUrl: string;
  initialType?: ProjectTypeFilter;
  initialMeta?: APIResponsePaginationMeta | null;
}

export function ShowcaseFeed({
  projects,
  apiBaseUrl,
  initialType = "all",
  initialMeta = null,
}: ShowcaseFeedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<ProjectTypeFilter>(initialType);
  const [pageCache, setPageCache] = useState<
    Record<ProjectTypeFilter, Record<number, APIResponseProject[]>>
  >({
    all: {},
    portfolio: {},
    linktree: {},
    menu: {},
    [initialType]: { 1: projects ?? [] },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasNextPageByFilter, setHasNextPageByFilter] = useState<
    Record<ProjectTypeFilter, boolean>
  >({
    all: false,
    portfolio: false,
    linktree: false,
    menu: false,
    [initialType]: initialMeta
      ? initialMeta.page < initialMeta.last_page
      : (projects?.length || 0) === PAGE_LIMIT,
  });
  const [lastPageByFilter, setLastPageByFilter] = useState<
    Record<ProjectTypeFilter, number | null>
  >({
    all: null,
    portfolio: null,
    linktree: null,
    menu: null,
    [initialType]: initialMeta?.last_page ?? null,
  });

  const currentProjects = useMemo(
    () => pageCache[currentFilter]?.[currentPage] || [],
    [pageCache, currentFilter, currentPage],
  );
  const loadedPages = useMemo(
    () =>
      Object.keys(pageCache[currentFilter] || {})
        .map(Number)
        .sort((a, b) => a - b),
    [pageCache, currentFilter],
  );
  const paginationPages = useMemo(() => {
    const knownLastPage = lastPageByFilter[currentFilter];
    const fallbackLastPage = loadedPages[loadedPages.length - 1] || 1;
    const totalPages = Math.max(1, knownLastPage ?? fallbackLastPage);

    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [lastPageByFilter, currentFilter, loadedPages]);
  const canGoNext = lastPageByFilter[currentFilter]
    ? currentPage < (lastPageByFilter[currentFilter] || 1)
    : hasNextPageByFilter[currentFilter] || Boolean(pageCache[currentFilter]?.[currentPage + 1]);

  const parseProjectListResponse = (json: any) => {
    const payload = json?.data ?? json;
    const items = Array.isArray(payload) ? payload : payload?.data ?? [];
    const meta = Array.isArray(payload) ? null : payload?.meta ?? null;

    return {
      items: items as APIResponseProject[],
      meta: meta as APIResponsePaginationMeta | null,
    };
  };

  const fetchPage = async (page: number, filter = currentFilter) => {
    if (pageCache[filter]?.[page] || isLoading || !apiBaseUrl) {
      setCurrentPage(page);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      });
      if (filter !== "all") {
        params.set("type", filter);
      }

      const res = await fetch(`${apiBaseUrl}/api/projects/list/public?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
      const json = await res.json();
      const { items: nextItems, meta } = parseProjectListResponse(json);

      setPageCache((prev) => ({
        ...prev,
        [filter]: {
          ...(prev[filter] || {}),
          [page]: nextItems,
        },
      }));
      setCurrentPage(page);
      setHasNextPageByFilter((prev) => ({
        ...prev,
        [filter]: meta ? meta.page < meta.last_page : nextItems.length === PAGE_LIMIT,
      }));
      if (meta) {
        setLastPageByFilter((prev) => ({
          ...prev,
          [filter]: meta.last_page,
        }));
      }
    } catch {
      setLoadError("Unable to load more showcase projects right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!pageCache[currentFilter]?.[1] && apiBaseUrl) {
      void fetchPage(1, currentFilter);
      return;
    }

    setCurrentPage(1);
  }, [currentFilter]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    if (currentFilter === "all") {
      url.searchParams.delete("type");
    } else {
      url.searchParams.set("type", currentFilter);
    }
    window.history.replaceState({}, "", url.toString());
  }, [currentFilter]);

  const goPrev = () => {
    if (currentPage <= 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const goNext = async () => {
    const nextPage = currentPage + 1;
    if (!canGoNext) return;
    await fetchPage(nextPage, currentFilter);
  };

  return (
    <motion.div
      className="flex flex-col space-y-16 text-black"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex max-w-6xl flex-col space-y-8"
        >
          <motion.span
            variants={itemVariants}
            className="w-fit border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-black uppercase tracking-normal text-black shadow-[6px_6px_0_#000]"
          >
            Published with Kislap
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="max-w-6xl text-5xl font-black uppercase leading-[0.9] tracking-normal text-black md:text-7xl lg:text-8xl"
          >
            Real pages, not demo promises.
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-3xl text-xl font-semibold leading-relaxed text-zinc-700">
            Browse portfolios, link pages, and menus people have already published. Filter by format and open the work directly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3"
          >
            {filterOptions.map((option) => (
              <Button
                asChild
                key={option.value}
                variant={option.value === currentFilter ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-none border-4 border-black px-5 font-black uppercase shadow-[4px_4px_0_#000]",
                  option.value === currentFilter
                    ? "bg-secondary text-black hover:bg-secondary"
                    : "bg-white text-black hover:bg-black hover:text-white",
                )}
              >
                <a href={getFilterHref(option.value)} aria-current={option.value === currentFilter ? "page" : undefined}>
                  {option.label}
                </a>
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        {!currentProjects || currentProjects.length === 0 ? (
          <div className="border-4 border-black bg-secondary px-6 py-20 text-center shadow-[10px_10px_0_#000]">
            <p className="text-3xl font-black uppercase text-black">
              No published examples in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-flow-dense grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              className="rounded-none border-4 border-black bg-white font-black uppercase text-black shadow-[4px_4px_0_#000]"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            {paginationPages.map((page) => (
              <Button
                key={page}
                type="button"
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => fetchPage(page, currentFilter)}
                disabled={isLoading}
                className={cn(
                  "rounded-none border-4 border-black font-black uppercase shadow-[4px_4px_0_#000]",
                  page === currentPage ? "bg-black text-white" : "bg-white text-black",
                )}
              >
                {page}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={
                isLoading ||
                !canGoNext
              }
              className="rounded-none border-4 border-black bg-white font-black uppercase text-black shadow-[4px_4px_0_#000]"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? <p className="font-mono text-sm font-bold uppercase text-zinc-600">Loading page {currentPage + 1}...</p> : null}
          {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
