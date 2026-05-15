import {
  FileText,
  Globe,
  QrCode,
} from "lucide-react";

export type LandingBuildPaths = {
  portfolio: string;
  linktree: string;
  menu: string;
  default: string;
};

export const productStories = [
  {
    title: "Portfolio",
    eyebrow: "Proof for people hiring you",
    copy: "A structured profile, project proof, work history, SEO metadata, and a public URL without assembling a website stack.",
    accent: "bg-blue-500",
    imageSize: "1600 x 1200 builder screenshot",
    imageSrc: "/assets/home/portfolio-screen.png",
    icon: FileText,
  },
  {
    title: "Link Page",
    eyebrow: "One branded route from every bio",
    copy: "A mobile-first home for links, launches, booking, newsletters, and social traffic that should not feel disposable.",
    accent: "bg-fuchsia-500",
    imageSize: "1200 x 1600 mobile page screenshot",
    imageSrc: "/assets/home/link-page-screen.png",
    icon: Globe,
  },
  {
    title: "Digital Menu",
    eyebrow: "QR-ready browsing for tables and counters",
    copy: "A public menu with categories, item detail, gallery support, and a format customers can actually browse on mobile.",
    accent: "bg-amber-400",
    imageSize: "1200 x 1600 menu mobile screenshot",
    imageSrc: "/assets/home/digital-menu-screen.png",
    icon: QrCode,
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
