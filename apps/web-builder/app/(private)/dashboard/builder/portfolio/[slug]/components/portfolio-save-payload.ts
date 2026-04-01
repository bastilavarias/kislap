import { PortfolioFormValues } from '@/lib/schemas/portfolio';

interface BuildPortfolioSavePayloadContext {
  portfolioID?: number | null;
  projectID?: number;
  userID?: number;
  theme?: Record<string, unknown>;
  layout: string;
}

export function buildPortfolioSaveFormData(
  values: PortfolioFormValues,
  context: BuildPortfolioSavePayloadContext
) {
  const payload = {
    portfolio_id: context.portfolioID,
    project_id: context.projectID,
    user_id: context.userID,
    name: values.name || '',
    job_title: values.job_title || '',
    avatar_url: values.avatar ? null : values.avatar_url || null,
    resume_url: values.resume ? null : values.resume_url || null,
    location: values.location || '',
    introduction: values.introduction || '',
    about: values.about || '',
    email: values.email || '',
    phone: values.phone || '',
    website: values.website || '',
    github: values.github || '',
    linkedin: values.linkedin || '',
    twitter: values.twitter || '',
    theme: { ...(context.theme || {}) },
    layout_name: context.layout,
    work_experiences: (values.work_experiences || []).map((workExp, index) => ({
      ...workExp,
      placement_order: index,
    })),
    education: (values.education || []).map((education, index) => ({
      ...education,
      placement_order: index,
    })),
    showcases: (values.showcases || []).map((showcase, index) => ({
      ...showcase,
      placement_order: index,
    })),
    skills: values.skills || [],
  };

  const formData = new FormData();
  if (values.avatar instanceof File) {
    formData.append('avatar', values.avatar);
  }
  if (values.resume instanceof File) {
    formData.append('resume', values.resume);
  }

  formData.append('json_body', JSON.stringify(payload));

  return formData;
}
