import { getPresetThemeStyles } from '@/lib/theme-presets';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import type { MenuFormValues } from '@/lib/schemas/menu';
import type { PortfolioFormValues } from '@/lib/schemas/portfolio';
import type { ThemeStyles } from '@/types/theme';

export type StarterProjectType = 'portfolio' | 'linktree' | 'menu';

export type BuilderStarter = {
  id: string;
  type: StarterProjectType;
  label: string;
  description: string;
  bestFor: string;
  defaults: {
    layoutName: string;
    themePreset: string;
  };
};

export type BuilderLayoutOption = {
  id: string;
  label: string;
  description: string;
};

export type BuilderThemeOption = {
  id: string;
  label: string;
  description: string;
};

export const PROJECT_TYPE_COPY: Record<
  StarterProjectType,
  { label: string; title: string; description: string; bestFor: string }
> = {
  portfolio: {
    label: 'Portfolio',
    title: 'Start a portfolio',
    description: 'Turn your profile, work, and proof into a polished public site.',
    bestFor: 'Developers, freelancers, designers, and job seekers',
  },
  linktree: {
    label: 'Linktree',
    title: 'Start a link page',
    description: 'Route social traffic into one branded page that feels intentional.',
    bestFor: 'Creators, founders, speakers, and personal brands',
  },
  menu: {
    label: 'Menu',
    title: 'Start a digital menu',
    description: 'Launch a QR-friendly menu page people can actually browse on mobile.',
    bestFor: 'Cafes, restaurants, bakeries, and food stalls',
  },
};

export const LAYOUT_OPTIONS: Record<StarterProjectType, BuilderLayoutOption[]> = {
  portfolio: [
    { id: 'default', label: 'Default', description: 'Clean and professional with strong hierarchy.' },
    {
      id: 'neo-brutalist',
      label: 'Neo Brutalist',
      description: 'Bold, punchy, and great when you want more personality.',
    },
    {
      id: 'newspaper',
      label: 'Newspaper',
      description: 'Editorial and content-led for writing-heavy portfolios.',
    },
  ],
  linktree: [
    {
      id: 'linktree-default',
      label: 'Default',
      description: 'Simple, mobile-first, and easy to scan.',
    },
    {
      id: 'linktree-neo-brutalist',
      label: 'Neo Brutalist',
      description: 'Louder visual direction for creator-first branding.',
    },
  ],
  menu: [
    {
      id: 'menu-default',
      label: 'Default',
      description: 'Structured and familiar for straightforward menu browsing.',
    },
    {
      id: 'menu-editorial',
      label: 'Editorial',
      description: 'A more designed menu presentation with stronger brand feel.',
    },
    {
      id: 'menu-showcase',
      label: 'Showcase',
      description: 'A more visual direction when photos matter as much as the list.',
    },
    {
      id: 'menu-runway',
      label: 'Runway',
      description: 'Asymmetric and more fashion-forward for expressive food brands.',
    },
  ],
};

export const THEME_OPTIONS: Record<StarterProjectType, BuilderThemeOption[]> = {
  portfolio: [
    { id: 'corporate', label: 'Corporate', description: 'Calm, clean, and credible.' },
    { id: 'sunset-horizon', label: 'Sunset Horizon', description: 'Warmer, softer, and more personal.' },
    { id: 'slack', label: 'Slack', description: 'Sharper contrast with a modern SaaS feel.' },
  ],
  linktree: [
    { id: 'spotify', label: 'Spotlight', description: 'High-contrast and social-first.' },
    { id: 'marshmallow', label: 'Marshmallow', description: 'Soft and friendly without looking generic.' },
    { id: 'corporate', label: 'Corporate', description: 'Minimal and brand-safe.' },
  ],
  menu: [
    { id: 'caffeine', label: 'Caffeine', description: 'Warm neutrals for food and cafe brands.' },
    { id: 'summer', label: 'Summer', description: 'Brighter and more upbeat.' },
    { id: 'sunset-horizon', label: 'Sunset Horizon', description: 'Softer tones for editorial menus.' },
  ],
};

export const STARTERS: Record<StarterProjectType, BuilderStarter[]> = {
  portfolio: [
    {
      id: 'resume-first',
      type: 'portfolio',
      label: 'Resume First',
      description: 'Best when you already have your experience and need a strong first draft quickly.',
      bestFor: 'Fast setup from a CV or LinkedIn-style profile',
      defaults: { layoutName: 'default', themePreset: 'corporate' },
    },
    {
      id: 'freelancer',
      type: 'portfolio',
      label: 'Freelancer',
      description: 'Lead with services, proof, and a stronger visual personality.',
      bestFor: 'Consultants, agencies, and independent creatives',
      defaults: { layoutName: 'neo-brutalist', themePreset: 'sunset-horizon' },
    },
    {
      id: 'developer',
      type: 'portfolio',
      label: 'Developer',
      description: 'More technical proof, stronger project framing, and cleaner social links.',
      bestFor: 'Developers, engineers, and technical builders',
      defaults: { layoutName: 'newspaper', themePreset: 'slack' },
    },
  ],
  linktree: [
    {
      id: 'creator',
      type: 'linktree',
      label: 'Creator',
      description: 'A mobile-first bio page with your main platforms and offers front and center.',
      bestFor: 'Instagram, TikTok, and YouTube traffic',
      defaults: { layoutName: 'linktree-neo-brutalist', themePreset: 'spotify' },
    },
    {
      id: 'personal-brand',
      type: 'linktree',
      label: 'Personal Brand',
      description: 'A more polished page when your name and positioning matter as much as the links.',
      bestFor: 'Speakers, founders, coaches, and consultants',
      defaults: { layoutName: 'linktree-neo-brutalist', themePreset: 'corporate' },
    },
    {
      id: 'launch-links',
      type: 'linktree',
      label: 'Launch Links',
      description: 'Use one page to route people into a campaign, waitlist, release, or launch.',
      bestFor: 'Products, newsletters, and timed campaigns',
      defaults: { layoutName: 'linktree-default', themePreset: 'marshmallow' },
    },
  ],
  menu: [
    {
      id: 'cafe',
      type: 'menu',
      label: 'Cafe',
      description: 'Warm, brandable, and tuned for coffee, pastries, and lighter menus.',
      bestFor: 'Coffee shops, bakeries, and brunch spots',
      defaults: { layoutName: 'menu-editorial', themePreset: 'caffeine' },
    },
    {
      id: 'restaurant',
      type: 'menu',
      label: 'Restaurant',
      description: 'A more immersive layout for larger menus, galleries, and stronger presentation.',
      bestFor: 'Sit-down restaurants and dinner-service brands',
      defaults: { layoutName: 'menu-showcase', themePreset: 'sunset-horizon' },
    },
    {
      id: 'food-stall',
      type: 'menu',
      label: 'Food Stall',
      description: 'A fast, punchy setup for smaller menus that still feels branded.',
      bestFor: 'Pop-ups, food stalls, and street-food concepts',
      defaults: { layoutName: 'menu-runway', themePreset: 'summer' },
    },
  ],
};

export function getDefaultStarter(type: StarterProjectType) {
  return STARTERS[type][0];
}

export function getStarterById(type: StarterProjectType, starterId?: string | null) {
  return STARTERS[type].find((starter) => starter.id === starterId) ?? getDefaultStarter(type);
}

export function getDefaultLayout(type: StarterProjectType) {
  return getDefaultStarter(type).defaults.layoutName;
}

export function getDefaultThemePreset(type: StarterProjectType) {
  return getDefaultStarter(type).defaults.themePreset;
}

export function getThemeStylesForPreset(preset?: string | null): ThemeStyles {
  return getPresetThemeStyles(preset || 'default');
}

export function createThemeObject(preset?: string | null) {
  const presetName = preset || 'default';
  return {
    preset: presetName,
    styles: getThemeStylesForPreset(presetName),
  };
}

function createPortfolioBase(name: string): PortfolioFormValues {
  return {
    name,
    job_title: 'Senior product engineer',
    avatar: null,
    avatar_url:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    location: 'Cebu City, Philippines',
    introduction: 'I design and build digital products that make complex workflows feel simpler.',
    about:
      'I work across product design, front-end systems, and full-stack delivery. Most of my projects involve taking a vague internal process or service idea and turning it into something clearer, faster, and easier for people to trust. I care about structure, usability, and building interfaces that stay maintainable as teams grow.',
    email: 'avery.navarro@example.com',
    phone: '+63 917 555 0198',
    website: 'https://averynavarro.dev',
    github: 'https://github.com/averynavarro',
    linkedin: 'https://linkedin.com/in/averynavarro',
    twitter: 'https://x.com/averynavarro',
    work_experiences: [
      {
        company: 'Northshore Studio',
        role: 'Senior Product Engineer',
        url: 'https://northshore.example',
        location: 'Remote',
        startDate: 'Jan 2023',
        endDate: '',
        about: 'Led product-facing interfaces, design systems, and performance cleanup across client platforms and internal tools.',
        placement_order: 0,
      },
      {
        company: 'Ledger Lane',
        role: 'Product Designer',
        url: 'https://ledgerlane.example',
        location: 'Singapore',
        startDate: 'May 2021',
        endDate: 'Dec 2022',
        about: 'Designed and shipped financial dashboards, onboarding flows, and reporting tools for operations teams.',
        placement_order: 1,
      },
      {
        company: 'Open Harbor',
        role: 'Front-end Engineer',
        url: 'https://openharbor.example',
        location: 'Manila',
        startDate: 'Jun 2019',
        endDate: 'Apr 2021',
        about: 'Built marketing pages, booking interfaces, and reusable UI patterns for service-based products.',
        placement_order: 2,
      },
    ],
    education: [
      {
        school: 'Ateneo de Manila University',
        degree: 'BS Information Design',
        level: 'College',
        location: 'Quezon City',
        yearStart: '2015',
        yearEnd: '2019',
        about: 'Focused on interaction design, front-end development, and storytelling through digital products.',
        placement_order: 0,
      },
      {
        school: 'Design Systems Collective',
        degree: 'Advanced Interface Systems',
        level: 'Continuing Education',
        location: 'Online',
        yearStart: '2022',
        yearEnd: '2022',
        about: 'Advanced study in design systems, component thinking, and cross-functional product delivery.',
        placement_order: 1,
      },
    ],
    showcases: [
      {
        name: 'CareLoop Portal',
        description:
          'A healthcare operations portal that simplified staff scheduling, patient tasks, and recurring admin workflows.',
        url: 'https://example.com/careloop',
        role: 'Product architecture and implementation',
        technologies: [
          { name: 'Next.js' },
          { name: 'TypeScript' },
          { name: 'Postgres' },
          { name: 'Tailwind CSS' },
        ],
        placement_order: 0,
      },
      {
        name: 'Beacon Ops Dashboard',
        description:
          'An internal dashboard for monitoring queues, incidents, and customer handoffs across support teams.',
        url: 'https://example.com/beacon-ops',
        role: 'Systems design and front-end delivery',
        technologies: [
          { name: 'React' },
          { name: 'Go' },
          { name: 'OpenTelemetry' },
          { name: 'Recharts' },
        ],
        placement_order: 1,
      },
      {
        name: 'Studio Atlas Site',
        description:
          'A conversion-focused public website for a boutique agency repositioning around product strategy and design systems.',
        url: 'https://example.com/studio-atlas',
        role: 'Copy structure, UI, and implementation',
        technologies: [
          { name: 'Astro' },
          { name: 'Content Design' },
          { name: 'SEO' },
          { name: 'Tailwind CSS' },
        ],
        placement_order: 2,
      },
    ],
    skills: [
      { name: 'Product Strategy' },
      { name: 'TypeScript' },
      { name: 'UI Systems' },
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'Node.js' },
      { name: 'Go' },
      { name: 'Postgres' },
      { name: 'Docker' },
      { name: 'Design Systems' },
      { name: 'SEO' },
      { name: 'Accessibility' },
      { name: 'Analytics' },
      { name: 'Storybook' },
      { name: 'Git' },
      { name: 'Figma' },
    ],
  };
}

export function buildPortfolioStarterValues(
  starterId: string,
  projectName = 'John Doe'
): PortfolioFormValues {
  const base = createPortfolioBase(projectName);

  if (starterId === 'freelancer') {
    return {
      ...base,
      job_title: 'Freelance product designer',
      introduction: 'I help founders ship sharper brand and product experiences.',
      about:
        'I work with founders and service businesses to package offers, proof, and design thinking into cleaner public sites.',
      showcases: [
        {
          name: 'Creative Retainer Site',
          description: 'Service-led site built to turn inbound traffic into more qualified inquiries.',
          url: 'https://example.com',
          role: 'Brand direction, UX, and implementation',
          technologies: [{ name: 'Figma' }, { name: 'Next.js' }, { name: 'Tailwind CSS' }],
          placement_order: 0,
        },
        {
          name: 'Founder Brand Refresh',
          description: 'Positioning-led site for a founder moving from referrals to stronger inbound growth.',
          url: 'https://example.com/founder',
          role: 'Messaging, conversion flow, and implementation',
          technologies: [{ name: 'Copy Strategy' }, { name: 'UI Design' }, { name: 'Astro' }],
          placement_order: 1,
        },
        {
          name: 'Local Service Website Refresh',
          description: 'Refined a service company site to surface trust, services, and conversion points more clearly.',
          url: 'https://example.com/local-service',
          role: 'Offer design, proof structure, and implementation',
          technologies: [{ name: 'Brand Strategy' }, { name: 'SEO' }, { name: 'Next.js' }],
          placement_order: 2,
        },
      ],
      skills: [
        { name: 'UI Design' },
        { name: 'Brand Systems' },
        { name: 'Next.js' },
        { name: 'Conversion UX' },
        { name: 'Art Direction' },
      ],
    };
  }

  if (starterId === 'developer') {
    return {
      ...base,
      job_title: 'Developer focused on product systems',
      introduction: 'I design and ship products with clear structure, strong UX, and maintainable code.',
      showcases: [
        {
          name: 'Internal Platform Migration',
          description: 'Moved a fragmented admin surface into a single app shell with shared patterns and cleaner APIs.',
          url: 'https://example.com/platform',
          role: 'Architecture, React implementation, and API integration',
          technologies: [{ name: 'TypeScript' }, { name: 'Next.js' }, { name: 'Postgres' }],
          placement_order: 0,
        },
        {
          name: 'API Observability Toolkit',
          description: 'Developer-facing tooling for request tracing, failures, and deployment validation.',
          url: 'https://example.com/observability',
          role: 'Systems design and full-stack implementation',
          technologies: [{ name: 'Go' }, { name: 'OpenTelemetry' }, { name: 'Postgres' }],
          placement_order: 1,
        },
        {
          name: 'Realtime Support Dashboard',
          description: 'Monitoring surface for support and ops teams with clearer issue visibility and queue health.',
          url: 'https://example.com/support-dashboard',
          role: 'Front-end architecture and data visualization',
          technologies: [{ name: 'React' }, { name: 'WebSockets' }, { name: 'Recharts' }],
          placement_order: 2,
        },
      ],
      skills: [
        { name: 'TypeScript' },
        { name: 'System Design' },
        { name: 'Next.js' },
        { name: 'Go APIs' },
        { name: 'Postgres' },
        { name: 'Observability' },
      ],
    };
  }

  return base;
}

export function buildLinktreeStarterValues(
  starterId: string,
  projectName = 'John Doe'
): LinktreeFormValues {
  const starterName =
    !projectName || projectName === 'John Doe'
      ? starterId === 'personal-brand'
        ? 'Nika Valdez'
        : starterId === 'launch-links'
          ? 'Orbit Labs'
          : 'Mika Reyes'
      : projectName;
  const base: LinktreeFormValues = {
    name: starterName,
    tagline: 'Creator notes, drops, and favorite corners of the internet.',
    about: 'A playful bio page for routing people into content, community, and projects without feeling generic.',
    phone: '+63 917 555 0247',
    email: 'mika@canvasclub.me',
    logo: null,
    logo_url:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    background_style: 'grid',
    layout_name: 'linktree-default',
    sections: [
      {
        type: 'banner',
        banner_text: 'WELCOME TO THE LINK DROP ✨ weekly updates, good finds, and current obsessions',
        cta_label: 'Start here',
        url: 'https://example.com/start-here',
        accent_color: '#245d4b',
      },
      {
        type: 'link',
        title: 'Watch the latest reel',
        description: 'Short videos on creator workflow, filming setups, and what I am testing right now.',
        url: 'https://example.com/reels',
        icon_key: 'video',
      },
      {
        type: 'link',
        title: 'Join the studio notes',
        description: 'Weekly notes on creative process, internet culture, and building online with more intention.',
        url: 'https://example.com/studio-notes',
        icon_key: 'mail',
      },
      {
        type: 'link',
        title: 'Shop the toolkit',
        description: 'My favorite camera gear, desk setup picks, and creator tools in one page.',
        url: 'https://example.com/toolkit',
        icon_key: 'shopping-bag',
      },
      {
        type: 'link',
        title: 'Browse my photo dump',
        description: 'Behind-the-scenes captures, coffee runs, moodboards, and everyday snapshots.',
        url: 'https://example.com/photo-dump',
        icon_key: 'image',
      },
      {
        type: 'promo',
        title: 'Build a page like this with Kislap',
        description: 'See how I turn content drops, community links, and personal promos into one clean public page.',
        url: 'https://kislap.app/',
        image_url:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        accent_color: 'linear-gradient(135deg, #fff7c2 0%, #ffd2d8 100%)',
      },
      {
        type: 'quote',
        quote_text: 'Build a page that feels like your corner of the internet, not just a list of buttons.',
        quote_author: starterName,
        accent_color: 'linear-gradient(135deg, #d7e9ff 0%, #f4dcff 100%)',
      },
      {
        type: 'link',
        title: 'Work with me',
        description: 'Brand collabs, UGC packages, speaking invites, and creative partnerships.',
        url: 'mailto:mika@canvasclub.me',
        icon_key: 'mail',
      },
      {
        type: 'link',
        title: 'Join the private channel',
        description: 'A smaller community space for drops, resources, and behind-the-scenes updates.',
        url: 'https://example.com/community',
        icon_key: 'users',
      },
      {
        type: 'support',
        title: 'Support the creator experiments',
        description: 'If the notes, resources, or videos help you, you can send a small tip or just save the QR for later.',
        support_note: 'Every bit goes into better videos, better tools, and more weird internet experiments.',
        support_qr_image_url:
          'https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=https%3A%2F%2Fexample.com%2Fsupport-mika',
      },
    ],
  };

  if (starterId === 'personal-brand') {
    return {
      ...base,
      name: starterName,
      tagline: 'Founder, speaker, and systems-minded storyteller.',
      about: 'Use one page to route people into your ideas, talks, writing, and consulting without losing personality.',
      layout_name: 'linktree-neo-brutalist',
      sections: [
        {
          type: 'banner',
          banner_text: 'CURRENTLY WRITING, SPEAKING, AND BUILDING SYSTEMS FOR SMALL TEAMS',
          cta_label: 'See what I am doing',
          url: 'https://example.com/now',
        },
        {
          type: 'link',
          title: 'Speaking kit',
          description: 'Talks, topics, and inquiry details.',
          url: 'https://example.com/speaking',
          icon_key: 'mic',
        },
        {
          type: 'link',
          title: 'Read the essays',
          description: 'Long-form writing on product strategy, digital publishing, and modern internet presence.',
          url: 'https://example.com/newsletter',
          icon_key: 'book-open',
        },
        {
          type: 'quote',
          quote_text: 'Clear communication and clear products usually win together.',
          quote_author: starterName,
        },
        {
          type: 'link',
          title: 'Work with me',
          description: 'Consulting, workshops, and advisory availability.',
          url: 'https://example.com/services',
          icon_key: 'briefcase',
        },
        {
          type: 'link',
          title: 'Founder podcast guesting',
          description: 'Topics, audience fit, and how to invite me on your show.',
          url: 'https://example.com/podcast',
          icon_key: 'headphones',
        },
        {
          type: 'link',
          title: 'Email me',
          description: 'Direct line for speaking and business inquiries.',
          url: 'mailto:nika@signalstudio.co',
          icon_key: 'mail',
        },
        {
          type: 'link',
          title: 'View media kit',
          description: 'Brand assets, approved headshots, and speaking topics.',
          url: 'https://example.com/media-kit',
          icon_key: 'image',
        },
      ],
    };
  }

  if (starterId === 'launch-links') {
    return {
      ...base,
      name: starterName,
      tagline: 'Everything for your next launch in one page.',
      about: 'A sharper campaign page for launches, waitlists, beta invites, changelogs, and timed offers.',
      sections: [
        {
          type: 'banner',
          banner_text: 'BETA NOW OPEN: join the early access list before public launch.',
          cta_label: 'Join waitlist',
          url: 'https://example.com/waitlist',
        },
        {
          type: 'link',
          title: 'Product preview',
          description: 'See the latest screenshots and feature breakdown.',
          url: 'https://example.com/preview',
          icon_key: 'sparkles',
        },
        {
          type: 'link',
          title: 'Launch video',
          description: 'Quick walkthrough of the product, positioning, and what early users will get.',
          url: 'https://example.com/launch-video',
          icon_key: 'video',
        },
        {
          type: 'link',
          title: 'Founder notes',
          description: 'Context, roadmap, experiments, and launch updates.',
          url: 'https://example.com/notes',
          icon_key: 'pen-square',
        },
        {
          type: 'link',
          title: 'FAQ',
          description: 'Answers for pricing, launch timeline, and what happens next.',
          url: 'https://example.com/faq',
          icon_key: 'circle-help',
        },
        {
          type: 'link',
          title: 'See roadmap',
          description: 'What is shipping next and what early users can expect.',
          url: 'https://example.com/roadmap',
          icon_key: 'route',
        },
        {
          type: 'quote',
          quote_text: 'Launch pages work better when the next step feels obvious in one screen.',
          quote_author: starterName,
        },
      ],
    };
  }

  return base;
}

function createMenuBase(name: string): MenuFormValues {
  return {
    name,
    description: 'A warm, mobile-friendly digital menu built for quick scanning and stronger branding.',
    logo: null,
    logo_url:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80',
    cover_image: null,
    cover_image_url:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80',
    phone: '+63 917 000 1234',
    email: 'hello@kislap.app',
    website_url: 'https://kislap.app',
    address: '1182 Example Street',
    city: 'Manila',
    google_maps_url: 'https://maps.google.com',
    search_enabled: true,
    hours_enabled: true,
    business_hours: [
      { day: 'Monday', open: '08:00', close: '18:00', closed: false },
      { day: 'Tuesday', open: '08:00', close: '18:00', closed: false },
      { day: 'Wednesday', open: '08:00', close: '18:00', closed: false },
      { day: 'Thursday', open: '08:00', close: '18:00', closed: false },
      { day: 'Friday', open: '08:00', close: '20:00', closed: false },
      { day: 'Saturday', open: '09:00', close: '20:00', closed: false },
      { day: 'Sunday', open: '09:00', close: '17:00', closed: false },
    ],
    social_links: [
      { platform: 'instagram', url: 'https://instagram.com/johndoe' },
      { platform: 'facebook', url: 'https://facebook.com/johndoe' },
      { platform: 'website', url: 'https://kislap.app' },
      { platform: 'tiktok', url: 'https://tiktok.com/@johndoe' },
    ],
    gallery_images: [
      {
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
      },
      {
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
      },
      {
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=900&q=80',
      },
      {
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
      },
    ],
    layout_name: 'menu-default',
    qr_settings: {
      foreground_color: '#111111',
      background_color: '#ffffff',
      show_logo: false,
    },
    display_poster_settings: {
      template: 'clean',
      size: 'a4',
      color_mode: 'light',
      headline: 'Scan to view our menu',
      subtext: 'Browse our latest dishes, drinks, and prices on your phone.',
      footer_note: 'Updated live for dine-in and takeaway.',
      show_logo: true,
      show_address: false,
      show_url: true,
    },
    display_poster_image_url: '',
    categories: [
      {
        id: null,
        client_key: 'coffee',
        name: 'Coffee',
        description: 'Espresso-based drinks and house specials.',
        image: null,
        image_url: null,
        placement_order: 0,
        is_visible: true,
      },
      {
        id: null,
        client_key: 'non-coffee',
        name: 'Non Coffee',
        description: 'Signature drinks, tea, and house favorites.',
        image: null,
        image_url: null,
        placement_order: 1,
        is_visible: true,
      },
      {
        id: null,
        client_key: 'pastries',
        name: 'Pastries',
        description: 'Fresh bakes and light pairings for coffee runs.',
        image: null,
        image_url: null,
        placement_order: 2,
        is_visible: true,
      },
    ],
    items: [
      {
        id: null,
        category_id: null,
        category_key: 'coffee',
        name: 'Salt and Sugar Shaken Latte',
        description: 'Sea salt foam, brown sugar, and shaken espresso.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        badge: 'Bestseller',
        price: '130',
        variants: [
          { name: '12oz', price: '120', is_default: true, placement_order: 0 },
          { name: '16oz', price: '140', is_default: false, placement_order: 1 },
        ],
        placement_order: 0,
        is_available: true,
        is_featured: true,
      },
      {
        id: null,
        category_id: null,
        category_key: 'coffee',
        name: 'Sea Salt Caramel Latte',
        description: 'Espresso, milk, sea salt cream, and toasted caramel drizzle.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
        badge: 'Popular',
        price: '150',
        variants: [
          { name: '12oz', price: '140', is_default: true, placement_order: 0 },
          { name: '16oz', price: '155', is_default: false, placement_order: 1 },
        ],
        placement_order: 1,
        is_available: true,
        is_featured: true,
      },
      {
        id: null,
        category_id: null,
        category_key: 'non-coffee',
        name: 'Milky Cookie and Cream',
        description: 'Milk with cookies and extra cream.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1553787499-6f913324e0ad?auto=format&fit=crop&w=800&q=80',
        badge: null,
        price: '110',
        variants: [
          { name: '12oz', price: '110', is_default: true, placement_order: 0 },
          { name: '16oz', price: '125', is_default: false, placement_order: 1 },
        ],
        placement_order: 2,
        is_available: true,
        is_featured: false,
      },
      {
        id: null,
        category_id: null,
        category_key: 'coffee',
        name: 'Spanish Latte',
        description: 'Espresso, milk, and sweetened condensed milk.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1517701550927-30cf4ba1f2f0?auto=format&fit=crop&w=800&q=80',
        badge: null,
        price: '120',
        variants: [
          { name: '12oz', price: '120', is_default: true, placement_order: 0 },
          { name: '16oz', price: '135', is_default: false, placement_order: 1 },
          { name: 'Hot', price: '125', is_default: false, placement_order: 2 },
        ],
        placement_order: 3,
        is_available: true,
        is_featured: false,
      },
      {
        id: null,
        category_id: null,
        category_key: 'pastries',
        name: 'Butter Croissant',
        description: 'Flaky laminated pastry baked fresh every morning.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
        badge: null,
        price: '95',
        variants: [
          { name: 'Single', price: '95', is_default: true, placement_order: 0 },
          { name: 'Box of 3', price: '270', is_default: false, placement_order: 1 },
        ],
        placement_order: 4,
        is_available: true,
        is_featured: false,
      },
      {
        id: null,
        category_id: null,
        category_key: 'non-coffee',
        name: 'Matcha Cream Latte',
        description: 'Stone-ground matcha with milk and soft vanilla cream.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=800&q=80',
        badge: 'New',
        price: '145',
        variants: [
          { name: '12oz', price: '145', is_default: true, placement_order: 0 },
          { name: '16oz', price: '160', is_default: false, placement_order: 1 },
        ],
        placement_order: 5,
        is_available: true,
        is_featured: true,
      },
      {
        id: null,
        category_id: null,
        category_key: 'coffee',
        name: 'Cold Brew Tonic',
        description: 'Bright cold brew, tonic water, and orange peel.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        badge: null,
        price: '160',
        variants: [
          { name: 'Regular', price: '160', is_default: true, placement_order: 0 },
          { name: 'Large', price: '175', is_default: false, placement_order: 1 },
        ],
        placement_order: 6,
        is_available: true,
        is_featured: false,
      },
      {
        id: null,
        category_id: null,
        category_key: 'pastries',
        name: 'Pain au Chocolat',
        description: 'Buttery pastry layered with dark chocolate.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
        badge: null,
        price: '110',
        variants: [
          { name: 'Single', price: '110', is_default: true, placement_order: 0 },
          { name: 'Box of 4', price: '420', is_default: false, placement_order: 1 },
        ],
        placement_order: 7,
        is_available: true,
        is_featured: false,
      },
      {
        id: null,
        category_id: null,
        category_key: 'coffee',
        name: 'Dirty Matcha Espresso',
        description: 'Ceremonial matcha layered with espresso and milk.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=800&q=80',
        badge: null,
        price: '165',
        variants: [
          { name: '12oz', price: '165', is_default: true, placement_order: 0 },
          { name: '16oz', price: '180', is_default: false, placement_order: 1 },
        ],
        placement_order: 8,
        is_available: true,
        is_featured: false,
      },
      {
        id: null,
        category_id: null,
        category_key: 'non-coffee',
        name: 'Strawberry Cloud Milk',
        description: 'Fresh strawberry milk with whipped vanilla cream.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
        badge: null,
        price: '135',
        variants: [
          { name: '12oz', price: '135', is_default: true, placement_order: 0 },
          { name: '16oz', price: '150', is_default: false, placement_order: 1 },
        ],
        placement_order: 9,
        is_available: true,
        is_featured: false,
      },
      {
        id: null,
        category_id: null,
        category_key: 'pastries',
        name: 'Cinnamon Kouign-Amann',
        description: 'Caramelized laminated pastry with cinnamon sugar.',
        image: null,
        image_url:
          'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=800&q=80',
        badge: 'Fresh Bake',
        price: '125',
        variants: [
          { name: 'Single', price: '125', is_default: true, placement_order: 0 },
          { name: 'Box of 4', price: '470', is_default: false, placement_order: 1 },
        ],
        placement_order: 10,
        is_available: true,
        is_featured: true,
      },
    ],
  };
}

export function buildMenuStarterValues(starterId: string, projectName = 'John Doe Cafe'): MenuFormValues {
  const starterName =
    !projectName || projectName === 'John Doe Cafe'
      ? starterId === 'restaurant'
        ? 'Resto Express'
        : starterId === 'food-stall'
          ? 'Siomai Prince'
          : 'Cafe Moto'
      : projectName;
  const base = createMenuBase(starterName);

  if (starterId === 'restaurant') {
    return {
      ...base,
      name: starterName,
      description: 'A more immersive digital menu for larger courses, gallery-led presentation, and dine-in discovery.',
      categories: [
        {
          id: null,
          client_key: 'starters',
          name: 'Starters',
          description: 'Small plates to open the table.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          placement_order: 0,
          is_visible: true,
        },
        {
          id: null,
          client_key: 'mains',
          name: 'Mains',
          description: 'Core dishes and signatures.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
          placement_order: 1,
          is_visible: true,
        },
      ],
      items: [
        {
          id: null,
          category_id: null,
          category_key: 'starters',
          name: 'Smoked Tomato Bruschetta',
          description: 'Toasted bread, smoked tomato, basil oil, and whipped ricotta.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
          badge: 'Signature',
          price: '240',
          variants: [
            { name: 'Solo', price: '240', is_default: true, placement_order: 0 },
            { name: 'For sharing', price: '420', is_default: false, placement_order: 1 },
          ],
          placement_order: 0,
          is_available: true,
          is_featured: true,
        },
        {
          id: null,
          category_id: null,
          category_key: 'mains',
          name: 'Grilled Chicken Rosemary',
          description: 'Herb-brined chicken, pan sauce, and roasted vegetables.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '420',
          variants: [
            { name: 'Quarter', price: '420', is_default: true, placement_order: 0 },
            { name: 'Half', price: '760', is_default: false, placement_order: 1 },
          ],
          placement_order: 1,
          is_available: true,
          is_featured: false,
        },
        {
          id: null,
          category_id: null,
          category_key: 'mains',
          name: 'Braised Beef Bowl',
          description: 'Slow-cooked beef, roasted carrots, and herbed rice with jus.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '520',
          variants: [
            { name: 'Regular', price: '520', is_default: true, placement_order: 0 },
            { name: 'Large', price: '720', is_default: false, placement_order: 1 },
          ],
          placement_order: 2,
          is_available: true,
          is_featured: false,
        },
        {
          id: null,
          category_id: null,
          category_key: 'starters',
          name: 'Crispy Calamari',
          description: 'Lightly fried squid rings with lemon aioli and herbs.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1625944524160-169d0ddf4311?auto=format&fit=crop&w=800&q=80',
          badge: 'Chef Pick',
          price: '360',
          variants: [
            { name: 'Solo', price: '360', is_default: true, placement_order: 0 },
            { name: 'For sharing', price: '620', is_default: false, placement_order: 1 },
          ],
          placement_order: 3,
          is_available: true,
          is_featured: true,
        },
        {
          id: null,
          category_id: null,
          category_key: 'mains',
          name: 'Herb Butter Salmon',
          description: 'Pan-seared salmon with lemon herb butter and seasonal greens.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '690',
          variants: [
            { name: 'Regular', price: '690', is_default: true, placement_order: 0 },
            { name: 'Set meal', price: '820', is_default: false, placement_order: 1 },
          ],
          placement_order: 4,
          is_available: true,
          is_featured: false,
        },
        {
          id: null,
          category_id: null,
          category_key: 'starters',
          name: 'Roasted Pumpkin Soup',
          description: 'Velvety pumpkin soup finished with cream and toasted seeds.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '220',
          variants: [
            { name: 'Cup', price: '220', is_default: true, placement_order: 0 },
            { name: 'Bowl', price: '320', is_default: false, placement_order: 1 },
          ],
          placement_order: 5,
          is_available: true,
          is_featured: false,
        },
        {
          id: null,
          category_id: null,
          category_key: 'mains',
          name: 'Truffle Mushroom Pasta',
          description: 'Creamy pasta with roasted mushrooms, parmesan, and truffle oil.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
          badge: 'House Favorite',
          price: '540',
          variants: [
            { name: 'Regular', price: '540', is_default: true, placement_order: 0 },
            { name: 'For sharing', price: '780', is_default: false, placement_order: 1 },
          ],
          placement_order: 6,
          is_available: true,
          is_featured: true,
        },
      ],
    };
  }

  if (starterId === 'food-stall') {
    return {
      ...base,
      name: starterName,
      description: 'A quick, punchy digital menu for compact offerings, QR access, and easy ordering decisions.',
      categories: [
        {
          id: null,
          client_key: 'rice-bowls',
          name: 'Rice Bowls',
          description: 'Fast favorites for lunch and dinner.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
          placement_order: 0,
          is_visible: true,
        },
        {
          id: null,
          client_key: 'extras',
          name: 'Extras',
          description: 'Sides and add-ons.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1625944525533-473f1c35fd3f?auto=format&fit=crop&w=800&q=80',
          placement_order: 1,
          is_visible: true,
        },
      ],
      items: [
        {
          id: null,
          category_id: null,
          category_key: 'rice-bowls',
          name: 'Chicken Katsu Bowl',
          description: 'Crispy chicken, rice, and house sauce.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80',
          badge: 'Popular',
          price: '180',
          variants: [
            { name: 'Solo', price: '180', is_default: true, placement_order: 0 },
            { name: 'Double rice', price: '210', is_default: false, placement_order: 1 },
          ],
          placement_order: 0,
          is_available: true,
          is_featured: true,
        },
        {
          id: null,
          category_id: null,
          category_key: 'extras',
          name: 'Loaded Fries',
          description: 'Crispy fries with cheese sauce, scallions, and spicy mayo.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '120',
          variants: [
            { name: 'Regular', price: '120', is_default: true, placement_order: 0 },
            { name: 'Large', price: '165', is_default: false, placement_order: 1 },
          ],
          placement_order: 1,
          is_available: true,
          is_featured: false,
        },
        {
          id: null,
          category_id: null,
          category_key: 'rice-bowls',
          name: 'Spicy Sisig Rice',
          description: 'Sizzling chopped pork, calamansi, chili, and garlic rice.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
          badge: 'Best Seller',
          price: '165',
          variants: [
            { name: 'Solo', price: '165', is_default: true, placement_order: 0 },
            { name: 'Egg topping', price: '190', is_default: false, placement_order: 1 },
          ],
          placement_order: 2,
          is_available: true,
          is_featured: true,
        },
        {
          id: null,
          category_id: null,
          category_key: 'extras',
          name: 'Pork Siomai',
          description: 'Steamed pork siomai with chili garlic and calamansi soy.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
          badge: 'House Favorite',
          price: '75',
          variants: [
            { name: '4 pcs', price: '75', is_default: true, placement_order: 0 },
            { name: '8 pcs', price: '140', is_default: false, placement_order: 1 },
          ],
          placement_order: 3,
          is_available: true,
          is_featured: true,
        },
        {
          id: null,
          category_id: null,
          category_key: 'rice-bowls',
          name: 'Beef Pares Bowl',
          description: 'Tender beef pares, pickled vegetables, and garlic rice.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '195',
          variants: [
            { name: 'Solo', price: '195', is_default: true, placement_order: 0 },
            { name: 'With siomai', price: '235', is_default: false, placement_order: 1 },
          ],
          placement_order: 4,
          is_available: true,
          is_featured: false,
        },
        {
          id: null,
          category_id: null,
          category_key: 'extras',
          name: 'Shanghai Lumpia',
          description: 'Crunchy spring rolls with sweet chili dip.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '95',
          variants: [
            { name: '6 pcs', price: '95', is_default: true, placement_order: 0 },
            { name: '12 pcs', price: '180', is_default: false, placement_order: 1 },
          ],
          placement_order: 5,
          is_available: true,
          is_featured: false,
        },
        {
          id: null,
          category_id: null,
          category_key: 'rice-bowls',
          name: 'Tapa Garlic Rice',
          description: 'Sweet-savory tapa strips over garlic rice with egg.',
          image: null,
          image_url:
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
          badge: null,
          price: '185',
          variants: [
            { name: 'Solo', price: '185', is_default: true, placement_order: 0 },
            { name: 'With siomai', price: '225', is_default: false, placement_order: 1 },
          ],
          placement_order: 6,
          is_available: true,
          is_featured: false,
        },
      ],
    };
  }

  return base;
}

