'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/image-upload-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  Briefcase,
  GraduationCap,
  FolderGit2,
  Edit2,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Globe,
  User,
  FileText,
  UploadCloud,
  Linkedin,
  Github,
  Twitter,
} from 'lucide-react';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { ParsedFileDialog } from '@/components/parsed-file-dialog';
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
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { SortableList } from '@/components/sortable-list';
import { PortfolioFormPreview } from './portfolio-form-preview';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';

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
  isParserOpen: boolean;
  setIsParserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  applyParsedResume: (data: Record<string, any>) => void;
  fallbackAvatarUrl: string | null;

  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;

  layout: string;
  setLayout: (layout: string) => void;

  onAddWorkExperience: () => void;
  onAddEducation: () => void;
  onAddShowcase: () => void;
  onAddTechnologyToShowcase: (index: number, name: string) => void;
  onRemoveTechnologyFromShowcase: (showcaseIndex: number, technologyIndex: number) => void;
}

function AddItemDialog({
  onAdd,
  title,
  placeholder,
}: {
  onAdd: (item: string) => void;
  title: string;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleSave = () => {
    if (value.trim() !== '') {
      onAdd(value.trim());
      setValue('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="mt-2 border-dashed shadow-none text-xs h-8"
        >
          <Plus className="w-3 h-3 mr-1.5" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add {title}</DialogTitle>
          <DialogDescription>Type the name and press Enter or click save.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
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
            className="shadow-none"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="shadow-none">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
            className="rounded-lg shadow-none data-[state=active]:bg-background"
          >
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="rounded-lg shadow-none data-[state=active]:bg-background"
          >
            Theme
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="mt-0">
          <Card className="shadow-none border-border">
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
                        ? 'border-primary bg-primary/5'
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
                          ? 'bg-background text-primary'
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
          <Card className="shadow-none border-border">
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
  isParserOpen,
  setIsParserOpen,
  applyParsedResume,
  fallbackAvatarUrl,
  localThemeSettings,
  setLocalThemeSettings,
  layout,
  setLayout,
}: Props) {
  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = formMethods;
  const previewValues = watch();

  const { fields: workFields, remove: removeWork, move: moveWork } = workFieldArray;
  const {
    fields: educationFields,
    remove: removeEducation,
    move: moveEducation,
  } = educationFieldArray;
  const { fields: showcaseFields, remove: removeShowcase, move: moveShowcase } = showcaseFieldArray;
  const { fields: skillFields, remove: removeSkill, append: appendSkill } = skillFieldArray;

  const [editState, setEditState] = useState<{
    type: 'work' | 'education' | 'project' | null;
    index: number | null;
  }>({ type: null, index: null });
  const [builderTab, setBuilderTab] = useState<'form' | 'preview'>('form');

  const closeDialog = () => setEditState({ type: null, index: null });

  useEffect(() => {
    //@ts-ignore
    setValue('layout_name', layout);
  }, [layout, setValue]);

  const accordionItemClass =
    'border-b rounded-none px-0 shadow-none lg:border lg:rounded-lg lg:px-4 last:border-0 lg:last:border';

  const handleClearContent = () => {
    if (!window.confirm('Clear the current portfolio form content? Layout and theme will stay as they are.')) {
      return;
    }

    reset({
      name: '',
      job_title: '',
      avatar: null,
      avatar_url: '',
      resume: null,
      resume_url: '',
      location: '',
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
      layout_name: layout,
    } as PortfolioFormValues);
  };

  return (
    <div className="w-full relative">
      <div className="mb-6">
        <Tabs value={builderTab} onValueChange={(value) => setBuilderTab(value as 'form' | 'preview')}>
          <TabsList className="grid h-12 w-full max-w-md grid-cols-2 rounded-xl border border-border/70 bg-muted/50 p-1 shadow-sm">
            <TabsTrigger
              value="form"
              className="cursor-pointer rounded-lg"
            >
              Form
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="cursor-pointer rounded-lg"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {builderTab === 'preview' ? (
        <PortfolioFormPreview
          values={previewValues}
          layout={layout}
          themeSettings={localThemeSettings}
          fallbackAvatarUrl={fallbackAvatarUrl}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-none lg:border-border lg:bg-card lg:border">
              <CardContent className="p-3 lg:p-6">
                <div className="flex justify-between items-center mb-6 px-1 lg:px-0 gap-4">
                  <h1 className="text-2xl font-bold">Content</h1>
                  <Button type="button" variant="outline" className="shadow-none" onClick={handleClearContent}>
                    Clear content
                  </Button>
                </div>

                <div className="flex items-center justify-between mb-8 bg-muted/20 p-4 rounded-xl border">
                  <div>
                    <h3 className="text-sm font-semibold">Resume Parser</h3>
                    <p className="text-xs text-muted-foreground">
                      Auto-fill your portfolio using AI.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="shadow-none flex items-center gap-2
                  bg-gradient-to-r from-blue-500 to-purple-500 
                  hover:from-blue-600 hover:to-purple-600 
                  text-white border-0 transition-all"
                    onClick={() => setIsParserOpen(true)}
                  >
                    Parse Resume
                  </Button>
                </div>

                <div className="flex flex-col gap-6 lg:gap-10">
                  <Accordion type="single" defaultValue="details" collapsible>
                    <AccordionItem value="details" className={accordionItemClass}>
                      <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                        Header & Bio
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-2 pb-4 px-1 lg:px-2">
                      {/* Identity Group */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <User className="w-4 h-4" /> Identity
                        </div>
                        <div className="flex flex-col gap-6 md:flex-row">
                          <div className="shrink-0 md:w-64">
                            <Label className="mb-2 block">Avatar</Label>
                            <ImageUploadField
                              id="portfolio-avatar-upload"
                              previewUrl={watch('avatar_url') || fallbackAvatarUrl}
                              currentFile={watch('avatar') as File}
                              onFileSelect={(file) => {
                                setValue('avatar', file, { shouldDirty: true, shouldValidate: true });
                                if (file) {
                                  setValue('avatar_url', '', {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="grid flex-1 grid-cols-1 gap-4">
                            <div>
                              <Label className="mb-2 block">Name</Label>
                              <Input
                                {...register('name')}
                                placeholder="John Doe"
                                className="shadow-none"
                              />
                              {errors.name && (
                                <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                              )}
                            </div>
                            <div>
                              <Label className="mb-2 block">Job Title</Label>
                              <Input
                                {...register('job_title')}
                                placeholder="Software Engineer"
                                className="shadow-none"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Label className="mb-1 block">Resume / CV</Label>
                              <p className="text-xs text-muted-foreground">
                                Optional. Upload a PDF so visitors can download it from your portfolio.
                              </p>
                            </div>
                            {(watch('resume') || watch('resume_url')) && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-8 px-2 text-xs shadow-none"
                                onClick={() => {
                                  setValue('resume', null, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                  setValue('resume_url', '', {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                Remove PDF
                              </Button>
                            )}
                          </div>

                          <Dropzone
                            className="min-h-[136px] rounded-lg border border-dashed border-border bg-muted/20 transition-colors hover:bg-muted/30"
                            accept={{ 'application/pdf': ['.pdf'] }}
                            maxFiles={1}
                            maxSize={1024 * 1024 * 10}
                            onDrop={(files) => {
                              const file = files[0] ?? null;
                              setValue('resume', file, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              if (file) {
                                setValue('resume_url', '', {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }
                            }}
                          >
                            <DropzoneEmptyState>
                              <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 text-center">
                                <div className="rounded-full border border-border bg-background p-3">
                                  <UploadCloud className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">Drop a PDF here or click to upload</p>
                                  <p className="text-xs text-muted-foreground">PDF only, up to 10MB.</p>
                                </div>
                              </div>
                            </DropzoneEmptyState>
                            <DropzoneContent files={watch('resume') ? [watch('resume') as File] : []} />
                          </Dropzone>

                          {(watch('resume') || watch('resume_url')) && (
                            <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-3 text-sm">
                              <div className="rounded-md bg-muted p-2">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">
                                  {watch('resume') instanceof File
                                    ? (watch('resume') as File).name
                                    : 'Current resume on file'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {watch('resume') instanceof File
                                    ? `${Math.max(1, Math.round((watch('resume') as File).size / 1024))} KB • PDF`
                                    : 'This will appear as a download button on your public portfolio.'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label className="mb-2 block">Short Introduction</Label>
                          <Textarea
                            {...register('introduction')}
                            className="h-20 resize-none shadow-none"
                            placeholder="A brief tagline..."
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">About Me</Label>
                          <Textarea
                            {...register('about')}
                            className="h-32 resize-none shadow-none"
                            placeholder="Tell your story..."
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Contact Group */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <MapPin className="w-4 h-4" /> Contact
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> Location
                            </Label>
                            <Input
                              {...register('location')}
                              placeholder="City, Country"
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <Mail className="w-3 h-3" /> Email
                            </Label>
                            <Input
                              {...register('email')}
                              placeholder="hello@example.com"
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <Globe className="w-3 h-3" /> Website
                            </Label>
                            <Input
                              {...register('website')}
                              placeholder="https://..."
                              className="shadow-none"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Socials Group */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <Globe className="w-4 h-4" /> Socials
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <Github className="w-3 h-3" /> GitHub
                            </Label>
                            <Input
                              {...register('github')}
                              placeholder="username"
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <Linkedin className="w-3 h-3" /> LinkedIn
                            </Label>
                            <Input
                              {...register('linkedin')}
                              placeholder="username"
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <Twitter className="w-3 h-3" /> Twitter/X
                            </Label>
                            <Input
                              {...register('twitter')}
                              placeholder="username"
                              className="shadow-none"
                            />
                          </div>
                        </div>
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                <Accordion type="single" defaultValue="work" collapsible>
                  <AccordionItem value="work" className={accordionItemClass}>
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Work Experience
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4">
                      {workFields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center bg-muted/20 rounded-lg border-dashed border-2">
                          <Briefcase className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                          <p className="text-muted-foreground text-sm">No work experience yet.</p>
                        </div>
                      ) : (
                        <SortableList
                          items={workFields}
                          onDragEnd={(oldIndex, newIndex) => moveWork(oldIndex, newIndex)}
                          renderItem={(field, index) => {
                            const role = watch(`work_experiences.${index}.role`);
                            const company = watch(`work_experiences.${index}.company`);
                            return (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {role || 'Untitled Role'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {company || 'Unknown Company'}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditState({ type: 'work', index })}
                                    className="shadow-none"
                                  >
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeWork(index)}
                                    className="hover:text-destructive shadow-none"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }}
                        />
                      )}
                      <Button
                        onClick={onAddWorkExperience}
                        variant="outline"
                        className="w-full mt-2 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Position
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                  {/* 3. EDUCATION */}
                  <Accordion type="single" defaultValue="edu" collapsible>
                  <AccordionItem value="edu" className={accordionItemClass}>
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Education
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4">
                      {educationFields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center bg-muted/20 rounded-lg border-dashed border-2">
                          <GraduationCap className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                          <p className="text-muted-foreground text-sm">No education listed.</p>
                        </div>
                      ) : (
                        <SortableList
                          items={educationFields}
                          onDragEnd={(oldIndex, newIndex) => moveEducation(oldIndex, newIndex)}
                          renderItem={(field, index) => {
                            const degree = watch(`education.${index}.degree`);
                            const school = watch(`education.${index}.school`);
                            return (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {degree || 'Untitled Degree'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {school || 'Unknown School'}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditState({ type: 'education', index })}
                                    className="shadow-none"
                                  >
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeEducation(index)}
                                    className="hover:text-destructive shadow-none"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }}
                        />
                      )}
                      <Button
                        onClick={onAddEducation}
                        variant="outline"
                        className="w-full mt-2 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Education
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  </Accordion>

                  {/* 4. PROJECTS */}
                  <Accordion type="single" defaultValue="projects" collapsible>
                  <AccordionItem value="projects" className={accordionItemClass}>
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Projects
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 pb-4">
                      {showcaseFields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center bg-muted/20 rounded-lg border-dashed border-2">
                          <FolderGit2 className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                          <p className="text-muted-foreground text-sm">No projects added.</p>
                        </div>
                      ) : (
                        <SortableList
                          items={showcaseFields}
                          onDragEnd={(oldIndex, newIndex) => moveShowcase(oldIndex, newIndex)}
                          renderItem={(field, index) => {
                            const name = watch(`showcases.${index}.name`);
                            return (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {name || 'Untitled Project'}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditState({ type: 'project', index })}
                                    className="shadow-none"
                                  >
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeShowcase(index)}
                                    className="hover:text-destructive shadow-none"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }}
                        />
                      )}
                      <Button
                        onClick={onAddShowcase}
                        variant="outline"
                        className="w-full mt-2 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  </Accordion>

                  {/* 5. SKILLS */}
                  <Accordion type="single" defaultValue="skills" collapsible>
                  <AccordionItem value="skills" className={accordionItemClass}>
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Skills
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {skillFields.map((field, index) => (
                          <Badge key={field.id} className="text-sm py-1 px-3 shadow-none">
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
                      <AddItemDialog
                        title="Skill"
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

          {/* --- RIGHT COLUMN: DESIGN PANEL --- */}
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
      )}

      <Dialog open={editState.type !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editState.type === 'work' && 'Edit Experience'}
              {editState.type === 'education' && 'Edit Education'}
              {editState.type === 'project' && 'Edit Project'}
            </DialogTitle>
            <DialogDescription>Details will appear on your public portfolio.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar px-1">
            {/* WORK FORM */}
            {editState.type === 'work' && editState.index !== null && (
              <>
                <div>
                  <Label className="mb-2 block">Role</Label>
                  <Input
                    {...register(`work_experiences.${editState.index}.role`)}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Company</Label>
                  <Input
                    {...register(`work_experiences.${editState.index}.company`)}
                    className="shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Start</Label>
                    <Input
                      {...register(`work_experiences.${editState.index}.startDate`)}
                      placeholder="2020"
                      className="shadow-none"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">End</Label>
                    <Input
                      {...register(`work_experiences.${editState.index}.endDate`)}
                      placeholder="Present"
                      className="shadow-none"
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Location</Label>
                  <Input
                    {...register(`work_experiences.${editState.index}.location`)}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Description</Label>
                  <Textarea
                    {...register(`work_experiences.${editState.index}.about`)}
                    className="min-h-[100px] shadow-none"
                  />
                </div>
              </>
            )}

            {/* EDUCATION FORM */}
            {editState.type === 'education' && editState.index !== null && (
              <>
                <div>
                  <Label className="mb-2 block">Degree</Label>
                  <Input
                    {...register(`education.${editState.index}.degree`)}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">School</Label>
                  <Input
                    {...register(`education.${editState.index}.school`)}
                    className="shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Start Year</Label>
                    <Input
                      {...register(`education.${editState.index}.yearStart`)}
                      className="shadow-none"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">End Year</Label>
                    <Input
                      {...register(`education.${editState.index}.yearEnd`)}
                      className="shadow-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* PROJECT FORM */}
            {editState.type === 'project' && editState.index !== null && (
              <>
                <div>
                  <Label className="mb-2 block">Project Name</Label>
                  <Input
                    {...register(`showcases.${editState.index}.name`)}
                    className="shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Role</Label>
                    <Input
                      {...register(`showcases.${editState.index}.role`)}
                      placeholder="e.g. Lead"
                      className="shadow-none"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">URL</Label>
                    <Input
                      {...register(`showcases.${editState.index}.url`)}
                      placeholder="https://"
                      className="shadow-none"
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Description</Label>
                  <Textarea
                    {...register(`showcases.${editState.index}.description`)}
                    className="min-h-[100px] shadow-none"
                  />
                </div>

                {/* Tech Stack in Dialog */}
                <div>
                  <Label className="mb-2 block">Technologies</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(watch(`showcases.${editState.index}.technologies`) ?? []).map(
                      (tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="pl-2 pr-1 py-1 shadow-none"
                        >
                          {tech.name}
                          <button
                            type="button"
                            className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
                            onClick={() =>
                              onRemoveTechnologyFromShowcase(editState.index!, techIndex)
                            }
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )
                    )}
                  </div>
                  <AddItemDialog
                    title="Tech"
                    placeholder="e.g. React"
                    onAdd={(tech) => onAddTechnologyToShowcase(editState.index!, tech)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={closeDialog} className="w-full shadow-none">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MOBILE TRIGGER */}
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

      <ParsedFileDialog
        open={isParserOpen}
        onOpenChange={setIsParserOpen}
        projectType="portfolio"
        sourceType="resume"
        title="Resume Parser"
        description="Upload a resume and reuse parsed results anytime."
        onApplyParsedData={applyParsedResume}
      />
    </div>
  );
}

