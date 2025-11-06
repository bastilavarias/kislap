import { z } from 'zod';

const isISODate = (val: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
  const date = new Date(val);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(val);
};

export const AppointmentSchema = z.object({
  user_id: z.number().int().positive().optional(),
  project_id: z.number().int().positive().optional,
  name: z.string(),
  email: z.email({ pattern: z.regexes.unicodeEmail }),
  contact_number: z.string(),
  message: z.string().optional(),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine(isISODate, {
      message: 'Invalid date format. Expected YYYY-MM-DD.',
    })
    .optional(),
  time_from: z.string().time('Invalid start time format. Expected HH:MM or HH:MM:SS').optional(),
  time_to: z.string().time('Invalid end time format. Expected HH:MM or HH:MM:SS').optional(),
});

export type AppointmentFormValues = z.infer<typeof AppointmentSchema>;

export const AppointmentValidationSchema = AppointmentSchema.superRefine((data, ctx) => {
  const { date, time_from, time_to } = data;

  if (time_from && time_to) {
    const startDateTime = new Date(`${date}T${time_from}`);
    const endDateTime = new Date(`${date}T${time_to}`);

    if (startDateTime >= endDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['time_to'],
      });
    }
  }
});
