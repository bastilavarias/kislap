'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProject } from '@/hooks/api/use-project';
import type { APIResponseProject } from '@/types/api-response';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { cn } from '@/lib/utils';

import {
  MoreHorizontal,
  Layout,
  BarChart3,
  ExternalLink,
  Zap,
  Globe,
  CalendarDays,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  ArrowUpRight,
} from 'lucide-react';

const typeConfig: Record<string, { label: string; color: string; icon: any; projectName: string }> =
  {
    portfolio: {
      label: 'Portfolio',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      icon: Layout,
      projectName: 'portfolio',
    },
    biz: {
      label: 'Business',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      icon: BarChart3,
      projectName: 'biz',
    },
    links: {
      label: 'Link-in-Bio',
      color: 'text-pink-600 bg-pink-50 border-pink-200',
      icon: ExternalLink,
      projectName: 'linktree',
    },
    waitlist: {
      label: 'Waitlist',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      icon: Zap,
      projectName: 'waitlist',
    },
  };

interface ProjectCardProps {
  project: APIResponseProject;
  onEdit: (project: APIResponseProject) => void;
  onDelete: (id: number) => void;
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
  const rootDomain = process.env.NEXT_PUBLIC_SHINE_SUFFIX_URL || 'kislap.test';
  const liveUrl = project?.sub_domain ? `${urlPrefix}${project.sub_domain}.${rootDomain}` : '#';

  const typeInfo = typeConfig[project.type] || typeConfig.portfolio;

  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group relative flex flex-col bg-card hover:bg-muted/20 border border-border/60 hover:border-primary/20 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative h-32 w-full overflow-hidden rounded-t-xl bg-muted/30 border-b border-border/40">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div
            className={cn(
              'h-12 w-12 rounded-xl flex items-center justify-center shadow-sm border bg-background/50 backdrop-blur-sm',
              typeInfo.color
            )}
          >
            <typeInfo.icon className="w-6 h-6 opacity-90" />
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className={cn(
              'px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border backdrop-blur-md',
              project.published
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
            )}
          >
            {project.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <Link
              href={`/dashboard/builder/${typeInfo.projectName}/${project.slug}`}
              className="block font-semibold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors"
            >
              {project.name}
            </Link>

            {project.sub_domain && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-3 h-3" />
                <span>{liveUrl}</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/link:opacity-100 transition-all" />
              </a>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-muted-foreground/50"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/builder/${project.type}/${project.slug}`}
                  className="cursor-pointer"
                >
                  <Layout className="mr-2 h-4 w-4 text-muted-foreground" /> Open Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" /> Edit Details
              </DropdownMenuItem>
              {project.sub_domain && (
                <DropdownMenuItem asChild>
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" /> View Live Site
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed mb-6">
          {project.description || 'No description provided.'}
        </p>

        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
            <span>{createdDate}</span>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary font-medium">
            <span>Manage</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[280px] rounded-xl border border-border/40 bg-muted/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (booted && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-border/60 bg-muted/5">
        <h3 className="text-xl font-semibold tracking-tight mb-2">Create your first project</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
          You haven't created any portfolios yet. Launch your first site in minutes.
        </p>
        <div className="relative">
          <ProjectFormDialog onOpenChange={handleDialogChange} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={setDeletingId}
          />
        ))}

        <div
          className="group relative flex flex-col items-center justify-center h-full min-h-[300px] border border-dashed border-border/60 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={() => setIsEditOpen(true)}
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-muted-foreground cursor-pointer" />
          </div>
          <span className="font-medium text-muted-foreground">Create New Project</span>
        </div>
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
