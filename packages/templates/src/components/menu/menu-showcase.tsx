"use client";

import React from "react";
import { Globe, Github, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { Mode } from "@/contexts/settings-context";
import { ThemeStyles } from "@/types/theme";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { KISLAP_LINKS } from "../shared/kislap-links";
import { formatHoursLabel, formatMenuLocation, MenuData, MenuSocialLink } from "./menu-types";

interface Props {
  menu?: MenuData;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const FALLBACK_MENU: MenuData = {
  name: "Studio Supper",
  description: "Visual-first menu for cafes, bakeries, and modern comfort food spots.",
  city: "Makati",
  business_hours: [{ day: "monday", open: "10:00", close: "20:00", closed: false }],
  categories: [
    { id: 1, name: "Coffee", description: "Daily brews and signature iced drinks.", is_visible: true, placement_order: 1 },
    { id: 2, name: "Desserts", description: "House sweets and soft-baked favorites.", is_visible: true, placement_order: 2 },
  ],
  items: [
    { id: 1, menu_category_id: 1, name: "Butterscotch Latte", description: "Espresso, milk, butterscotch, and sea salt.", price: "165", is_available: true, placement_order: 1 },
    { id: 2, menu_category_id: 1, name: "Cold Brew Float", description: "Slow-steeped brew with cream top.", price: "180", is_available: true, placement_order: 2 },
    { id: 3, menu_category_id: 2, name: "Banana Bread Slice", description: "Toasted thick-cut banana bread.", price: "120", is_available: true, placement_order: 3 },
    { id: 4, menu_category_id: 2, name: "Soft Cookie Box", description: "Three bakery-style cookies.", price: "150", is_available: true, placement_order: 4 },
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

export function MenuShowcase({ menu, themeMode, themeStyles, onSetThemeMode }: Props) {
  const [currentUrl, setCurrentUrl] = React.useState(
    menu?.website_url?.trim() || KISLAP_LINKS.website
  );
  const source =
    menu && ((menu.categories?.length ?? 0) > 0 || (menu.items?.length ?? 0) > 0)
      ? menu
      : FALLBACK_MENU;
  const activeTheme =
    themeMode === "dark" ? { ...themeStyles.light, ...themeStyles.dark } : themeStyles.light;
  const backgroundColor = activeTheme.background || "#fff";
  const foregroundColor = activeTheme.foreground || "#111";
  const mutedColor = activeTheme["muted-foreground"] || "#666";
  const borderColor = activeTheme.border || "rgba(0,0,0,0.12)";
  const cardColor = activeTheme.card || backgroundColor;
  const bodyFont = activeTheme["font-serif"] || activeTheme["font-sans"] || "system-ui, sans-serif";
  const headingFont = activeTheme["font-sans"] || "system-ui, sans-serif";
  const socials = (source.social_links || []).filter((link) => link.url?.trim()) as MenuSocialLink[];
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

  const gallery = (source.gallery_images || []).filter(Boolean) as string[];

  return (
    <div style={{ backgroundColor, color: foregroundColor, fontFamily: bodyFont }} className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border p-5 md:p-8" style={{ borderColor, backgroundColor: cardColor }}>
          <div className="absolute right-5 top-5 flex items-center gap-2">
            <ThemeSwitchToggle isDarkMode={themeMode === "dark"} onSetThemeMode={onSetThemeMode} />
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm"
              style={{ borderColor, color: foregroundColor }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div className="overflow-hidden rounded-[1.5rem]">
              {source.cover_image_url ? (
                <img src={source.cover_image_url} alt={source.name || "Menu cover"} className="h-64 w-full object-cover md:h-[420px]" />
              ) : (
                <div
                  className="h-64 w-full md:h-[420px]"
                  style={{ background: `linear-gradient(135deg, ${activeTheme.primary || foregroundColor}22, transparent 70%)` }}
                />
              )}
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-3xl border" style={{ borderColor }}>
                  {source.logo_url ? (
                    <img src={source.logo_url} alt={source.name || "Menu logo"} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl" style={{ fontFamily: headingFont }}>M</div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em]" style={{ color: mutedColor }}>
                    {source.city?.trim() || "Menu"}
                  </p>
                  <h1 className="mt-1 text-4xl font-semibold md:text-5xl" style={{ fontFamily: headingFont }}>
                    {source.name || "Studio Supper"}
                  </h1>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-relaxed md:text-base" style={{ color: mutedColor }}>
                {source.description || "Visual-first menu for cafes, bakeries, and modern comfort food spots."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {formatMenuLocation(source) ? (
                  <div className="rounded-2xl border p-4" style={{ borderColor }}>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]" style={{ color: mutedColor }}>
                      <MapPin className="h-4 w-4" /> Location
                    </div>
                    <p className="mt-2 text-sm">{formatMenuLocation(source)}</p>
                  </div>
                ) : null}
                {source.business_hours?.find((entry) => !entry.closed) ? (
                  <div className="rounded-2xl border p-4" style={{ borderColor }}>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]" style={{ color: mutedColor }}>
                      <Phone className="h-4 w-4" /> Hours
                    </div>
                    <p className="mt-2 text-sm">{formatHoursLabel(source.business_hours.find((entry) => !entry.closed)!)}</p>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {source.phone ? (
                  <a href={`tel:${source.phone}`} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor }}>
                    <Phone className="h-4 w-4" /> Call
                  </a>
                ) : null}
                {source.email ? (
                  <a href={`mailto:${source.email}`} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor }}>
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
                {source.google_maps_url ? (
                  <a href={source.google_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor }}>
                    <MapPin className="h-4 w-4" /> Map
                  </a>
                ) : null}
              </div>

              {socials.length ? (
                <div className="flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <a
                      key={`${social.platform}-${social.url}`}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
                      style={{ borderColor }}
                    >
                      {socialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8">
          {[...(source.categories || [])]
            .filter((category) => category.is_visible !== false)
            .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0))
            .map((category) => {
              const items = [...(source.items || [])]
                .filter((item) => item.menu_category_id === category.id && item.is_available !== false)
                .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
              if (!items.length) return null;

              return (
                <section key={category.id} className="rounded-[2rem] border p-6 md:p-8" style={{ borderColor }}>
                  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h2 className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: headingFont }}>
                        {category.name}
                      </h2>
                      {category.description ? <p className="mt-2 text-sm" style={{ color: mutedColor }}>{category.description}</p> : null}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => {
                      const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
                      const defaultVariant = variants.find((variant) => variant.is_default) ?? variants[0];
                      return (
                        <div key={item.id} className="rounded-[1.25rem] border p-4" style={{ borderColor, backgroundColor: cardColor }}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-semibold leading-tight" style={{ fontFamily: headingFont }}>
                                {item.name}
                              </h3>
                              {item.badge ? <p className="mt-1 text-xs uppercase tracking-[0.18em]" style={{ color: mutedColor }}>{item.badge}</p> : null}
                            </div>
                            <span className="rounded-full border px-3 py-1 text-sm font-semibold" style={{ borderColor }}>
                              ₱{defaultVariant?.price || item.price}
                            </span>
                          </div>
                          {item.description ? <p className="mt-3 text-sm leading-relaxed" style={{ color: mutedColor }}>{item.description}</p> : null}
                          {variants.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {variants.map((variant) => (
                                <span key={`${item.id}-${variant.name}`} className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.12em]" style={{ backgroundColor: `${foregroundColor}10` }}>
                                  {variant.name} â‚±{variant.price}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </section>

        {gallery.length ? (
          <section className="mt-10 border-t pt-8" style={{ borderColor }}>
            <h2 className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: headingFont }}>
              Gallery
            </h2>
            <div className="mt-5 columns-1 gap-4 sm:columns-2 md:columns-3">
              {gallery.map((image, index) => (
                <div key={`${image}-${index}`} className="mb-4 break-inside-avoid overflow-hidden rounded-[1.25rem] border" style={{ borderColor }}>
                  <img src={image} alt={`${source.name || "Menu"} gallery ${index + 1}`} className="h-auto w-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 border-t pt-8" style={{ borderColor }}>
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
            <div className="mx-auto">
              <img
                src={qrImageUrl}
                alt={`QR code for ${source.name || "menu"}`}
                className="h-[190px] w-[190px] object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: headingFont }}>
                Share This Menu
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: mutedColor }}>
                Give guests a fast way to revisit the menu. Scan the code, open the page, and share it anywhere in seconds.
              </p>
              <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor }}>
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
            Share-ready pages powered by Kislap
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a href={KISLAP_LINKS.github} target="_blank" rel="noreferrer"><Github className="h-4 w-4" /></a>
            <a href={KISLAP_LINKS.website} target="_blank" rel="noreferrer"><Globe className="h-4 w-4" /></a>
            <a href={KISLAP_LINKS.facebook} target="_blank" rel="noreferrer"><FaFacebookF className="h-4 w-4" /></a>
          </div>
          <p className="mt-4 text-xs" style={{ color: mutedColor }}>{currentUrl}</p>
        </footer>
      </div>
    </div>
  );
}
