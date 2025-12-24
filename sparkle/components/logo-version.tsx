import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Props {
  url: string;
}

export function LogoVersion({ url }: Props) {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

  return (
    <Link href={url} className="flex items-center space-x-2 hover:opacity-80">
      <div>
        ✨<span className="text-xl font-black">KISLAP</span>✨
      </div>
      <Badge variant="secondary" className="inline-flex">
        v{appVersion}
      </Badge>
    </Link>
  );
}
