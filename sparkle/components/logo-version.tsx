import { Badge } from "@/components/ui/badge";

export function LogoVersion() {
  return (
    <div className="flex items-center space-x-2">
      <div>
        ✨<span className="text-xl font-black">KISLAP</span>✨
      </div>
      <Badge variant="secondary" className="hidden sm:inline-flex">
        v0.0.0
      </Badge>
    </div>
  );
}
