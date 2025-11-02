'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { FileParserDialog } from '@/app/(private)/projects/builder/portfolio/[slug]/components/file-parser-dialog';
import { PortfolioFormValues } from '@/lib/schemas/portfolio';
import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form'; // Import necessary types
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
import { Settings } from '@/contexts/settings-context';

interface Props {
  formMethods: UseFormReturn<PortfolioFormValues>;

  workFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'work_experiences', 'id'>;
  educationFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'education', 'id'>;
  showcaseFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'showcases', 'id'>;
  skillFieldArray: UseFieldArrayReturn<PortfolioFormValues, 'skills', 'id'>;

  files: File[] | [];
  setFiles: React.Dispatch<React.SetStateAction<File[] | []>>;
  isFileUploadDialogOpen: boolean;
  setIsFileUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFileProcessing: boolean;
  fileProcessingError: string;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;

  onAddWorkExperience: () => void;
  onAddEducation: () => void;
  onAddShowcase: () => void;
  onAddTechnologyToShowcase: (index: number, name: string) => void;
  onRemoveTechnologyFromShowcase: (showcaseIndex: number, technologyIndex: number) => void;
  onProcessResumeFile: () => Promise<void>;
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

// Update the Form component definition to destructure all props
export function Form({
  formMethods,
  workFieldArray,
  educationFieldArray,
  showcaseFieldArray,
  skillFieldArray,
  onAddWorkExperience,
  onAddEducation,
  onAddShowcase,
  onAddTechnologyToShowcase,
  onRemoveTechnologyFromShowcase,
  files,
  setFiles,
  isFileUploadDialogOpen,
  setIsFileUploadDialogOpen,
  isFileProcessing,
  fileProcessingError,
  onProcessResumeFile,
  localThemeSettings,
  setLocalThemeSettings,
}: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = formMethods;

  const { fields: workFields, remove: removeWork } = workFieldArray;
  const { fields: educationFields, remove: removeEducation } = educationFieldArray;
  const { fields: showcaseFields, remove: removeShowcase } = showcaseFieldArray;
  const { fields: skillFields, remove: removeSkill, append: appendSkill } = skillFieldArray;

  return (
    <Card>
      <CardContent className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Content</h1>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Resume</h3>
            <Button
              className="shadow-none flex items-center min-w-32 justify-center 
             bg-gradient-to-r from-blue-500 to-purple-500 
             hover:from-blue-600 hover:to-purple-600 
             text-white border-0"
              onClick={() => setIsFileUploadDialogOpen(true)}
            >
              🤖 Parse with AI
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Header Accordion - using register, errors from formMethods */}
            <Accordion type="single" defaultValue="details" collapsible>
              <AccordionItem value="details" className="rounded-lg !border px-4">
                <AccordionTrigger className="cursor-pointer py-3 text-base font-medium">
                  Header
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2 pb-4 xl:px-5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="col-span-8">
                      <Label className="font-medium mb-2">Name</Label>
                      <Input {...register('name')} className="w-full shadow-none" />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="col-span-4">
                      <Label className="font-medium mb-2">Job Title</Label>
                      <Input {...register('job_title')} className="w-full shadow-none" />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.job_title?.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium mb-2">Location</Label>
                    <Input {...register('location')} className="w-full shadow-none" />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.location?.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="font-medium mb-2">Introduction</Label>
                    <Textarea
                      {...register('introduction')}
                      className="w-full shadow-none h-20 resize-none"
                    />
                    {errors.introduction && (
                      <p className="text-destructive text-sm mt-1">{errors.introduction.message}</p>
                    )}
                  </div>
                  {/* ... (rest of header content) */}
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

            {/* Work Experiences Accordion - using workFields, removeWork, onAddWorkExperience from props */}
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
                                {...register(`work_experiences.${index}.role` as const)}
                                className="w-full shadow-none"
                              />
                              {errors.work_experiences?.[index]?.role && (
                                <p className="text-destructive text-sm mt-1">
                                  {errors.work_experiences[index]?.role?.message}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium mb-2">Company</Label>
                                <Input
                                  {...register(`work_experiences.${index}.company` as const)}
                                  className="w-full shadow-none"
                                />
                              </div>
                              <div>
                                <Label className="font-medium mb-2">Location</Label>
                                <Input
                                  {...register(`work_experiences.${index}.location` as const)}
                                  className="w-full shadow-none"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label className="font-medium mb-2">Date Range</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs mb-2">Start Date</Label>
                                  <Input
                                    {...register(`work_experiences.${index}.startDate` as const)}
                                    className="w-full shadow-none"
                                  />
                                  {errors.work_experiences?.[index]?.startDate && (
                                    <p className="text-destructive text-sm mt-1">
                                      {errors.work_experiences[index]?.startDate?.message}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-xs mb-2">End Date</Label>
                                  {/* <Controller
                                    name={`work_experiences.${index}.endDate`}
                                    control={control} // Use passed control
                                    render={({ field }) => (
                                      <DateInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="w-full shadow-none"
                                        placeholder="Start Date"
                                      />
                                    )}
                                  /> */}
                                  <Input
                                    {...register(`work_experiences.${index}.endDate` as const)}
                                    className="w-full shadow-none"
                                  />
                                  {errors.work_experiences?.[index]?.endDate && (
                                    <p className="text-destructive text-sm mt-1">
                                      {errors.work_experiences[index]?.endDate?.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="font-medium mb-2">Description</Label>
                              <Textarea
                                {...register(`work_experiences.${index}.about` as const)}
                                className="w-full shadow-none h-24 resize-none"
                              />
                              {errors.work_experiences?.[index]?.about && (
                                <p className="text-destructive text-sm mt-1">
                                  {errors.work_experiences[index]?.about?.message}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <div />
                              <Button
                                className="shadow-none"
                                type="button"
                                variant="destructive"
                                onClick={() => removeWork(index)} // Use passed removeWork
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
                        onClick={onAddWorkExperience} // Use passed onAddWorkExperience
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

          {/* Education Accordion - using educationFields, removeEducation, onAddEducation from props */}
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
                                {/* <Controller
                                  name={`education.${index}.yearStart`}
                                  control={control} // Use passed control
                                  render={({ field }) => (
                                    <DateInput
                                      value={field.value}
                                      onChange={field.onChange}
                                      className="w-full shadow-none"
                                    />
                                  )}
                                /> */}
                                <Input
                                  {...register(`education.${index}.yearStart` as const)}
                                  className="w-full shadow-none"
                                />
                                {errors.education?.[index]?.yearStart && (
                                  <p className="text-destructive text-sm mt-1">
                                    {errors.education[index]?.yearStart?.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label className="text-xs mb-2">End Date</Label>
                                {/* <Controller
                                  name={`education.${index}.yearEnd`}
                                  control={control} // Use passed control
                                  render={({ field }) => (
                                    <DateInput
                                      value={field.value}
                                      onChange={field.onChange}
                                      className="w-full shadow-none"
                                      placeholder="Start Date"
                                    />
                                  )}
                                /> */}
                                <Input
                                  {...register(`education.${index}.yearEnd` as const)}
                                  className="w-full shadow-none"
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
                              onClick={() => removeEducation(index)} // Use passed removeEducation
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
                      onClick={onAddEducation} // Use passed onAddEducation
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Showcases / Projects Accordion - using showcaseFields, removeShowcase, and new handlers from props */}
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
                              {(watch(`showcases.${index}.technologies`) ?? []).map(
                                (tech, techIndex) => (
                                  <Badge key={techIndex}>
                                    {tech.name}
                                    <button
                                      type="button"
                                      className="ml-2 text-xs"
                                      onClick={
                                        () => onRemoveTechnologyFromShowcase(index, techIndex) // Use passed handler
                                      }
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                )
                              )}
                            </div>
                            <AddItemDrawer
                              title="Add New Technology"
                              placeholder="e.g. React, Node.js, Next.js"
                              onAdd={(tech) => onAddTechnologyToShowcase(index, tech)} // Use passed handler
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <div />
                            <Button
                              className="shadow-none"
                              type="button"
                              variant="destructive"
                              onClick={() => removeShowcase(index)} // Use passed removeShowcase
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
                      onClick={onAddShowcase} // Use passed onAddShowcase
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Skills Accordion - using skillFields, removeSkill, appendSkill from props */}
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
                              onClick={() => removeSkill(index)} // Use passed removeSkill
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>

                    <AddItemDrawer
                      title="Add New Skill"
                      placeholder="e.g. TypeScript, React, Laravel..."
                      // Use the passed appendSkill (part of skillFieldArray)
                      onAdd={(skill) => appendSkill({ name: skill })}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* ThemeControlPanel - using localThemeSettings and setLocalThemeSettings from props */}
        <div className="lg:col-span-4">
          <div>
            <h1 className="text-2xl font-bold mb-6">Customization</h1>
            <ThemeControlPanel
              stateless={true}
              themeSettings={localThemeSettings}
              setThemeSettings={setLocalThemeSettings}
              hideTopActionButtons={true}
              hideModeToggle={true}
              hideScrollArea={true}
              hideThemeSaverButton={false}
            />
          </div>
        </div>
      </CardContent>

      <FileParserDialog
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
