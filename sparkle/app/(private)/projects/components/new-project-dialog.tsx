'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const projectTypes = [
  { label: 'Online Resume', emoji: '📄', url: '/projects/builder/resume/new' },
  { label: 'Business Website', emoji: '🏢', url: '/projects/builder/biz/new' },
  { label: 'Startup Waitlists', emoji: '🚀', url: '/projects/builder/waitlist/new' },
  { label: 'Link-in-bio Page', emoji: '🔗', url: '/projects/builder/link/new' },
];

export function NewProjectDialog() {
  const [projectType, setProjectType] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-bold">NEW PROJECT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px] xl:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Create new Project</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <Label className="font-medium mb-2">Name</Label>
            <Input className="w-full shadow-none" placeholder="My Online Portfolio" />
          </div>

          <div>
            <Label className="font-medium mb-2">Description</Label>
            <Textarea className="w-full shadow-none" placeholder="Descriptio here..." />
          </div>

          <div>
            <Label className="font-medium mb-2">Domain</Label>
            <div className="relative flex items-center">
              <Input className="w-full shadow-none" />
              <span className="text-gray-500 font-mono ml-1">.kislap.test</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="font-medium mb-2">Project type</Label>
          <div className="grid grid-cols-2 gap-6">
            {projectTypes.map((project) => (
              <Card className="shadow-none" key={project.label}>
                <CardHeader className="pb-0 mb-0">
                  <CardTitle className="text-3xl flex items-center gap-1">
                    {project.emoji}
                    <p className="text-xl font-semibold">{project.label}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-0 pt-0">
                  <div className="flex justify-between items-center">
                    <small>Lorem ipsum</small>
                    <Button
                      className="shadow-none"
                      variant={
                        project.label.toLowerCase() === projectType ? 'secondary' : 'outline'
                      }
                      onClick={() => setProjectType(project.label.toLowerCase())}
                    >
                      {project.label.toLowerCase() === projectType ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}{' '}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Process</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
