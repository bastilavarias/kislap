// PortfolioFormWrapper.tsx
// (You'll need to create this file, or put its content in the original wrapper.tsx)

'use client';

import { Form } from '@/app/(private)/projects/builder/portfolio/[slug]/components/form'; // Import the modified Form component
import { FormHeader } from '@/components/form-header';
import { BackButton } from '@/components/back-button';
import { useState } from 'react';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PortfolioFormValues, PortfolioSchema } from '@/lib/schemas/portfolio';
import { DocumentResume, useDocument } from '@/hooks/api/use-document';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';

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
  const [tab, setTab] = useState('edit');
  const [files, setFiles] = useState<File[] | []>([]);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileProcessingError, setFileProcessingError] = useState('');
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);

  const { parse } = useDocument();

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

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = formMethods;

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
    const updatedTechnologies = currentShowcases?[showcaseIndex]?.technologies.filter(
      (_, i) => i !== technologyIndex
    );
    setValue(`showcases.${showcaseIndex}.technologies`, updatedTechnologies, {
      shouldValidate: true,
    });
  };

  // 5. RESUME LOGIC: The onProcessResumeFile logic is moved here
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

  const onSubmit = (form: PortfolioFormValues) => {
    console.log('✅ Submitted!');
    console.log(form);
  };

  const onError = (errors: any) => {
    console.log('❌ Errors:', errors);
  };

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
            <h1>Overview</h1>
          )}
        </div>
      </div>
    </div>
  );
}
