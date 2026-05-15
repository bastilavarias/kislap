import * as React from 'react';
import { cn } from '@/lib/utils';

export function BuilderPageShell({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto flex w-full max-w-7xl flex-col gap-8', className)}
      {...props}
    />
  );
}

export function BuilderPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 border-4 border-black bg-white p-6 shadow-[8px_8px_0_#000] md:grid-cols-[1fr_auto] md:items-end">
      <div className="max-w-5xl">
        <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-normal md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-3">{action}</div> : null}
    </div>
  );
}

export function BuilderPanel({
  className,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section
      className={cn('border-4 border-black bg-white shadow-[6px_6px_0_#000]', className)}
      {...props}
    />
  );
}

export function BuilderPanelHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b-4 border-black p-5 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow ? (
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-black uppercase leading-tight">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export const builderButtonClass =
  'rounded-none border-2 border-black bg-black font-black uppercase text-white shadow-[4px_4px_0_#facc15] hover:bg-primary hover:text-white';

export const builderSecondaryButtonClass =
  'rounded-none border-2 border-black bg-secondary font-black uppercase text-black shadow-[4px_4px_0_#000] hover:bg-secondary';

export const builderOutlineButtonClass =
  'rounded-none border-2 border-black bg-white font-black uppercase text-black hover:bg-black hover:text-white';

export const builderInputClass =
  'rounded-none border-2 border-black bg-white font-semibold shadow-none focus-visible:ring-0 focus-visible:border-primary';

export const builderTabsListClass =
  'rounded-none border-2 border-black bg-white p-1 shadow-[4px_4px_0_#000]';

export const builderTabsTriggerClass =
  'rounded-none font-black uppercase data-[state=active]:bg-secondary data-[state=active]:text-black data-[state=active]:shadow-none';
