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

export default function AcknowledgementBanner() {
  const builderUrl = 'https://builder.kislap.app/';

  return (
    <div className="w-full border-b border-border bg-background py-2.5 text-center text-xs text-muted-foreground backdrop-blur-sm ">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-center items-center md:justify-between gap-2 px-4">
          <div>
            <span className="opacity-80">This site is powered by</span>
            <span className="font-bold tracking-tight text-primary">✨KISLAP✨</span>
          </div>

          <div>
            Visit <ActionLink href={builderUrl}>{builderUrl}</ActionLink>
          </div>
        </div>
      </div>
    </div>
  );
}
