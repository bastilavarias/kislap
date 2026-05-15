import { ProjectList } from '@/app/\(private\)/dashboard/components/projects-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  BuilderPageHeader,
  BuilderPageShell,
  builderSecondaryButtonClass,
} from '@/components/builder/builder-ui';

export default function Page() {
  return (
    <BuilderPageShell>
      <BuilderPageHeader
        eyebrow="Project desk"
        title="Manage the pages you publish."
        description="Open a builder, check live status, or start a new portfolio, link page, or digital menu."
        action={
          <Button asChild className={builderSecondaryButtonClass}>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        }
      />
      <div className="flex flex-col gap-4 py-2 md:gap-6">
        <ProjectList />
      </div>
    </BuilderPageShell>
  );
}
