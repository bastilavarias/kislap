"use client";
import type React from "react";
import { useMemo, useState } from "react";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePageActivity } from "@/hooks/api/use-page-activity";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Mail, Phone, Share2 } from "lucide-react";
import {
  LinktreeSection,
  NeoBrutalistSection,
} from "./linktree-neo-brutalist-sections";
import {
  BrandGlyph,
  getPlatformKey,
  ICON_BADGE_STYLES,
  PLATFORM_STYLES,
} from "./linktree-neo-brutalist-icons";
import { trackThenNavigate } from "./linktree-track-navigation";
interface LinkItem {
  id: number;
  title: string;
  url: string;
  image_url?: string | null;
  icon_key?: string | null;
  placement_order?: number | null;
  description?: string | null;
}
interface ContentItem {
  kind: "link" | "section";
  id: number;
  placement_order: number;
  link?: LinkItem;
  section?: LinktreeSection;
}
interface LinktreeData {
  id?: number;
  project_id?: number;
  name?: string;
  tagline?: string;
  about?: string;
  background_style?: "plain" | "grid";
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  links?: LinkItem[];
  sections?: LinktreeSection[];
}
interface Props {
  linktree?: LinktreeData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}
const BRUTAL_SHADOW = {
  boxShadow: "4px 4px 0 var(--shadow-color, var(--border))",
};
const BRUTAL_SHADOW_LG = { boxShadow: "6px 6px 0 var(--shadow-color, var(--border))" };

function LinkCard({
  link,
  index,
  onTrackClick,
}: {
  link: LinkItem;
  index: number;
  onTrackClick?: (url: string) => Promise<unknown> | void;
}) {
  const platform = getPlatformKey(link.url, link.title);
  const style = PLATFORM_STYLES[platform];
  const iconKey = (link.icon_key || "").toLowerCase();
  const hasPresetIcon = !!ICON_BADGE_STYLES[iconKey];

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => trackThenNavigate(event, link.url, onTrackClick)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.25 }}
      whileHover={{ x: 3, y: -3 }}
      whileTap={{ scale: 0.98 }}
      style={BRUTAL_SHADOW}
      className={cn(
        "group relative block w-full border-2 border-border bg-card p-3 @sm:p-4",
        "transition-all duration-150 hover:bg-muted/30 hover:shadow-none",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-12 w-12 shrink-0 overflow-hidden grid place-items-center border-2 border-border text-xs font-black",
            hasPresetIcon
              ? ICON_BADGE_STYLES[iconKey]
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {hasPresetIcon ? (
            <BrandGlyph iconKey={iconKey} />
          ) : link.image_url ? (
            <img
              src={link.image_url}
              alt={link.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{style.label}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] @md:text-[16px] font-black uppercase tracking-wide leading-tight">
            {link.title}
          </h3>
          {link.description ? (
            <p className="text-[12px] @md:text-[14px] font-medium leading-relaxed text-muted-foreground">
              {link.description}
            </p>
          ) : null}
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0" />
      </div>
    </motion.a>
  );
}

export function LinktreeNeoBrutalist({
  linktree,
  themeMode,
  onSetThemeMode,
}: Props) {
  const [copied, setCopied] = useState(false);
  const { trackPageLinkClick } = usePageActivity();
  const isGridBackground = linktree?.background_style !== "plain";
  const gridLineColor =
    themeMode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const pageBackgroundStyle = isGridBackground
    ? {
        backgroundColor: "var(--background)",
        backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }
    : { backgroundColor: "var(--background)" };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackClick = async (url: string) => {
    if (!linktree?.project_id || !url) return;
    await trackPageLinkClick(linktree.project_id, url);
  };
  const handleTrackedContactClick = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    void trackThenNavigate(event, url, handleTrackClick);
  };

  const { emailValue, phoneValue, contentItems } = useMemo(() => {
    const links = linktree?.links ?? [];
    const sections = linktree?.sections ?? [];
    const emailLink =
      links.find((item) => item.url.toLowerCase().startsWith("mailto:")) ??
      null;
    const phoneLink =
      links.find((item) => item.url.toLowerCase().startsWith("tel:")) ?? null;
    const mainLinks = links.filter(
      (item) =>
        !item.url.toLowerCase().startsWith("mailto:") &&
        !item.url.toLowerCase().startsWith("tel:"),
    );
    const merged: ContentItem[] = [
      ...mainLinks.map((link) => ({
        kind: "link" as const,
        id: link.id,
        placement_order: link.placement_order ?? 0,
        link,
      })),
      ...sections.map((section) => ({
        kind: "section" as const,
        id: section.id,
        placement_order: section.placement_order ?? 0,
        section,
      })),
    ].sort((a, b) => a.placement_order - b.placement_order);

    return {
      emailValue:
        linktree?.email ||
        (emailLink ? emailLink.url.replace("mailto:", "") : ""),
      phoneValue:
        linktree?.phone || (phoneLink ? phoneLink.url.replace("tel:", "") : ""),
      contentItems: merged,
    };
  }, [linktree?.email, linktree?.phone, linktree?.links, linktree?.sections]);

  return (
    <div
      className={cn("@container min-h-screen w-full text-foreground font-sans p-4")}
      style={pageBackgroundStyle}
    >
      <section
        style={BRUTAL_SHADOW_LG}
        className={cn(
          "mx-auto w-full max-w-[680px] border-4 border-border p-3 @sm:p-5",
          isGridBackground ? "bg-background/95" : "bg-background",
        )}
      >
        <div className="mb-5 flex items-center justify-end gap-2 @sm:mb-7">
          <div className="flex items-center gap-2">
            <div className="border-2 border-border bg-primary px-2 py-1 text-primary-foreground">
              <ThemeSwitchToggle
                isDarkMode={themeMode === "dark"}
                onSetThemeMode={onSetThemeMode}
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              style={BRUTAL_SHADOW}
              className="h-9 w-9 rounded-none border-2 border-border bg-accent text-accent-foreground hover:shadow-none"
              onClick={handleShare}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="px-2 pb-2 text-center">
          <div
            style={BRUTAL_SHADOW}
            className="mx-auto h-24 w-24 overflow-hidden border-4 border-border bg-muted @sm:h-28 @sm:w-28"
          >
            {linktree?.logo_url ? (
              <img
                src={linktree.logo_url}
                alt={linktree?.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-3xl font-black">
                {linktree?.name?.charAt(0) || "N"}
              </div>
            )}
          </div>

          <h1 className="mt-4 text-[clamp(1.55rem,4.3vw,2.3rem)] font-black uppercase tracking-tight leading-tight">
            {linktree?.name}
          </h1>
          {linktree?.tagline ? (
            <p className="mx-auto mt-2 max-w-[42ch] text-[clamp(0.95rem,1.5vw,1.15rem)] font-medium leading-snug text-muted-foreground">
              {linktree.tagline}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm @sm:text-base font-semibold text-muted-foreground">
            {phoneValue ? (
              <a href={`tel:${phoneValue}`} className="inline-flex items-center gap-1 hover:text-foreground" onClick={(event) => handleTrackedContactClick(event, `tel:${phoneValue}`)}>
                <Phone className="h-3.5 w-3.5" />
                {phoneValue}
              </a>
            ) : null}
            {phoneValue && emailValue ? <span>|</span> : null}
            {emailValue ? (
              <a href={`mailto:${emailValue}`} className="inline-flex items-center gap-1 hover:text-foreground" onClick={(event) => handleTrackedContactClick(event, `mailto:${emailValue}`)}>
                <Mail className="h-3.5 w-3.5" />
                {emailValue}
              </a>
            ) : null}
          </div>

          {linktree?.about ? (
            <p className="mx-auto mt-2 max-w-[54ch] text-xs @sm:text-sm font-normal leading-snug text-muted-foreground/80">
              {linktree.about}
            </p>
          ) : null}
        </div>

        {contentItems.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 @sm:gap-4">
            {contentItems.map((item, index) =>
              item.kind === "link" && item.link ? (
                <LinkCard key={`link-${item.id}`} link={item.link} index={index} onTrackClick={handleTrackClick} />
              ) : item.kind === "section" && item.section ? (
                <NeoBrutalistSection key={`section-${item.id}`} section={item.section} onTrackClick={handleTrackClick} />
              ) : null,
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}



