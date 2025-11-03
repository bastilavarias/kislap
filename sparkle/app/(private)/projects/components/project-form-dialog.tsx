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
import { AlertCircleIcon, Wrench } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

const projectTypes = [
  {
    label: 'portfolio',
    emoji: '📄',
    active: true,
    description: 'Showcase your personal or professional work in a clean, modern portfolio.',
    features: ['Customizable templates', 'Responsive design', 'Easy media upload'],
  },
  {
    label: 'biz',
    emoji: '🏢',
    active: false,
    description: 'Create a professional business website to attract clients and customers.',
    features: ['Company info pages', 'Service showcase', 'Contact forms'],
  },
  {
    label: 'waitlist',
    emoji: '🚀',
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
      <DialogContent className="sm:max-w-[420px] md:max-w-[620px] lg:max-w-[820px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create new Project</DialogTitle>
          </DialogHeader>

          <div className="py-5">
            <div className="grid grid-cols-1 gap-6 mb-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle className="capitalize">{error}</AlertTitle>
                </Alert>
              )}

              <div>
                <Label className="font-medium mb-2">Name</Label>
                <Input
                  {...register('name')}
                  placeholder="My Online Portfolio"
                  className="w-full shadow-none"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label className="font-medium mb-2">Domain</Label>
                <div className="relative flex items-center">
                  <Input
                    {...register('sub_domain')}
                    placeholder="myportfolio"
                    className="w-full shadow-none"
                  />
                  <span className="text-gray-500 font-mono ml-1">.kislap.test</span>
                </div>
                {errors.sub_domain && (
                  <p className="text-destructive text-sm mt-1">{errors.sub_domain.message}</p>
                )}
              </div>

              <div>
                <Label className="font-medium mb-2">Description</Label>
                <Textarea {...register('description')} className="w-full shadow-none" />
                {errors.description && (
                  <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="font-medium mb-2">Project type</Label>
              <div className="grid grid-cols-2 gap-6">
                {projectTypes.map((project) => {
                  const isActive = project.active;
                  const isSelected = currentType === project.label;

                  return (
                    <Card
                      key={project.label}
                      className={`relative overflow-hidden rounded-xl border transition-all duration-300
    ${isSelected ? 'border-primary shadow-lg' : 'border-border hover:shadow-md'}
    ${!isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {/* Coming Soon overlay */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                          <span className="text-white font-bold text-2xl tracking-wide uppercase text-center">
                            Coming Soon!
                          </span>
                        </div>
                      )}

                      {/* Card Header */}
                      <CardHeader className="pb-1 relative z-20">
                        <CardTitle className="text-3xl flex items-center gap-2">
                          <span>{project.emoji}</span>
                          <p className="text-xl font-semibold capitalize">{project.label}</p>
                        </CardTitle>
                        {/* Purpose description */}
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                        )}
                      </CardHeader>

                      {/* Card Content */}
                      <CardContent className="pt-2 relative z-20">
                        <div className="flex flex-col gap-2">
                          {/* Features / Benefits */}
                          {project.features && project.features.length > 0 && (
                            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                              {project.features.map((feat, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                  {feat}
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Action button */}
                          <div className="flex justify-end mt-3">
                            <Button
                              type="button"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={() =>
                                setValue('type', project.label, { shouldValidate: true })
                              }
                              className={`shadow-none w-28 transition-transform duration-200
            ${!isActive ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                              disabled={!isActive}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {errors.type && (
                <p className="text-destructive text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="shadow-none">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="w-24">
              {loading ? 'Processing' : 'Process'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
