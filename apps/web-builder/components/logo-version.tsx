import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Props {
  url: string;
  showVersion?: boolean;
}

export function LogoVersion({ url, showVersion = false }: Props) {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

  return (
    <Link
      href={url}
      className="group flex items-center gap-3 transition hover:-translate-y-0.5"
      aria-label="Kislap home"
    >
      <img
        src="/logo.png"
        alt="Kislap"
        width={3148}
        height={768}
        className="h-14 w-auto object-contain transition-transform duration-200 group-hover:-translate-y-0.5"
      />
      {showVersion ? (
        <Badge
          variant="secondary"
          className="hidden rounded-none border-4 border-black bg-secondary px-2 py-1 font-mono text-[11px] font-black uppercase text-black shadow-[3px_3px_0_#000] sm:inline-flex"
        >
          v{appVersion}
        </Badge>
      ) : null}
    </Link>
  );
}
