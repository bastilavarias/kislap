import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function LogoVersion() {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

  return (
    <Link href="/" className="flex items-center space-x-2 hover:opacity-80">
      <div>
        ✨<span className="text-xl font-black">KISLAP</span>✨
      </div>
      <Badge variant="secondary" className="hidden sm:inline-flex">
        v{appVersion}
      </Badge>
    </Link>
  );
}
