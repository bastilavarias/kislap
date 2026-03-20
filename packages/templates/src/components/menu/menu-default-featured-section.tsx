'use client';

import { MenuItem } from './menu-types';

interface Props {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export function MenuDefaultFeaturedSection({ items, onItemClick }: Props) {
  if (!items.length) return null;

  return (
    <section className="mt-8 rounded-[32px] border border-border/70 bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            House favorites
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">Start With The Bestsellers</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          The first plates we recommend when someone is visiting the menu for the first time.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick(item)}
            className="group overflow-hidden rounded-[28px] border border-border/70 bg-background text-left transition-colors hover:bg-accent/20"
          >
            {item.image_url ? (
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.badge ? (
                  <span className="absolute left-3 top-3 inline-flex rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                    {item.badge}
                  </span>
                ) : null}
              </div>
            ) : null}
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg font-black tracking-tight">{item.name}</p>
                <p className="text-base font-black text-primary">{item.price}</p>
              </div>
              {item.description ? (
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
