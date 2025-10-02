'use client';

import { Form } from '@/app/(private)/projects/builder/portfolio/[slug]/components/form'; // Import the modified Form component
import { FormHeader } from '@/components/form-header';
import { BackButton } from '@/components/back-button';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PortfolioFormValues, PortfolioSchema } from '@/lib/schemas/portfolio';
import { DocumentResume, useDocument } from '@/hooks/api/use-document';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { usePortfolio } from '@/hooks/api/use-portfolio';
import { Project, useProject } from '@/hooks/api/use-project';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/api/use-auth';

function mapResumeToFormValues(resume: DocumentResume): PortfolioFormValues {
  return {
    name: resume.name || '',
    introduction: resume.introduction || '',
    about: resume.about || '',
    email: resume.email || '',
    phone: resume.phone || '',
    website: resume.website || '',
    github: resume.github || '',
    linkedin: resume.linkedin || '',
    twitter: resume.twitter || '',

    workExperiences: (resume.work_experiences || []).map((work: any) => ({
      company: work.company || '',
      role: work.role || '',
      location: work.location || '',
      startDate: work.start_date || null,
      endDate: work.end_date || null,
      about: work.about || '',
    })),

    education: (resume.education || []).map((education: any) => ({
      school: education.school,
      level: education.level || '',
      degree: education.degree || '',
      location: education.location || '',
      yearStart: education.year_start || null,
      yearEnd: education.year_end || null,
      about: education.about || '',
    })),

    showcases: (resume.showcases || []).map((showcase: any) => ({
      name: showcase.name,
      description: showcase.description || '',
      role: showcase.role || '',
      technologies: showcase.technologies || [],
    })),

    skills: (resume.skills || []).map((skill: { name: string }) => ({
      name: skill.name,
    })),
  };
}

export function Wrapper() {
  const [project, setProject] = useState<Project | null>(null);
  const [tab, setTab] = useState('edit');
  const [files, setFiles] = useState<File[] | []>([]);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileProcessingError, setFileProcessingError] = useState('');
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);
  const { create } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { parse } = useDocument();
  const { getBySlug } = useProject();
  const params = useParams();
  const { authUser } = useAuth();

  const formMethods = useForm<PortfolioFormValues>({
    resolver: zodResolver(PortfolioSchema),
    defaultValues: {
      name: '',
      introduction: '',
      about: '',
      email: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
      workExperiences: [],
      education: [],
      showcases: [],
      skills: [],
    },
  });

  const { setValue, watch, control } = formMethods;

  const workFieldArray = useFieldArray({ control, name: 'workExperiences' });
  const educationFieldArray = useFieldArray({ control, name: 'education' });
  const showcaseFieldArray = useFieldArray({ control, name: 'showcases' });
  const skillFieldArray = useFieldArray({ control, name: 'skills' });

  const onAddWorkExperience = () => {
    workFieldArray.append({
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      about: '',
    });
  };

  const onAddEducation = () => {
    educationFieldArray.append({
      school: '',
      degree: '',
      level: '',
      location: '',
      yearStart: '',
      yearEnd: '',
      about: '',
    });
  };

  const onAddShowcase = () => {
    showcaseFieldArray.append({
      name: '',
      description: '',
      role: '',
      technologies: [],
    });
  };

  const onAddTechnologyToShowcase = (showcaseTechnologyIndex: number, name: string) => {
    const currentShowcases = watch('showcases') ?? [];
    const currentTechnologies = currentShowcases[showcaseTechnologyIndex]?.technologies || [];
    setValue(
      `showcases.${showcaseTechnologyIndex}.technologies`,
      [...currentTechnologies, { name }],
      {
        shouldValidate: true,
      }
    );
  };

  const onRemoveTechnologyFromShowcase = (showcaseIndex: number, technologyIndex: number) => {
    const currentShowcases = watch('showcases') ?? [];
    const updatedTechnologies =
      currentShowcases?.[showcaseIndex]?.technologies?.filter((_, i) => i !== technologyIndex) ??
      [];
    setValue(`showcases.${showcaseIndex}.technologies`, updatedTechnologies, {
      shouldValidate: true,
    });
  };

  const onProcessResumeFile = async () => {
    setFileProcessingError('');
    setIsFileProcessing(true);
    const { success, data, message } = await parse(files[0], 'resume');

    if (success && data) {
      const mappedValues = mapResumeToFormValues(data);

      Object.entries(mappedValues).forEach(([key, value]) => {
        setValue(key as keyof PortfolioFormValues, value, { shouldValidate: true });
      });

      setIsFileUploadDialogOpen(false);
      toast('Resume successfully parsed!');
      setIsFileProcessing(false);
      setFiles([]);
      setFileProcessingError('');
      return;
    }
    setFileProcessingError(message);
    setIsFileProcessing(false);
  };

  const onGetProject = async () => {
    const slug = params.slug;
    const view = 'full';

    if (slug == null || typeof slug != 'string') {
      alert('Invalid route.');
      return;
    }

    const { success, data, message } = await getBySlug(slug, view);

    if (success && data) {
      setProject(data);

      if (data.portfolio) {
        console.log(data.portfolio);
        // const mappedValues = mapResumeToFormValues(data.portfolio);

        // Object.entries(mappedValues).forEach(([key, value]) => {
        //   setValue(key as keyof PortfolioFormValues, value, { shouldValidate: true });
        // });
      }
      return;
    }

    alert(message);
  };

  const onSubmit = async (form: PortfolioFormValues) => {
    setError('');
    setLoading(true);
    const { success, data, message } = await create({
      user_id: authUser?.id ?? 1,
      project_id: project?.id,
      ...form,
      theme: {
        ...localThemeSettings?.theme,
      },
    });
    if (success && data) {
      alert('Portfolio successfully saved!');
      return;
    }

    setLoading(false);
    setError(message);
    toast('Someting went wrong!');
  };

  const onError = (errors: any) => {
    console.log('❌ Errors:', errors);
  };

  useEffect(() => {
    onGetProject();
  }, []);

  return (
    <div>
      <BackButton className="mb-5" icon={true}>
        Go back
      </BackButton>
      <div className="flex flex-col gap-10">
        <FormHeader
          tab={tab}
          onTabChange={setTab}
          onSave={() => formMethods.handleSubmit(onSubmit, onError)()}
        />
        <div className="w-full">
          {tab === 'edit' ? (
            <Form
              formMethods={formMethods}
              workFieldArray={workFieldArray}
              educationFieldArray={educationFieldArray}
              showcaseFieldArray={showcaseFieldArray}
              skillFieldArray={skillFieldArray}
              onAddWorkExperience={onAddWorkExperience}
              onAddEducation={onAddEducation}
              onAddShowcase={onAddShowcase}
              onAddTechnologyToShowcase={onAddTechnologyToShowcase}
              onRemoveTechnologyFromShowcase={onRemoveTechnologyFromShowcase}
              files={files}
              setFiles={setFiles}
              isFileUploadDialogOpen={isFileUploadDialogOpen}
              setIsFileUploadDialogOpen={setIsFileUploadDialogOpen}
              isFileProcessing={isFileProcessing}
              fileProcessingError={fileProcessingError}
              onProcessResumeFile={onProcessResumeFile}
              localThemeSettings={localThemeSettings}
              setLocalThemeSettings={setLocalThemeSettings}
            />
          ) : (
            <h1>DashboardOverview</h1>
          )}
        </div>
      </div>
    </div>
  );
}
