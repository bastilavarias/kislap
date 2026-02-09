import { z } from 'zod';

export const linktreeFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Display name is required.'),
  tagline: z.string().max(200, 'Tagline cannot exceed 200 characters.').optional(),
  // logo: z.any().optional(),
  // logo_url: z.string().optional(),
  links: z
    .array(
      z.object({
        id: z.number().optional(),
        title: z.string().min(1, 'Link title is required.'),
        url: z.string().url('Must be a valid URL.').min(1, 'Link URL is required.'),
        description: z.string().optional(),
        image: z.any().optional(),
        image_url: z.string().optional(),
      })
    )
    .default([]),
  layout_name: z.string().default('linktree-default'),
});

export type LinktreeFormValues = z.infer<typeof linktreeFormSchema>;
