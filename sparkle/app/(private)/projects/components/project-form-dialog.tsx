'use client';

import { useState } from 'react';
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
import { useProject } from '@/hooks/api/useProject';

const projectTypes = [
  { label: 'portfolio', emoji: '📄', url: '/projects/builder/resume/new' },
  { label: 'biz', emoji: '🏢', url: '/projects/builder/biz/new' },
  { label: 'waitlist', emoji: '🚀', url: '/projects/builder/waitlist/new' },
  { label: 'links', emoji: '🔗', url: '/projects/builder/link/new' },
];

export function ProjectFormDialog() {
  const { create } = useProject();

  const [form, setForm] = useState({
    name: '',
    description: '',
    sub_domain: '',
    type: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await create(form.name, form.description, form.sub_domain, form.type);
      console.log('Project created:', res);
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold">NEW PROJECT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new Project</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="My Online Portfolio"
              />
            </div>

            <div>
              <Label className="font-medium mb-2">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description here..."
              />
            </div>

            <div>
              <Label className="font-medium mb-2">Domain</Label>
              <div className="relative flex items-center">
                <Input
                  value={form.sub_domain}
                  onChange={(e) => handleChange('sub_domain', e.target.value)}
                  className="w-full shadow-none"
                />
                <span className="text-gray-500 font-mono ml-1">.kislap.test</span>
              </div>
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
                        variant={form.type === project.label ? 'secondary' : 'outline'}
                        onClick={() => handleChange('type', project.label)}
                      >
                        {form.type === project.label ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Process</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
