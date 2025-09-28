import { z } from 'zod';

export const PortfolioSchema = z.object({
  name: z.string().optional(),
  introduction: z.string().optional(),
  about: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),

  workExperiences: z
    .array(
      z.object({
        company: z.string().optional(),
        role: z.string().optional(),
        location: z.string().optional(),
        startDate: z.string().optional(), // or z.coerce.date().optional() if string from API
        endDate: z.string().optional(),
        about: z.string().optional(),
      })
    )
    .optional(),

  education: z
    .array(
      z.object({
        school: z.string().optional(),
        level: z.string().optional(),
        degree: z.string().optional(),
        location: z.string().optional(),
        yearStart: z.string().optional(),
        yearEnd: z.string().optional(),
        about: z.string().optional(),
      })
    )
    .optional(),

  showcases: z
    .array(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        role: z.string().optional(),
        technologies: z
          .array(
            z.object({
              name: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),

  skills: z
    .array(
      z.object({
        name: z.string().optional(),
      })
    )
    .optional(),
});

export type PortfolioFormValues = z.infer<typeof PortfolioSchema>;
