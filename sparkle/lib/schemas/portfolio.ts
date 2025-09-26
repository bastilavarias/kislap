import { z } from 'zod';

const socialLinkSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string(),
});

const workExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const educationSchema = z.object({
  degree: z.string(),
  school: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const PortfolioSchema = z.object({
  name: z.string(),
  location: z.string(),
  introduction: z.string(),
  email: z.string().email(),
  phone: z.string(),
  about: z.string(),
  socialLinks: z.array(socialLinkSchema),
  workExperiences: z.array(workExperienceSchema),
  educations: z.array(educationSchema),
  skills: z.array(z.string()),
});

export type PortfolioFormValues = z.infer<typeof PortfolioSchema>;
