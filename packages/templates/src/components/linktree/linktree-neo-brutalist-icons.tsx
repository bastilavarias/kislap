"use client";

import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa6";

export const PLATFORM_STYLES: Record<string, { label: string }> = {
  tiktok: { label: "T" },
  youtube: { label: "Y" },
  instagram: { label: "I" },
  discord: { label: "D" },
  github: { label: "G" },
  portfolio: { label: "P" },
  default: { label: "L" },
};

export const ICON_BADGE_STYLES: Record<string, string> = {
  tiktok: "bg-black text-white",
  youtube: "bg-red-500 text-white",
  instagram: "bg-yellow-300 text-black",
  discord: "bg-blue-600 text-white",
  portfolio: "bg-red-500 text-white",
  github: "bg-[#8b5e3c] text-white",
};

export function getPlatformKey(url: string, title: string) {
  const lowerUrl = (url || "").toLowerCase();
  const lowerTitle = (title || "").toLowerCase();
  if (lowerUrl.includes("tiktok.com") || lowerTitle.includes("tiktok")) return "tiktok";
  if (lowerUrl.includes("youtube.com") || lowerTitle.includes("youtube")) return "youtube";
  if (lowerUrl.includes("instagram.com") || lowerTitle.includes("instagram")) return "instagram";
  if (lowerUrl.includes("discord.com") || lowerTitle.includes("discord")) return "discord";
  if (lowerUrl.includes("github.com") || lowerTitle.includes("github")) return "github";
  if (lowerTitle.includes("portfolio")) return "portfolio";
  return "default";
}

export function BrandGlyph({ iconKey }: { iconKey: string }) {
  if (iconKey === "youtube") return <FaYoutube className="h-4 w-4" />;
  if (iconKey === "instagram") return <FaInstagram className="h-4 w-4" />;
  if (iconKey === "portfolio") return <FaGlobe className="h-4 w-4" />;
  if (iconKey === "github") return <FaGithub className="h-4 w-4" />;
  if (iconKey === "tiktok") return <FaTiktok className="h-4 w-4" />;
  if (iconKey === "discord") return <FaDiscord className="h-4 w-4" />;
  return null;
}
