import { z } from 'zod';

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const LinktreeSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  logo: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .nullable()
    .optional(),
  logo_url: z.string().nullable().optional(),
  social_links: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        platform: z.string(),
        url: z.string(),
      })
    )
    .optional(),
  layout_name: z.string().optional(),
});

export type LinktreeFormValues = z.infer<typeof LinktreeSchema>;
