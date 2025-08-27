import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function LogoVersion() {
  return (
    <Link href="/" className="flex items-center space-x-2 hover:opacity-80">
      <div>
        ✨<span className="text-xl font-black">KISLAP</span>✨
      </div>
      <Badge variant="secondary" className="hidden sm:inline-flex">
        v0.0.0
      </Badge>
    </Link>
  );
}
