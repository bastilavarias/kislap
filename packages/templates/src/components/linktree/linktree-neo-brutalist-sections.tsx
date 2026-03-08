"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

function PromoSection({ section }: { section: LinktreeSection }) {
  if (!section.url) return null;
  return (
    <a
      href={section.url}
      target="_blank"
      rel="noopener noreferrer"
      style={BRUTAL_SHADOW}
      className="block border-2 border-border bg-card p-2 transition-all duration-150 hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-none"
    >
      <div className="h-44 w-full overflow-hidden bg-muted">
        {section.image_url ? (
          <img src={section.image_url} alt={section.title || "Promo"} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <p className="w-full text-center text-xs font-black uppercase tracking-wide">
          {section.title}
        </p>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
      {section.description ? (
        <p className="mt-1 text-center text-[11px] font-medium text-muted-foreground">
          {section.description}
        </p>
      ) : null}
    </a>
  );
}

function SupportSection({ section }: { section: LinktreeSection }) {
  return (
    <div style={BRUTAL_SHADOW} className="border-2 border-border bg-card p-2.5">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px] sm:items-center">
        <div>
          {section.title ? <p className="text-xs font-black uppercase">{section.title}</p> : null}
          {section.description ? (
            <p className="mt-1 text-[11px] text-muted-foreground">{section.description}</p>
          ) : null}
          {section.support_note ? (
            <p className="mt-1 text-[11px] text-muted-foreground">{section.support_note}</p>
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
  return (
    <div style={BRUTAL_SHADOW} className="relative overflow-hidden border-2 border-border bg-background p-4 sm:p-5">
      <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-primary/50 blur-2xl" />
      <div className="absolute -right-12 -bottom-10 h-28 w-28 rounded-full bg-accent/50 blur-2xl" />
      <blockquote className="relative z-10 text-center text-[1.75rem] sm:text-[2.3rem] italic font-medium leading-tight">
        {section.quote_text}
      </blockquote>
      {section.quote_author ? (
        <p className="relative z-10 mt-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          {section.quote_author}
        </p>
      ) : null}
    </div>
  );
}

function BannerSection({ section }: { section: LinktreeSection }) {
  const style = section.accent_color
    ? {
        backgroundColor: section.accent_color,
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
      <p className={cn("text-center text-sm sm:text-base font-black uppercase", section.accent_color ? "text-white" : "text-foreground")}>
        {section.banner_text}
      </p>
    </div>
  );
}

export function NeoBrutalistSection({ section }: { section: LinktreeSection }) {
  if (section.type === "promo") return <PromoSection section={section} />;
  if (section.type === "support") return <SupportSection section={section} />;
  if (section.type === "quote") return <QuoteSection section={section} />;
  if (section.type === "banner") return <BannerSection section={section} />;
  return null;
}
