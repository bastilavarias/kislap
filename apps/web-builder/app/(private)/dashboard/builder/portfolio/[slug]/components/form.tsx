'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Plus,
  X,
  LayoutTemplate,
  Grid,
  Box,
  Ghost,
  Cpu,
  Newspaper,
  Zap,
  CloudFog,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { FileParserDialog } from '@/app/(private)/dashboard/builder/portfolio/[slug]/components/file-parser-dialog';
import { PortfolioFormValues } from '@/lib/schemas/portfolio';
import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
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
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';

const LAYOUT_OPTIONS = [
  { id: 'default', name: 'Default', icon: LayoutTemplate, description: 'Clean & Standard' },
  { id: 'bento', name: 'Bento', icon: Grid, description: 'Modern Grid' },
  { id: 'neo-brutalist', name: 'Neo-Brutal', icon: Box, description: 'Bold Borders' },
  { id: 'glass', name: 'Glass', icon: Ghost, description: 'Frosted UI' },
  { id: 'cyber', name: 'Cyber', icon: Cpu, description: 'Futuristic' },
  { id: 'newspaper', name: 'Editorial', icon: Newspaper, description: 'Classic Print' },
  { id: 'kinetic', name: 'Kinetic', icon: Zap, description: 'Interactive' },
  { id: 'vaporware', name: 'Vaporware', icon: CloudFog, description: 'Retro 80s' },
];
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

  layout: string;
  setLayout: (layout: string) => void;

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

// Extracted Design Panel for reuse in Sidebar (Desktop) and Sheet (Mobile)
function DesignPanel({
  layout,
  setLayout,
  localThemeSettings,
  setLocalThemeSettings,
}: {
  layout: string;
  setLayout: (l: string) => void;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
}) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <h2 className="text-xl font-bold mb-4 hidden lg:block">Design & Style</h2>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-4 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="layout"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Theme
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choose Layout</CardTitle>
              <CardDescription>Select a structure for your portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {LAYOUT_OPTIONS.map((option) => {
                const isSelected = layout === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setLayout(option.id)}
                    className={cn(
                      'cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-muted hover:border-muted-foreground/30 hover:bg-muted/30'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={cn(
                        'p-3 rounded-full mb-3 transition-colors',
                        isSelected
                          ? 'bg-background text-primary shadow-sm'
                          : 'bg-muted text-muted-foreground group-hover:bg-background'
                      )}
                    >
                      <option.icon className="w-6 h-6" />
                    </div>

                    <div className="text-center">
                      <p className={cn('font-semibold text-sm', isSelected && 'text-primary')}>
                        {option.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Choose Theme</CardTitle>
              <CardDescription>Customize colors, fonts, and radius.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeControlPanel
                stateless={true}
                themeSettings={localThemeSettings}
                setThemeSettings={setLocalThemeSettings}
                hideTopActionButtons={true}
                hideModeToggle={true}
                hideScrollArea={true}
                hideThemeSaverButton={false}
                hideImportButton={true}
                hideRandomButton={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

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
  layout,
  setLayout,
}: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  const { fields: workFields, remove: removeWork } = workFieldArray;
  const { fields: educationFields, remove: removeEducation } = educationFieldArray;
  const { fields: showcaseFields, remove: removeShowcase } = showcaseFieldArray;
  const { fields: skillFields, remove: removeSkill, append: appendSkill } = skillFieldArray;

  useEffect(() => {
    //@ts-ignore
    setValue('layout_name', layout);
  }, [layout, setValue]);

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
        {/* --- LEFT COLUMN: CONTENT (Always Visible) --- */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Content</h1>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Resume Data</h3>
                <Button
                  className="shadow-none flex items-center min-w-32 justify-center 
                  bg-gradient-to-r from-blue-500 to-purple-500 
                  hover:from-blue-600 hover:to-purple-600 
                  text-white border-0 transition-all"
                  onClick={() => setIsFileUploadDialogOpen(true)}
                >
                  🤖 Parse with AI
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Header Accordion */}
                <Accordion type="single" defaultValue="details" collapsible>
                  <AccordionItem value="details" className="rounded-lg border px-4">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Header & Bio
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4 xl:px-2">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="col-span-1 md:col-span-8">
                          <Label className="font-medium mb-2">Name</Label>
                          <Input
                            {...register('name')}
                            className="w-full shadow-none"
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>

                        <div className="col-span-1 md:col-span-4">
                          <Label className="font-medium mb-2">Job Title</Label>
                          <Input
                            {...register('job_title')}
                            className="w-full shadow-none"
                            placeholder="Software Engineer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium mb-2">Location</Label>
                          <Input
                            {...register('location')}
                            className="w-full shadow-none"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <Label className="font-medium mb-2">Email</Label>
                          <Input
                            {...register('email')}
                            className="w-full shadow-none"
                            placeholder="hello@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="font-medium mb-2">Short Introduction</Label>
                        <Textarea
                          {...register('introduction')}
                          className="w-full shadow-none h-20 resize-none"
                          placeholder="A brief tagline..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-medium mb-2">Website</Label>
                          <Input
                            {...register('website')}
                            className="w-full shadow-none"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <Label className="font-medium mb-2">GitHub</Label>
                          <Input
                            {...register('github')}
                            className="w-full shadow-none"
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div>
                          <Label className="font-medium mb-2">LinkedIn</Label>
                          <Input
                            {...register('linkedin')}
                            className="w-full shadow-none"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div>
                          <Label className="font-medium mb-2">Twitter / X</Label>
                          <Input
                            {...register('twitter')}
                            className="w-full shadow-none"
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="font-medium mb-2">About Me</Label>
                        <Textarea
                          {...register('about')}
                          className="w-full shadow-none h-32 resize-none"
                          placeholder="Tell your story..."
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Work Experiences Accordion */}
                <Accordion type="single" defaultValue="work" collapsible>
                  <AccordionItem value="work" className="rounded-lg border px-4">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Work Experience
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4">
                      {workFields.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <div className="bg-muted p-3 rounded-full mb-3">
                            <LayoutTemplate className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground text-sm">
                            No work experience added yet.
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {workFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="relative border rounded-lg p-5 bg-card hover:border-primary/20 transition-colors"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeWork(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            <div className="grid gap-4">
                              <div>
                                <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                  Job Title
                                </Label>
                                <Input
                                  {...register(`work_experiences.${index}.role` as const)}
                                  className="mt-1.5"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    Company
                                  </Label>
                                  <Input
                                    {...register(`work_experiences.${index}.company` as const)}
                                    className="mt-1.5"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    Location
                                  </Label>
                                  <Input
                                    {...register(`work_experiences.${index}.location` as const)}
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    Start
                                  </Label>
                                  <Input
                                    {...register(`work_experiences.${index}.startDate` as const)}
                                    className="mt-1.5"
                                    placeholder="e.g. 2020"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    End
                                  </Label>
                                  <Input
                                    {...register(`work_experiences.${index}.endDate` as const)}
                                    className="mt-1.5"
                                    placeholder="Present"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                  Description
                                </Label>
                                <Textarea
                                  {...register(`work_experiences.${index}.about` as const)}
                                  className="mt-1.5 min-h-[100px]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2 border-dashed"
                        onClick={onAddWorkExperience}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Position
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Accordion type="single" defaultValue="edu" collapsible>
                  <AccordionItem value="edu" className="rounded-lg border px-4">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Education
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4">
                      {educationFields.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No education added.
                        </p>
                      )}

                      <div className="space-y-4">
                        {educationFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="relative border rounded-lg p-5 bg-card hover:border-primary/20 transition-colors"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeEducation(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            <div className="grid gap-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    Degree
                                  </Label>
                                  <Input
                                    {...register(`education.${index}.degree` as const)}
                                    className="mt-1.5"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    School
                                  </Label>
                                  <Input
                                    {...register(`education.${index}.school` as const)}
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    Start Year
                                  </Label>
                                  <Input
                                    {...register(`education.${index}.yearStart` as const)}
                                    className="mt-1.5"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    End Year
                                  </Label>
                                  <Input
                                    {...register(`education.${index}.yearEnd` as const)}
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2 border-dashed"
                        onClick={onAddEducation}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Education
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Projects Accordion */}
                <Accordion type="single" defaultValue="projects" collapsible>
                  <AccordionItem value="projects" className="rounded-lg border px-4">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Projects
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4">
                      <div className="space-y-4">
                        {showcaseFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="relative border rounded-lg p-5 bg-card hover:border-primary/20 transition-colors"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeShowcase(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            <div className="grid gap-4">
                              <div>
                                <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                  Project Name
                                </Label>
                                <Input
                                  {...register(`showcases.${index}.name` as const)}
                                  className="mt-1.5"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    Role
                                  </Label>
                                  <Input
                                    {...register(`showcases.${index}.role` as const)}
                                    className="mt-1.5"
                                    placeholder="Optional"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                    URL
                                  </Label>
                                  <Input
                                    {...register(`showcases.${index}.url` as const)}
                                    className="mt-1.5"
                                    placeholder="Optional"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-xs uppercase text-muted-foreground font-semibold">
                                  Description
                                </Label>
                                <Textarea
                                  {...register(`showcases.${index}.description` as const)}
                                  className="mt-1.5"
                                />
                              </div>

                              <div>
                                <Label className="text-xs uppercase text-muted-foreground font-semibold block mb-2">
                                  Tech Stack
                                </Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {(watch(`showcases.${index}.technologies`) ?? []).map(
                                    (tech, techIndex) => (
                                      <Badge
                                        key={techIndex}
                                        variant="secondary"
                                        className="pl-2 pr-1 py-1"
                                      >
                                        {tech.name}
                                        <button
                                          type="button"
                                          className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                          onClick={() =>
                                            onRemoveTechnologyFromShowcase(index, techIndex)
                                          }
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </Badge>
                                    )
                                  )}
                                </div>
                                <AddItemDrawer
                                  title="Add Tech"
                                  placeholder="e.g. React"
                                  onAdd={(tech) => onAddTechnologyToShowcase(index, tech)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2 border-dashed"
                        onClick={onAddShowcase}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Accordion type="single" defaultValue="skills" collapsible>
                  <AccordionItem value="skills" className="rounded-lg border px-4">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Skills
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skillFields.map((field, index) => (
                          <Badge key={field.id} className="text-sm py-1 px-3">
                            {watch(`skills.${index}.name`)}
                            <button
                              type="button"
                              className="ml-2 hover:text-white/80"
                              onClick={() => removeSkill(index)}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        {skillFields.length === 0 && (
                          <span className="text-sm text-muted-foreground italic">
                            No skills added yet.
                          </span>
                        )}
                      </div>
                      <AddItemDrawer
                        title="Add Skill"
                        placeholder="e.g. TypeScript"
                        onAdd={(skill) => appendSkill({ name: skill })}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hidden lg:col-span-4 lg:block relative">
          <div className="sticky top-6 space-y-4">
            <DesignPanel
              layout={layout}
              setLayout={setLayout}
              localThemeSettings={localThemeSettings}
              setLocalThemeSettings={setLocalThemeSettings}
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-xl bg-primary hover:bg-primary/90 flex items-center justify-center"
            >
              <Palette className="w-6 h-6 text-primary-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] pt-6 px-4">
            <SheetHeader className="mb-4 text-left">
              <SheetTitle>Design & Style</SheetTitle>
              <SheetDescription>Switch layouts and customize your theme.</SheetDescription>
            </SheetHeader>

            <div className="h-full overflow-y-auto pb-20">
              <DesignPanel
                layout={layout}
                setLayout={setLayout}
                localThemeSettings={localThemeSettings}
                setLocalThemeSettings={setLocalThemeSettings}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <FileParserDialog
        onProcess={onProcessResumeFile}
        files={files}
        onChangeFiles={setFiles}
        loading={isFileProcessing}
        open={isFileUploadDialogOpen}
        onOpenChange={setIsFileUploadDialogOpen}
        error={fileProcessingError}
      />
    </div>
  );
}
