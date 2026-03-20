'use client';

import { Clock3, Sparkles, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MenuCategory, MenuItem } from './menu-types';

interface Props {
  item: MenuItem | null;
  category?: MenuCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuDefaultItemDialog({ item, category, open, onOpenChange }: Props) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">{item.name}</DialogTitle>
          <DialogDescription>
            {category?.name || 'Menu item'}
            {item.badge ? ` - ${item.badge}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {item.image_url ? (
            <div className="overflow-hidden rounded-2xl border bg-muted">
              <img src={item.image_url} alt={item.name} className="h-72 w-full object-cover" />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
              {item.price}
            </span>
            {item.badge ? (
              <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <Tag className="h-3.5 w-3.5" />
                {item.badge}
              </span>
            ) : null}
            {item.is_featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
            {item.is_available === false ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-destructive">
                <Clock3 className="h-3.5 w-3.5" />
                Unavailable
              </span>
            ) : null}
          </div>

          {item.description ? (
            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
