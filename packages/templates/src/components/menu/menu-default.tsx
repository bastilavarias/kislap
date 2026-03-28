"use client";

import React from "react";
import { Mode } from "@/contexts/settings-context";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import { Github, Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { ThemeStyles } from "@/types/theme";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import { KISLAP_LINKS } from "../shared/kislap-links";
import {
  formatHoursLabel,
  formatMenuLocation,
  formatPlatformLabel,
  MenuCategory,
  MenuData,
  MenuItem as MenuItemData,
  MenuSocialLink,
} from "./menu-types";

interface Props {
  menu?: MenuData;
  themeMode: Mode;
  themeStyles: ThemeStyles;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

type MenuItem = {
  name: string;
  price: string;
  description: string;
  badge?: string;
  image_url?: string | null;
  variants?: MenuItemData["variants"];
};

const ICED_LEFT: MenuItem[] = [
  {
    name: "SALT AND SUGAR SHAKEN LATTE",
    price: "130",
    description: "Sea salt foam + brown sugar shaken espresso = SSSL",
  },
  {
    name: "SPANISH LATTE",
    price: "110",
    description: "Espresso, milk and many many sweetened condensed milk",
    badge: "ICED / HOT",
  },
  {
    name: "YIN YANG MOCHA",
    price: "140",
    description:
      "Yin: chocolate cream with a touch of white pepper\nYang: white mocha infused with black pepper",
  },
  {
    name: "SUNLIME LATTE CREAM",
    price: "150",
    description: "A creamy citrusy twist in a latte",
  },
  {
    name: "MISO CARAMEL MACCHIATO",
    price: "120",
    description: "Just umami macchiato",
  },
  {
    name: "LONG FOAM BLACK",
    price: "100",
    description: "Ice, water, espresso but that's not it",
    badge: "ICED / HOT",
  },
];

const ICED_RIGHT: MenuItem[] = [
  {
    name: "TIRAMISU LATTE",
    price: "130",
    description: "Latte with cheese foam, cocoa dust and a ladyfinger on top",
  },
  {
    name: "GINATAANG KALABASA LATTE",
    price: "150",
    description:
      "Our own take of pumpkin spiced latte with a filipino twist on it",
  },
  {
    name: "MOCHA AND CREAM",
    price: "120",
    description: "What happens if you put cookies and cream to coffee",
  },
  {
    name: "COOKIE BUTTER LATTE",
    price: "150",
    description: "Biscoff with milk and espresso",
  },
  {
    name: "AMERICANO",
    price: "90",
    description: "Espresso, ice, water that's it",
  },
];

const NON_LEFT: MenuItem[] = [
  {
    name: "MATCHA LATTE",
    price: "90",
    description: "Ice, milk and some weird green thing",
  },
  {
    name: "MISO CARAMEL MATCHA",
    price: "100",
    description:
      '"What\'s that weird taste? Is it the matcha?"\n"No, sir-no. It is the matcha."',
  },
  {
    name: "SEASALT SPANISH MATCHA",
    price: "120",
    description: "Someone's colonizing our matcha!!!!!",
    badge: "ICED / HOT",
  },
  {
    name: "HOT F*@#ING CHOCOLATE",
    price: "100",
    description: "With brown sugar cream",
  },
];

const NON_RIGHT: MenuItem[] = [
  {
    name: "MILKY COOKIE AND CREAMSS",
    price: "110",
    description: "Milk with cookies and x2 cream",
  },
  {
    name: "PINKY MILKY BERRY CREAMY",
    price: "110",
    description: "Creamy strawberriessss",
  },
  {
    name: "COOKIE BUTTER MILKY CREAM",
    price: "110",
    description: "Biscoff flavored milk + Biscoff cream",
  },
];

const FALLBACK_MENU: MenuData = {
  name: "DON'T STIR CAFE",
  address: "1182 ALC Bldg. S.H Loyola St. Sampaloc Manila",
  city: "",
  country: "",
  business_hours: [{ day: "monday", open: "5PM", close: "3AM", closed: false }],
  social_links: [
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "tiktok", url: "#" },
  ],
  categories: [
    { id: 1, name: "Iced Coffee", is_visible: true, placement_order: 1 },
    { id: 2, name: "Non Coffee", is_visible: true, placement_order: 2 },
  ],
  items: [
    ...ICED_LEFT.map((item, index) => ({
      id: index + 1,
      menu_category_id: 1,
      name: item.name,
      description: item.description,
      badge: item.badge ?? null,
      price: item.price,
      is_available: true,
      placement_order: index + 1,
    })),
    ...ICED_RIGHT.map((item, index) => ({
      id: index + 100,
      menu_category_id: 1,
      name: item.name,
      description: item.description,
      badge: item.badge ?? null,
      price: item.price,
      is_available: true,
      placement_order: index + 100,
    })),
    ...NON_LEFT.map((item, index) => ({
      id: index + 200,
      menu_category_id: 2,
      name: item.name,
      description: item.description,
      badge: item.badge ?? null,
      price: item.price,
      is_available: true,
      placement_order: index + 200,
    })),
    ...NON_RIGHT.map((item, index) => ({
      id: index + 300,
      menu_category_id: 2,
      name: item.name,
      description: item.description,
      badge: item.badge ?? null,
      price: item.price,
      is_available: true,
      placement_order: index + 300,
    })),
  ],
};

function PriceBadge({ price }: { price: string }) {
  return <span className="menu-price-badge">{price}</span>;
}

function formatPesoPrice(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (/^[₱P$]/i.test(trimmed)) return trimmed;
  return `₱${trimmed}`;
}

function getSortedVariants(variants?: MenuItemData["variants"]) {
  return [...(variants ?? [])].sort(
    (a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0),
  );
}

function getDisplayPrice(price: string, variants?: MenuItemData["variants"]) {
  const sortedVariants = getSortedVariants(variants);
  const defaultVariant =
    sortedVariants.find((variant) => variant.is_default) ?? sortedVariants[0];

  return defaultVariant?.price?.trim() || price;
}

function MenuItemBlock({
  name,
  price,
  description,
  badge,
  image_url,
  variants,
}: MenuItem) {
  const sortedVariants = getSortedVariants(variants);
  const displayPrice = getDisplayPrice(price, sortedVariants);

  return (
    <div className="flex gap-4">
      {image_url ? (
        <div
          className="hidden h-20 w-20 flex-shrink-0 overflow-hidden rounded border md:block"
          style={{ borderColor: "var(--ds-border)" }}
        >
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <h3 className="menu-heading min-w-0 flex-1 text-2xl tracking-wide md:text-3xl">
                {name}
              </h3>
              <PriceBadge price={displayPrice} />
            </div>
          </div>
          {badge ? (
            <span className="menu-heading shrink-0 text-xl tracking-wider">
              {badge}
            </span>
          ) : null}
        </div>
        <p
          className="mt-1 whitespace-pre-line text-sm"
          style={{ color: "var(--ds-muted)" }}
        >
          {description}
        </p>
        {sortedVariants.length ? (
          <div
            className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
            style={{ color: "var(--ds-foreground)" }}
          >
            {sortedVariants.map((variant) => (
              <span
                key={`${name}-${variant.name}-${variant.placement_order ?? 0}`}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
                style={{ borderColor: "var(--ds-border)" }}
              >
                <span className="font-semibold uppercase tracking-[0.08em]">
                  {variant.name}
                </span>
                <span style={{ color: "var(--ds-muted)" }}>
                  {formatPesoPrice(variant.price)}
                </span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function splitItemsIntoColumns(items: MenuItemData[]) {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)] as const;
}

function getVisibleCategories(menu: MenuData) {
  return [...(menu.categories ?? [])]
    .filter((category) => category.is_visible !== false)
    .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
}

function getCategoryItems(menu: MenuData, category: MenuCategory) {
  return [...(menu.items ?? [])]
    .filter(
      (item) =>
        item.menu_category_id === category.id && item.is_available !== false,
    )
    .sort((a, b) => (a.placement_order ?? 0) - (b.placement_order ?? 0));
}

function formatPosterTitle(title: string) {
  return title.trim().toUpperCase();
}

function renderSectionTitle(title: string) {
  return formatPosterTitle(title);
}

function getHeaderHours(menu: MenuData) {
  const openEntry =
    menu.business_hours?.find((entry) => entry.closed !== true) ??
    FALLBACK_MENU.business_hours?.[0];

  return openEntry ? formatHoursLabel(openEntry) : "5PM - 3AM";
}

function getSocialMeta(platform: string) {
  switch (platform) {
    case "facebook":
      return { icon: <FaFacebookF className="h-5 w-5" />, label: "Facebook" };
    case "instagram":
      return { icon: <FaInstagram className="h-5 w-5" />, label: "Instagram" };
    case "tiktok":
      return { icon: <FaTiktok className="h-5 w-5" />, label: "TikTok" };
    case "whatsapp":
      return { icon: <FaWhatsapp className="h-5 w-5" />, label: "WhatsApp" };
    default:
      return {
        icon: <Globe className="h-4 w-4" />,
        label: formatPlatformLabel(platform),
      };
  }
}

function getHeaderLinks(menu: MenuData) {
  return [
    menu.website_url?.trim()
      ? {
          key: "website",
          href: menu.website_url.trim(),
          icon: <Globe className="h-4 w-4" />,
          label: "Website",
        }
      : null,
    menu.google_maps_url?.trim()
      ? {
          key: "map",
          href: menu.google_maps_url.trim(),
          icon: <MapPin className="h-4 w-4" />,
          label: "Map",
        }
      : null,
    menu.phone?.trim()
      ? {
          key: "phone",
          href: `tel:${menu.phone.trim()}`,
          icon: <Phone className="h-4 w-4" />,
          label: "Call",
        }
      : null,
    menu.email?.trim()
      ? {
          key: "email",
          href: `mailto:${menu.email.trim()}`,
          icon: <Mail className="h-4 w-4" />,
          label: "Email",
        }
      : null,
    menu.whatsapp?.trim()
      ? {
          key: "whatsapp",
          href: `https://wa.me/${menu.whatsapp.trim().replace(/[^\d]/g, "")}`,
          icon: <FaWhatsapp className="h-4 w-4" />,
          label: "WhatsApp",
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    href: string;
    icon: React.ReactNode;
    label: string;
  }[];
}

function getHeaderDetails(menu: MenuData) {
  return [
    menu.phone?.trim()
      ? {
          key: "phone",
          icon: <Phone className="h-4 w-4" />,
          value: menu.phone.trim(),
        }
      : null,
    menu.email?.trim()
      ? {
          key: "email",
          icon: <Mail className="h-4 w-4" />,
          value: menu.email.trim(),
        }
      : null,
  ].filter(Boolean) as { key: string; icon: React.ReactNode; value: string }[];
}

function getGalleryImages(menu: MenuData) {
  return (menu.gallery_images ?? [])
    .map((image) => image?.trim())
    .filter(Boolean) as string[];
}

function sanitizeQrColor(value?: string | null, fallback = "111111") {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return trimmed.replace("#", "");
}

function LogoMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-12 w-12"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

function MenuSection({
  title,
  description,
  imageUrl,
  leftItems,
  rightItems,
}: {
  title: React.ReactNode;
  description?: string | null;
  imageUrl?: string | null;
  leftItems: MenuItem[];
  rightItems: MenuItem[];
}) {
  return (
    <section className="mb-12">
      <h2 className="menu-heading mb-10 text-center text-4xl tracking-wide md:text-5xl">
        {title}
      </h2>
      {imageUrl || description ? (
        <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
          {imageUrl ? (
            <div
              className="h-28 w-28 flex-shrink-0 overflow-hidden rounded border"
              style={{ borderColor: "var(--ds-border)" }}
            >
              <img
                src={imageUrl}
                alt={`${typeof title === "string" ? title : "Category"} section`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          {description ? (
            <p
              className="max-w-2xl text-sm leading-relaxed"
              style={{ color: "var(--ds-muted)" }}
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
        <div className="space-y-8">
          {leftItems.map((item) => (
            <MenuItemBlock key={item.name} {...item} />
          ))}
        </div>
        <div className="space-y-8">
          {rightItems.map((item) => (
            <MenuItemBlock key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MenuDefault({
  menu,
  themeMode,
  themeStyles,
  onSetThemeMode,
}: Props) {
  const [shareLabel, setShareLabel] = React.useState("Share");
  const [currentUrl, setCurrentUrl] = React.useState(
    menu?.website_url?.trim() || KISLAP_LINKS.website,
  );
  const source =
    menu && (menu.categories?.length || menu.items?.length)
      ? menu
      : FALLBACK_MENU;
  const categories = getVisibleCategories(source);
  const location = formatMenuLocation(source).replace(/,\s*,/g, ",");
  const headerLocation =
    location || "1182 ALC Bldg. S.H Loyola St. Sampaloc Manila";
  const headerHours = getHeaderHours(source);
  const showHeaderHours = source.hours_enabled !== false;
  const socials = source.social_links?.filter((link) => link.url?.trim())
    ?.length
    ? (source.social_links?.filter((link) =>
        link.url?.trim(),
      ) as MenuSocialLink[])
    : (FALLBACK_MENU.social_links as MenuSocialLink[]);
  const activeTheme =
    themeMode === "dark"
      ? { ...themeStyles.light, ...themeStyles.dark }
      : themeStyles.light;
  const description = source.description?.trim() || "";
  const galleryImages = getGalleryImages(source);
  const coverImage = source.cover_image_url?.trim() || null;
  const qrForeground = sanitizeQrColor(
    source.qr_settings?.foreground_color,
    sanitizeQrColor(activeTheme.foreground, "111111"),
  );
  const qrBackground = sanitizeQrColor(
    source.qr_settings?.background_color,
    sanitizeQrColor(activeTheme.background, "ffffff"),
  );
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&color=${qrForeground}&bgcolor=${qrBackground}&data=${encodeURIComponent(
    currentUrl,
  )}`;
  const headerLinks = getHeaderLinks(source);
  const headerDetails = getHeaderDetails(source);
  const headerMeta = [
    showHeaderHours
      ? { key: "hours", label: "Store Hours", value: headerHours }
      : null,
  ].filter(Boolean) as { key: string; label: string; value: string }[];

  const handleShare = React.useCallback(async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = source.name?.trim() || "Menu";

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareLabel("Copied");
      window.setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      setShareLabel("Share");
    }
  }, [source.name]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <>
      <style jsx global>{`
        .menu-root {
          background-color: var(--ds-background);
          color: var(--ds-foreground);
          min-height: 100vh;
          font-family: var(--ds-font-body);
        }

        .menu-root * {
          box-sizing: border-box;
        }

        .menu-heading {
          font-family: var(--ds-font-display);
        }

        .menu-price-badge {
          background-color: var(--ds-badge-background);
          color: var(--ds-badge-foreground);
          border-radius: 9999px;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--ds-font-body);
          font-weight: 700;
          font-size: 0.875rem;
          margin-left: 0.75rem;
          flex-shrink: 0;
        }
      `}</style>

      <div
        className="menu-root px-4 py-10 antialiased md:px-8"
        style={
          {
            "--ds-background": activeTheme.background,
            "--ds-foreground": activeTheme.foreground,
            "--ds-muted": activeTheme["muted-foreground"],
            "--ds-border": activeTheme.border,
            "--ds-badge-background": activeTheme.card,
            "--ds-badge-foreground": activeTheme["card-foreground"],
            "--ds-font-body":
              activeTheme["font-serif"] ||
              activeTheme["font-sans"] ||
              "system-ui, sans-serif",
            "--ds-font-display":
              activeTheme["font-sans"] || "system-ui, sans-serif",
            "--ds-font-meta":
              activeTheme["font-mono"] ||
              activeTheme["font-sans"] ||
              "ui-monospace, monospace",
          } as React.CSSProperties
        }
      >
        <div className="mx-auto max-w-4xl">
          <header
            className="mb-8 pb-6"
            style={{ borderBottom: "1px solid var(--ds-border)" }}
          >
            <div
              className="relative overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--ds-border)" }}
            >
              <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                <ThemeSwitchToggle
                  isDarkMode={themeMode === "dark"}
                  onSetThemeMode={onSetThemeMode}
                />
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm transition-opacity hover:opacity-80"
                  style={{
                    borderColor: "var(--ds-border)",
                    backgroundColor:
                      "color-mix(in srgb, var(--ds-background) 72%, transparent)",
                    color: "var(--ds-foreground)",
                    backdropFilter: "blur(10px)",
                  }}
                  aria-label="Share menu"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{shareLabel}</span>
                </button>
              </div>
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={`${source.name || "Menu"} cover`}
                  className="h-44 w-full object-cover md:h-56"
                />
              ) : (
                <div
                  className="h-32 w-full md:h-40"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in srgb, var(--ds-foreground) 10%, transparent), transparent 60%)",
                  }}
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--ds-background) 88%, transparent), transparent 55%)",
                }}
              />
            </div>

            <div className="relative mx-auto -mt-12 flex max-w-3xl flex-col items-center px-4 text-center md:-mt-14">
              <div
                className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 shadow-sm md:h-28 md:w-28"
                style={{
                  borderColor: "var(--ds-foreground)",
                  backgroundColor: "var(--ds-background)",
                }}
              >
                {source.logo_url ? (
                  <img
                    src={source.logo_url}
                    alt={source.name || "Menu logo"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <LogoMark />
                )}
                <div
                  className="absolute h-1 w-full -rotate-45 transform"
                  style={{ backgroundColor: "var(--ds-foreground)" }}
                />
              </div>

              <div className="mt-4">
                <h1 className="menu-heading mb-2 text-5xl tracking-wider md:text-6xl">
                  {source.name?.trim() || "DON'T STIR CAFE"}
                </h1>
                <p
                  className="text-sm tracking-wide md:text-base"
                  style={{ color: "var(--ds-muted)" }}
                >
                  {headerLocation}
                </p>
                {description ? (
                  <p
                    className="mx-auto mt-3 max-w-xl text-sm leading-relaxed"
                    style={{ color: "var(--ds-muted)" }}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {headerMeta.length ? (
                <div className="mt-5 flex w-full max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
                  {headerMeta.map((entry) => (
                    <div key={entry.key} className="text-center">
                      <div
                        className="text-[11px] uppercase tracking-[0.18em]"
                        style={{ color: "var(--ds-muted)" }}
                      >
                        {entry.label}
                      </div>
                      <div className="mt-1 text-sm font-semibold md:text-base">
                        {entry.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {headerDetails.length ? (
                <div
                  className="mt-4 flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
                  style={{ color: "var(--ds-muted)" }}
                >
                  {headerDetails.map((detail) => (
                    <div key={detail.key} className="flex items-center gap-2">
                      {detail.icon}
                      <span>{detail.value}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {socials.length ? (
                <div
                  className="mt-4 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3"
                  style={{ color: "var(--ds-muted)" }}
                >
                  {socials.map((social) => {
                    const meta = getSocialMeta(social.platform);
                    return (
                      <a
                        key={`${social.platform}-${social.url}-header`}
                        href={social.url || "#"}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-opacity hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "var(--ds-foreground)",
                          borderColor: "var(--ds-border)",
                        }}
                        aria-label={meta.label}
                        title={meta.label}
                      >
                        {meta.icon}
                      </a>
                    );
                  })}
                </div>
              ) : null}

              {headerLinks.length ? (
                <div className="mt-5 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3 text-sm">
                  {headerLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-2 transition-opacity hover:opacity-80"
                      style={{ color: "var(--ds-foreground)" }}
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {link.icon}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.12em]">
                        {link.label}
                      </span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </header>

          {categories.map((category, index) => {
            const categoryItems = getCategoryItems(source, category);

            if (!categoryItems.length) return null;

            const [leftItems, rightItems] =
              splitItemsIntoColumns(categoryItems);

            return (
              <React.Fragment key={category.id}>
                {index > 0 ? (
                  <div
                    className="my-12 w-full"
                    style={{ borderTop: "1px solid var(--ds-border)" }}
                  />
                ) : null}
                <MenuSection
                  title={renderSectionTitle(category.name)}
                  description={category.description}
                  imageUrl={category.image_url}
                  leftItems={leftItems}
                  rightItems={rightItems}
                />
              </React.Fragment>
            );
          })}

          {galleryImages.length ? (
            <div
              className="mt-8"
              style={{
                borderTop: "1px solid var(--ds-border)",
                paddingTop: "1.5rem",
              }}
            >
              <div className="mb-5">
                <h2 className="menu-heading text-3xl tracking-wide md:text-4xl">
                  Gallery
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--ds-muted)" }}
                >
                  A closer look at the space, drinks, and atmosphere.
                </p>
              </div>
              <div className="columns-1 gap-4 sm:columns-2 md:columns-3">
                {galleryImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="mb-4 break-inside-avoid overflow-hidden rounded border"
                    style={{ borderColor: "var(--ds-border)" }}
                  >
                    <img
                      src={image}
                      alt={`${source.name || "Menu"} gallery ${index + 1}`}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <section
            className="mt-12 border-t px-2 pt-8"
            style={{ borderColor: "var(--ds-border)" }}
          >
            <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
              <div
                className="mx-auto overflow-hidden rounded-2xl border p-3"
                style={{ borderColor: "var(--ds-border)" }}
              >
                <img
                  src={qrImageUrl}
                  alt={`QR code for ${source.name || "menu"}`}
                  className="h-[190px] w-[190px] rounded-xl object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="menu-heading text-3xl tracking-wide md:text-4xl">
                  Share This Menu
                </h2>
                <p
                  className="mt-2 max-w-xl text-sm leading-relaxed"
                  style={{ color: "var(--ds-muted)" }}
                >
                  Scan the QR code to open this menu instantly on any phone, or
                  copy the link and share it with your customers.
                </p>
                <div
                  className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm"
                  style={{
                    borderColor: "var(--ds-border)",
                    color: "var(--ds-foreground)",
                  }}
                >
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{currentUrl}</span>
                </div>
              </div>
            </div>
          </section>

          <footer
            className="mt-12 border-t-4 pt-10 pb-10 text-center"
            style={{ borderColor: "var(--ds-border)" }}
          >
            <div className="flex flex-col items-center justify-center gap-6 px-4">
              <div className="space-y-1">
                <p
                  className="text-sm font-bold uppercase"
                  style={{ color: "var(--ds-foreground)" }}
                >
                  © {new Date().getFullYear()} {source.name?.trim() || "Menu"}.
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: "var(--ds-muted)",
                    fontFamily: "var(--ds-font-meta)",
                  }}
                >
                  All rights reserved. Made with{" "}
                  <span className="text-red-500">♥</span>
                </p>
              </div>

              <div
                className="h-1 w-12"
                style={{ backgroundColor: "var(--ds-foreground)" }}
              />

              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"
                    style={{ color: "var(--ds-foreground)" }}
                  >
                    <span className="text-amber-400">✨</span> Powered by Kislap
                  </span>
                  <p
                    className="text-[10px] uppercase tracking-widest"
                    style={{
                      color: "var(--ds-muted)",
                      fontFamily: "var(--ds-font-meta)",
                    }}
                  >
                    Transform your forms into beautiful websites
                  </p>
                </div>

                <div className="mt-1 flex items-center gap-4">
                  <a
                    href={KISLAP_LINKS.github}
                    target="_blank"
                    rel="noreferrer"
                    className="border-2 border-transparent p-1 transition-colors hover:border-current hover:opacity-80"
                    style={{ color: "var(--ds-foreground)" }}
                    title="Kislap Github"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={KISLAP_LINKS.website}
                    target="_blank"
                    rel="noreferrer"
                    className="border-2 border-transparent p-1 transition-colors hover:border-current hover:opacity-80"
                    style={{ color: "var(--ds-foreground)" }}
                    title="Kislap Website"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                  <a
                    href={KISLAP_LINKS.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="border-2 border-transparent p-1 transition-colors hover:border-current hover:opacity-80"
                    style={{ color: "var(--ds-foreground)" }}
                    title="Kislap Facebook"
                  >
                    <FaFacebookF className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
