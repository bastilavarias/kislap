'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormValues, ProjectSchema } from '@/lib/schemas/project';
import { useProject } from '@/hooks/api/use-project';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { APIResponseProject } from '@/types/api-response';

const projectTypes = [
  {
    label: 'portfolio',
    emoji: '🎨',
    active: true,
    description: 'Showcase your personal or professional work in a clean, modern portfolio.',
    features: ['Customizable templates', 'Responsive design', 'Easy media upload'],
    route: 'portfolio',
  },
  {
    label: 'biz',
    emoji: '💼',
    active: true,
    description: 'Create a professional business3 website to attract clients and customers.',
    features: ['Company info pages', 'Service showcase', 'Contact forms'],
    route: 'biz',
  },
  {
    label: 'links',
    emoji: '🔗',
    active: true,
    description: 'Aggregate all your important links in a single, shareable page.',
    features: ['Social links', 'Custom branding', 'Easy sharing'],
    route: 'linktree',
  },
  {
    label: 'waitlist',
    emoji: '⏳',
    active: false,
    description: 'Build hype and gather early users for your upcoming project or app.',
    features: ['Sign-up forms', 'Email notifications', 'Analytics dashboard'],
    route: 'waitlist',
  },
];

interface ProjectFormDialogProps {
  project?: APIResponseProject | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  replaceURL?: boolean;
}

export function ProjectFormDialog({
  project,
  open,
  onOpenChange,
  trigger,
  replaceURL = false,
}: ProjectFormDialogProps) {
  const { create, update } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const isEditMode = !!project;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      sub_domain: '',
      type: 'portfolio',
      published: false,
    },
  });

  useEffect(() => {
    if (project) {
      //@ts-ignore
      reset({
        name: project.name,
        description: project.description || '',
        sub_domain: project.sub_domain || '',
        type: project.type,
        published: project.published,
      });
    } else {
      reset();
    }
  }, [project, reset, open]);

  const currentType = watch('type');

  const onSubmit = async (form: ProjectFormValues) => {
    setError('');
    setLoading(true);

    try {
      if (isEditMode && project) {
        const { success, data, message } = await update(project.id, form);

        if (success) {
          if (onOpenChange) onOpenChange(false);

          if (replaceURL && data?.slug) {
            window.location.href = `/dashboard/builder/${currentType}/${data.slug}`;
            return;
          }

          router.refresh();
        } else {
          setError(message || 'Failed to update project');
        }
      } else {
        const { success, data, message } = await create(form);
        if (success && data) {
          if (onOpenChange) onOpenChange(false);
          router.push(`/dashboard/builder/${currentType}/${data.slug}`);
        } else {
          setError(message || 'Failed to create project');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !onOpenChange && (
        <DialogTrigger asChild>
          <Button className="font-bold">NEW PROJECT</Button>
        </DialogTrigger>
      )}

      <DialogContent
        className="
  w-screen h-screen 
  sm:w-full 
  sm:h-[90vh]  {/* CHANGED: Fixed height ensures internal scrolling always works */}
  sm:max-w-[420px] md:max-w-[620px] lg:max-w-[900px] 
  p-0 gap-0 overflow-hidden flex flex-col rounded-none sm:rounded-lg border-0 sm:border"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-h-full">
          <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-2 shrink-0 border-b sm:border-b-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4 sm:pt-2">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle className="capitalize ml-2">{error}</AlertTitle>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium mb-1.5 block">Name</Label>
                    <Input
                      {...register('name')}
                      placeholder="My Online Portfolio"
                      className="shadow-sm"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="font-medium mb-1.5 block">Domain</Label>
                    <div className="relative flex items-center">
                      <Input
                        {...register('sub_domain')}
                        placeholder="myportfolio"
                        className="shadow-sm pr-24"
                      />
                      <span className="absolute right-3 text-muted-foreground font-mono text-sm bg-background/50 pointer-events-none">
                        .kislap.app
                      </span>
                    </div>
                    {errors.sub_domain && (
                      <p className="text-destructive text-sm mt-1">{errors.sub_domain.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <Label className="font-medium mb-1.5 block">Description</Label>
                  <Textarea
                    {...register('description')}
                    className="shadow-sm flex-1 min-h-[120px] md:min-h-[100px] resize-none"
                    placeholder="A brief description of what this project is about..."
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Project Type Selection */}
              <div>
                <Label className="font-medium mb-3 block text-base sm:text-lg">
                  Select Project Type
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectTypes.map((type) => {
                    const isActive = type.active;
                    const isSelected = currentType === type.label;

                    return (
                      <Card
                        key={type.label}
                        className={cn(
                          'relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer text-left group',
                          isSelected
                            ? 'border-primary ring-1 ring-primary shadow-md bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:shadow-sm',
                          !isActive && 'opacity-60 cursor-not-allowed bg-muted/50'
                        )}
                        onClick={() => {
                          if (isActive) {
                            setValue('type', type.label, { shouldValidate: true });
                          }
                        }}
                      >
                        <div
                          className={cn(
                            'absolute top-3 right-3 w-4 h-4 rounded-full border border-primary transition-colors flex items-center justify-center',
                            isSelected ? 'bg-primary' : 'bg-transparent',
                            !isActive && 'hidden'
                          )}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>

                        {!isActive && (
                          <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] flex items-center justify-center z-10 select-none">
                            <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm">
                              Coming Soon
                            </span>
                          </div>
                        )}

                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">{type.emoji}</span>
                            <span className="capitalize">{type.label}</span>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground mb-3 leading-snug min-h-[40px]">
                            {type.description}
                          </p>

                          {type.features && (
                            <ul className="space-y-1 hidden sm:block">
                              {' '}
                              {/* Hide details on very small screens if needed, or keep */}
                              {type.features.map((feat, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-muted-foreground flex items-center gap-1.5"
                                >
                                  <div
                                    className={cn(
                                      'w-1 h-1 rounded-full',
                                      isSelected ? 'bg-primary' : 'bg-muted-foreground'
                                    )}
                                  />
                                  {feat}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {errors.type && (
                  <p className="text-destructive text-sm mt-2 font-medium">{errors.type.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 sm:p-6 border-t bg-muted/20 shrink-0 gap-3 sm:gap-2 flex-col-reverse sm:flex-row">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 w-full sm:w-auto px-8">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="h-10 w-full sm:w-auto px-8">
              {loading
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
