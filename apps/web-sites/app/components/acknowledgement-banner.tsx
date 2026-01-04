import Link from 'next/link';

interface ActionLinkProps {
  href: string;
  children: React.ReactNode;
}

function ActionLink({ href, children }: ActionLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      className="font-medium underline decoration-primary decoration-2 underline-offset-2 transition-colors hover:text-primary hover:decoration-accent"
    >
      {children}
    </Link>
  );
}

function MarqueeContent() {
  const builderUrl = 'https://builder.kislap.app/';
  return (
    <div className="flex items-center mx-8 whitespace-nowrap">
      <span className="opacity-80">This site is powered by</span>
      <span className="mx-2 font-bold tracking-tight text-primary">✨KISLAP✨</span>
      <span className="hidden sm:inline text-muted-foreground/40 mx-2">|</span>
      <span>
        Visit <ActionLink href={builderUrl}>{builderUrl}</ActionLink>
      </span>
    </div>
  );
}

export default function AcknowledgementBanner() {
  return (
    <div className="bg-background relative w-full overflow-hidden border-b border-border py-2.5 text-xs text-muted-foreground backdrop-blur-sm">
      <div className="group flex w-full overflow-hidden select-none">
        <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around group-hover:[animation-play-state:paused]">
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
        </div>

        <div
          aria-hidden="true"
          className="animate-marquee flex min-w-full shrink-0 items-center justify-around group-hover:[animation-play-state:paused]"
        >
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
