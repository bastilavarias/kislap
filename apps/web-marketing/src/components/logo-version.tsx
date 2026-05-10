import { Badge } from "@/components/ui/badge";
import { APP_VERSION } from "astro:env/client";

interface Props {
  url: string;
}

export function LogoVersion({ url }: Props) {
  return (
    <a href={url} className="group flex items-center gap-3">
      <div className="border-4 border-black bg-white px-3 py-2 text-black shadow-[5px_5px_0_#000] transition-transform duration-200 group-hover:-translate-y-0.5">
        <span className="text-xl font-black leading-none tracking-normal">
          KISLAP
        </span>
      </div>
      <Badge
        variant="secondary"
        className="hidden rounded-none border-4 border-black bg-secondary px-2 py-1 font-mono text-[11px] font-black text-black shadow-[3px_3px_0_#000] sm:inline-flex"
      >
        v{APP_VERSION}
      </Badge>
    </a>
  );
}
