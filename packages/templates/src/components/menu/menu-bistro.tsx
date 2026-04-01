"use client";

import React from "react";
import { Globe, Mail, MapPin, Phone, Share2, Github } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { Mode } from "@/contexts/settings-context";
import { ThemeStyles } from "@/types/theme";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { KISLAP_LINKS } from "../shared/kislap-links";
import { formatHoursLabel, formatMenuLocation, MenuData, MenuItem, MenuSocialLink, normalizeMenuShareUrl } from "./menu-types";

interface Props {
  menu?: MenuData;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const FALLBACK_MENU: MenuData = {
  name: "Late Table Bistro",
  description: "An evening-led menu with slow pours, comforting plates, and a little more candlelight than usual.",
  address: "42 Escolta Street",
  city: "Manila",
  phone: "+63 917 800 1122",
  email: "hello@latetable.co",
  website_url: "https://kislap.app/",
  business_hours: [{ day: "monday", open: "17:00", close: "23:00", closed: false }],
  social_links: [
    { platform: "instagram", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "tiktok", url: "#" },
  ],
  categories: [
    { id: 1, name: "Small Plates", description: "Start light, then linger.", is_visible: true, placement_order: 1 },
    { id: 2, name: "Mains", description: "The heart of the service.", is_visible: true, placement_order: 2 },
    { id: 3, name: "Night Drinks", description: "House pours and zero-proof signatures.", is_visible: true, placement_order: 3 },
  ],
  items: [
    { id: 1, menu_category_id: 1, name: "Brown Butter Carrots", description: "Labneh, pistachio, and herb oil.", price: "240", is_available: true, placement_order: 1 },
    { id: 2, menu_category_id: 1, name: "Charred Corn Toast", description: "Whipped ricotta, lime, and chili crunch.", price: "210", is_available: true, placement_order: 2 },
    { id: 3, menu_category_id: 2, name: "Half Roast Chicken", description: "Garlic jus, herbs, and roasted potatoes.", price: "540", is_available: true, placement_order: 3 },
    { id: 4, menu_category_id: 2, name: "Mushroom Cream Pasta", description: "Brown mushrooms, pepper, and parmesan.", price: "380", is_available: true, placement_order: 4 },
    { id: 5, menu_category_id: 3, name: "Citrus Highball", description: "Soda, citrus peel, and house syrup.", price: "190", is_available: true, placement_order: 5 },
    { id: 6, menu_category_id: 3, name: "Midnight Latte", description: "Dark espresso, cream top, and nutmeg.", price: "180", is_available: true, placement_order: 6 },
  ],
};

function getActiveTheme(themeMode: Mode, themeStyles: ThemeStyles) {
  return themeMode === "dark" ? { ...themeStyles.light, ...themeStyles.dark } : themeStyles.light;
}

function sanitizeQrColor(value?: string | null, fallback = "111111") {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return trimmed.replace("#", "");
}

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

function formatVariantPrice(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^[₱$£€]/.test(trimmed)) return trimmed;
  return `₱${trimmed}`;
}

function getItemPrice(item: MenuItem) {
  const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  const active = variants.find((variant) => variant.is_default) || variants[0];
  return active?.price?.trim() || item.price;
}

function ItemLine({
  item,
  headingFont,
  bodyFont,
  mutedColor,
  accentColor,
  borderColor,
}: {
  item: MenuItem;
  headingFont: string;
  bodyFont: string;
  mutedColor: string;
  accentColor: string;
  borderColor: string;
}) {
  const price = getItemPrice(item);
  const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));

  return (
    <article className="border-t pt-5 first:border-t-0 first:pt-0" style={{ borderColor }}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold uppercase tracking-[0.08em] @md:text-2xl" style={{ fontFamily: headingFont }}>
          {item.name}
        </h3>
        <span className="shrink-0 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: accentColor, fontFamily: headingFont }}>
          ₱{price}
        </span>
      </div>
      {item.description ? (
        <p className="mt-2 max-w-2xl text-sm leading-7 @md:text-[15px]" style={{ color: mutedColor, fontFamily: bodyFont }}>
          {item.description}
        </p>
      ) : null}
      {variants.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {variants.map((variant) => (
            <span
              key={`${item.id}-${variant.name}-${variant.price}`}
              className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] [overflow-wrap:anywhere]"
              style={{ borderColor, color: mutedColor, fontFamily: headingFont }}
            >
              <span>{variant.name}</span>
              <span>{formatVariantPrice(variant.price)}</span>
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function MenuBistro({ menu, themeMode, themeStyles, onSetThemeMode }: Props) {
  const [currentUrl, setCurrentUrl] = React.useState(normalizeMenuShareUrl(menu?.website_url) || KISLAP_LINKS.website);
  const [shareLabel, setShareLabel] = React.useState("Share");
  const source = menu && ((menu.categories?.length ?? 0) > 0 || (menu.items?.length ?? 0) > 0) ? menu : FALLBACK_MENU;
  const activeTheme = getActiveTheme(themeMode, themeStyles);
  const backgroundColor = activeTheme.background || "#f8f3eb";
  const foregroundColor = activeTheme.foreground || "#1f1a17";
  const mutedColor = activeTheme["muted-foreground"] || foregroundColor;
  const accentColor = activeTheme.primary || foregroundColor;
  const borderColor = activeTheme.border || "rgba(0,0,0,0.16)";
  const bodyFont = activeTheme["font-serif"] || activeTheme["font-sans"] || "system-ui, sans-serif";
  const headingFont = activeTheme["font-sans"] || "system-ui, sans-serif";
  const categories = [...(source.categories || [])]
    .filter((category) => category.is_visible !== false)
    .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  const items = [...(source.items || [])]
    .filter((item) => item.is_available !== false)
    .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  const socials = (source.social_links || []).filter((link) => link.url?.trim()) as MenuSocialLink[];
  const gallery = (source.gallery_images || []).filter(Boolean) as string[];
  const hours = source.hours_enabled === false ? null : source.business_hours?.find((entry) => !entry.closed);
  const qrForeground = sanitizeQrColor(source.qr_settings?.foreground_color, sanitizeQrColor(foregroundColor, "111111"));
  const qrBackground = sanitizeQrColor(source.qr_settings?.background_color, sanitizeQrColor(backgroundColor, "ffffff"));
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&color=${qrForeground}&bgcolor=${qrBackground}&data=${encodeURIComponent(currentUrl)}`;

  React.useEffect(() => {
    if (typeof window !== "undefined") setCurrentUrl(normalizeMenuShareUrl(window.location.href) || window.location.href);
  }, []);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = normalizeMenuShareUrl(window.location.href) || window.location.href;
    const title = source.name?.trim() || "Menu";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareLabel("Copied");
        window.setTimeout(() => setShareLabel("Share"), 1800);
      }
    } catch {}
  };

  return (
    <div style={{ backgroundColor, color: foregroundColor, fontFamily: bodyFont }} className="@container min-h-screen px-4 py-6 @md:px-8 @md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-10 border-b pb-10 @md:grid-cols-[1.2fr_0.8fr] @md:items-end" style={{ borderColor }}>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <ThemeSwitchToggle isDarkMode={themeMode === "dark"} onSetThemeMode={onSetThemeMode} />
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-opacity hover:opacity-80"
                style={{ borderColor, color: foregroundColor }}
              >
                <Share2 className="h-4 w-4" />
                {shareLabel}
              </button>
            </div>
            <div className="flex items-center gap-5">
              <div className="h-24 w-24 overflow-hidden rounded-full border @md:h-28 @md:w-28" style={{ borderColor }}>
                {source.logo_url ? (
                  <img src={source.logo_url} alt={source.name || "Menu logo"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl" style={{ fontFamily: headingFont }}>M</div>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em]" style={{ color: mutedColor }}>
                  {source.city?.trim() || "House Menu"}
                </p>
                <h1 className="mt-2 text-4xl font-semibold @md:text-6xl" style={{ fontFamily: headingFont }}>
                  {source.name || "Late Table Bistro"}
                </h1>
              </div>
            </div>
            <p className="max-w-2xl text-base leading-8 @md:text-lg" style={{ color: mutedColor }}>
              {source.description || FALLBACK_MENU.description}
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm @md:text-base">
              {formatMenuLocation(source) ? (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: mutedColor }}>Address</p>
                  <p>{formatMenuLocation(source)}</p>
                </div>
              ) : null}
              {hours ? (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: mutedColor }}>Store Hours</p>
                  <p>{formatHoursLabel(hours)}</p>
                </div>
              ) : null}
              {source.phone ? (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: mutedColor }}>Phone</p>
                  <p>{source.phone}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-5 @md:justify-self-end @md:text-right">
            <div className="overflow-hidden rounded-[2rem]">
              {source.cover_image_url ? (
                <img src={source.cover_image_url} alt={source.name || "Cover image"} className="h-56 w-full object-cover @md:w-[420px]" />
              ) : (
                <div className="h-56 w-full @md:w-[420px]" style={{ background: `linear-gradient(135deg, ${accentColor}22, transparent 72%)` }} />
              )}
            </div>
            {source.email ? <p className="text-sm" style={{ color: mutedColor }}>{source.email}</p> : null}
            {socials.length ? (
              <div className="flex flex-wrap gap-3 @md:justify-end">
                {socials.map((social) => (
                  <a key={`${social.platform}-${social.url}`} href={social.url || "#"} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-80" style={{ borderColor }}>
                    {socialIcon(social.platform)}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <main className="mt-12 space-y-16">
          {categories.map((category, index) => {
            const categoryItems = items.filter((item) => item.menu_category_id === category.id);
            if (!categoryItems.length) return null;
            return (
              <section key={category.id} className="grid gap-8 border-t pt-8 @md:grid-cols-[0.34fr_1fr]" style={{ borderColor }}>
                <div className="@md:sticky @md:top-8 @md:self-start">
                  <p className="text-xs uppercase tracking-[0.28em]" style={{ color: accentColor }}>
                    Section {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold uppercase @md:text-5xl" style={{ fontFamily: headingFont }}>
                    {category.name}
                  </h2>
                  {category.description ? (
                    <p className="mt-3 max-w-sm text-sm leading-7 @md:text-base" style={{ color: mutedColor }}>
                      {category.description}
                    </p>
                  ) : null}
                  {category.image_url ? (
                    <img src={category.image_url} alt={category.name} className="mt-5 h-44 w-full rounded-[1.5rem] object-cover @md:max-w-sm" />
                  ) : null}
                </div>
                <div className="space-y-7">
                  {categoryItems.map((item) => (
                    <ItemLine
                      key={item.id}
                      item={item}
                      headingFont={headingFont}
                      bodyFont={bodyFont}
                      mutedColor={mutedColor}
                      accentColor={accentColor}
                      borderColor={borderColor}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {gallery.length ? (
            <section className="border-t pt-8" style={{ borderColor }}>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: accentColor }}>Moments</p>
                  <h2 className="mt-2 text-3xl font-semibold @md:text-4xl" style={{ fontFamily: headingFont }}>Gallery</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-4 @sm:grid-cols-2 @lg:grid-cols-4">
                {gallery.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${source.name || "Menu"} gallery ${index + 1}`}
                    className={
                      index % 3 === 0
                        ? "h-80 w-full rounded-[1.75rem] object-cover"
                        : index % 3 === 1
                          ? "h-64 w-full rounded-[1.75rem] object-cover"
                          : "h-72 w-full rounded-[1.75rem] object-cover"
                    }
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-6 border-t pt-8 @md:grid-cols-[220px_1fr] @md:items-center" style={{ borderColor }}>
            <div className="mx-auto @md:mx-0">
              <img src={qrImageUrl} alt={`QR code for ${source.name || "menu"}`} className="h-[190px] w-[190px] object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold @md:text-4xl" style={{ fontFamily: headingFont }}>Share This Menu</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 @md:text-base" style={{ color: mutedColor }}>
                Scan the code to open the latest menu on any phone, or send the link to customers before they even arrive.
              </p>
              <div className="mt-4 flex w-full max-w-full items-start gap-2 rounded-2xl border px-4 py-2 text-sm" style={{ borderColor }}>
                <Globe className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-all [overflow-wrap:anywhere]">{currentUrl}</span>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-14 border-t pt-10 pb-10 text-center" style={{ borderColor }}>
          <p className="text-sm" style={{ color: mutedColor }}>© {new Date().getFullYear()} {source.name || "Late Table Bistro"}. All rights reserved.</p>
          <div className="mt-5 inline-flex items-center gap-4">
            <a href={KISLAP_LINKS.github} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80"><Github className="h-4 w-4" /></a>
            <a href={KISLAP_LINKS.website} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80"><Globe className="h-4 w-4" /></a>
            <a href={KISLAP_LINKS.facebook} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80"><FaFacebookF className="h-4 w-4" /></a>
          </div>
        </footer>
      </div>
    </div>
  );
}



