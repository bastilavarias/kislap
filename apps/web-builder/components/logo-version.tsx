import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Props {
  url: string;
}

export function LogoVersion({ url }: Props) {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

  return (
    <Link href={url} className="flex items-center gap-2 transition hover:-translate-y-0.5">
      <div className="border-2 border-black bg-white px-3 py-1 text-xl font-black leading-none tracking-normal text-black shadow-[3px_3px_0_#000]">
        KISLAP
      </div>
      <Badge
        variant="secondary"
        className="rounded-none border-2 border-black bg-secondary px-2 py-1 font-mono text-[10px] font-black uppercase text-black"
      >
        v{appVersion}
      </Badge>
    </Link>
  );
}
