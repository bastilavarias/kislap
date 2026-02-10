"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { Mode } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Share2,
  MoreHorizontal,
  Check,
  Copy,
} from "lucide-react";
import { useState } from "react";

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

// --- Sub-Components ---

const ProfileHeader = ({
  linktree,
  themeMode,
  onSetThemeMode,
}: {
  linktree?: LinktreeData;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="relative w-full flex flex-col items-center pt-12 pb-8 px-4 text-center">
      {/* Top Controls (Theme & Share) */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent text-foreground transition-colors"
          onClick={handleShare}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </Button>
        <div className="scale-90 bg-background/50 backdrop-blur-sm rounded-full">
          <ThemeSwitchToggle
            isDarkMode={themeMode === "dark"}
            onSetThemeMode={onSetThemeMode}
          />
        </div>
      </div>

      {/* Avatar */}
      <div className="relative group mb-6">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
          {linktree?.logo_url ? (
            <img
              src={linktree.logo_url}
              alt={linktree.name || "Profile"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
              {linktree?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        {/* Verified/Status Badge (Optional visual flair) */}
        <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-4 border-background shadow-sm">
          <Check className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
        </div>
      </div>

      {/* Text Info */}
      <div className="space-y-2 max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-700 fade-in">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {linktree?.name || "User Profile"}
        </h1>
        {linktree?.tagline && (
          <p className="text-lg font-medium text-primary">{linktree.tagline}</p>
        )}
        {linktree?.about && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none px-4">
            {linktree.about}
          </p>
        )}
      </div>
    </header>
  );
};

const LinkCard = ({ link }: { link: LinkItem }) => {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex items-center p-1.5 pr-4 w-full mb-4 rounded-[1.5rem]",
        "bg-card text-card-foreground border border-border/50 shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-md hover:border-primary/50 hover:bg-accent/5",
        "active:scale-[0.98]",
      )}
    >
      {/* Thumbnail */}
      <div className="shrink-0 relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-muted border border-border/10 mr-4">
        {link.image_url ? (
          <img
            src={link.image_url}
            alt={link.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <ExternalLink className="w-5 h-5 text-primary/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col justify-center text-left min-w-0">
        <h3 className="font-semibold text-base md:text-lg truncate pr-2 group-hover:text-primary transition-colors">
          {link.title}
        </h3>
        {link.description && (
          <p className="text-xs text-muted-foreground truncate">
            {link.description}
          </p>
        )}
      </div>

      {/* Action Icon (Visual Indicator) */}
      <div className="shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground">
        <MoreHorizontal className="w-5 h-5" />
      </div>
    </a>
  );
};

const LinksList = ({ linktree }: { linktree?: LinktreeData }) => {
  // Sort links by placement_order (0, 1, 2...)
  const sortedLinks = useMemo(() => {
    if (!linktree?.links) return [];
    return [...linktree.links].sort(
      (a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0),
    );
  }, [linktree?.links]);

  if (sortedLinks.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
        No links available yet.
      </div>
    );
  }

  return (
    <main className="w-full max-w-2xl px-6 pb-20 mx-auto">
      <div className="flex flex-col items-center w-full">
        {sortedLinks.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </main>
  );
};

const SimpleFooter = ({ name }: { name?: string }) => {
  return (
    <footer className="py-8 text-center px-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-1 bg-border rounded-full mb-4 opacity-50" />
        <p className="text-xs font-medium text-muted-foreground/60">
          © {new Date().getFullYear()} {name || "Kaf."}
        </p>
        <Link
          href="/"
          className="text-[10px] uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
        >
          Powered by Linktree
        </Link>
      </div>
    </footer>
  );
};

// --- Main Component ---

export function LinktreeDefault({
  linktree,
  themeMode,
  onSetThemeMode,
}: Props) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col font-sans antialiased",
        // Use background color from theme object (handled by tailwind config/css variables via 'bg-background')
        "bg-background text-foreground transition-colors duration-300",
      )}
    >
      {/* Background decoration (Optional - creates a subtle glow based on primary color) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        <ProfileHeader
          linktree={linktree}
          themeMode={themeMode}
          onSetThemeMode={onSetThemeMode}
        />

        <LinksList linktree={linktree} />

        <SimpleFooter name={linktree?.name} />
      </div>
    </div>
  );
}
