import * as z from 'zod';

export const userSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.email(),
  mobile_number: z.string().nullable().optional(),
  newsletter: z.boolean().default(false),
});

export type UserFormValues = z.infer<typeof userSchema>;
