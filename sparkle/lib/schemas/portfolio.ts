import { z } from 'zod';

export const PortfolioSchema = z.object({
  name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  introduction: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),

  work_experiences: z
    .array(
      z.object({
        company: z.string().optional().nullable(),
        role: z.string().optional().nullable(),
        url: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
        startDate: z.string().optional(), // or z.coerce.date().optional() if string from API
        endDate: z.string().optional().nullable(),
        about: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  education: z
    .array(
      z.object({
        school: z.string().optional().nullable(),
        level: z.string().optional().nullable(),
        degree: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
        yearStart: z.string().optional().nullable(),
        yearEnd: z.string().optional().nullable(),
        about: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  showcases: z
    .array(
      z.object({
        name: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        url: z.string().optional().nullable(),
        role: z.string().optional().nullable(),
        technologies: z
          .array(
            z.object({
              name: z.string().optional().nullable(),
            })
          )
          .optional()
          .nullable(),
      })
    )
    .optional()
    .nullable(),

  skills: z
    .array(
      z.object({
        name: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
});

export type PortfolioFormValues = z.infer<typeof PortfolioSchema>;
