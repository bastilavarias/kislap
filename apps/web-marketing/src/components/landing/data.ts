import {
  FileText,
  Globe,
  LayoutTemplate,
  LineChart,
  QrCode,
  Wand2,
} from "lucide-react";

import {
  getBuilderProjectCreateUrl,
  getFeaturePagePath,
  SITE_HOST_LABEL,
} from "@/lib/site-config";

export const buildPaths = {
  portfolio: getBuilderProjectCreateUrl({ type: "portfolio" }),
  linktree: getBuilderProjectCreateUrl({ type: "linktree" }),
  menu: getBuilderProjectCreateUrl({ type: "menu" }),
  default: getBuilderProjectCreateUrl(),
};

export const productStories = [
  {
    title: "Portfolio",
    eyebrow: "Proof for people hiring you",
    copy: "A structured profile, project proof, work history, SEO metadata, and a public URL without assembling a website stack.",
    accent: "bg-blue-500",
    href: getFeaturePagePath("portfolio-builder"),
    imageSize: "1600 x 1200 builder screenshot",
    icon: FileText,
  },
  {
    title: "Link Page",
    eyebrow: "One branded route from every bio",
    copy: "A mobile-first home for links, launches, booking, newsletters, and social traffic that should not feel disposable.",
    accent: "bg-fuchsia-500",
    href: getFeaturePagePath("linktree-builder"),
    imageSize: "1200 x 1600 mobile page screenshot",
    icon: Globe,
  },
  {
    title: "Digital Menu",
    eyebrow: "QR-ready browsing for tables and counters",
    copy: "A public menu with categories, item detail, gallery support, and a format customers can actually browse on mobile.",
    accent: "bg-amber-400",
    href: getFeaturePagePath("menu-builder"),
    imageSize: "1200 x 1600 menu mobile screenshot",
    icon: QrCode,
  },
];

export const bentoCards = [
  {
    title: "Builder workspace",
    copy: "Replace with the project creation or editor screen.",
    size: "2400 x 1400",
    className: "lg:col-span-3 lg:row-span-2",
    tone: "bg-zinc-200",
    icon: LayoutTemplate,
  },
  {
    title: "Published output",
    copy: `Use a real ${SITE_HOST_LABEL} page capture.`,
    size: "1800 x 1200",
    className: "lg:col-span-3",
    tone: "bg-red-500 text-white",
    icon: Globe,
  },
  {
    title: "Analytics",
    copy: "Show views, clicks, and active project signals.",
    size: "1400 x 900",
    className: "lg:col-span-2",
    tone: "bg-white",
    icon: LineChart,
  },
  {
    title: "QR",
    copy: "Use menu QR or display poster output.",
    size: "900 x 900",
    className: "lg:col-span-1",
    tone: "bg-amber-300",
    icon: QrCode,
  },
  {
    title: "Template family",
    copy: "Show portfolio, link page, and menu side by side.",
    size: "1800 x 900",
    className: "lg:col-span-3",
    tone: "bg-black text-white",
    icon: Wand2,
  },
];

export const faqs = [
  {
    q: "Is Kislap free to use?",
    a: "Yes. You can build, publish, and host your page on a Kislap public URL for free.",
  },
  {
    q: "Why forms instead of drag and drop?",
    a: "Forms keep the structure clean. Kislap turns your content into a designed page without making you arrange every pixel.",
  },
  {
    q: "Can I start with a specific page type?",
    a: "Yes. Start directly with a portfolio, link page, or digital menu so the builder opens with the right structure.",
  },
];
