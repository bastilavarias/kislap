import { z } from 'zod';
import {
  createDefaultBusinessHours,
  createDefaultDisplayPosterSettings,
  createDefaultSocialLinks,
} from '../menu-defaults';

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
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'Variant name is required'),
        price: z.string().min(1, 'Variant price is required'),
        is_default: z.boolean().default(false),
        placement_order: z.number().default(0),
      })
    )
    .default([]),
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
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  google_maps_url: z.string().optional().nullable(),
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
  gallery_images: z
    .array(
      z.object({
        image: z.any().optional().nullable(),
        image_url: z.string().optional().nullable(),
      })
    )
    .default([]),
  layout_name: z.string().default('menu-default'),
  qr_settings: z.object({
    foreground_color: z.string().default('#111111'),
    background_color: z.string().default('#ffffff'),
    show_logo: z.boolean().default(false),
  }),
  display_poster_settings: z.object({
    template: z.enum(['clean']).default('clean'),
    size: z.enum(['a4', 'a5', 'a6']).default('a4'),
    color_mode: z.enum(['light', 'dark']).default('light'),
    headline: z.string().default('Scan to view our menu'),
    subtext: z.string().default('Browse our latest dishes, drinks, and prices on your phone.'),
    footer_note: z.string().default('Updated live for dine-in and takeaway.'),
    show_logo: z.boolean().default(true),
    show_address: z.boolean().default(false),
    show_url: z.boolean().default(true),
  }).default(createDefaultDisplayPosterSettings()),
  display_poster_image_url: z.string().optional().nullable(),
  categories: z.array(menuCategorySchema).default([]),
  items: z.array(menuItemSchema).default([]),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;
