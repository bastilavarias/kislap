'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, FilePlus2 } from 'lucide-react'; // Added X icon for removing technologies/skills
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { FileUploadDialog } from '@/app/(private)/projects/builder/portfolio/[slug]/components/file-upload-dialog';
import { PortfolioFormValues, PortfolioSchema } from '@/lib/schemas/portfolio';
import { SubmitHandler, useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateInput } from '@/components/date-input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { DocumentResume, useDocument } from '@/hooks/api/use-document';
import { toast } from 'sonner';

interface Props {
  onSubmit: SubmitHandler<PortfolioFormValues>;
}

function AddItemDrawer({
  onAdd,
  title,
  placeholder,
}: {
  onAdd: (item: string) => void;
  title: string;
  placeholder: string;
}) {
  const [value, setValue] = useState('');

  const handleSave = () => {
    if (value.trim() !== '') {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="mt-6 shadow-none font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          {title}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-2xl p-6 max-h-[40%] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">✨ {title}</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Type the name and press <kbd>Enter</kbd> or click save.
          </p>
        </SheetHeader>

        <div className="mt-6">
          <Label className="mb-2 block text-sm font-medium">Name</Label>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
            className="h-12 text-base rounded-xl"
            autoFocus
          />
        </div>

        <SheetFooter className="mt-auto flex justify-end gap-2">
          <SheetClose asChild>
            <Button onClick={handleSave} className="px-6 py-2 rounded-xl shadow-sm">
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function Form({ onSubmit }: Props) {
  const [files, setFiles] = useState<File[] | []>([]);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [fileProcessingError, setFileProcessingError] = useState('');
  const { parse } = useDocument();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<PortfolioFormValues>({
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
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: 'workExperiences',
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  });

  const {
    fields: showcaseFields,
    append: appendShowcase,
    remove: removeShowcase,
  } = useFieldArray({
    control,
    name: 'showcases',
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: 'skills',
  });

  const onAddWorkExperience = () => {
    appendWork({
      role: '',
      company: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      about: '',
    });
  };

  const onAddEducation = () => {
    appendEducation({
      school: '',
      degree: '',
      level: '',
      location: '',
      yearStart: new Date(),
      yearEnd: new Date(),
      about: '',
    });
  };

  const onAddShowcase = () => {
    appendShowcase({
      name: '',
      description: '',
      role: '',
      technologies: [],
    });
  };

  const onAddTechnologyToShowcase = (index: number, name: string) => {
    const currentShowcases = watch('showcases');
    const currentTechnologies = currentShowcases[index]?.technologies || [];
    setValue(`showcases.${index}.technologies`, [...currentTechnologies, { name }], {
      shouldValidate: true,
    });
  };

  const onRemoveTechnologyFromShowcase = (showcaseIndex: number, technologyIndex: number) => {
    const currentShowcases = watch('showcases');
    const updatedTechnologies = currentShowcases[showcaseIndex].technologies.filter(
      (_, i) => i !== technologyIndex
    );
    setValue(`showcases.${showcaseIndex}.technologies`, updatedTechnologies, {
      shouldValidate: true,
    });
  };

  function mapResumeToFormValues(resume: DocumentResume): PortfolioFormValues {
    return {
      name: resume.name || '',
      introduction: resume.introduction || '',
      about: resume.about || '',
      email: resume.email || '',
      phone: resume.phone || '',
      website: resume.website || '', // Corrected mapping
      github: resume.github || '',
      linkedin: resume.linkedin || '',
      twitter: resume.twitter || '',

      workExperiences: (resume.work_experiences || []).map(
        (work: {
          company: string | null;
          role: string | null;
          location: string | null;
          start_date: string | null;
          end_date: string | null;
          about: string | null;
        }) => ({
          company: work.company || '',
          role: work.role || '',
          location: work.location || '',
          startDate: work.start_date ? new Date(work.start_date) : null,
          endDate: work.end_date ? new Date(work.end_date) : null,
          about: work.about || '',
        })
      ),

      education: (resume.education || []).map(
        (education: {
          school: string;
          level: string | null;
          degree: string | null;
          location: string | null;
          year_start: number | null;
          year_end: number | null;
          about: string | null;
        }) => ({
          school: education.school,
          level: education.level || '',
          degree: education.degree || '',
          location: education.location || '',
          yearStart: education.year_start ? new Date(`${education.year_start}-01-01`) : null,
          yearEnd: education.year_end ? new Date(`${education.year_end}-01-01`) : null,
          about: education.about || '',
        })
      ),

      showcases: (resume.showcases || []).map(
        (showcase: {
          name: string;
          description: string | null;
          role: string | null;
          technologies: {
            name: string;
          }[];
        }) => ({
          name: showcase.name,
          description: showcase.description || '',
          role: showcase.role || '',
          technologies: showcase.technologies || [],
        })
      ),

      skills: (resume.skills || []).map((skill: { name: string }) => ({
        name: skill.name,
      })),
    };
  }

  const onProcessResumeFile = async () => {
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
      return;
    }
    setFileProcessingError(message);
    setIsFileProcessing(false);
  };

  return (
    <Card>
      <CardContent>
        <form className="grid grid-cols-12 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Content</h1>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Resume</h3>
              <Button
                variant="outline"
                className="cursor-pointer shadow-none"
                onClick={() => setIsFileUploadDialogOpen(true)}
              >
                <FilePlus2 className="size-4" />
                Upload
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <Accordion type="single" defaultValue="details" collapsible>
                <AccordionItem value="details" className="rounded-lg !border px-4">
                  <AccordionTrigger className="cursor-pointer py-3 text-base font-medium">
                    Header
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 pb-4 xl:px-5">
                    <Label className="font-medium mb-2">Name</Label>
                    <Input {...register('name')} className="w-full shadow-none" />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                    )}

                    <div>
                      <Label className="font-medium mb-2">Introduction</Label>
                      <Textarea
                        {...register('introduction')}
                        className="w-full shadow-none h-20 resize-none"
                      />
                      {errors.introduction && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.introduction.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="font-medium mb-2">Email</Label>
                      <Input {...register('email')} className="w-full shadow-none" />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label className="font-medium mb-2">Phone Number</Label>
                      <Input {...register('phone')} className="w-full shadow-none" />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-medium mb-2">Website URL</Label>
                        <Input {...register('website')} className="w-full shadow-none" />
                        {errors.website && (
                          <p className="text-destructive text-sm mt-1">{errors.website.message}</p>
                        )}
                      </div>
                      <div>
                        <Label className="font-medium mb-2">GitHub URL</Label>
                        <Input {...register('github')} className="w-full shadow-none" />
                        {errors.github && (
                          <p className="text-destructive text-sm mt-1">{errors.github.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-medium mb-2">LinkedIn URL</Label>
                        <Input {...register('linkedin')} className="w-full shadow-none" />
                        {errors.linkedin && (
                          <p className="text-destructive text-sm mt-1">{errors.linkedin.message}</p>
                        )}
                      </div>
                      <div>
                        <Label className="font-medium mb-2">Twitter URL</Label>
                        <Input {...register('twitter')} className="w-full shadow-none" />
                        {errors.twitter && (
                          <p className="text-destructive text-sm mt-1">{errors.twitter.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="font-medium mb-2">About</Label>
                      <Textarea
                        {...register('about')}
                        className="w-full shadow-none h-20 resize-none"
                      />
                      {errors.about && (
                        <p className="text-destructive text-sm mt-1">{errors.about.message}</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" defaultValue="details" collapsible>
                <AccordionItem value="details" className="rounded-lg !border px-4">
                  <AccordionTrigger className="cursor-pointer py-3 text-base font-medium">
                    Work Experiences
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 pb-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        {workFields.length === 0 && (
                          <div className="flex justify-center items-center">
                            <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                              No work experiences added yet. Click “Add Work Experience” to start.
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          {workFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="border-2 border-dashed border-gray-300 rounded p-6 space-y-4"
                            >
                              <div>
                                <Label className="font-medium mb-2">Job Title</Label>
                                <Input
                                  {...register(`workExperiences.${index}.role` as const)}
                                  className="w-full shadow-none"
                                />
                                {errors.workExperiences?.[index]?.role && (
                                  <p className="text-destructive text-sm mt-1">
                                    {errors.workExperiences[index]?.role?.message}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium mb-2">Company</Label>
                                  <Input
                                    {...register(`workExperiences.${index}.company` as const)}
                                    className="w-full shadow-none"
                                  />
                                </div>
                                <div>
                                  <Label className="font-medium mb-2">Location</Label>
                                  <Input
                                    {...register(`workExperiences.${index}.location` as const)}
                                    className="w-full shadow-none"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label className="font-medium mb-2">Date Range</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs mb-2">Start Date</Label>
                                    <Controller
                                      name={`workExperiences.${index}.startDate`}
                                      control={control}
                                      render={({ field }) => (
                                        <DateInput
                                          value={field.value}
                                          onChange={field.onChange}
                                          className="w-full shadow-none"
                                        />
                                      )}
                                    />
                                    {errors.workExperiences?.[index]?.startDate && (
                                      <p className="text-destructive text-sm mt-1">
                                        {errors.workExperiences[index]?.startDate?.message}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <Label className="text-xs mb-2">End Date</Label>
                                    <Controller
                                      name={`workExperiences.${index}.endDate`}
                                      control={control}
                                      render={({ field }) => (
                                        <DateInput
                                          value={field.value}
                                          onChange={field.onChange}
                                          className="w-full shadow-none"
                                          placeholder="Start Date"
                                        />
                                      )}
                                    />
                                    {errors.workExperiences?.[index]?.endDate && (
                                      <p className="text-destructive text-sm mt-1">
                                        {errors.workExperiences[index]?.endDate?.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label className="font-medium mb-2">Description</Label>
                                <Textarea
                                  {...register(`workExperiences.${index}.about` as const)}
                                  className="w-full shadow-none h-24 resize-none"
                                />{' '}
                                {errors.workExperiences?.[index]?.about && (
                                  <p className="text-destructive text-sm mt-1">
                                    {errors.workExperiences[index]?.about?.message}
                                  </p>
                                )}
                              </div>

                              <div className="flex justify-between items-center">
                                <div />
                                <Button
                                  className="shadow-none"
                                  type="button"
                                  variant="destructive"
                                  onClick={() => removeWork(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-6 shadow-none"
                          onClick={onAddWorkExperience}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Work Experience
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <Accordion type="single" defaultValue="details" collapsible>
              <AccordionItem value="details" className="rounded-lg !border px-4">
                <AccordionTrigger className="cursor-pointer py-3 text-base font-medium">
                  Education
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2 pb-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      {educationFields.length === 0 && (
                        <div className="flex justify-center items-center">
                          <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                            No education added yet. Click “Add Education” to start.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        {educationFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="border-2 border-dashed border-gray-300 rounded p-6 space-y-4"
                          >
                            <div>
                              <Label className="font-medium mb-2">Degree</Label>
                              <Input
                                {...register(`education.${index}.degree` as const)}
                                className="w-full shadow-none"
                              />
                              {errors.education?.[index]?.degree && (
                                <p className="text-destructive text-sm mt-1">
                                  {errors.education[index]?.degree?.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label className="font-medium mb-2">School</Label>
                              <Input
                                {...register(`education.${index}.school` as const)}
                                className="w-full shadow-none"
                              />
                              {errors.education?.[index]?.school && (
                                <p className="text-destructive text-sm mt-1">
                                  {errors.education[index]?.school?.message}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label className="font-medium mb-2">Date Range</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                  <Label className="text-xs mb-2">Start Date</Label>
                                  <Controller
                                    name={`education.${index}.yearStart`}
                                    control={control}
                                    render={({ field }) => (
                                      <DateInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="w-full shadow-none"
                                      />
                                    )}
                                  />
                                  {errors.education?.[index]?.yearStart && (
                                    <p className="text-destructive text-sm mt-1">
                                      {errors.education[index]?.yearStart?.message}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-xs mb-2">End Date</Label>
                                  <Controller
                                    name={`education.${index}.yearEnd`}
                                    control={control}
                                    render={({ field }) => (
                                      <DateInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="w-full shadow-none"
                                        placeholder="Start Date"
                                      />
                                    )}
                                  />
                                  {errors.education?.[index]?.yearEnd && (
                                    <p className="text-destructive text-sm mt-1">
                                      {errors.education[index]?.yearEnd?.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div />
                              <Button
                                className="shadow-none"
                                type="button"
                                variant="destructive"
                                onClick={() => removeEducation(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="mt-6 shadow-none"
                        onClick={onAddEducation}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* --- ADDED SHOWCASES SECTION --- */}
            <Accordion type="single" defaultValue="showcases" collapsible>
              <AccordionItem value="showcases" className="rounded-lg !border px-4">
                <AccordionTrigger className="cursor-pointer py-3 text-base font-medium">
                  Showcases / Projects
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2 pb-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      {showcaseFields.length === 0 && (
                        <div className="flex justify-center items-center">
                          <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                            No projects or showcases added yet. Click “Add Project” to start.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        {showcaseFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="border-2 border-dashed border-gray-300 rounded p-6 space-y-4"
                          >
                            <div>
                              <Label className="font-medium mb-2">Project Name</Label>
                              <Input
                                {...register(`showcases.${index}.name` as const)}
                                className="w-full shadow-none"
                              />
                              {errors.showcases?.[index]?.name && (
                                <p className="text-destructive text-sm mt-1">
                                  {errors.showcases[index]?.name?.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label className="font-medium mb-2">Your Role (Optional)</Label>
                              <Input
                                {...register(`showcases.${index}.role` as const)}
                                className="w-full shadow-none"
                              />
                            </div>

                            <div>
                              <Label className="font-medium mb-2">Description (Optional)</Label>
                              <Textarea
                                {...register(`showcases.${index}.description` as const)}
                                className="w-full shadow-none h-24 resize-none"
                              />
                            </div>

                            <div>
                              <Label className="font-medium mb-2 block">Technologies</Label>
                              <div className="flex flex-wrap gap-2">
                                {watch(`showcases.${index}.technologies`).map((tech, techIndex) => (
                                  <Badge key={techIndex}>
                                    {tech.name}
                                    <button
                                      type="button"
                                      className="ml-2 text-xs"
                                      onClick={() =>
                                        onRemoveTechnologyFromShowcase(index, techIndex)
                                      }
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <AddItemDrawer
                                title="Add New Technology"
                                placeholder="e.g. React, Node.js, Next.js"
                                onAdd={(tech) => onAddTechnologyToShowcase(index, tech)}
                              />
                            </div>

                            <div className="flex justify-between items-center">
                              <div />
                              <Button
                                className="shadow-none"
                                type="button"
                                variant="destructive"
                                onClick={() => removeShowcase(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="mt-6 shadow-none"
                        onClick={onAddShowcase}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* --- END SHOWCASES SECTION --- */}

            <Accordion type="single" defaultValue="skills" collapsible>
              <AccordionItem value="skills" className="rounded-lg !border px-4">
                <AccordionTrigger className="cursor-pointer py-3 text-base font-medium">
                  Skills
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2 pb-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      {skillFields.length === 0 && (
                        <div className="flex justify-center items-center">
                          <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                            No skills added yet. Click “Add Skill” to start.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {skillFields.map((field, index) => {
                          const value = watch(`skills.${index}.name`);
                          return (
                            <Badge key={field.id}>
                              {value}
                              <button
                                type="button"
                                className="ml-2 text-xs"
                                onClick={() => removeSkill(index)}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>

                      {/* Changed to use the generic drawer for consistency */}
                      <AddItemDrawer
                        title="Add New Skill"
                        placeholder="e.g. TypeScript, React, Laravel..."
                        onAdd={(skill) => appendSkill({ name: skill })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="lg:col-span-4">
            <div>
              <h1 className="text-2xl font-bold mb-6">Customization</h1>
              <ThemeControlPanel
                stateless={true}
                hideTopActionButtons={true}
                hideModeToggle={true}
                hideScrollArea={true}
                hideThemeSaverButton={false}
              />
            </div>
          </div>
        </form>
      </CardContent>

      <FileUploadDialog
        onProcess={onProcessResumeFile}
        files={files}
        onChangeFiles={setFiles}
        loading={isFileProcessing}
        open={isFileUploadDialogOpen}
        onOpenChange={setIsFileUploadDialogOpen}
        error={fileProcessingError}
      />
    </Card>
  );
}
