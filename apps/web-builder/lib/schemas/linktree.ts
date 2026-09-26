import { z } from 'zod';

const blockLayoutSchema = z.object({
  width: z.enum(['auto', 'full', 'two-thirds', 'half', 'third']).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
});

const blockStyleSchema = z.object({
  variant: z.enum(['default', 'card', 'flat', 'highlight']).optional(),
  padding: z.enum(['compact', 'normal', 'spacious']).optional(),
});

export const linktreeFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Display name is required.'),
  tagline: z.string().max(200, 'Tagline cannot exceed 200 characters.').optional(),
  about: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Must be a valid email.').optional().or(z.literal('')),
  logo: z.any().optional(),
  logo_url: z.string().optional(),
  background_style: z.enum(['plain', 'grid']),
  sections: z
    .array(
      z.object({
        id: z.number().optional(),
        type: z.enum([
          'link',
          'promo',
          'support',
          'quote',
          'banner',
          'text',
          'project',
          'experience',
          'skills',
        ]),
        title: z.string().optional(),
        description: z.string().optional(),
        url: z.string().optional(),
        app_url: z.string().optional(),
        image: z.any().optional(),
        image_url: z.string().optional(),
        icon_key: z.string().optional(),
        accent_color: z.string().optional(),
        quote_text: z.string().optional(),
        quote_author: z.string().optional(),
        banner_text: z.string().optional(),
        support_note: z.string().optional(),
        support_qr_image: z.any().optional(),
        support_qr_image_url: z.string().optional(),
        cta_label: z.string().optional(),
        content: z.record(z.string(), z.unknown()).optional(),
        layout: blockLayoutSchema.optional(),
        style: blockStyleSchema.optional(),
      })
    ),
  layout_name: z.string(),
  composition_layout: z.enum(['classic', 'bento', 'portfolio', 'creator']),
});

export type LinktreeFormValues = z.infer<typeof linktreeFormSchema>;
