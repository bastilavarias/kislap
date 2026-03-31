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
  app_url?: string | null;
  image_url?: string | null;
  accent_color?: string | null;
  quote_text?: string | null;
  quote_author?: string | null;
  banner_text?: string | null;
  support_note?: string | null;
  support_qr_image_url?: string | null;
  cta_label?: string | null;
  placement_order?: number | null;
}

const BRUTAL_SHADOW = { boxShadow: "4px 4px 0 var(--shadow-color, var(--border))" };

function getAccentBackgroundStyle(accentColor?: string | null) {
  const trimmed = (accentColor || "").trim();
  if (!trimmed) return undefined;
  if (trimmed.includes("gradient(")) {
    return {
      backgroundImage: trimmed,
    };
  }
  return {
    backgroundColor: trimmed,
  };
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
      style={BRUTAL_SHADOW}
      className="block border-2 border-border bg-card p-3 @sm:p-4 transition-all duration-150 hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-none"
    >
      <div className="h-44 w-full overflow-hidden bg-muted">
        {section.image_url ? (
          <img src={section.image_url} alt={section.title || "Promo"} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-between py-1">
        <p className="w-full text-center text-[14px] @md:text-[16px] font-black uppercase tracking-wide leading-tight">
          {section.title}
        </p>
        <ArrowUpRight className="h-4 w-4" />
      </div>
      {section.description ? (
        <p className="mt-1 pb-1 text-center text-[12px] @md:text-[14px] font-medium leading-relaxed text-muted-foreground">
          {section.description}
        </p>
      ) : null}
    </a>
  );
}

function SupportSection({ section }: { section: LinktreeSection }) {
  return (
    <div style={BRUTAL_SHADOW} className="border-2 border-border bg-card p-3 @sm:p-4">
      <div className="grid grid-cols-1 gap-3 @sm:grid-cols-[1fr_140px] @sm:items-center">
        <div>
          {section.title ? <p className="text-[14px] @md:text-[16px] font-black uppercase leading-tight">{section.title}</p> : null}
          {section.description ? (
            <p className="mt-1 text-[12px] @md:text-[14px] font-medium leading-relaxed text-muted-foreground">{section.description}</p>
          ) : null}
          {section.support_note ? (
            <p className="mt-1 text-[12px] @md:text-[14px] font-medium leading-relaxed text-muted-foreground">{section.support_note}</p>
          ) : null}
        </div>
        <div className="mx-auto h-32 w-32 border-2 border-border bg-background grid place-items-center text-[10px] font-black overflow-hidden">
          {section.support_qr_image_url ? (
            <img
              src={section.support_qr_image_url}
              alt={section.title || "Support QR"}
              className="h-full w-full object-cover"
            />
          ) : (
            "QR CODE"
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
      style={{ ...BRUTAL_SHADOW, ...(accentStyle || {}) }}
      className={cn(
        "relative overflow-hidden border-2 border-border p-4 @sm:p-5",
        accentStyle ? "" : "bg-background"
      )}
    >
      <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-primary/50 blur-2xl" />
      <div className="absolute -right-12 -bottom-10 h-28 w-28 rounded-full bg-accent/50 blur-2xl" />
      <blockquote
        className={cn(
          "relative z-10 text-center text-[1.75rem] @sm:text-[2.3rem] italic font-mono font-medium leading-tight",
          hasAccent ? "text-white" : "text-foreground"
        )}
      >
        {section.quote_text}
      </blockquote>
      {section.quote_author ? (
        <p
          className={cn(
            "relative z-10 mt-2 text-center text-[10px] font-black uppercase tracking-[0.2em]",
            hasAccent ? "text-white/90" : "text-muted-foreground"
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
  const style = accentStyle
    ? {
        ...accentStyle,
        color: "white",
        boxShadow: "4px 4px 0 var(--shadow-color, var(--border))",
      }
    : BRUTAL_SHADOW;

  return (
    <div
      style={style}
      className={cn(
        "border-2 border-border p-3",
        section.accent_color ? "" : "bg-card",
      )}
    >
      <p className={cn("text-center text-sm @sm:text-base font-black uppercase", section.accent_color ? "text-white" : "text-foreground")}>
        {section.banner_text}
      </p>
    </div>
  );
}

export function NeoBrutalistSection({
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


