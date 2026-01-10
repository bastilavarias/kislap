import { Badge } from "@/components/ui/badge";
import { APP_VERSION } from "astro:env/client";

interface Props {
  url: string;
}

export function LogoVersion({ url }: Props) {
  return (
    <a href={url} className="flex items-center space-x-2 hover:opacity-80">
      <div>
        ✨<span className="text-xl font-bold">KISLAP</span>✨
      </div>
      <Badge variant="secondary" className="inline-flex">
        v{APP_VERSION}
      </Badge>
    </a>
  );
}
