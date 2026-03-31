import { z } from 'zod';

export const AppointmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  contact_number: z.string().optional().or(z.literal('')),
  message: z.string().optional().or(z.literal('')),
});

export type AppointmentFormValues = z.infer<typeof AppointmentSchema>;
