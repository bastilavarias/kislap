import { z } from 'zod';

export const PortfolioSchema = z.object({
  name: z.string(),
  introduction: z.string(),
  about: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().url().nullable(),
  github: z.string().url().nullable(),
  linkedin: z.string().nullable(),
  twitter: z.string().nullable(),

  workExperiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string(),
      startDate: z.date().nullable(), // keep string if from API (ISO), or use z.coerce.date() if you want real Date
      endDate: z.date().nullable(),
      about: z.string(),
    })
  ),

  education: z.array(
    z.object({
      school: z.string(),
      level: z.string().nullable(),
      degree: z.string().nullable(),
      location: z.string().nullable(),
      yearStart: z.date().nullable(),
      yearEnd: z.date().nullable(),
      about: z.string().nullable(),
    })
  ),

  showcases: z.array(
    z.object({
      name: z.string(),
      description: z.string().nullable(),
      role: z.string().nullable(),
      technologies: z.array(
        z.object({
          name: z.string(),
        })
      ),
    })
  ),

  skills: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

export type PortfolioFormValues = z.infer<typeof PortfolioSchema>;
