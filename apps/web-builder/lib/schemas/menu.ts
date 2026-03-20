import { z } from 'zod';
import { createDefaultBusinessHours, createDefaultSocialLinks } from '../menu-defaults';

export const menuCategorySchema = z.object({
  id: z.number().optional().nullable(),
  client_key: z.string().min(1),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().nullable(),
  image: z.any().optional().nullable(),
  image_url: z.string().optional().nullable(),
  placement_order: z.number().default(0),
  is_visible: z.boolean().default(true),
});

export const menuItemSchema = z.object({
  id: z.number().optional().nullable(),
  category_id: z.number().optional().nullable(),
  category_key: z.string().optional().nullable(),
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional().nullable(),
  image: z.any().optional().nullable(),
  image_url: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  price: z.string().min(1, 'Price is required'),
  placement_order: z.number().default(0),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export const menuFormSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().optional().nullable(),
  logo: z.any().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  cover_image: z.any().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  website_url: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  google_maps_url: z.string().optional().nullable(),
  currency: z.string().default('PHP'),
  search_enabled: z.boolean().default(true),
  hours_enabled: z.boolean().default(false),
  business_hours: z
    .array(
      z.object({
        day: z.string(),
        open: z.string(),
        close: z.string(),
        closed: z.boolean().default(false),
      })
    )
    .default(createDefaultBusinessHours()),
  social_links: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().optional().nullable(),
      })
    )
    .default(createDefaultSocialLinks()),
  layout_name: z.string().default('menu-default'),
  qr_settings: z.object({
    foreground_color: z.string().default('#111111'),
    background_color: z.string().default('#ffffff'),
    show_logo: z.boolean().default(false),
  }),
  categories: z.array(menuCategorySchema).default([]),
  items: z.array(menuItemSchema).default([]),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;
