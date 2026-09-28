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
  'A creator-focused Kislap Page for videos, socials, community links, and current projects.',
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
  email,
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
  'Creator, storyteller, and internet tinkerer.',
  'Videos, experiments, useful links, and the things I am currently building.',
  'juan.delacruz@example.com',
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
  tagline = 'Creator, storyteller, and internet tinkerer.',
  about = 'Videos, experiments, useful links, and the things I am currently building.',
  email = 'juan.delacruz@example.com',
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
  'NEW VIDEO EVERY WEEK - BUILDING THINGS IN PUBLIC',
  NULL,
  NULL,
  NULL,
  'See what I am building',
  NULL,
  JSON_OBJECT('width', 'full', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NULL,
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  1,
  'link',
  'Watch the latest video',
  'https://www.youtube.com/',
  'Tech, software, creator workflow, and internet experiments.',
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
  'Quick explainers, opinions, and things worth sharing.',
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
  'promo',
  'Building Kislap',
  'https://kislap.app',
  'A customizable personal Page for everything you do online.',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'Open the project',
  NULL,
  JSON_OBJECT('width', 'full', 'align', 'left'),
  JSON_OBJECT('variant', 'highlight', 'padding', 'normal'),
  'linear-gradient(135deg, #fff3a6 0%, #ffd1d1 100%)',
  NOW(),
  NOW()
),
(
  @creator_linktree_id,
  4,
  'quote',
  '',
  '',
  NULL,
  NULL,
  NULL,
  'Make the page feel like your corner of the internet, not a directory.',
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
  5,
  'link',
  'Work with me',
  'mailto:juan.delacruz@example.com',
  'Collaborations, speaking, and creative projects.',
  'mail',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  JSON_OBJECT('width', 'full', 'align', 'left'),
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
  'A developer Kislap Page combining projects, technical skills, experience, and contact links.',
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
  email,
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
  'I build web products end-to-end, from product decisions and UI systems to APIs, infrastructure, and deployment.',
  'juan.delacruz@example.com',
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
  about = 'I build web products end-to-end, from product decisions and UI systems to APIs, infrastructure, and deployment.',
  email = 'juan.delacruz@example.com',
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
  0,
  'text',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('heading', 'About', 'body', 'I build full-stack web products with a focus on clear interfaces, maintainable systems, and useful automation.'),
  JSON_OBJECT('width', 'two-thirds', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  1,
  'skills',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('heading', 'Stack', 'items', 'TypeScript, Next.js, React, Go, MySQL, Docker'),
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'highlight', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  2,
  'project',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('title', 'Kislap', 'description', 'A block-based personal Page builder for creators and professionals.', 'url', 'https://kislap.app', 'technologies', 'Next.js, Go, MySQL'),
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
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
  JSON_OBJECT('title', 'Pulseboard', 'description', 'A compact operations dashboard for tracking queues, incidents, and recurring work.', 'url', 'https://example.com/pulseboard', 'technologies', 'React, Go, Recharts'),
  JSON_OBJECT('width', 'half', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  4,
  'experience',
  '',
  '',
  NULL,
  NULL,
  JSON_OBJECT('role', 'Software Developer', 'company', 'Product Team', 'start', '2023', 'end', 'Present', 'description', 'Building production web applications, internal systems, and integrations.'),
  JSON_OBJECT('width', 'full', 'align', 'left'),
  JSON_OBJECT('variant', 'card', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  5,
  'link',
  'GitHub',
  'https://github.com/',
  'Code, experiments, and open-source work.',
  'github',
  NULL,
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  6,
  'link',
  'LinkedIn',
  'https://www.linkedin.com/',
  'Professional profile and experience.',
  NULL,
  NULL,
  JSON_OBJECT('width', 'third', 'align', 'left'),
  JSON_OBJECT('variant', 'default', 'padding', 'normal'),
  NOW(),
  NOW()
),
(
  @developer_linktree_id,
  7,
  'link',
  'Email me',
  'mailto:juan.delacruz@example.com',
  'For work, collaboration, or consulting.',
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
  'A service-focused Kislap Page for freelance and VA work, proof, services, and booking.',
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
  email,
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
  'A service-focused page for operations support, selected work, proof, and one clear contact path.',
  'juan.delacruz@example.com',
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
  about = 'A service-focused page for operations support, selected work, proof, and one clear contact path.',
  email = 'juan.delacruz@example.com',
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
  JSON_OBJECT('heading', 'How I can help', 'body', 'Inbox management, calendar coordination, research, customer support, and lightweight operations.'),
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
  JSON_OBJECT('heading', 'Services', 'items', 'Admin Support, Calendar, Research, Customer Support, Canva, Notion'),
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
  JSON_OBJECT('title', 'Operations cleanup', 'description', 'Organized a growing client workspace, recurring tasks, and weekly reporting into one simple system.', 'technologies', 'Notion, Google Workspace, Slack'),
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
  JSON_OBJECT('title', 'Support workflow', 'description', 'Created reusable responses, escalation rules, and a cleaner support tracking flow.', 'technologies', 'Gmail, Sheets, Helpdesk'),
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
  'Reliable, organized, and easy to work with.',
  'Sample client',
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
  'https://example.com/book',
  'Tell me what is taking too much time off your plate.',
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
