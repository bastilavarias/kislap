'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormValues, ProjectSchema } from '@/lib/schemas/project';
import { useProject } from '@/hooks/api/useProject';

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

const projectTypes = [
  { label: 'portfolio', emoji: '📄' },
  { label: 'biz', emoji: '🏢' },
  { label: 'waitlist', emoji: '🚀' },
  { label: 'links', emoji: '🔗' },
];

export function ProjectFormDialog() {
  const { create } = useProject();
  const [loading, setLoading] = useState(false);

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
    },
  });

  const currentType = watch('type');

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);

    try {
      const res = await create(data.name, data.description ?? '', data.sub_domain, data.type);
      setLoading(false);
      console.log('Project created:', res);
    } catch (err) {
      setLoading(false);
      console.error('Error creating project:', err);
    }
  };

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
              <div>
                <Label className="font-medium mb-2">Name</Label>
                <Input
                  {...register('name')}
                  placeholder="My Online Portfolio"
                  className="w-full shadow-none"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label className="font-medium mb-2">Description</Label>
                <Textarea
                  {...register('description')}
                  placeholder="Description here..."
                  className="w-full shadow-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label className="font-medium mb-2">Domain</Label>
                <div className="relative flex items-center">
                  <Input {...register('sub_domain')} className="w-full shadow-none" />
                  <span className="text-gray-500 font-mono ml-1">.kislap.test</span>
                </div>
                {errors.sub_domain && (
                  <p className="text-red-500 text-sm mt-1">{errors.sub_domain.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="font-medium mb-2">Project type</Label>
              <div className="grid grid-cols-2 gap-6">
                {projectTypes.map((project) => (
                  <Card key={project.label} className="shadow-none">
                    <CardHeader className="pb-0 mb-0">
                      <CardTitle className="text-3xl flex items-center gap-1">
                        {project.emoji}
                        <p className="text-xl font-semibold capitalize">{project.label}</p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-0 pt-0">
                      <div className="flex justify-between items-center">
                        <small>Lorem ipsum</small>
                        <Button
                          type="button"
                          variant={currentType === project.label ? 'default' : 'outline'}
                          onClick={() => setValue('type', project.label, { shouldValidate: true })}
                        >
                          {currentType === project.label ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing' : 'Process'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
