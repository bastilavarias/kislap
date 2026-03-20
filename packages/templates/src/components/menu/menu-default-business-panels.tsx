'use client';

import { ExternalLink } from 'lucide-react';
import { formatHoursLabel, formatPlatformLabel, MenuBusinessHour, MenuSocialLink } from './menu-types';

interface Props {
  businessHours: MenuBusinessHour[];
  socialLinks: MenuSocialLink[];
}

export function MenuDefaultBusinessPanels({ businessHours, socialLinks }: Props) {
  if (!businessHours.length && !socialLinks.length) return null;

  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      {businessHours.length ? (
        <div className="rounded-[28px] border border-border/70 bg-card p-5">
          <h2 className="text-lg font-bold tracking-tight">Opening Hours</h2>
          <div className="mt-4 space-y-2">
            {businessHours.map((entry) => (
              <div key={entry.day} className="flex items-center justify-between rounded-xl border bg-muted/15 px-4 py-3 text-sm">
                <span className="font-medium">{entry.day}</span>
                <span className="text-muted-foreground">{formatHoursLabel(entry)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {socialLinks.length ? (
        <div className="rounded-[28px] border border-border/70 bg-card p-5">
          <h2 className="text-lg font-bold tracking-tight">Social & Reviews</h2>
          <div className="mt-4 grid gap-2">
            {socialLinks.map((link) => (
              <a key={link.platform} href={link.url!} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between rounded-xl border bg-muted/15 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/30">
                {formatPlatformLabel(link.platform)}
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
