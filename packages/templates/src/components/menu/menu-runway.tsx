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
  name: "Runway Kitchen",
  description: "An all-day room for signature plates, clean coffee, and dramatic desserts.",
  address: "18 Mayapis Street",
  city: "Makati",
  phone: "+63 917 300 5544",
  email: "hello@runwaykitchen.co",
  website_url: "https://kislap.app/",
  business_hours: [{ day: "monday", open: "08:00", close: "22:00", closed: false }],
  social_links: [
    { platform: "instagram", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "tiktok", url: "#" },
  ],
  categories: [
    { id: 1, name: "Morning Bar", description: "Espresso, matcha, and bakery pairings.", is_visible: true, placement_order: 1 },
    { id: 2, name: "House Plates", description: "Comfort dishes built for long lunches.", is_visible: true, placement_order: 2 },
    { id: 3, name: "After Hours", description: "Dessert pours and small indulgences.", is_visible: true, placement_order: 3 },
  ],
  items: [
    { id: 1, menu_category_id: 1, name: "Cloud Latte", description: "Espresso, foam cloud, and toasted sugar.", price: "180", is_available: true, placement_order: 1 },
    { id: 2, menu_category_id: 1, name: "Matcha Citrus", description: "Ceremonial matcha, yuzu, and tonic.", price: "195", is_available: true, placement_order: 2 },
    { id: 3, menu_category_id: 2, name: "Roasted Chicken Pasta", description: "Garlic cream, parsley, and black pepper.", price: "390", is_available: true, placement_order: 3 },
    { id: 4, menu_category_id: 2, name: "Brisket Rice Bowl", description: "Slow beef, egg jam, pickles, and herbs.", price: "420", is_available: true, placement_order: 4 },
    { id: 5, menu_category_id: 3, name: "Cream Top Cocoa", description: "Dark chocolate, cream cap, sea salt.", price: "170", is_available: true, placement_order: 5 },
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

function resolvePrice(item: MenuItem) {
  const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  const active = variants.find((variant) => variant.is_default) || variants[0];
  return active?.price?.trim() || item.price;
}

function ItemRow({ item, headingFont, mutedColor, accentColor, borderColor }: { item: MenuItem; headingFont: string; mutedColor: string; accentColor: string; borderColor: string; }) {
  const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  return (
    <article className="border-t pt-5 first:border-t-0 first:pt-0" style={{ borderColor }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold leading-tight @md:text-[2rem]" style={{ fontFamily: headingFont }}>
            {item.name}
          </h3>
          {item.badge ? <p className="mt-1 text-[11px] uppercase tracking-[0.2em]" style={{ color: accentColor }}>{item.badge}</p> : null}
        </div>
        <span className="shrink-0 text-sm uppercase tracking-[0.18em]" style={{ color: accentColor, fontFamily: headingFont }}> ₱{resolvePrice(item)}
        </span>
      </div>
      {item.description ? <p className="mt-2 max-w-xl text-sm leading-7 @md:text-base" style={{ color: mutedColor }}>{item.description}</p> : null}
      {variants.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {variants.map((variant) => (
            <span key={`${item.id}-${variant.name}-${variant.price}`} className="max-w-full break-words text-xs uppercase tracking-[0.14em] [overflow-wrap:anywhere]" style={{ color: mutedColor }}>
              {variant.name} {formatVariantPrice(variant.price)}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function MenuRunway({ menu, themeMode, themeStyles, onSetThemeMode }: Props) {
  const [currentUrl, setCurrentUrl] = React.useState(normalizeMenuShareUrl(menu?.website_url) || KISLAP_LINKS.website);
  const [shareLabel, setShareLabel] = React.useState("Share");
  const source = menu && ((menu.categories?.length ?? 0) > 0 || (menu.items?.length ?? 0) > 0) ? menu : FALLBACK_MENU;
  const activeTheme = getActiveTheme(themeMode, themeStyles);
  const backgroundColor = activeTheme.background || "#f8f8f8";
  const foregroundColor = activeTheme.foreground || "#101010";
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
      <div className="mx-auto max-w-7xl @md:grid @md:grid-cols-[0.38fr_1fr] @md:gap-10">
        <aside className="@md:sticky @md:top-6 @md:h-[calc(100vh-3rem)] @md:overflow-auto @md:pr-2">
          <div className="space-y-6 border-b pb-8 @md:border-b-0 @md:pb-0" style={{ borderColor }}>
            <div className="flex items-center justify-between">
              <ThemeSwitchToggle isDarkMode={themeMode === "dark"} onSetThemeMode={onSetThemeMode} />
              <button type="button" onClick={handleShare} className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-opacity hover:opacity-80" style={{ borderColor }}>
                <Share2 className="h-4 w-4" /> {shareLabel}
              </button>
            </div>
            <div className="overflow-hidden rounded-[2.2rem]">
              {source.cover_image_url ? (
                <img src={source.cover_image_url} alt={source.name || "Cover image"} className="h-72 w-full object-cover @md:h-[340px]" />
              ) : (
                <div className="h-72 w-full @md:h-[340px]" style={{ background: `linear-gradient(145deg, ${accentColor}20, transparent 72%)` }} />
              )}
            </div>
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[1.75rem] border" style={{ borderColor }}>
                {source.logo_url ? (
                  <img src={source.logo_url} alt={source.name || "Menu logo"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl" style={{ fontFamily: headingFont }}>M</div>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em]" style={{ color: accentColor }}>{source.city?.trim() || "Kitchen"}</p>
                <h1 className="mt-2 text-4xl font-semibold leading-none" style={{ fontFamily: headingFont }}>{source.name || "Runway Kitchen"}</h1>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 @md:text-base" style={{ color: mutedColor }}>{source.description || FALLBACK_MENU.description}</p>
            <div className="space-y-3 text-sm @md:text-base">
              {formatMenuLocation(source) ? <p><span style={{ color: mutedColor }}>Address</span><br />{formatMenuLocation(source)}</p> : null}
              {hours ? <p><span style={{ color: mutedColor }}>Store Hours</span><br />{formatHoursLabel(hours)}</p> : null}
              {source.phone ? <p><span style={{ color: mutedColor }}>Phone</span><br />{source.phone}</p> : null}
              {source.email ? <p><span style={{ color: mutedColor }}>Email</span><br />{source.email}</p> : null}
            </div>
            {socials.length ? (
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a key={`${social.platform}-${social.url}`} href={social.url || "#"} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-80" style={{ borderColor }}>
                    {socialIcon(social.platform)}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </aside>

        <main className="mt-10 space-y-16 @md:mt-0">
          {categories.map((category, index) => {
            const categoryItems = items.filter((item) => item.menu_category_id === category.id);
            if (!categoryItems.length) return null;
            return (
              <section key={category.id} className="grid gap-6 @md:grid-cols-[0.28fr_1fr] @md:gap-10">
                <div className="border-t pt-4" style={{ borderColor }}>
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: accentColor }}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold uppercase leading-none @md:text-5xl" style={{ fontFamily: headingFont }}>
                    {category.name}
                  </h2>
                  {category.description ? <p className="mt-3 max-w-xs text-sm leading-7" style={{ color: mutedColor }}>{category.description}</p> : null}
                  {category.image_url ? <img src={category.image_url} alt={category.name} className="mt-5 h-40 w-full rounded-[1.5rem] object-cover" /> : null}
                </div>
                <div className="space-y-7 border-t pt-4" style={{ borderColor }}>
                  {categoryItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      headingFont={headingFont}
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
              <h2 className="text-3xl font-semibold @md:text-4xl" style={{ fontFamily: headingFont }}>Gallery</h2>
              <div className="mt-6 columns-1 gap-4 @sm:columns-2">
                {gallery.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${source.name || "Menu"} gallery ${index + 1}`} className="mb-4 w-full break-inside-avoid rounded-[1.75rem] object-cover" />
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-5 border-t pt-8 @md:grid-cols-[220px_1fr] @md:items-center" style={{ borderColor }}>
            <img src={qrImageUrl} alt={`QR code for ${source.name || "menu"}`} className="h-[190px] w-[190px] object-cover" />
            <div>
              <h2 className="text-3xl font-semibold @md:text-4xl" style={{ fontFamily: headingFont }}>Share This Menu</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 @md:text-base" style={{ color: mutedColor }}>
                Keep the latest menu one scan away for regulars, walk-ins, and customers sending the link around.
              </p>
              <div className="mt-4 flex w-full max-w-full items-start gap-2 text-sm" style={{ color: mutedColor }}>
                <Globe className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-all [overflow-wrap:anywhere]">{currentUrl}</span>
              </div>
            </div>
          </section>

          <footer className="border-t pt-10 pb-10" style={{ borderColor }}>
            <div className="flex flex-col gap-4 @md:flex-row @md:items-center @md:justify-between">
              <p className="text-sm" style={{ color: mutedColor }}>© {new Date().getFullYear()} {source.name || "Runway Kitchen"}. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href={KISLAP_LINKS.github} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80"><Github className="h-4 w-4" /></a>
                <a href={KISLAP_LINKS.website} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80"><Globe className="h-4 w-4" /></a>
                <a href={KISLAP_LINKS.facebook} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-80"><FaFacebookF className="h-4 w-4" /></a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}



