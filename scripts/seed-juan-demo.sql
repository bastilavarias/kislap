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
SET @creator_theme_object = CAST('{"preset":"pastel-dreams","styles":{"light":{"background":"oklch(0.97 0.01 314.78)","foreground":"oklch(0.37 0.03 259.73)","card":"oklch(1.00 0 0)","card-foreground":"oklch(0.37 0.03 259.73)","popover":"oklch(1.00 0 0)","popover-foreground":"oklch(0.37 0.03 259.73)","primary":"oklch(0.71 0.16 293.54)","primary-foreground":"oklch(1.00 0 0)","secondary":"oklch(0.91 0.05 306.09)","secondary-foreground":"oklch(0.45 0.03 256.80)","muted":"oklch(0.95 0.03 307.17)","muted-foreground":"oklch(0.55 0.02 264.36)","accent":"oklch(0.94 0.03 321.94)","accent-foreground":"oklch(0.37 0.03 259.73)","destructive":"oklch(0.81 0.10 19.57)","border":"oklch(0.91 0.05 306.09)","input":"oklch(0.91 0.05 306.09)","ring":"oklch(0.71 0.16 293.54)","chart-1":"oklch(0.71 0.16 293.54)","chart-2":"oklch(0.61 0.22 292.72)","chart-3":"oklch(0.54 0.25 293.01)","chart-4":"oklch(0.49 0.24 292.58)","chart-5":"oklch(0.43 0.21 292.76)","radius":"1.5rem","sidebar":"oklch(0.91 0.05 306.09)","sidebar-foreground":"oklch(0.37 0.03 259.73)","sidebar-primary":"oklch(0.71 0.16 293.54)","sidebar-primary-foreground":"oklch(1.00 0 0)","sidebar-accent":"oklch(0.94 0.03 321.94)","sidebar-accent-foreground":"oklch(0.37 0.03 259.73)","sidebar-border":"oklch(0.91 0.05 306.09)","sidebar-ring":"oklch(0.71 0.16 293.54)","font-sans":"Open Sans, sans-serif","font-serif":"Source Serif 4, serif","font-mono":"IBM Plex Mono, monospace","shadow-color":"hsl(0 0% 0%)","shadow-opacity":"0.08","shadow-blur":"16px","shadow-spread":"-4px","shadow-offset-x":"0px","shadow-offset-y":"8px","letter-spacing":"0em","spacing":"0.25rem"},"dark":{"background":"oklch(0.22 0.01 56.04)","foreground":"oklch(0.93 0.03 272.79)","card":"oklch(0.28 0.03 307.23)","card-foreground":"oklch(0.93 0.03 272.79)","popover":"oklch(0.28 0.03 307.23)","popover-foreground":"oklch(0.93 0.03 272.79)","primary":"oklch(0.79 0.12 295.75)","primary-foreground":"oklch(0.22 0.01 56.04)","secondary":"oklch(0.34 0.04 308.85)","secondary-foreground":"oklch(0.87 0.01 258.34)","muted":"oklch(0.28 0.03 307.23)","muted-foreground":"oklch(0.71 0.02 261.32)","accent":"oklch(0.39 0.05 304.64)","accent-foreground":"oklch(0.87 0.01 258.34)","destructive":"oklch(0.81 0.10 19.57)","border":"oklch(0.34 0.04 308.85)","input":"oklch(0.34 0.04 308.85)","ring":"oklch(0.79 0.12 295.75)","chart-1":"oklch(0.79 0.12 295.75)","chart-2":"oklch(0.71 0.16 293.54)","chart-3":"oklch(0.61 0.22 292.72)","chart-4":"oklch(0.54 0.25 293.01)","chart-5":"oklch(0.49 0.24 292.58)","sidebar":"oklch(0.34 0.04 308.85)","sidebar-foreground":"oklch(0.93 0.03 272.79)","sidebar-primary":"oklch(0.79 0.12 295.75)","sidebar-primary-foreground":"oklch(0.22 0.01 56.04)","sidebar-accent":"oklch(0.39 0.05 304.64)","sidebar-accent-foreground":"oklch(0.87 0.01 258.34)","sidebar-border":"oklch(0.34 0.04 308.85)","sidebar-ring":"oklch(0.79 0.12 295.75)","shadow-color":"hsl(0 0% 0%)","shadow-opacity":"0.1","shadow-blur":"3px","shadow-spread":"0px","shadow-offset-x":"0","shadow-offset-y":"1px","letter-spacing":"0em","spacing":"0.25rem"},"css":{}}}' AS JSON);
SET @developer_theme_object = CAST('{"preset":"vs-code","styles":{"light":{"background":"oklch(0.97 0.02 225.66)","foreground":"oklch(0.15 0.02 269.18)","card":"oklch(0.98 0.01 228.79)","card-foreground":"oklch(0.15 0.02 269.18)","popover":"oklch(0.98 0.01 238.45)","popover-foreground":"oklch(0.15 0.02 269.18)","primary":"oklch(0.71 0.15 239.07)","primary-foreground":"oklch(0.94 0.03 232.39)","secondary":"oklch(0.91 0.03 229.20)","secondary-foreground":"oklch(0.15 0.02 269.18)","muted":"oklch(0.89 0.02 225.69)","muted-foreground":"oklch(0.36 0.03 230.30)","accent":"oklch(0.88 0.02 235.72)","accent-foreground":"oklch(0.34 0.05 229.72)","destructive":"oklch(0.61 0.24 20.96)","border":"oklch(0.82 0.02 240.77)","input":"oklch(0.82 0.02 240.77)","ring":"oklch(0.55 0.10 235.72)","chart-1":"oklch(0.57 0.11 228.97)","chart-2":"oklch(0.45 0.10 270.08)","chart-3":"oklch(0.65 0.15 159.03)","chart-4":"oklch(0.75 0.10 100.01)","chart-5":"oklch(0.55 0.15 299.88)","radius":"0rem","sidebar":"oklch(0.93 0.01 238.46)","sidebar-foreground":"oklch(0.15 0.02 269.18)","sidebar-primary":"oklch(0.57 0.11 228.97)","sidebar-primary-foreground":"oklch(0.99 0.01 203.97)","sidebar-accent":"oklch(0.88 0.02 235.72)","sidebar-accent-foreground":"oklch(0.15 0.02 269.18)","sidebar-border":"oklch(0.82 0.02 240.77)","sidebar-ring":"oklch(0.57 0.11 228.97)","font-sans":"''Source Code Pro'', ''Geist'', ''Geist Fallback'', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, ''Noto Sans'', sans-serif, ''Apple Color Emoji'', ''Segoe UI Emoji'', ''Segoe UI Symbol'', ''Noto Color Emoji''","font-serif":"''Source Serif 4'', ''Geist'', ''Geist Fallback'', ui-serif, Georgia, Cambria, ''Times New Roman'', Times, serif","font-mono":"''Source Code Pro'', ''Geist Mono'', ''Geist Mono Fallback'', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ''Liberation Mono'', ''Courier New'', monospace","shadow-color":"oklch(0.49 0.09 235.45)","shadow-opacity":"0.06","shadow-blur":"2.5px","shadow-spread":"0px","shadow-offset-x":"0px","shadow-offset-y":"1px","letter-spacing":"0em","spacing":"0.25rem"},"dark":{"background":"oklch(0.18 0.02 271.27)","foreground":"oklch(0.90 0.01 238.47)","card":"oklch(0.22 0.02 271.67)","card-foreground":"oklch(0.90 0.01 238.47)","popover":"oklch(0.22 0.02 271.67)","popover-foreground":"oklch(0.90 0.01 238.47)","primary":"oklch(0.71 0.15 239.07)","primary-foreground":"oklch(0.94 0.03 232.39)","secondary":"oklch(0.28 0.03 270.91)","secondary-foreground":"oklch(0.90 0.01 238.47)","muted":"oklch(0.28 0.03 270.91)","muted-foreground":"oklch(0.60 0.03 269.46)","accent":"oklch(0.28 0.03 270.91)","accent-foreground":"oklch(0.90 0.01 238.47)","destructive":"oklch(0.64 0.25 19.69)","border":"oklch(0.90 0.01 238.47 / 15%)","input":"oklch(0.90 0.01 238.47 / 20%)","ring":"oklch(0.66 0.13 227.15)","chart-1":"oklch(0.66 0.13 227.15)","chart-2":"oklch(0.60 0.10 269.83)","chart-3":"oklch(0.70 0.15 159.83)","chart-4":"oklch(0.80 0.10 100.65)","chart-5":"oklch(0.60 0.15 300.14)","sidebar":"oklch(0.22 0.02 271.67)","sidebar-foreground":"oklch(0.90 0.01 238.47)","sidebar-primary":"oklch(0.66 0.13 227.15)","sidebar-primary-foreground":"oklch(0.18 0.02 271.27)","sidebar-accent":"oklch(0.28 0.03 270.91)","sidebar-accent-foreground":"oklch(0.90 0.01 238.47)","sidebar-border":"oklch(0.90 0.01 238.47 / 15%)","sidebar-ring":"oklch(0.66 0.13 227.15)","shadow-color":"oklch(0 0 0)","shadow-opacity":"0.01","shadow-blur":"2px","shadow-spread":"0px","shadow-offset-x":"0px","shadow-offset-y":"1px","letter-spacing":"0em","spacing":"0.25rem"},"css":{}}}' AS JSON);
SET @freelancer_theme_object = CAST('{"preset":"elegant-luxury","styles":{"light":{"background":"oklch(0.98 0.00 56.38)","foreground":"oklch(0.22 0 0)","card":"oklch(0.98 0.00 56.38)","card-foreground":"oklch(0.22 0 0)","popover":"oklch(0.98 0.00 56.38)","popover-foreground":"oklch(0.22 0 0)","primary":"oklch(0.47 0.15 24.94)","primary-foreground":"oklch(1.00 0 0)","secondary":"oklch(0.96 0.04 89.09)","secondary-foreground":"oklch(0.48 0.10 75.12)","muted":"oklch(0.94 0.01 53.44)","muted-foreground":"oklch(0.44 0.01 73.64)","accent":"oklch(0.96 0.06 95.62)","accent-foreground":"oklch(0.40 0.13 25.72)","destructive":"oklch(0.44 0.16 26.90)","border":"oklch(0.94 0.03 80.99)","input":"oklch(0.94 0.03 80.99)","ring":"oklch(0.47 0.15 24.94)","chart-1":"oklch(0.51 0.19 27.52)","chart-2":"oklch(0.47 0.15 24.94)","chart-3":"oklch(0.40 0.13 25.72)","chart-4":"oklch(0.56 0.15 49.00)","chart-5":"oklch(0.47 0.12 46.20)","radius":"0.375rem","sidebar":"oklch(0.94 0.01 53.44)","sidebar-foreground":"oklch(0.22 0 0)","sidebar-primary":"oklch(0.47 0.15 24.94)","sidebar-primary-foreground":"oklch(1.00 0 0)","sidebar-accent":"oklch(0.96 0.06 95.62)","sidebar-accent-foreground":"oklch(0.40 0.13 25.72)","sidebar-border":"oklch(0.94 0.03 80.99)","sidebar-ring":"oklch(0.47 0.15 24.94)","font-sans":"Poppins, sans-serif","font-serif":"Libre Baskerville, serif","font-mono":"IBM Plex Mono, monospace","shadow-color":"hsl(0 63% 18%)","shadow-opacity":"0.12","shadow-blur":"16px","shadow-spread":"-2px","shadow-offset-x":"1px","shadow-offset-y":"1px","letter-spacing":"0em","spacing":"0.25rem"},"dark":{"background":"oklch(0.22 0.01 56.04)","foreground":"oklch(0.97 0.00 106.42)","card":"oklch(0.27 0.01 34.30)","card-foreground":"oklch(0.97 0.00 106.42)","popover":"oklch(0.27 0.01 34.30)","popover-foreground":"oklch(0.97 0.00 106.42)","primary":"oklch(0.51 0.19 27.52)","primary-foreground":"oklch(0.98 0.00 56.38)","secondary":"oklch(0.47 0.12 46.20)","secondary-foreground":"oklch(0.96 0.06 95.62)","muted":"oklch(0.27 0.01 34.30)","muted-foreground":"oklch(0.87 0.00 56.37)","accent":"oklch(0.56 0.15 49.00)","accent-foreground":"oklch(0.96 0.06 95.62)","destructive":"oklch(0.64 0.21 25.33)","border":"oklch(0.37 0.01 67.56)","input":"oklch(0.37 0.01 67.56)","ring":"oklch(0.51 0.19 27.52)","chart-1":"oklch(0.71 0.17 22.22)","chart-2":"oklch(0.64 0.21 25.33)","chart-3":"oklch(0.58 0.22 27.33)","chart-4":"oklch(0.84 0.16 84.43)","chart-5":"oklch(0.77 0.16 70.08)","sidebar":"oklch(0.22 0.01 56.04)","sidebar-foreground":"oklch(0.97 0.00 106.42)","sidebar-primary":"oklch(0.51 0.19 27.52)","sidebar-primary-foreground":"oklch(0.98 0.00 56.38)","sidebar-accent":"oklch(0.56 0.15 49.00)","sidebar-accent-foreground":"oklch(0.96 0.06 95.62)","sidebar-border":"oklch(0.37 0.01 67.56)","sidebar-ring":"oklch(0.51 0.19 27.52)","shadow-color":"hsl(0 0% 0%)","shadow-opacity":"0.1","shadow-blur":"3px","shadow-spread":"0px","shadow-offset-x":"0","shadow-offset-y":"1px","letter-spacing":"0em","spacing":"0.25rem"},"css":{}}}' AS JSON);

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
  'plain',
  'pastel-dreams',
  @creator_theme_object,
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
  background_style = 'plain',
  theme_name = 'pastel-dreams',
  theme_object = @creator_theme_object,
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
  'vs-code',
  @developer_theme_object,
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
  theme_name = 'vs-code',
  theme_object = @developer_theme_object,
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
  '#1e1e1e',
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
  '#007acc',
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
  'plain',
  'elegant-luxury',
  @freelancer_theme_object,
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
  background_style = 'plain',
  theme_name = 'elegant-luxury',
  theme_object = @freelancer_theme_object,
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
