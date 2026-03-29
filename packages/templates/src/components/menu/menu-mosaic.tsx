"use client";

import React from "react";
import { Globe, Mail, MapPin, Phone, Share2, Github } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { Mode } from "@/contexts/settings-context";
import { ThemeStyles } from "@/types/theme";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { KISLAP_LINKS } from "../shared/kislap-links";
import { formatHoursLabel, formatMenuLocation, MenuData, MenuItem, MenuSocialLink } from "./menu-types";

interface Props {
  menu?: MenuData;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const FALLBACK_MENU: MenuData = {
  name: "Mosaic Cafe",
  description: "A bright, social menu with snapshots of the room, the bar, and the dishes everyone points at first.",
  address: "8 Brixton Street",
  city: "Pasig",
  phone: "+63 917 555 2299",
  email: "hello@mosaiccafe.co",
  website_url: "https://kislap.app/",
  business_hours: [{ day: "monday", open: "10:00", close: "21:00", closed: false }],
  social_links: [
    { platform: "instagram", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "tiktok", url: "#" },
  ],
  categories: [
    { id: 1, name: "Coffee Bar", description: "Comforting signatures, clean espresso, and zero-proof sparkles.", is_visible: true, placement_order: 1 },
    { id: 2, name: "Kitchen Pass", description: "Big plates and buttery sides built for sharing.", is_visible: true, placement_order: 2 },
    { id: 3, name: "Sweet Corner", description: "Desserts you order for the table and quietly finish yourself.", is_visible: true, placement_order: 3 },
  ],
  items: [
    { id: 1, menu_category_id: 1, name: "Vanilla Sea Salt Latte", description: "Espresso, cream foam, and sea salt caramel.", price: "190", is_available: true, placement_order: 1 },
    { id: 2, menu_category_id: 1, name: "Citrus Tonic Americano", description: "Espresso, tonic, pomelo peel.", price: "175", is_available: true, placement_order: 2 },
    { id: 3, menu_category_id: 2, name: "Roast Pork Rice Bowl", description: "Herb rice, pickled cucumber, and soy glaze.", price: "330", is_available: true, placement_order: 3 },
    { id: 4, menu_category_id: 2, name: "Creamy Truffle Pasta", description: "Mushrooms, cream, and parmesan.", price: "365", is_available: true, placement_order: 4 },
    { id: 5, menu_category_id: 3, name: "Burnt Basque Slice", description: "Soft center cheesecake with citrus zest.", price: "165", is_available: true, placement_order: 5 },
    { id: 6, menu_category_id: 3, name: "Cookie Box", description: "Three rotating house cookies.", price: "210", is_available: true, placement_order: 6 },
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
  if (/^[â‚±$Â£â‚¬]/.test(trimmed)) return trimmed;
  return `â‚±${trimmed}`;
}

function resolvePrice(item: MenuItem) {
  const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  const active = variants.find((variant) => variant.is_default) || variants[0];
  return active?.price?.trim() || item.price;
}

function SectionItem({ item, headingFont, mutedColor, accentColor, borderColor }: { item: MenuItem; headingFont: string; mutedColor: string; accentColor: string; borderColor: string; }) {
  const variants = [...(item.variants || [])].sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
  return (
    <article className="border-b pb-5 last:border-b-0 last:pb-0" style={{ borderColor }}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="max-w-xl text-2xl font-semibold leading-tight md:text-3xl" style={{ fontFamily: headingFont }}>{item.name}</h3>
        <span
          className="shrink-0 text-sm uppercase tracking-[0.18em]"
          style={{ color: accentColor, fontFamily: headingFont }}
        >
          ₱{resolvePrice(item)}
        </span>
      </div>
      {item.description ? <p className="mt-2 text-sm leading-7 md:text-base" style={{ color: mutedColor }}>{item.description}</p> : null}
      {variants.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {variants.map((variant) => (
            <span key={`${item.id}-${variant.name}-${variant.price}`} className="text-xs uppercase tracking-[0.14em]" style={{ color: mutedColor }}>
              {variant.name} {formatVariantPrice(variant.price)}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function MenuMosaic({ menu, themeMode, themeStyles, onSetThemeMode }: Props) {
  const [currentUrl, setCurrentUrl] = React.useState(menu?.website_url?.trim() || KISLAP_LINKS.website);
  const [shareLabel, setShareLabel] = React.useState("Share");
  const source = menu && ((menu.categories?.length ?? 0) > 0 || (menu.items?.length ?? 0) > 0) ? menu : FALLBACK_MENU;
  const activeTheme = getActiveTheme(themeMode, themeStyles);
  const backgroundColor = activeTheme.background || "#fcfaf6";
  const foregroundColor = activeTheme.foreground || "#111111";
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
    if (typeof window !== "undefined") setCurrentUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
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

  const heroImages = [source.cover_image_url, ...(gallery || [])].filter(Boolean) as string[];

  return (
    <div style={{ backgroundColor, color: foregroundColor, fontFamily: bodyFont }} className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[2rem] border p-5 md:p-6" style={{ borderColor }}>
          <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
            <ThemeSwitchToggle isDarkMode={themeMode === "dark"} onSetThemeMode={onSetThemeMode} />
            <button type="button" onClick={handleShare} className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-opacity hover:opacity-80" style={{ borderColor, backgroundColor }}>
              <Share2 className="h-4 w-4" /> {shareLabel}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[1.8rem] sm:col-span-2">
                {heroImages[0] ? (
                  <img src={heroImages[0]} alt={source.name || "Cover image"} className="h-64 w-full object-cover md:h-[360px]" />
                ) : (
                  <div className="h-64 w-full md:h-[360px]" style={{ background: `linear-gradient(135deg, ${accentColor}22, transparent 70%)` }} />
                )}
              </div>
              {heroImages.slice(1, 3).map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`${source.name || "Menu"} visual ${index + 2}`} className="h-40 w-full rounded-[1.5rem] object-cover md:h-48" />
              ))}
            </div>

            <div className="flex flex-col justify-between gap-6 md:pl-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-[1.6rem] border" style={{ borderColor }}>
                  {source.logo_url ? (
                    <img src={source.logo_url} alt={source.name || "Menu logo"} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl" style={{ fontFamily: headingFont }}>M</div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: accentColor }}>{source.city?.trim() || "Cafe"}</p>
                  <h1 className="mt-2 text-4xl font-semibold leading-none md:text-5xl" style={{ fontFamily: headingFont }}>{source.name || "Mosaic Cafe"}</h1>
                </div>
              </div>

              <p className="text-sm leading-7 md:text-base" style={{ color: mutedColor }}>{source.description || FALLBACK_MENU.description}</p>

              <div className="space-y-2 text-sm md:text-base">
                {formatMenuLocation(source) ? <p>{formatMenuLocation(source)}</p> : null}
                {hours ? <p>{formatHoursLabel(hours)}</p> : null}
                {source.phone ? <p>{source.phone}</p> : null}
                {source.email ? <p>{source.email}</p> : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a key={`${social.platform}-${social.url}`} href={social.url || "#"} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-80" style={{ borderColor }}>
                    {socialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="mt-12 space-y-16">
          {categories.map((category, index) => {
            const categoryItems = items.filter((item) => item.menu_category_id === category.id);
            if (!categoryItems.length) return null;
            const reverse = index % 2 === 1;
            return (
              <section key={category.id} className={`grid gap-8 ${reverse ? "md:grid-cols-[1fr_0.42fr]" : "md:grid-cols-[0.42fr_1fr]"} md:items-start`}>
                <div className={reverse ? "md:order-2" : ""}>
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: accentColor }}>Collection {String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 text-3xl font-semibold md:text-5xl" style={{ fontFamily: headingFont }}>{category.name}</h2>
                  {category.description ? <p className="mt-3 max-w-sm text-sm leading-7 md:text-base" style={{ color: mutedColor }}>{category.description}</p> : null}
                  {(category.image_url || heroImages[index + 1]) ? (
                    <img src={category.image_url || heroImages[index + 1]} alt={category.name} className="mt-5 h-52 w-full rounded-[1.8rem] object-cover md:h-72" />
                  ) : null}
                </div>
                <div className={`space-y-6 border-t pt-5 ${reverse ? "md:order-1" : ""}`} style={{ borderColor }}>
                  {categoryItems.map((item) => (
                    <SectionItem key={item.id} item={item} headingFont={headingFont} mutedColor={mutedColor} accentColor={accentColor} borderColor={borderColor} />
                  ))}
                </div>
              </section>
            );
          })}

          {gallery.length ? (
            <section className="border-t pt-8" style={{ borderColor }}>
              <h2 className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: headingFont }}>Gallery</h2>
              <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
                {gallery.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${source.name || "Menu"} gallery ${index + 1}`} className="mb-4 w-full break-inside-avoid rounded-[1.75rem] object-cover" />
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-5 border-t pt-8 md:grid-cols-[220px_1fr] md:items-center" style={{ borderColor }}>
            <img src={qrImageUrl} alt={`QR code for ${source.name || "menu"}`} className="h-[190px] w-[190px] object-cover" />
            <div>
              <h2 className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: headingFont }}>Share This Menu</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 md:text-base" style={{ color: mutedColor }}>
                Let people save the menu, send it around the table, or open it again the next time they come back.
              </p>
              <div className="mt-4 inline-flex max-w-full items-center gap-2 text-sm" style={{ color: mutedColor }}>
                <Globe className="h-4 w-4 shrink-0" />
                <span className="truncate">{currentUrl}</span>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-14 border-t pt-10 pb-10 text-center" style={{ borderColor }}>
          <p className="text-sm" style={{ color: mutedColor }}>Â© {new Date().getFullYear()} {source.name || "Mosaic Cafe"}. All rights reserved.</p>
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
