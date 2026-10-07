START TRANSACTION;

INSERT INTO users (
  first_name,
  last_name,
  email,
  password,
  role,
  is_banned,
  newsletter,
  github,
  google,
  created_at,
  updated_at
)
VALUES (
  'Juan',
  'Delacruz',
  'juan.delacruz.demo@kislap.app',
  'DISABLED_DEMO_ACCOUNT',
  'default',
  0,
  0,
  0,
  0,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  role = VALUES(role),
  is_banned = 0,
  updated_at = NOW();

SET @juan_user_id = LAST_INSERT_ID();
SET @theme_object = (
  SELECT theme_object
  FROM linktrees
  WHERE theme_object IS NOT NULL
  ORDER BY id ASC
  LIMIT 1
);

INSERT INTO projects (
  user_id,
  name,
  description,
  slug,
  sub_domain,
  type,
  published,
  created_at,
  updated_at
)
VALUES (
  @juan_user_id,
  'Juan Delacruz - Creator',
  'A creator Kislap Page filled with videos, socials, notes, creator tools, community, and collaboration links.',
  'juan-delacruz-creator',
  'juandelacruz',
  'linktree',
  1,
  NOW() - INTERVAL 2 MINUTE,
  NOW()
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  user_id = VALUES(user_id),
  name = VALUES(name),
  description = VALUES(description),
  sub_domain = VALUES(sub_domain),
  type = 'linktree',
  published = 1,
  deleted_at = NULL,
  updated_at = NOW();

SET @creator_project_id = LAST_INSERT_ID();
SET @creator_linktree_id = (
  SELECT id
  FROM linktrees
  WHERE project_id = @creator_project_id AND deleted_at IS NULL
  ORDER BY id ASC
  LIMIT 1
);

INSERT INTO linktrees (
  project_id,
  user_id,
  name,
  tagline,
  about,
  phone,
  email,
  logo_url,
  layout_name,
  composition_layout,
  background_style,
  theme_name,
  theme_object,
  created_at,
  updated_at
)
SELECT
  @creator_project_id,
  @juan_user_id,
  'Juan Delacruz',
  'Tech creator documenting software, tools, and internet culture.',
  'I make practical videos and short explainers about technology, creator workflows, useful tools, and the projects I am building along the way.',
  '+63 917 555 0247',
  'juan.delacruz@example.com',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'linktree-default',
  'creator',
  'grid',
  'default',
  @theme_object,
  NOW(),
  NOW()
WHERE @creator_linktree_id IS NULL;

SET @creator_linktree_id = COALESCE(@creator_linktree_id, LAST_INSERT_ID());

UPDATE linktrees
SET
  user_id = @juan_user_id,
  name = 'Juan Delacruz',
  tagline = 'Tech creator documenting software, tools, and internet culture.',
  about = 'I make practical videos and short explainers about technology, creator workflows, useful tools, and the projects I am building along the way.',
  phone = '+63 917 555 0247',
  email = 'juan.delacruz@example.com',
  logo_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  layout_name = 'linktree-default',
  composition_layout = 'creator',
  background_style = 'grid',
  theme_name = 'default',
  theme_object = COALESCE(@theme_object, theme_object),
  deleted_at = NULL,
  updated_at = NOW()
WHERE id = @creator_linktree_id;

DELETE FROM linktree_links WHERE linktree_id = @creator_linktree_id;

INSERT INTO linktree_links (
  linktree_id,
  placement_order,
  type,
  title,
  url,
  description,
  icon_key,
  banner_text,
  quote_text,
  quote_author,
  support_note,
  cta_label,
  content_json,
  layout_json,
  style_json,
  accent_color,
  created_at,
  updated_at
)
VALUES
(
  @creator_linktree_id,
  0,
  'banner',
  '',
  'https://kislap.app',
  NULL,
  NULL,
  'NEW VIDEO EVERY WEEK - TECH, TOOLS, AND THINGS I AM BUILDING',
  NULL,
  NULL,
  NULL,
  'See what I am building',
  NULL,
  JSON_OBJECT('width', 'full', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  '#fff3a6',
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  1,
  'link',
  'Watch the latest video',
  'https://www.youtube.com/',
  'Long-form videos about software, useful tech, creator workflow, and internet experiments.',
  'video',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  2,
  'link',
  'Follow the short-form feed',
  'https://www.tiktok.com/',
  'Quick explainers, tech news, opinions, and useful finds.',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  3,
  'link',
  'Read the studio notes',
  'https://kislap.app',
  'Notes on content, software projects, research, and what I learned while building in public.',
  'mail',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  4,
  'link',
  'Creator toolkit',
  'https://kislap.app',
  'The apps, gear, workflows, and small utilities I keep coming back to.',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'highlight', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  5,
  'promo',
  'Building Kislap',
  'https://kislap.app',
  'One customizable Page for your links, work, projects, promos, and online identity.',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'Open Kislap',
  NULL,
  JSON_OBJECT('width', 'full', 'align', 'left'),
  JSON_OBJECT('variant', 'highlight', 'padding', 'normal'),
  'linear-gradient(135deg, #fff3a6 0%, #ffd1d1 100%)',
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  6,
  'quote',
  '',
  '',
  NULL,
  NULL,
  NULL,
  'Make your page feel like your corner of the internet, not a directory.',
  'Juan Delacruz',
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'full', 'align', 'center'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  7,
  'link',
  'Work with me',
  'mailto:juan.delacruz@example.com',
  'Brand collaborations, speaking, creator partnerships, and interesting web projects.',
  'mail',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  8,
  'link',
  'Join the community',
  'https://kislap.app',
  'A place for creator notes, resources, project updates, and behind-the-scenes experiments.',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
);

INSERT INTO projects (
  user_id,
  name,
  description,
  slug,
  sub_domain,
  type,
  published,
  created_at,
  updated_at
)
VALUES (
  @juan_user_id,
  'Juan Delacruz - Developer',
  'A developer Kislap Page with a complete bio, technical stack, selected projects, work experience, and contact links.',
  'juan-delacruz-developer',
  'juan-dev',
  'linktree',
  1,
  NOW() - INTERVAL 1 MINUTE,
  NOW()
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  user_id = VALUES(user_id),
  name = VALUES(name),
  description = VALUES(description),
  sub_domain = VALUES(sub_domain),
  type = 'linktree',
  published = 1,
  deleted_at = NULL,
  updated_at = NOW();

SET @developer_project_id = LAST_INSERT_ID();
SET @developer_linktree_id = (
  SELECT id
  FROM linktrees
  WHERE project_id = @developer_project_id AND deleted_at IS NULL
  ORDER BY id ASC
  LIMIT 1
);

INSERT INTO linktrees (
  project_id,
  user_id,
  name,
  tagline,
  about,
  phone,
  email,
  logo_url,
  layout_name,
  composition_layout,
  background_style,
  theme_name,
  theme_object,
  created_at,
  updated_at
)
SELECT
  @developer_project_id,
  @juan_user_id,
  'Juan Delacruz',
  'Software developer building useful products and systems.',
  'Based in Manila, I build web products end-to-end: product decisions, interfaces, APIs, infrastructure, deployment, and the automation that keeps everything running.',
  '+63 917 555 0247',
  'juan.delacruz@example.com',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'linktree-default',
  'portfolio',
  'grid',
  'default',
  @theme_object,
  NOW(),
  NOW()
WHERE @developer_linktree_id IS NULL;

SET @developer_linktree_id = COALESCE(@developer_linktree_id, LAST_INSERT_ID());

UPDATE linktrees
SET
  user_id = @juan_user_id,
  name = 'Juan Delacruz',
  tagline = 'Software developer building useful products and systems.',
  about = 'Based in Manila, I build web products end-to-end: product decisions, interfaces, APIs, infrastructure, deployment, and the automation that keeps everything running.',
  phone = '+63 917 555 0247',
  email = 'juan.delacruz@example.com',
  logo_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  layout_name = 'linktree-default',
  composition_layout = 'portfolio',
  background_style = 'grid',
  theme_name = 'default',
  theme_object = COALESCE(@theme_object, theme_object),
  deleted_at = NULL,
  updated_at = NOW()
WHERE id = @developer_linktree_id;

DELETE FROM linktree_links WHERE linktree_id = @developer_linktree_id;

INSERT INTO linktree_links (
  linktree_id,
  placement_order,
  type,
  title,
  url,
  banner_text,
  quote_text,
  quote_author,
  accent_color,
  layout_json,
  style_json,
  created_at,
  updated_at
)
VALUES
(
  @developer_linktree_id,
  0,
  'banner',
  '',
  '',
  'CURRENTLY BUILDING / SHIPPING WEB PRODUCTS / AUTOMATING THE BORING STUFF',
  NULL,
  NULL,
  '#111111',
  JSON_OBJECT('width', 'full', 'align', 'center'),
  JSON_OBJECT('variant', 'default', 'padding', 'compact'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  6,
  'quote',
  '',
  '',
  NULL,
  'Good software should feel obvious to the user and boring to operate.',
  'Juan Delacruz',
  '#ff3132',
  JSON_OBJECT('width', 'full', 'align', 'center'),
  JSON_OBJECT('variant', 'default', 'padding', 'spacious'),
  NOW(),
  NOW()
);

INSERT INTO linktree_links (
  linktree_id,
  placement_order,
  type,
  title,
  url,
  description,
  icon_key,
  content_json,
  layout_json,
  style_json,
  created_at,
  updated_at
)
VALUES
(
  @developer_linktree_id,
  1,
  'text',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('heading', 'I build the whole thing.', 'body', 'Interfaces people understand. APIs that stay boring. Deployments that do not need rituals. I like owning the path from product idea to a working system in production.'),
  JSON_OBJECT('width', 'two-thirds', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  2,
  'skills',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('heading', 'Daily stack', 'items', 'TypeScript, Next.js, React, Go, MySQL, Docker, Cloudflare, Git'),
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'highlight', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  3,
  'project',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('title', 'Kislap', 'description', 'A focused publishing platform that turns structured forms into fast, personal public pages without making people become web designers.', 'url', 'https://kislap.app', 'image_url', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', 'technologies', 'Next.js, Go, MySQL, Cloudflare'),
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  4,
  'project',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('title', 'QueueWatch', 'description', 'An operations dashboard concept that turns noisy background jobs, incidents, and recurring work into one calm surface for operators.', 'image_url', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', 'technologies', 'React, Go, Recharts'),
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  5,
  'experience',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('role', 'Software Developer', 'company', 'Independent & Product Teams', 'start', '2021', 'end', 'Now', 'description', 'Shipping customer-facing products, internal tools, APIs, integrations, and deployment workflows. Usually somewhere between product thinking, code, and keeping production healthy.'),
  JSON_OBJECT('width', 'full', 'align', 'left'),
  JSON_OBJECT('variant', 'card', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  7,
  'link',
  'GitHub',
  'https://github.com/',
  'Code, experiments, open-source work, and things I broke before they worked.',
  'github',
  NULL,
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  8,
  'link',
  'LinkedIn',
  'https://www.linkedin.com/',
  'Career history, work context, and the more serious version of this page.',
  NULL,
  NULL,
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  9,
  'link',
  'Email me',
  'mailto:juan.delacruz@example.com',
  'For product work, collaborations, consulting, or an interesting problem.',
  'mail',
  NULL,
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
);

INSERT INTO projects (
  user_id,
  name,
  description,
  slug,
  sub_domain,
  type,
  published,
  created_at,
  updated_at
)
VALUES (
  @juan_user_id,
  'Juan Delacruz - Freelancer',
  'A complete freelance and virtual-assistant Kislap Page covering services, tools, sample client work, social proof, and a clear contact path.',
  'juan-delacruz-freelancer',
  'juan-work',
  'linktree',
  1,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  user_id = VALUES(user_id),
  name = VALUES(name),
  description = VALUES(description),
  sub_domain = VALUES(sub_domain),
  type = 'linktree',
  published = 1,
  deleted_at = NULL,
  updated_at = NOW();

SET @freelancer_project_id = LAST_INSERT_ID();
SET @freelancer_linktree_id = (
  SELECT id
  FROM linktrees
  WHERE project_id = @freelancer_project_id AND deleted_at IS NULL
  ORDER BY id ASC
  LIMIT 1
);

INSERT INTO linktrees (
  project_id,
  user_id,
  name,
  tagline,
  about,
  phone,
  email,
  logo_url,
  layout_name,
  composition_layout,
  background_style,
  theme_name,
  theme_object,
  created_at,
  updated_at
)
SELECT
  @freelancer_project_id,
  @juan_user_id,
  'Juan Delacruz',
  'Virtual assistant helping founders stay organized and move faster.',
  'I support small teams with inboxes, calendars, research, customer support, documentation, and lightweight operations so founders can spend more time on high-value work.',
  '+63 917 555 0247',
  'juan.delacruz@example.com',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'linktree-default',
  'bento',
  'grid',
  'default',
  @theme_object,
  NOW(),
  NOW()
WHERE @freelancer_linktree_id IS NULL;

SET @freelancer_linktree_id = COALESCE(@freelancer_linktree_id, LAST_INSERT_ID());

UPDATE linktrees
SET
  user_id = @juan_user_id,
  name = 'Juan Delacruz',
  tagline = 'Virtual assistant helping founders stay organized and move faster.',
  about = 'I support small teams with inboxes, calendars, research, customer support, documentation, and lightweight operations so founders can spend more time on high-value work.',
  phone = '+63 917 555 0247',
  email = 'juan.delacruz@example.com',
  logo_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  layout_name = 'linktree-default',
  composition_layout = 'bento',
  background_style = 'grid',
  theme_name = 'default',
  theme_object = COALESCE(@theme_object, theme_object),
  deleted_at = NULL,
  updated_at = NOW()
WHERE id = @freelancer_linktree_id;

DELETE FROM linktree_links WHERE linktree_id = @freelancer_linktree_id;

INSERT INTO linktree_links (
  linktree_id,
  placement_order,
  type,
  title,
  url,
  description,
  quote_text,
  quote_author,
  content_json,
  layout_json,
  style_json,
  created_at,
  updated_at
)
VALUES
(
  @freelancer_linktree_id,
  0,
  'text',
  '',
  '',
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('heading', 'How I can help', 'body', 'Inbox management, calendar coordination, research, customer support, documentation, weekly reporting, and lightweight operations for small remote teams.'),
  JSON_OBJECT('width', 'two-thirds', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @freelancer_linktree_id,
  1,
  'skills',
  '',
  '',
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('heading', 'Services & tools', 'items', 'Admin Support, Calendar, Research, Customer Support, Canva, Notion, Google Workspace, Slack'),
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'highlight', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @freelancer_linktree_id,
  2,
  'project',
  '',
  '',
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('title', 'Operations cleanup', 'description', 'Consolidated scattered tasks, meeting notes, and weekly reporting into one simple workspace with clear owners and recurring routines.', 'technologies', 'Notion, Google Workspace, Slack'),
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @freelancer_linktree_id,
  3,
  'project',
  '',
  '',
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('title', 'Customer support workflow', 'description', 'Created reusable responses, escalation rules, and a lightweight tracker so common questions get handled faster and nothing important gets lost.', 'technologies', 'Gmail, Sheets, Helpdesk'),
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @freelancer_linktree_id,
  4,
  'quote',
  '',
  '',
  NULL,
  'Juan is reliable, organized, and easy to work with. He keeps the small things moving without needing constant follow-up.',
  'Sample startup client',
  NULL,
  JSON_OBJECT('width', 'two-thirds', 'align', 'center'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @freelancer_linktree_id,
  5,
  'link',
  'Book a discovery call',
  'mailto:juan.delacruz@example.com?subject=Discovery%20call',
  'Tell me what is taking too much time off your plate and what kind of support you need.',
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'highlight', 'padding', 'normal'),
  NOW(),
  NOW()
);

COMMIT;

SELECT
  @juan_user_id AS user_id,
  @creator_project_id AS creator_project_id,
  @developer_project_id AS developer_project_id,
  @freelancer_project_id AS freelancer_project_id;
