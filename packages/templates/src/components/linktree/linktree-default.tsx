"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Mail, Phone, Share2 } from "lucide-react";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Button } from "@/components/ui/button";
import { Mode } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { usePageActivity } from "@/hooks/api/use-page-activity";
import { BrandGlyph, ICON_BADGE_STYLES } from "./linktree-neo-brutalist-icons";
import { DefaultSection, LinktreeSection } from "./linktree-default-sections";
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
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  background_style?: "plain" | "grid";
  links?: LinkItem[];
  sections?: LinktreeSection[];
}

interface Props {
  linktree?: LinktreeData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

function LinkCard({
  link,
  onTrackClick,
}: {
  link: LinkItem;
  onTrackClick?: (url: string) => Promise<unknown> | void;
}) {
  const iconKey = (link.icon_key || "").toLowerCase();
  const hasPresetIcon = !!ICON_BADGE_STYLES[iconKey];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => trackThenNavigate(event, link.url, onTrackClick)}
      className={cn(
        "group block rounded-2xl border border-border/70 bg-card p-3",
        "transition hover:bg-accent/30",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/70",
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
            <ArrowUpRight className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{link.title}</p>
          {link.description ? (
            <p className="truncate text-sm text-muted-foreground">
              {link.description}
            </p>
          ) : null}
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
    </a>
  );
}

export function LinktreeDefault({
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
        backgroundSize: "24px 24px",
      }
    : { backgroundColor: "var(--background)" };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTrackClick = async (url: string) => {
    if (!linktree?.project_id || !url) return;
    await trackPageLinkClick(linktree.project_id, url);
  };

  const handleTrackedContactClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
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
        linktree?.email || emailLink?.url.replace("mailto:", "") || "",
      phoneValue: linktree?.phone || phoneLink?.url.replace("tel:", "") || "",
      contentItems: merged,
    };
  }, [
    linktree?.about,
    linktree?.email,
    linktree?.links,
    linktree?.phone,
    linktree?.sections,
  ]);

  return (
    <div className="min-h-screen w-full p-4 sm:p-6" style={pageBackgroundStyle}>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto w-full max-w-[620px] rounded-3xl border border-border/70 bg-background/95 p-4 sm:p-6"
      >
        <div className="mb-6 flex items-center justify-end gap-2">
          <ThemeSwitchToggle
            isDarkMode={themeMode === "dark"}
            onSetThemeMode={onSetThemeMode}
          />
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={handleShare}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="text-center">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-border/70 bg-muted">
            {linktree?.logo_url ? (
              <img
                src={linktree.logo_url}
                alt={linktree?.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            {linktree?.name}
          </h1>
          {linktree?.tagline ? (
            <p className="mx-auto mt-2 max-w-[42ch] text-sm text-muted-foreground">
              {linktree.tagline}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            {phoneValue ? (
              <a
                href={`tel:${phoneValue}`}
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={(event) =>
                  handleTrackedContactClick(event, `tel:${phoneValue}`)
                }
              >
                <Phone className="h-3.5 w-3.5" />
                {phoneValue}
              </a>
            ) : null}
            {phoneValue && emailValue ? <span>|</span> : null}
            {emailValue ? (
              <a
                href={`mailto:${emailValue}`}
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={(event) =>
                  handleTrackedContactClick(event, `mailto:${emailValue}`)
                }
              >
                <Mail className="h-3.5 w-3.5" />
                {emailValue}
              </a>
            ) : null}
          </div>

          {linktree?.about ? (
            <p className="mx-auto mt-2 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
              {linktree.about}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {contentItems.map((item) =>
            item.kind === "link" && item.link ? (
              <LinkCard
                key={`link-${item.id}`}
                link={item.link}
                onTrackClick={handleTrackClick}
              />
            ) : item.kind === "section" && item.section ? (
              <DefaultSection
                key={`section-${item.id}`}
                section={item.section}
                onTrackClick={handleTrackClick}
              />
            ) : null,
          )}
        </div>
      </motion.section>
    </div>
  );
}
