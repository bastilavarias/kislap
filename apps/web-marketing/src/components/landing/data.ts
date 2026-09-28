import {
  BriefcaseBusiness,
  Code2,
  Megaphone,
} from "lucide-react";

export type LandingBuildPaths = {
  default: string;
};

export const productStories = [
  {
    title: "Creator Page",
    eyebrow: "Put every destination behind one link",
    copy: "Feature your latest video, socials, affiliate links, brand partnerships, support links, and whatever deserves attention now.",
    accent: "bg-fuchsia-500",
    imageSize: "Kislap Page example",
    imageSrc: "/assets/home/link-page-screen.png",
    icon: Megaphone,
  },
  {
    title: "Developer Page",
    eyebrow: "Links plus proof of work",
    copy: "Mix GitHub, projects, experience, skills, writing, contact details, and social links without building a separate portfolio site.",
    accent: "bg-blue-500",
    imageSize: "Kislap Page example",
    imageSrc: "/assets/home/portfolio-screen.png",
    icon: Code2,
  },
  {
    title: "Freelancer Page",
    eyebrow: "Make the next action obvious",
    copy: "Show services, selected work, testimonials, booking links, contact details, and social proof in one shareable page.",
    accent: "bg-amber-400",
    imageSize: "Kislap Page example",
    imageSrc: "/assets/home/link-page-screen.png",
    icon: BriefcaseBusiness,
  },
];

export const faqs = [
  {
    q: "What is Kislap?",
    a: "Kislap is a customizable personal page builder for putting your links, work, socials, projects, promos, and other important content on one public page.",
  },
  {
    q: "Is Kislap a Linktree alternative?",
    a: "Kislap can replace a basic link-in-bio page, but it is designed to go further with flexible content blocks, multiple layouts, themes, projects, skills, experience, banners, support cards, and more.",
  },
  {
    q: "Is Kislap free to use?",
    a: "Yes. You can build and publish a Kislap Page on a public Kislap URL for free.",
  },
  {
    q: "Can I customize the layout?",
    a: "Yes. Blocks can be reordered and given different widths, alignment, spacing, and appearance while Kislap keeps the page responsive.",
  },
  {
    q: "Who is Kislap for?",
    a: "Kislap is useful for creators, developers, freelancers, virtual assistants, students, and anyone who wants one shareable page for their online presence.",
  },
];
