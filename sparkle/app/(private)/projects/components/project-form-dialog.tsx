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

const projectTypes = [
  {
    label: 'portfolio',
    emoji: '🎨',
    active: true,
    description: 'Showcase your personal or professional work in a clean, modern portfolio.',
    features: ['Customizable templates', 'Responsive design', 'Easy media upload'],
  },
  {
    label: 'biz',
    emoji: '💼',
    active: false,
    description: 'Create a professional business website to attract clients and customers.',
    features: ['Company info pages', 'Service showcase', 'Contact forms'],
  },
  {
    label: 'waitlist',
    emoji: '⏳',
    active: false,
    description: 'Build hype and gather early users for your upcoming project or app.',
    features: ['Sign-up forms', 'Email notifications', 'Analytics dashboard'],
  },
  {
    label: 'links',
    emoji: '🔗',
    active: false,
    description: 'Aggregate all your important links in a single, shareable page.',
    features: ['Social links', 'Custom branding', 'Easy sharing'],
  },
];

export function ProjectFormDialog() {
  const { create } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      sub_domain: '',
      type: '',
      published: false,
    },
  });

  const currentType = watch('type');

  const onSubmit = async (form: ProjectFormValues) => {
    setError('');
    setLoading(true);
    const { success, data, message } = await create(form);
    if (success && data) {
      router.push(`/projects/builder/${currentType}/${data.slug}`);
      return;
    }
    setLoading(false);
    setError(message);
  };

  useEffect(() => {
    setValue('type', 'portfolio');
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold">NEW PROJECT</Button>
      </DialogTrigger>
      {/* 1. Added 'max-h-[90vh]' to ensure it fits on screen
         2. Added 'flex flex-col' to manage header/content/footer layout 
         3. 'overflow-hidden' prevents double scrollbars
      */}
      <DialogContent className="sm:max-w-[420px] md:max-w-[620px] lg:max-w-[900px] max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-h-full">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <DialogTitle className="text-2xl font-bold">Create New Project</DialogTitle>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 pt-2">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle className="capitalize ml-2">{error}</AlertTitle>
              </Alert>
            )}

            <div className="space-y-6">
              {/* Project Details Section */}
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
                        className="shadow-sm pr-24" // padding for the suffix
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

                <div className="h-full">
                  <Label className="font-medium mb-1.5 block">Description</Label>
                  <Textarea
                    {...register('description')}
                    className="shadow-sm h-[calc(100%-28px)] min-h-[100px] resize-none"
                    placeholder="A brief description of what this project is about..."
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Project Type Selection */}
              <div>
                <Label className="font-medium mb-3 block text-lg">Select Project Type</Label>
                {/* Responsive Grid: 1 col on mobile, 2 cols on tablet+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectTypes.map((project) => {
                    const isActive = project.active;
                    const isSelected = currentType === project.label;

                    return (
                      <Card
                        key={project.label}
                        className={cn(
                          'relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer text-left group',
                          isSelected
                            ? 'border-primary ring-1 ring-primary shadow-md bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:shadow-sm',
                          !isActive && 'opacity-60 cursor-not-allowed bg-muted/50'
                        )}
                        onClick={() => {
                          if (isActive) {
                            setValue('type', project.label, { shouldValidate: true });
                          }
                        }}
                      >
                        {/* Selection Indicator */}
                        <div
                          className={cn(
                            'absolute top-3 right-3 w-4 h-4 rounded-full border border-primary transition-colors flex items-center justify-center',
                            isSelected ? 'bg-primary' : 'bg-transparent',
                            !isActive && 'hidden'
                          )}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>

                        {/* Coming Soon overlay */}
                        {!isActive && (
                          <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] flex items-center justify-center z-10 select-none">
                            <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm">
                              Coming Soon
                            </span>
                          </div>
                        )}

                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">{project.emoji}</span>
                            <span className="capitalize">{project.label}</span>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground mb-3 leading-snug min-h-[40px]">
                            {project.description}
                          </p>

                          {/* Features List */}
                          {project.features && (
                            <ul className="space-y-1">
                              {project.features.map((feat, idx) => (
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

          <DialogFooter className="p-6 border-t bg-muted/20 shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 px-8">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="h-10 px-8">
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
