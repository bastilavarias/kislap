import { z } from 'zod';

export const AppointmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email(),
  contact_number: z.string(),
  message: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof AppointmentSchema>;
