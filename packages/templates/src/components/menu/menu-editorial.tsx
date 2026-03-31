"use client";

import React from "react";
import { Globe, Github, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { Mode } from "@/contexts/settings-context";
import { ThemeStyles } from "@/types/theme";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { KISLAP_LINKS } from "../shared/kislap-links";
import {
  formatHoursLabel,
  formatMenuLocation,
  formatPlatformLabel,
  MenuData,
  MenuSocialLink,
} from "./menu-types";

interface Props {
  menu?: MenuData;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const FALLBACK_MENU: MenuData = {
  name: "Cafe Editorial",
  description: "A warm all-day menu for coffee, brunch, and quiet late conversations.",
  address: "123 Corner Studio Ave.",
  city: "Manila",
  business_hours: [{ day: "monday", open: "09:00", close: "18:00", closed: false }],
  categories: [
    { id: 1, name: "Signature Coffee", description: "House staples and bestsellers.", is_visible: true, placement_order: 1 },
    { id: 2, name: "Kitchen Plates", description: "Brunch plates and comfort bowls.", is_visible: true, placement_order: 2 },
  ],
  items: [
    { id: 1, menu_category_id: 1, name: "Sea Salt Latte", description: "Espresso, milk, and sea salt foam.", price: "120", is_available: true, placement_order: 1 },
    { id: 2, menu_category_id: 1, name: "House Mocha", description: "Deep cocoa, espresso, and cream.", price: "140", is_available: true, placement_order: 2 },
    { id: 3, menu_category_id: 2, name: "Truffle Eggs Toast", description: "Soft eggs, mushrooms, herbs, and toast.", price: "220", is_available: true, placement_order: 3 },
    { id: 4, menu_category_id: 2, name: "Chicken Pesto Bowl", description: "Herbed rice, chicken, greens, and pesto.", price: "260", is_available: true, placement_order: 4 },
  ],
  social_links: [
    { platform: "instagram", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "tiktok", url: "#" },
  ],
};

function socialIcon(platform: string) {
  switch (platform) {
    case "instagram":
      return <FaInstagram className="h-4 w-4" />;
    case "facebook":
      return <FaFacebookF className="h-4 w-4" />;
    case "tiktok":
      return <FaTiktok className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}

function sanitizeQrColor(value?: string | null, fallback = "111111") {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return trimmed.replace("#", "");
}

export function MenuEditorial({ menu, themeMode, themeStyles, onSetThemeMode }: Props) {
  const [currentUrl, setCurrentUrl] = React.useState(
    menu?.website_url?.trim() || KISLAP_LINKS.website
  );
  const source =
    menu && ((menu.categories?.length ?? 0) > 0 || (menu.items?.length ?? 0) > 0)
      ? menu
      : FALLBACK_MENU;
  const activeTheme =
    themeMode === "dark" ? { ...themeStyles.light, ...themeStyles.dark } : themeStyles.light;
  const bodyFont = activeTheme["font-serif"] || activeTheme["font-sans"] || "system-ui, sans-serif";
  const headingFont = activeTheme["font-sans"] || "system-ui, sans-serif";
  const borderColor = activeTheme.border || "rgba(0,0,0,0.12)";
  const mutedColor = activeTheme["muted-foreground"] || activeTheme.foreground || "#666";
  const foregroundColor = activeTheme.foreground || "#111";
  const backgroundColor = activeTheme.background || "#fff";
  const cardColor = activeTheme.card || backgroundColor;
  const qrForeground = sanitizeQrColor(
    source.qr_settings?.foreground_color,
    sanitizeQrColor(foregroundColor, "111111")
  );
  const qrBackground = sanitizeQrColor(
    source.qr_settings?.background_color,
    sanitizeQrColor(backgroundColor, "ffffff")
  );
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&color=${qrForeground}&bgcolor=${qrBackground}&data=${encodeURIComponent(
    currentUrl
  )}`;
  const categories = [...(source.categories || [])]
    .filter((category) => category.is_visible !== false)
    .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  const socials = (source.social_links || []).filter((link) => link.url?.trim()) as MenuSocialLink[];
  const hours = source.business_hours?.find((entry) => !entry.closed);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.share) {
        await navigator.share({ title: source.name || "Menu", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {}
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <div style={{ backgroundColor, color: foregroundColor, fontFamily: bodyFont }} className="@container min-h-screen px-4 py-8 @md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 overflow-hidden rounded-[2rem] border" style={{ borderColor, backgroundColor: cardColor }}>
          <div className="relative h-56 w-full @md:h-80">
            {source.cover_image_url ? (
              <img src={source.cover_image_url} alt={source.name || "Menu cover"} className="h-full w-full object-cover" />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: `linear-gradient(135deg, ${activeTheme.primary || foregroundColor}22, transparent 60%)` }}
              />
            )}
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <ThemeSwitchToggle isDarkMode={themeMode === "dark"} onSetThemeMode={onSetThemeMode} />
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm"
                style={{ borderColor, backgroundColor: `${backgroundColor}CC`, color: foregroundColor }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          <div className="grid gap-8 px-6 pb-8 pt-6 @md:grid-cols-[auto_1fr] @md:px-10">
            <div className="-mt-12 flex justify-center @md:-mt-16 @md:justify-start">
              <div className="relative z-10 h-32 w-32 overflow-hidden rounded-[2rem] border-4 shadow-sm @md:h-40 @md:w-40" style={{ borderColor: backgroundColor, backgroundColor: cardColor }}>
                {source.logo_url ? (
                  <img src={source.logo_url} alt={source.name || "Menu logo"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl" style={{ fontFamily: headingFont }}>M</div>
                )}
              </div>
            </div>

            <div className="space-y-5 text-center @md:text-left">
              <div>
                <p className="text-xs uppercase tracking-[0.25em]" style={{ color: mutedColor }}>
                  {source.city?.trim() || "House Menu"}
                </p>
                <h1 className="mt-2 text-4xl font-semibold @md:text-6xl" style={{ fontFamily: headingFont }}>
                  {source.name || "Cafe Editorial"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm @md:text-base" style={{ color: mutedColor }}>
                  {source.description || "A warm all-day menu for coffee, brunch, and quiet late conversations."}
                </p>
              </div>

              <div className="grid gap-4 @md:grid-cols-2">
                {formatMenuLocation(source) ? (
                  <div className="text-center @md:text-left">
                    <div
                      className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] @md:justify-start"
                      style={{ color: mutedColor }}
                    >
                      <MapPin className="h-4 w-4" />
                      Address
                    </div>
                    <p className="mt-2 text-sm font-medium @md:text-base">
                      {formatMenuLocation(source)}
                    </p>
                  </div>
                ) : null}
                {hours ? (
                  <div className="text-center @md:text-left">
                    <div
                      className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] @md:justify-start"
                      style={{ color: mutedColor }}
                    >
                      <Phone className="h-4 w-4" />
                      Store Hours
                    </div>
                    <p className="mt-2 text-sm font-semibold @md:text-base">
                      {formatHoursLabel(hours)}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap justify-center gap-3 @md:justify-start">
                {source.phone ? (
                  <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor }}>
                    <Phone className="h-4 w-4" /> {source.phone}
                  </span>
                ) : null}
                {source.email ? (
                  <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor }}>
                    <Mail className="h-4 w-4" /> {source.email}
                  </span>
                ) : null}
              </div>

              {socials.length ? (
                <div className="flex flex-wrap justify-center gap-3 @md:justify-start">
                  {socials.map((social) => (
                    <a
                      key={`${social.platform}-${social.url}`}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-80"
                      style={{ borderColor, color: foregroundColor }}
                      title={formatPlatformLabel(social.platform)}
                    >
                      {socialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="space-y-10">
          {categories.map((category) => {
            const items = [...(source.items || [])]
              .filter((item) => item.menu_category_id === category.id && item.is_available !== false)
              .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
            if (!items.length) return null;

            return (
              <section key={category.id} className="grid gap-6 border-t pt-8 @md:grid-cols-[280px_1fr]" style={{ borderColor }}>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold @md:text-4xl" style={{ fontFamily: headingFont }}>
                    {category.name}
                  </h2>
                  {category.description ? (
                    <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                      {category.description}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-4 @md:grid-cols-2">
                  {items.map((item) => {
                    const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
                    const defaultVariant = variants.find((variant) => variant.is_default) ?? variants[0];
                    return (
                      <article key={item.id} className="rounded-[1.5rem] border p-5" style={{ borderColor, backgroundColor: cardColor }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="mb-4 h-40 w-full rounded-2xl object-cover" />
                        ) : null}
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-2xl font-semibold leading-tight" style={{ fontFamily: headingFont }}>
                            {item.name}
                          </h3>
                          <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: activeTheme.primary || foregroundColor, color: activeTheme["primary-foreground"] || backgroundColor }}>
                            ₱{defaultVariant?.price || item.price}
                          </span>
                        </div>
                        {item.description ? (
                          <p className="mt-3 text-sm leading-relaxed" style={{ color: mutedColor }}>
                            {item.description}
                          </p>
                        ) : null}
                        {variants.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {variants.map((variant) => (
                              <span key={`${item.id}-${variant.name}`} className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em]" style={{ borderColor }}>
                                {variant.name} ₱{variant.price}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-12 border-t pt-8" style={{ borderColor }}>
          <div className="grid items-center gap-6 @md:grid-cols-[220px_1fr]">
            <div className="mx-auto">
              <img
                src={qrImageUrl}
                alt={`QR code for ${source.name || "menu"}`}
                className="h-[190px] w-[190px] object-cover"
              />
            </div>
            <div className="text-center @md:text-left">
              <h2 className="text-3xl font-semibold @md:text-4xl" style={{ fontFamily: headingFont }}>
                Share This Menu
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: mutedColor }}>
                Scan the QR code to open this menu on any phone, or copy the link and send it directly to your guests.
              </p>
              <div
                className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm"
                style={{ borderColor }}
              >
                <Globe className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{currentUrl}</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t pt-8 text-center" style={{ borderColor }}>
          <p className="text-sm font-semibold" style={{ fontFamily: headingFont }}>
            © {new Date().getFullYear()} {source.name || "Menu"}
          </p>
          <p className="mt-1 text-xs" style={{ color: mutedColor }}>
            Built with Kislap
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a href={KISLAP_LINKS.github} target="_blank" rel="noreferrer"><Github className="h-4 w-4" /></a>
            <a href={KISLAP_LINKS.website} target="_blank" rel="noreferrer"><Globe className="h-4 w-4" /></a>
            <a href={KISLAP_LINKS.facebook} target="_blank" rel="noreferrer"><FaFacebookF className="h-4 w-4" /></a>
          </div>
        </footer>
      </div>
    </div>
  );
}



