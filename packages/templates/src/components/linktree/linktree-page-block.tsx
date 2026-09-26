"use client";

import type React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CompositionLayout = "classic" | "bento" | "portfolio" | "creator";
export type BlockWidth = "auto" | "full" | "two-thirds" | "half" | "third";
export type BlockAlign = "left" | "center" | "right";
export type BlockVariant = "default" | "card" | "flat" | "highlight";
export type BlockPadding = "compact" | "normal" | "spacious";

export type BlockLayoutData = {
  width?: BlockWidth;
  align?: BlockAlign;
};

export type BlockStyleData = {
  variant?: BlockVariant;
  padding?: BlockPadding;
};

export type FlexibleBlockData = {
  type: string;
  content_json?: Record<string, unknown> | null;
  layout_json?: BlockLayoutData | null;
  style_json?: BlockStyleData | null;
};

const widthClasses: Record<Exclude<BlockWidth, "auto">, string> = {
  full: "@md:col-span-12",
  "two-thirds": "@md:col-span-8",
  half: "@md:col-span-6",
  third: "@md:col-span-4",
};

function defaultWidth(layout: CompositionLayout, type: string): Exclude<BlockWidth, "auto"> {
  if (layout === "classic") return "full";

  if (layout === "bento") {
    if (type === "banner" || type === "quote" || type === "experience") return "full";
    if (type === "text") return "two-thirds";
    if (type === "skills") return "third";
    return "half";
  }

  if (layout === "portfolio") {
    if (type === "experience" || type === "banner" || type === "quote") return "full";
    if (type === "text") return "two-thirds";
    if (type === "skills" || type === "link") return "third";
    return "half";
  }

  if (type === "banner" || type === "quote" || type === "text" || type === "experience") {
    return "full";
  }
  return "half";
}

export function pageShellWidthClass(
  layout: CompositionLayout,
  classicWidth = "max-w-[620px]",
) {
  if (layout === "bento") return "max-w-[980px]";
  if (layout === "portfolio") return "max-w-[1100px]";
  if (layout === "creator") return "max-w-[780px]";
  return classicWidth;
}

export function blockGridClass(
  layout: CompositionLayout,
  type: string,
  blockLayout?: BlockLayoutData | null,
) {
  const requested = blockLayout?.width || "auto";
  const width = requested === "auto" ? defaultWidth(layout, type) : requested;
  return cn("col-span-12 min-w-0", widthClasses[width]);
}

function alignmentClass(align?: BlockAlign) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function paddingClass(padding?: BlockPadding) {
  if (padding === "compact") return "p-2";
  if (padding === "spacious") return "p-5 @sm:p-6";
  return "p-3 @sm:p-4";
}

export function PageBlockFrame({
  block,
  brutal = false,
  children,
}: {
  block: FlexibleBlockData;
  brutal?: boolean;
  children: React.ReactNode;
}) {
  const variant = block.style_json?.variant || "default";
  const padding = block.style_json?.padding || "normal";
  const hasStyleSettings = !!block.style_json;
  const decorated = variant === "card" || variant === "highlight";

  return (
    <div
      className={cn(
        alignmentClass(block.layout_json?.align),
        hasStyleSettings && paddingClass(padding),
        decorated && (brutal ? "border-2 border-border" : "rounded-2xl border border-border/70"),
        variant === "card" && "bg-card",
        variant === "flat" && "bg-transparent",
        variant === "highlight" && "border-primary bg-primary/10",
        brutal && decorated && "shadow-[4px_4px_0_var(--shadow-color,var(--border))]",
      )}
    >
      {children}
    </div>
  );
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function skillItems(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return text(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PagePortfolioBlock({
  block,
  brutal = false,
}: {
  block: FlexibleBlockData;
  brutal?: boolean;
}) {
  const content = block.content_json || {};

  if (block.type === "text") {
    return (
      <PageBlockFrame block={block} brutal={brutal}>
        <div className={cn("h-full", brutal ? "border-2 border-border bg-card p-4" : "rounded-2xl border border-border/70 bg-card p-5")}>
          {text(content.heading) ? (
            <h2 className={cn("text-xl font-black", brutal && "uppercase")}>{text(content.heading)}</h2>
          ) : null}
          {text(content.body) ? (
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {text(content.body)}
            </p>
          ) : null}
        </div>
      </PageBlockFrame>
    );
  }

  if (block.type === "project") {
    const projectUrl = text(content.url);
    const project = (
      <div className={cn("h-full overflow-hidden", brutal ? "border-2 border-border bg-card" : "rounded-2xl border border-border/70 bg-card")}>
        {text(content.image_url) ? (
          <img
            src={text(content.image_url)}
            alt={text(content.title) || "Project"}
            className="h-40 w-full object-cover"
          />
        ) : null}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className={cn("text-lg font-black", brutal && "uppercase")}>{text(content.title)}</h2>
            {projectUrl ? <ArrowUpRight className="h-4 w-4 shrink-0" /> : null}
          </div>
          {text(content.description) ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {text(content.description)}
            </p>
          ) : null}
          {skillItems(content.technologies).length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {skillItems(content.technologies).map((item) => (
                <span
                  key={item}
                  className={cn(
                    "px-2 py-1 text-[10px] font-bold uppercase",
                    brutal ? "border-2 border-border" : "rounded-md border border-border/70",
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );

    return (
      <PageBlockFrame block={block} brutal={brutal}>
        {projectUrl ? (
          <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
            {project}
          </a>
        ) : project}
      </PageBlockFrame>
    );
  }

  if (block.type === "experience") {
    return (
      <PageBlockFrame block={block} brutal={brutal}>
        <div className={cn("h-full", brutal ? "border-2 border-border bg-card p-4" : "rounded-2xl border border-border/70 bg-card p-5")}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {[text(content.start), text(content.end)].filter(Boolean).join(" — ")}
          </p>
          <h2 className={cn("mt-2 text-lg font-black", brutal && "uppercase")}>{text(content.role)}</h2>
          {text(content.company) ? <p className="mt-1 text-sm font-semibold">{text(content.company)}</p> : null}
          {text(content.description) ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {text(content.description)}
            </p>
          ) : null}
        </div>
      </PageBlockFrame>
    );
  }

  if (block.type === "skills") {
    const items = skillItems(content.items);
    return (
      <PageBlockFrame block={block} brutal={brutal}>
        <div className={cn("h-full", brutal ? "border-2 border-border bg-card p-4" : "rounded-2xl border border-border/70 bg-card p-5")}>
          <h2 className={cn("text-lg font-black", brutal && "uppercase")}>
            {text(content.heading) || "Skills"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item}
                className={cn(
                  "px-2 py-1 text-xs font-semibold",
                  brutal ? "border-2 border-border" : "rounded-full border border-border/70 bg-secondary",
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </PageBlockFrame>
    );
  }

  return null;
}
