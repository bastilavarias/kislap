import { z } from 'zod';

export const linktreeFormSchema = z.object({
  display_name: z.string().min(1, 'Display name is required.'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters.').optional(),
  avatar: z.any().optional(), // File object for upload
  avatar_url: z.string().optional(), // URL of existing avatar
  links: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, 'Link title is required.'),
      url: z.string().url('Must be a valid URL.').min(1, 'Link URL is required.'),
      description: z.string().optional(),
      image: z.any().optional(),
      image_url: z.string().optional(),
    })
  ).default([]),
  layout_name: z.string().default('linktree-default'),
});

export type LinktreeFormValues = z.infer<typeof linktreeFormSchema>;
