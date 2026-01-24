import { z } from 'zod';

export const BizSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),

  logo: z.string().optional().nullable(),
  hero_image: z.string().optional().nullable(),

  type: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),

  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  map_link: z.string().optional().nullable(),

  domain: z.string().optional().nullable(),
  subdomain: z.string().optional().nullable(),
  website: z.string().optional().nullable(),

  services_enabled: z.boolean().default(false),
  products_enabled: z.boolean().default(false),
  booking_enabled: z.boolean().default(false),
  ordering_enabled: z.boolean().default(false),

  layout_name: z.string().optional().default('default'),

  social_links: z
    .array(
      z.object({
        id: z.coerce.number().optional().nullable(),
        platform: z.string().min(1, 'Platform is required'),
        url: z.string().url('Must be a valid URL'),
      })
    )
    .optional()
    .nullable(),

  services: z
    .array(
      z.object({
        id: z.coerce.number().optional().nullable(),
        name: z.string().min(1, 'Service name is required'),
        description: z.string().optional().nullable(),
        price: z.coerce.number().min(0).default(0),
        duration_minutes: z.coerce.number().min(0).default(0),
        is_featured: z.boolean().default(false),
        image: z.file().optional().nullable(),
        image_url: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  products: z
    .array(
      z.object({
        id: z.coerce.number().optional().nullable(),
        name: z.string().min(1, 'Product name is required'),
        description: z.string().optional().nullable(),
        price: z.coerce.number().min(0).default(0),
        stock: z.coerce.number().int().min(0).default(0),
        is_active: z.boolean().default(true),
        image: z.file().optional().nullable(),
        image_url: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  testimonials: z
    .array(
      z.object({
        id: z.coerce.number().optional().nullable(),
        author: z.string().min(1, 'Author name is required'),
        content: z.string().optional().nullable(),
        rating: z.coerce.number().min(1).max(5).default(5),
      })
    )
    .optional()
    .nullable(),
});

export type BizFormValues = z.infer<typeof BizSchema>;
