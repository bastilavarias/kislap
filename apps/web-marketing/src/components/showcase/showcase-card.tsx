import { useState } from "react";
import { ArrowRight, Globe, Layout } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LivePreviewFrame } from "@/components/live-preview";
import { getPublicProjectUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { APIResponseProject } from "@/types/api-response";

const styleConfig: Record<
  string,
  { label: string; accent: string; surface: string; icon: typeof Layout }
> = {
  portfolio: {
    label: "Portfolio",
    accent: "bg-blue-500 text-white",
    surface: "bg-blue-100",
    icon: Layout,
  },
  linktree: {
    label: "Link Page",
    accent: "bg-fuchsia-500 text-white",
    surface: "bg-fuchsia-100",
    icon: Globe,
  },
  menu: {
    label: "Menu",
    accent: "bg-secondary text-black",
    surface: "bg-amber-100",
    icon: Layout,
  },
  default: {
    label: "Project",
    accent: "bg-primary text-white",
    surface: "bg-zinc-200",
    icon: Globe,
  },
};

export function ShowcaseCard({ project }: { project: APIResponseProject }) {
  const [isHovered, setIsHovered] = useState(false);
  const [ogImageFailed, setOgImageFailed] = useState(false);
  const styles = styleConfig[project.type] || styleConfig.default;
  const liveUrl = getPublicProjectUrl(project.sub_domain);
  const displayUrl = liveUrl.replace(/^https?:\/\//, "");
  const hasOgImage = !!project.og_image_url && !ogImageFailed;

  return (
    <div
      className="group relative flex min-h-[460px] flex-col border-4 border-black bg-white shadow-[8px_8px_0_#000] transition-all duration-300 hover:-translate-y-2 hover:rotate-[-0.5deg] hover:shadow-[14px_14px_0_#000]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("relative h-[270px] w-full overflow-hidden border-b-4 border-black", styles.surface)}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.14)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.14)_50%,rgba(0,0,0,0.14)_75%,transparent_75%,transparent)] bg-[length:30px_30px] opacity-20" />
        <div className="absolute bottom-0 left-6 right-6 top-8 overflow-hidden border-4 border-black bg-white transition-transform duration-500 group-hover:scale-[1.025]">
          <div className="absolute left-0 right-0 top-0 z-20 flex h-9 items-center gap-1.5 border-b-4 border-black bg-white px-3">
            <div className="h-3 w-3 border-2 border-black bg-primary" />
            <div className="h-3 w-3 border-2 border-black bg-secondary" />
            <div className="h-3 w-3 border-2 border-black bg-black" />
            <div className="ml-2 flex h-5 max-w-[150px] flex-1 items-center truncate border border-black bg-zinc-100 px-2 font-mono text-[9px] font-bold uppercase text-zinc-700">
              {displayUrl}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 top-9 bg-white">
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

      <div className="relative z-10 flex flex-grow flex-col bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn("rounded-none border-2 border-black px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#000]", styles.accent)}
          >
            {styles.label}
          </Badge>
          <span className="font-mono text-xs font-bold text-zinc-500">
            {new Date(project.created_at).getFullYear()}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-2xl font-black uppercase leading-tight tracking-normal text-black transition-colors group-hover:text-primary">
          {project.name}
        </h3>
        <p className="mb-5 line-clamp-2 text-sm font-semibold leading-relaxed text-zinc-700">
          {project.description || "A published Kislap page built to be opened, scanned, and shared."}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="h-11 w-full rounded-none border-2 border-black bg-black font-black uppercase text-white shadow-[4px_4px_0_#facc15] transition-all group-hover:bg-primary group-hover:text-white"
          >
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              Visit Site
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
