'use client';

import {
  Check,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Search,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitchToggle } from '../theme-switch-toggle';
import { formatHoursLabel, formatPlatformLabel, MenuBusinessHour, MenuData, MenuSocialLink } from './menu-types';

interface Props {
  copied: boolean;
  businessHours: MenuBusinessHour[];
  menu: MenuData;
  query: string;
  socialLinks: MenuSocialLink[];
  themeMode: 'light' | 'dark';
  onQueryChange: (value: string) => void;
  onShare: () => void;
  onSetThemeMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

export function MenuDefaultHero({
  copied,
  businessHours,
  menu,
  query,
  socialLinks,
  themeMode,
  onQueryChange,
  onShare,
  onSetThemeMode,
}: Props) {
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = businessHours.find((entry) => entry.day === todayLabel) || businessHours[0] || null;

  return (
    <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card">
      <div className="mb-4 flex items-center justify-end gap-2 px-4 pt-4 sm:px-6">
        <ThemeSwitchToggle isDarkMode={themeMode === 'dark'} onSetThemeMode={onSetThemeMode} />
        <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full" onClick={onShare}>
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        </Button>
      </div>

      {menu.cover_image_url ? (
        <div className="relative h-52 w-full overflow-hidden sm:h-72">
          <img src={menu.cover_image_url} alt={menu.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </div>
      ) : null}

      <div className="px-4 pb-6 pt-6 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:items-end">
          <div className="flex items-start gap-4">
            <div className="-mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border-4 border-card bg-muted shadow-sm sm:h-28 sm:w-28">
              {menu.logo_url ? (
                <img src={menu.logo_url} alt={menu.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Wood-fired pizza and handmade pasta
              </p>
              <h1 className="mt-2 text-4xl font-black leading-none tracking-tight sm:text-6xl">
                {menu.name}
              </h1>
              {menu.description ? (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {menu.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 text-xs text-muted-foreground">
            {menu.phone ? (
              <span className="inline-flex items-center justify-between gap-3 rounded-[20px] border bg-background px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call the store
                </span>
                <span className="font-medium text-foreground">{menu.phone}</span>
              </span>
            ) : null}
            {menu.email ? (
              <span className="inline-flex items-center justify-between gap-3 rounded-[20px] border bg-background px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email us
                </span>
                <span className="font-medium text-foreground">{menu.email}</span>
              </span>
            ) : null}
            {menu.address ? (
              <span className="inline-flex items-center justify-between gap-3 rounded-[20px] border bg-background px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Visit
                </span>
                <span className="font-medium text-foreground">{menu.address}</span>
              </span>
            ) : null}
            {todayHours ? (
              <span className="inline-flex items-center justify-between gap-3 rounded-[20px] border bg-background px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  Open today
                </span>
                <span className="font-medium text-foreground">{formatHoursLabel(todayHours)}</span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {menu.website_url ? (
            <a
              href={menu.website_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between rounded-[20px] border bg-muted/15 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/30"
            >
              Website
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
          {menu.google_maps_url ? (
            <a
              href={menu.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between rounded-[20px] border bg-muted/15 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/30"
            >
              Open Map
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
          {menu.whatsapp ? (
            <a
              href={`https://wa.me/${menu.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between rounded-[20px] border bg-muted/15 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/30"
            >
              WhatsApp
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
          {socialLinks[0]?.url ? (
            <a
              href={socialLinks[0].url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between rounded-[20px] border bg-muted/15 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/30"
            >
              Instagram
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        {menu.search_enabled !== false ? (
          <div className="mt-8 flex items-center gap-3 rounded-[22px] border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search menu..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {todayHours ? (
            <div className="rounded-[24px] border bg-muted/15 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Opening Hours
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-lg font-black tracking-tight">
                  {todayHours.day}
                </p>
                <p className="text-base text-muted-foreground">{formatHoursLabel(todayHours)}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {businessHours.length
                  ? `Open ${businessHours.filter((entry) => !entry.closed).length} days a week for dine-in, pickup, and late-night cravings.`
                  : 'Fresh from the oven daily.'}
              </p>
            </div>
          ) : null}

          {socialLinks.length ? (
            <div className="rounded-[24px] border bg-muted/15 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Follow & Review
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/30"
                  >
                    {formatPlatformLabel(link.platform)}
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Keep up with new drops, limited pies, and what regulars are saying about the kitchen.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
