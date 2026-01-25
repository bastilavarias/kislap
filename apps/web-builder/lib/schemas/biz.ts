import { z } from 'zod';

const fileSchema = z.any().optional().nullable();

export const BizSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  logo: fileSchema,
  logo_url: z.string().optional().nullable(),
  hero_title: z.string().optional().nullable(),
  hero_description: z.string().optional().nullable(),
  hero_image: fileSchema,
  hero_image_url: z.string().optional().nullable(),
  about_image: fileSchema,
  about_image_url: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  map_link: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
  operation_hours: z.string().optional().nullable(),
  services_enabled: z.boolean().default(false),
  products_enabled: z.boolean().default(false),
  booking_enabled: z.boolean().default(false),
  ordering_enabled: z.boolean().default(false),
  layout_name: z.string().optional().default('default'),

  gallery_images: z
    .array(
      z.object({
        id: z.coerce.number().optional().nullable(),
        image: fileSchema,
        image_url: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  faqs: z
    .array(
      z.object({
        id: z.coerce.number().optional().nullable(),
        question: z.string().min(1, 'Question is required'),
        answer: z.string().min(1, 'Answer is required'),
      })
    )
    .optional()
    .nullable(),

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
        image: fileSchema,
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
        category: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        price: z.coerce.number().min(0).default(0),
        stock: z.coerce.number().int().min(0).default(0),
        is_active: z.boolean().default(true),
        image: fileSchema,
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
        avatar: fileSchema,
        avatar_url: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
});

export type BizFormValues = z.infer<typeof BizSchema>;
