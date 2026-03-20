'use client';

import { cn } from '@/lib/utils';
import { MenuCategory, MenuItem } from './menu-types';

interface CategoryGroup {
  category: MenuCategory;
  items: MenuItem[];
}

interface Props {
  activeCategory: number | null;
  groups: CategoryGroup[];
  hasVisibleItems: boolean;
  onCategoryClick: (category: MenuCategory) => void;
  onItemClick: (item: MenuItem) => void;
}

export function MenuDefaultCategorySections({
  activeCategory,
  groups,
  hasVisibleItems,
  onCategoryClick,
  onItemClick,
}: Props) {
  return (
    <>
      <div className="sticky top-4 z-20 mt-6 overflow-x-auto rounded-[24px] border border-border/70 bg-background/90 p-2 backdrop-blur">
        <div className="flex min-w-max gap-2">
          {groups.map(({ category }) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryClick(category)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-8 space-y-12">
        {hasVisibleItems ? (
          groups.map(({ category, items }) =>
            items.length ? (
              <div key={category.id}>
                <div className="mb-5 overflow-hidden rounded-[32px] border border-border/70 bg-card">
                  {category.image_url ? (
                    <div className="relative h-48 w-full overflow-hidden sm:h-56">
                      <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                    </div>
                  ) : null}
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Menu section
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">{category.name}</h2>
                    {category.description ? (
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onItemClick(item)}
                      className="group overflow-hidden rounded-[30px] border border-border/70 bg-card text-left transition-colors hover:bg-accent/20"
                    >
                      {item.image_url ? (
                        <div className="h-48 w-full overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : null}

                      <div className="space-y-3 p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xl font-black tracking-tight">{item.name}</p>
                            {item.badge ? (
                              <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                                {item.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-lg font-black text-primary">{item.price}</p>
                        </div>
                        {item.description ? (
                          <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                        ) : null}
                        {item.is_available === false ? (
                          <span className="inline-flex rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-destructive">
                            Unavailable
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="rounded-[28px] border-2 border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-lg font-semibold">No menu items match this view yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different category or search term, or add more items in the editor.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
