export interface BuilderFeaturePageConfig {
  slug: "portfolio-builder" | "linktree-builder" | "menu-builder";
  image: string;
  templateImage: string;
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroBody: string;
  audienceTitle: string;
  audience: string[];
  stats: Array<{ label: string; value: string }>;
  featureTitle: string;
  featureLead: string;
  features: Array<{
    title: string;
    description: string;
    bullets: string[];
  }>;
  workflowTitle: string;
  workflow: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  faq: Array<{ question: string; answer: string }>;
  keywords: string[];
}

export const builderPages: Record<BuilderFeaturePageConfig["slug"], BuilderFeaturePageConfig> = {
  "portfolio-builder": {
    slug: "portfolio-builder",
    image: "/og-image.png",
    templateImage: "/assets/templates/portfolio-template.jpg",
    title: "Portfolio Builder - Turn Your Work into a Public Page | Kislap",
    description:
      "Build a portfolio page from structured forms. Kislap turns your profile, projects, resume, and links into a polished public page without blank-canvas design work.",
    eyebrow: "Portfolio Builder",
    heroTitle: "Create a portfolio website without wrestling with a builder.",
    heroLead:
      "Kislap helps freelancers, designers, consultants, and job seekers publish the page people see first, with project proof, resume detail, and clean sharing metadata.",
    heroBody:
      "Start from a focused form, not drag-and-drop chaos. Add your headline, work, links, and experience once, then publish a portfolio with strong SEO, shareable previews, and production-ready layouts.",
    audienceTitle: "Built for people who need a credible online presence quickly.",
    audience: [
      "Professionals showing work, skills, and case studies",
      "Designers packaging services and proof in one link",
      "Freelancers sharing a clean site with direct inquiry flow",
      "Job seekers turning an existing resume into a portfolio page",
    ],
    stats: [
      { label: "Best for", value: "Portfolios & resumes" },
      { label: "Strongest hook", value: "Resume-to-site workflow" },
      { label: "Primary CTA", value: "Publish your personal site" },
    ],
    featureTitle: "Everything you need to publish a serious portfolio site",
    featureLead:
      "The portfolio builder focuses on credibility, presentation, and making it easier for people to contact you or review your work.",
    features: [
      {
        title: "Resume-to-website workflow",
        description:
          "Upload your resume and use AI-assisted mapping to prefill your portfolio, so you are not retyping the same career details into a dozen fields.",
        bullets: [
          "Resume parsing for a faster setup",
          "Work experience, education, and skills mapping",
          "Cleaner starting point before design customization",
        ],
      },
      {
        title: "Showcase work in a way clients can actually scan",
        description:
          "Add projects, descriptions, roles, technologies, and supporting details in a structure that helps people understand your range quickly.",
        bullets: [
          "Project showcase sections",
          "Technology tagging",
          "Contact and social profile integration",
        ],
      },
      {
        title: "SEO and social sharing built into the page",
        description:
          "Your portfolio is not just for direct links. It should also look good in social previews and communicate clearly to search engines and AI crawlers.",
        bullets: [
          "Metadata and Open Graph support",
          "Structured data for richer indexing",
          "Clean public URLs for sharing",
        ],
      },
    ],
    workflowTitle: "How the portfolio builder flow works",
    workflow: [
      {
        step: "01",
        title: "Add your profile or parse a resume",
        description:
          "Start with your name, role, links, and profile details, or use the parser to get a faster first draft.",
      },
      {
        step: "02",
        title: "Choose a layout and theme",
        description:
          "Pick the template direction, tune colors and typography, then tighten the page until it feels like your work.",
      },
      {
        step: "03",
        title: "Publish and share",
        description:
          "Launch on your Kislap subdomain and use the finished page for job applications, client outreach, and social profiles.",
      },
    ],
    faq: [
      {
        question: "Can I build a portfolio website even if I already have a resume?",
        answer:
          "Yes. That is one of the main strengths of the portfolio builder. You can use your resume as the starting point instead of rebuilding everything manually.",
      },
      {
        question: "Is the portfolio builder good for freelancers and agencies too?",
        answer:
          "Yes. It works well for solo freelancers, consultants, and service businesses that need a focused site with proof, services, and contact flow.",
      },
      {
        question: "Will the portfolio page be SEO friendly?",
        answer:
          "Yes. Kislap is designed to generate social preview metadata, structured data, and clear public pages that are easier for search engines to understand.",
      },
    ],
    keywords: [
      "build portfolio",
      "portfolio website builder",
      "resume website",
      "personal website builder",
      "online portfolio maker",
    ],
  },
  "linktree-builder": {
    slug: "linktree-builder",
    image: "/og-image.png",
    templateImage: "/assets/templates/linktree-template.jpg",
    title: "Link Page Builder - Build the Link People Open First | Kislap",
    description:
      "Build a branded link page from structured content. Kislap turns your links, offers, profiles, and calls to action into a public page that feels intentional.",
    eyebrow: "Link Page Builder",
    heroTitle: "Create a link in bio page that feels like your brand, not everyone else's.",
    heroLead:
      "Kislap gives creators and personal brands a cleaner way to publish the route from every bio, with stronger identity, better social previews, and flexible sections.",
    heroBody:
      "Use the link page builder to collect your profiles, offers, content destinations, and key actions into one page that feels custom instead of generic.",
    audienceTitle: "Ideal for creators, freelancers, founders, and people building attention online.",
    audience: [
      "Creators routing traffic from Instagram, TikTok, and YouTube",
      "Freelancers collecting booking, inquiry, and portfolio links",
      "Founders sharing products, waitlists, and launch updates",
      "Personal brands who want a cleaner bio-link presence",
    ],
    stats: [
      { label: "Best for", value: "Bio link pages" },
      { label: "Strongest hook", value: "Brand-first link hub" },
      { label: "Primary CTA", value: "Route social traffic better" },
    ],
    featureTitle: "A better bio link page for real brand use",
    featureLead:
      "The link page builder is focused on helping you capture attention quickly while keeping the page clear, mobile-friendly, and easy to update.",
    features: [
      {
        title: "Link blocks that feel curated, not disposable",
        description:
          "Turn your most important destinations into a page that looks intentional and easy to scan on mobile.",
        bullets: [
          "Reorderable links and sections",
          "Theme and layout control",
          "Social profile support",
        ],
      },
      {
        title: "Useful for launches, creator funnels, and personal brands",
        description:
          "Whether you are routing people to products, newsletters, bookings, or content platforms, the page can adapt without feeling cluttered.",
        bullets: [
          "Good for lead magnets, profiles, and campaigns",
          "Fast to update as priorities change",
          "Designed for shareability",
        ],
      },
      {
        title: "Better metadata for social and search",
        description:
          "Link pages usually get ignored as SEO assets. Kislap treats them as real public pages with metadata and richer machine-readable structure.",
        bullets: [
          "Open Graph and Twitter cards",
          "Canonical-friendly public pages",
          "Cleaner crawler context for AI tools",
        ],
      },
    ],
    workflowTitle: "How the link page builder flow works",
    workflow: [
      {
        step: "01",
        title: "Add your profile and links",
        description:
          "Start with your name, image, short bio, and the destinations you want people to click next.",
      },
      {
        step: "02",
        title: "Pick a layout that matches your brand",
        description:
          "Choose a layout, set the theme, and create a link hub that feels aligned with your identity instead of a default bio page.",
      },
      {
        step: "03",
        title: "Publish and use it everywhere",
        description:
          "Drop it into social bios, campaigns, QR codes, and creator profiles once the page is live.",
      },
    ],
    faq: [
      {
        question: "Can I use this instead of a standard bio link tool?",
        answer:
          "Yes. The goal is to give you a more flexible, better branded alternative that still keeps the setup simple.",
      },
      {
        question: "Is it good for creators and personal brands?",
        answer:
          "Yes. It works especially well for creators, speakers, founders, consultants, and freelancers who need one polished page to route attention.",
      },
      {
        question: "Can I still optimize the page for discovery and social sharing?",
        answer:
          "Yes. The page is still treated like a real public site, with metadata and structure that helps when it is shared or indexed.",
      },
    ],
    keywords: [
      "create bio link page",
      "link in bio builder",
      "branded link page",
      "creator landing page",
      "bio link page builder",
    ],
  },
  "menu-builder": {
    slug: "menu-builder",
    image: "/og-image.png",
    templateImage: "/assets/templates/menu-template.jpg",
    title: "Digital Menu Builder - Publish a QR-Ready Menu Page | Kislap",
    description:
      "Build a QR-ready digital menu from structured forms. Kislap turns categories, items, photos, and business details into a mobile public menu page.",
    eyebrow: "Menu Builder",
    heroTitle: "Create a digital menu that feels like your place, not a spreadsheet online.",
    heroLead:
      "The menu builder helps restaurants, cafes, and small food brands publish the page customers scan first, share later, and revisit on mobile.",
    heroBody:
      "Use structured menu sections, item photos, gallery images, QR support, and multiple layouts to build a public menu page that actually fits your brand.",
    audienceTitle: "Made for restaurants, cafes, food stalls, bakeries, and branded menu pages.",
    audience: [
      "Restaurants that need a clean digital menu",
      "Cafes that want a menu page with branding and gallery support",
      "Food stalls and small businesses using QR menus",
      "Operators replacing static PDFs with a more usable site",
    ],
    stats: [
      { label: "Best for", value: "QR-ready menu pages" },
      { label: "Strongest hook", value: "Brandable public menus" },
      { label: "Primary CTA", value: "Publish your menu fast" },
    ],
    featureTitle: "Why the menu builder works better than a PDF link",
    featureLead:
      "A menu page should load well on mobile, look good when shared, and still let you present categories, variants, gallery images, and QR access cleanly.",
    features: [
      {
        title: "Structured categories, items, and variants",
        description:
          "Organize menu sections clearly, add descriptions, item images, and show sizes or variants without making the menu confusing.",
        bullets: [
          "Categories and items with ordering control",
          "Variants for sizes or formats",
          "Cleaner mobile reading than PDF menus",
        ],
      },
      {
        title: "Branding, gallery, and cover support",
        description:
          "Bring your identity into the menu with cover images, logos, gallery imagery, and template options that feel more like a brand page than a utility screen.",
        bullets: [
          "Theme customization",
          "Gallery sections for ambience and dishes",
          "Multiple menu layouts",
        ],
      },
      {
        title: "Made for QR sharing and search visibility",
        description:
          "Your menu page can work as a scan destination at the table and a public search-friendly page for customers discovering your brand online.",
        bullets: [
          "QR display support",
          "Public URLs for sharing",
          "Metadata and structured content for indexing",
        ],
      },
    ],
    workflowTitle: "How the menu builder flow works",
    workflow: [
      {
        step: "01",
        title: "Add your business and menu details",
        description:
          "Start with your restaurant name, cover, logo, categories, items, and the details customers need most.",
      },
      {
        step: "02",
        title: "Choose a layout and tune the look",
        description:
          "Pick a menu template, apply your theme, and build a page that feels like your place instead of a generic QR landing page.",
      },
      {
        step: "03",
        title: "Share it online or through QR",
        description:
          "Publish the page and use it for table QR codes, social links, and local search visibility.",
      },
    ],
    faq: [
      {
        question: "Is this better than uploading a PDF menu?",
        answer:
          "For most businesses, yes. A web menu is easier to scan on mobile, easier to update, and much better for branding and sharing.",
      },
      {
        question: "Can I use it for cafes and small food businesses too?",
        answer:
          "Yes. It works well for cafes, bakeries, stalls, and other food businesses that want a light but branded public menu.",
      },
      {
        question: "Can I use this as a QR menu?",
        answer:
          "Yes. The menu pages are well suited for QR use, and the templates can surface a QR block directly in the public experience.",
      },
    ],
    keywords: [
      "digital menu builder",
      "restaurant menu website",
      "qr menu builder",
      "cafe menu website",
      "online menu creator",
    ],
  },
};
