"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Share2,
  Check,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Music2,
  Globe,
  Mail,
  ExternalLink,
} from "lucide-react";

// --- Types ---

export interface LinkItem {
  id: number;
  title: string;
  url: string;
  image_url?: string | null;
  placement_order: number;
  description?: string | null;
}

export interface LinktreeData {
  id?: number;
  name?: string;
  tagline?: string;
  about?: string;
  logo_url?: string;
  links?: LinkItem[];
  [key: string]: any;
}

interface Props {
  linktree?: LinktreeData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

// --- Icons & Logic ---

const PLATFORMS = {
  instagram: { icon: Instagram, label: "Instagram" },
  twitter: { icon: Twitter, label: "Twitter" },
  x: { icon: Twitter, label: "X" },
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  github: { icon: Github, label: "GitHub" },
  youtube: { icon: Youtube, label: "YouTube" },
  facebook: { icon: Facebook, label: "Facebook" },
  tiktok: { icon: Music2, label: "TikTok" }, // Using Music2 as placeholder for TikTok if specific icon unavailable
  spotify: { icon: Music2, label: "Spotify" },
  mailto: { icon: Mail, label: "Email" },
};

const getPlatform = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram.com")) return "instagram";
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
    return "x";
  if (lowerUrl.includes("linkedin.com")) return "linkedin";
  if (lowerUrl.includes("github.com")) return "github";
  if (lowerUrl.includes("youtube.com")) return "youtube";
  if (lowerUrl.includes("facebook.com")) return "facebook";
  if (lowerUrl.includes("tiktok.com")) return "tiktok";
  if (lowerUrl.includes("spotify.com")) return "spotify";
  if (lowerUrl.startsWith("mailto:")) return "mailto";
  return null;
};

// --- Components ---

const SocialRow = ({ links }: { links: LinkItem[] }) => {
  if (!links.length) return null;

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {links.map((link, i) => {
        const platformKey = getPlatform(link.url);
        const PlatformIcon = platformKey
          ? PLATFORMS[platformKey as keyof typeof PLATFORMS].icon
          : Globe;

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="text-foreground/70 hover:text-primary transition-colors p-2"
          >
            <PlatformIcon className="w-6 h-6" />
          </motion.a>
        );
      })}
    </motion.div>
  );
};

const LinkCard = ({ link, index }: { link: LinkItem; index: number }) => {
  // Determine icon based on URL if no custom image is provided
  const platformKey = getPlatform(link.url);
  const DefaultIcon = platformKey
    ? PLATFORMS[platformKey as keyof typeof PLATFORMS].icon
    : ExternalLink;

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex items-center w-full p-2 pr-4 rounded-full mb-4",
        "bg-card hover:bg-accent/80 text-card-foreground",
        "border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30",
        "transition-all duration-300 ease-out",
      )}
    >
      {/* Icon/Image Section */}
      <div className="shrink-0 relative w-12 h-12 rounded-full overflow-hidden bg-muted/50 border border-border/10 ml-1 mr-4 flex items-center justify-center">
        {link.image_url ? (
          <img
            src={link.image_url}
            alt={link.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <DefaultIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </div>

      {/* Text Section */}
      <div className="flex-grow flex flex-col justify-center text-left min-w-0 py-1">
        <h3 className="font-semibold text-sm md:text-base truncate group-hover:text-primary transition-colors">
          {link.title}
        </h3>
        {link.description && (
          <p className="text-[10px] md:text-xs text-muted-foreground truncate opacity-80">
            {link.description}
          </p>
        )}
      </div>
    </motion.a>
  );
};

// --- Main Layout ---

export function LinktreeDefault({
  linktree,
  themeMode,
  onSetThemeMode,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Logic: Separate Socials (First instance only) from Regular Links
  const { socialLinks, regularLinks } = useMemo(() => {
    if (!linktree?.links) return { socialLinks: [], regularLinks: [] };

    const sorted = [...linktree.links].sort(
      (a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0),
    );

    const usedPlatforms = new Set();
    const socials: LinkItem[] = [];
    const regular: LinkItem[] = [];

    sorted.forEach((link) => {
      const platform = getPlatform(link.url);

      if (platform && !usedPlatforms.has(platform) && platform !== "mailto") {
        usedPlatforms.add(platform);
        socials.push(link);
      } else {
        regular.push(link);
      }
    });

    return { socialLinks: socials, regularLinks: regular };
  }, [linktree?.links]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 text-foreground font-sans antialiased p-0 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative w-full max-w-md h-full md:h-[850px] md:max-h-[90vh]",
          "flex flex-col overflow-y-auto overflow-x-hidden",
          "bg-background/95 md:rounded-[3rem] md:border-[8px] md:border-neutral-900",
          "shadow-2xl scrollbar-hide",
        )}
      >
        {/* Decorative Top Gradient inside phone */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />

        {/* Top Controls */}
        <div className="relative z-20 flex justify-between items-center p-6">
          <ThemeSwitchToggle
            isDarkMode={themeMode === "dark"}
            onSetThemeMode={onSetThemeMode}
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-background/50"
            onClick={handleShare}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 pt-2 pb-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mb-4"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-background shadow-lg bg-muted">
              {linktree?.logo_url ? (
                <img
                  src={linktree.logo_url}
                  alt={linktree.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-3xl font-bold">
                  {linktree?.name?.charAt(0)}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {linktree?.name}
            </h1>
            {linktree?.tagline && (
              <p className="text-sm font-medium text-primary mb-2">
                {linktree.tagline}
              </p>
            )}
            {linktree?.about && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {linktree.about}
              </p>
            )}
          </motion.div>
        </div>

        <div className="relative z-10 px-6">
          <SocialRow links={socialLinks} />
        </div>

        <div className="relative z-10 flex-1 px-6 pb-12 flex flex-col items-center">
          {regularLinks.length > 0 ? (
            regularLinks.map((link, i) => (
              <LinkCard key={link.id} link={link} index={i} />
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-10 opacity-50">
              No links available
            </div>
          )}
        </div>

        <div className="py-6 text-center mt-auto relative z-10">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-medium text-muted-foreground/50">
              © {new Date().getFullYear()} {linktree?.name || "User"}
            </p>
            <Link
              href="/"
              className="text-[9px] uppercase tracking-widest text-primary/30 hover:text-primary transition-colors"
            >
              Powered by Linktree
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
