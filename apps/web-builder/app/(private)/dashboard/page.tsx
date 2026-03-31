import { ProjectList } from '@/app/\(private\)/dashboard/components/projects-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between">
        <div className="flex gap-1">
          <div className="text-3xl">📁</div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground">
              Manage and customize all of your projects.
            </p>
          </div>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <ProjectList />
      </div>
    </div>
  );
}
