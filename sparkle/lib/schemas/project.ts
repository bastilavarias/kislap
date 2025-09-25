import { z } from 'zod';

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sub_domain: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed')
    .min(3, 'Domain must be at least 3 chars')
    .max(63, 'Domain too long'),
  type: z.string().min(1, 'Type is required'),
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;
