'use client';

import { Form } from '@/app/(private)/projects/builder/portfolio/[slug]/components/form'; // Import the modified Form component
import { FormHeader } from '@/components/form-header';
import { BackButton } from '@/components/back-button';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PortfolioFormValues, PortfolioSchema } from '@/lib/schemas/portfolio';
import { useDocument } from '@/hooks/api/use-document';
import { toast } from 'sonner';
import { Settings } from '@/contexts/settings-context';
import { usePortfolio } from '@/hooks/api/use-portfolio';
import { useProject } from '@/hooks/api/use-project';
import { useParams } from 'next/navigation';
import { AuthUser, useAuth } from '@/hooks/api/use-auth';
import {
  APIResponseDocumentResume,
  APIResponsePortfolio,
  APIResponseProject,
} from '@/types/api-response';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useAuthContext } from '@/contexts/auth-context';

function mapToFormValues<T extends APIResponseDocumentResume | APIResponsePortfolio>(
  source: T
): PortfolioFormValues {
  return {
    name: source.name || '',
    job_title: source.job_title || '',
    location: source.location || '',
    introduction: source.introduction || '',
    about: source.about || '',
    email: source.email || '',
    phone: source.phone || '',
    website: source.website || '',
    github: source.github || '',
    linkedin: source.linkedin || '',
    twitter: source.twitter || '',

    work_experiences: (source.work_experiences || []).map((work: any) => ({
      company: work.company || '',
      role: work.role || '',
      location: work.location || '',
      startDate: work.start_date || null,
      endDate: work.end_date || null,
      about: work.about || '',
      url: work.url || '',
    })),

    education: (source.education || []).map((education: any) => ({
      school: education.school,
      level: education.level || '',
      degree: education.degree || '',
      location: education.location || '',
      yearStart: education.year_start || null,
      yearEnd: education.year_end || null,
      about: education.about || '',
    })),

    showcases: (source.showcases || []).map((showcase: any) => ({
      name: showcase.name,
      description: showcase.description || '',
      role: showcase.role || '',
      technologies: showcase.technologies || [],
    })),

    skills: (source.skills || []).map((skill: { name: string }) => ({
      name: skill.name,
    })),
  };
}

const LoadingDialog = ({ open }: { open: boolean }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="w-full h-full flex items-center justify-center">
          <Spinner size={50} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function Wrapper() {
  const [project, setProject] = useState<APIResponseProject | null>(null);
  const [tab, setTab] = useState('edit');
  const [files, setFiles] = useState<File[] | []>([]);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileProcessingError, setFileProcessingError] = useState('');
  const [localThemeSettings, setLocalThemeSettings] = useState<Settings | null>(null);
  const { create } = usePortfolio();
  const [isGetLoading, setGetLoading] = useState(true);
  const [isSaveLoading, setSaveLoading] = useState(false);
  const [isPublishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [porttfolioID, setPortfolioID] = useState<number | null>(null);
  const [layout, setLayout] = useState<string>('default');

  const { authUser } = useAuthContext();
  const { parse } = useDocument();
  const { getBySlug, publish } = useProject();
  const params = useParams();

  const formMethods = useForm<PortfolioFormValues>({
    resolver: zodResolver(PortfolioSchema),
    defaultValues: {
      name: '',
      job_title: '',
      introduction: '',
      about: '',
      email: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
      work_experiences: [],
      education: [],
      showcases: [],
      skills: [],
    },
  });

  const { setValue, watch, control } = formMethods;

  const workFieldArray = useFieldArray({ control, name: 'work_experiences' });
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
      url: '',
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
      const mappedValues = mapToFormValues(data);

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
      toast('Invalid route.');
      return;
    }

    setError('');

    const { success, data, message } = await getBySlug(slug, view);

    if (success && data) {
      setProject(data);

      if (data.portfolio) {
        const mappedValues = mapToFormValues(data.portfolio);
        Object.entries(mappedValues).forEach(([key, value]) => {
          setValue(key as keyof PortfolioFormValues, value, { shouldValidate: true });
        });
        setLocalThemeSettings({
          mode: 'light',
          theme: data.portfolio.theme_object,
        });
        setLayout(data.portfolio.layout_name ?? 'default');
        setPortfolioID(data.portfolio.id);
      }

      setGetLoading(false);
      return;
    }

    toast(message);
  };

  const onSubmit = async (form: PortfolioFormValues) => {
    setError('');
    setSaveLoading(true);

    console.log(layout);
    const { success, data, message } = await create({
      portfolio_id: porttfolioID,
      user_id: user?.id,
      project_id: project?.id,
      ...form,
      theme: {
        ...localThemeSettings?.theme,
      },
      layout_name: layout,
    });

    if (success && data) {
      toast('Portfolio succesfully details saved.');
      setSaveLoading(false);
      return;
    }

    setError(message);
    toast('Something went wrong!');
    setSaveLoading(false);
  };

  const onPublish = async (isPublished: boolean) => {
    if (!project?.id) {
      return;
    }

    setError('');
    setPublishLoading(true);

    const { success, data, message } = await publish(project?.id, isPublished);

    if (success && data) {
      setProject(data);
      toast(`Project ${data.published ? 'Published' : 'Unplished'} Successfully!`);
      setPublishLoading(false);
      return;
    }

    setError(message);
    toast('Something went wrong!');
    setPublishLoading(false);
  };

  const onError = (errors: any) => {
    console.log('❌ Errors:', errors);
  };

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

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
          project={project}
          tab={tab}
          error={error}
          onTabChange={setTab}
          onSave={() => formMethods.handleSubmit(onSubmit, onError)()}
          onPublish={onPublish}
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
              layout={layout}
              setLayout={setLayout}
            />
          ) : (
            <h1>DashboardOverview</h1>
          )}
        </div>
      </div>
      <LoadingDialog open={isSaveLoading || isPublishLoading || isGetLoading} />
    </div>
  );
}
