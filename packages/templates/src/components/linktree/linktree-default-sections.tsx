"use client";

import type React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackThenNavigate } from "./linktree-track-navigation";

export interface LinktreeSection {
  id: number;
  type: "promo" | "support" | "quote" | "banner";
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image_url?: string | null;
  accent_color?: string | null;
  quote_text?: string | null;
  quote_author?: string | null;
  banner_text?: string | null;
  support_note?: string | null;
  support_qr_image_url?: string | null;
}

function getAccentBackgroundStyle(accentColor?: string | null) {
  const trimmed = (accentColor || "").trim();
  if (!trimmed) return undefined;
  if (trimmed.includes("gradient(")) return { backgroundImage: trimmed };
  return { backgroundColor: trimmed };
}

function PromoSection({
  section,
  onTrackClick,
}: {
  section: LinktreeSection;
  onTrackClick?: (url: string) => Promise<unknown> | void;
}) {
  if (!section.url) return null;

  return (
    <a
      href={section.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
        trackThenNavigate(event, section.url as string, onTrackClick)
      }
      className="block rounded-2xl border border-border/70 bg-card p-3 transition hover:bg-accent/30"
    >
      {section.image_url ? (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-muted">
          <img
            src={section.image_url}
            alt={section.title || "Promo"}
            className="h-44 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{section.title}</p>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      {section.description ? (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {section.description}
        </p>
      ) : null}
    </a>
  );
}

function SupportSection({ section }: { section: LinktreeSection }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4">
      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-[1fr_112px] @sm:items-center">
        <div>
          {section.title ? (
            <p className="text-sm font-semibold">{section.title}</p>
          ) : null}
          {section.description ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {section.description}
            </p>
          ) : null}
          {section.support_note ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {section.support_note}
            </p>
          ) : null}
        </div>

        <div className="mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-xl border border-border/70 bg-background text-[10px] font-semibold text-muted-foreground">
          {section.support_qr_image_url ? (
            <img
              src={section.support_qr_image_url}
              alt={section.title || "Support QR"}
              className="h-full w-full object-cover"
            />
          ) : (
            "QR"
          )}
        </div>
      </div>
    </div>
  );
}

function QuoteSection({ section }: { section: LinktreeSection }) {
  const accentStyle = getAccentBackgroundStyle(section.accent_color);
  const hasAccent = !!accentStyle;

  return (
    <div
      style={accentStyle}
      className={cn(
        "rounded-2xl border border-border/70 p-6 @sm:p-8",
        hasAccent ? "" : "bg-card",
      )}
    >
      <blockquote
        className={cn(
          "text-center text-2xl italic leading-tight @sm:text-[2rem]",
          hasAccent ? "text-white" : "text-foreground",
        )}
      >
        {section.quote_text}
      </blockquote>
      {section.quote_author ? (
        <p
          className={cn(
            "mt-3 text-center text-xs uppercase tracking-[0.16em]",
            hasAccent ? "text-white/90" : "text-muted-foreground",
          )}
        >
          {section.quote_author}
        </p>
      ) : null}
    </div>
  );
}

function BannerSection({ section }: { section: LinktreeSection }) {
  const accentStyle = getAccentBackgroundStyle(section.accent_color);
  const hasAccent = !!accentStyle;
  return (
    <div
      style={accentStyle}
      className={cn(
        "rounded-xl border border-border/70 p-3",
        hasAccent ? "" : "bg-card",
      )}
    >
      <p
        className={cn(
          "text-center text-sm font-semibold",
          hasAccent ? "text-white" : "text-foreground",
        )}
      >
        {section.banner_text}
      </p>
    </div>
  );
}

export function DefaultSection({
  section,
  onTrackClick,
}: {
  section: LinktreeSection;
  onTrackClick?: (url: string) => Promise<unknown> | void;
}) {
  if (section.type === "promo") {
    return <PromoSection section={section} onTrackClick={onTrackClick} />;
  }
  if (section.type === "support") return <SupportSection section={section} />;
  if (section.type === "quote") return <QuoteSection section={section} />;
  if (section.type === "banner") return <BannerSection section={section} />;
  return null;
}


