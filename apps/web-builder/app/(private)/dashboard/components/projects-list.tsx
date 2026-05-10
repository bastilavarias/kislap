'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProject } from '@/hooks/api/use-project';
import type { APIResponseProject } from '@/types/api-response';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProjectFormDialog } from '@/components/project-form-dialog';
import { builderSecondaryButtonClass } from '@/components/builder/builder-ui';
import { ProjectCard } from './project-card';

import { Loader2, Plus, Trash2 } from 'lucide-react';

export function ProjectList() {
  const { getList, remove } = useProject();

  const [projects, setProjects] = useState<APIResponseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [booted, setBooted] = useState(false);

  const [editingProject, setEditingProject] = useState<APIResponseProject | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onGetProjects = async () => {
    setLoading(true);
    const { success, data, message } = await getList();
    if (success && data) setProjects(data);
    else toast.error(message || 'Failed to fetch projects');

    setLoading(false);
    setBooted(true);
  };

  useEffect(() => {
    onGetProjects();
  }, []);

  const handleEdit = (project: APIResponseProject) => {
    setEditingProject(project);
    setIsEditOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleteLoading(true);
    try {
      const { success, message } = await remove(deletingId);
      if (success) {
        toast.success('Project deleted');
        await onGetProjects();
      } else {
        toast.error(message || 'Failed to delete');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsDeleteLoading(false);
      setDeletingId(null);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setTimeout(() => onGetProjects(), 500);
      setEditingProject(null);
    }
  };

  if (!booted || loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[340px] animate-pulse border-4 border-black bg-white shadow-[6px_6px_0_#000]"
          />
        ))}
      </div>
    );
  }

  if (booted && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-4 border-black bg-white px-6 py-24 text-center shadow-[8px_8px_0_#000]">
        <h3 className="mb-2 text-3xl font-black uppercase tracking-normal">Create your first project</h3>
        <p className="mx-auto mb-8 max-w-sm font-semibold leading-relaxed text-muted-foreground">
          Start with a portfolio, link page, or digital menu and we will give you a stronger first draft to build from.
        </p>
        <Button asChild className={builderSecondaryButtonClass}>
          <Link href="/dashboard/projects/new">Choose a starter</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-flow-dense grid-cols-1 gap-6 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={setDeletingId}
          />
        ))}

        <Link
          href="/dashboard/projects/new"
          className="group relative flex min-h-[340px] flex-col overflow-hidden border-4 border-dashed border-black bg-secondary p-6 shadow-[6px_6px_0_#000] transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_#000] transition-transform group-hover:scale-105">
            <Plus className="h-6 w-6 text-black" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black uppercase tracking-normal text-black">
              Start something new
            </h3>
            <p className="text-sm font-semibold leading-relaxed text-black/75">
              Pick the right builder, preview the layout and theme, then create the project with
              a stronger first draft.
            </p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-8">
            <Badge variant="secondary" className="rounded-none border-2 border-black bg-white px-3 py-1 font-mono text-xs font-black uppercase shadow-none">
              Portfolio
            </Badge>
            <Badge variant="secondary" className="rounded-none border-2 border-black bg-white px-3 py-1 font-mono text-xs font-black uppercase shadow-none">
              Linktree
            </Badge>
            <Badge variant="secondary" className="rounded-none border-2 border-black bg-white px-3 py-1 font-mono text-xs font-black uppercase shadow-none">
              Menu
            </Badge>
          </div>
        </Link>
      </div>

      <ProjectFormDialog
        open={isEditOpen}
        onOpenChange={handleDialogChange}
        project={editingProject}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently delete{' '}
              <strong>{projects.find((p) => p.id === deletingId)?.name}</strong> and take it
              offline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleteLoading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
