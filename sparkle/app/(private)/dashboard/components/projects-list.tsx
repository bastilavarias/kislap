'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/hooks/api/use-project';
import type { APIResponseProject } from '@/types/api-response';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Eye,
  MoreVertical,
  Calendar,
  Globe,
  BarChart3,
  Zap,
  Layout,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { ProjectFormDialog } from '@/components/project-form-dialog';

// --- Types ---
export interface APIResponsePortfolio {
  id: number;
  name: string;
  [key: string]: any;
}

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  portfolio: {
    label: 'Portfolio',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: Layout,
  },
  biz: {
    label: 'Business',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: BarChart3,
  },
  links: {
    label: 'Link-in-Bio',
    color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    icon: ExternalLink,
  },
  waitlist: {
    label: 'Waitlist',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    icon: Zap,
  },
};

// Robust, standard Tailwind gradients that won't fail
const coverPatterns = [
  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500',
  'bg-gradient-to-bl from-emerald-400 via-teal-500 to-blue-600',
  'bg-gradient-to-r from-amber-200 via-orange-400 to-rose-600',
  'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900', // Deep Space
  'bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500',
  'bg-gradient-to-bl from-blue-600 via-violet-600 to-indigo-900', // Midnight
  'bg-gradient-to-r from-emerald-500 to-lime-600',
];

interface ProjectCardProps {
  project: APIResponseProject;
  onEdit: (project: APIResponseProject) => void;
  onDelete: (id: number) => void;
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const typeInfo = typeConfig[project.type] || typeConfig.portfolio;
  const createdDate = new Date(project.created_at);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Select a deterministic pattern based on ID
  const coverClass = coverPatterns[(project.id || 0) % coverPatterns.length];

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-border/60 bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1">
      {/* Abstract Cover Image Placeholder */}
      <div className={cn('relative h-40 w-full overflow-hidden', coverClass)}>
        {/* Mosaic/Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />

        {/* Subtle dark gradient at bottom for text contrast if needed */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant={project.published ? 'default' : 'secondary'}
            className={cn(
              'font-semibold shadow-sm backdrop-blur-md border-0',
              project.published
                ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white'
                : 'bg-black/40 hover:bg-black/50 text-white'
            )}
          >
            {project.published ? 'Live' : 'Draft'}
          </Badge>
        </div>

        {/* Project Type Icon (Floating) */}
        <div className="absolute -bottom-0 left-5 z-10">
          <div className="h-10 w-10 rounded-xl bg-background border shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <typeInfo.icon className="w-5 h-5 text-foreground/80" />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <CardContent className="pt-8 px-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1 w-full pr-2">
            <h3 className="font-bold text-lg leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-1">
              <Link
                href={`/dashboard/builder/${project.type}/${project.slug}`}
                className="focus:outline-none"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                {project.name}
              </Link>
            </h3>

            {project.sub_domain && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground relative z-20 w-fit">
                <Globe className="w-3 h-3" />
                <a
                  href={`https://${project.sub_domain}.kislap.app`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.sub_domain}.kislap.app
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                </a>
              </div>
            )}
          </div>

          <div className="relative z-20 -mr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/builder/${project.type}/${project.slug}`}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" /> Open Builder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(project)} className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`https://${project.sub_domain}.kislap.app`}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Visit Live Site
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => onDelete(project.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
          {project.description || 'No description provided. Click to add details.'}
        </p>
      </CardContent>

      {/* Minimal Footer */}
      <CardFooter className="px-5 py-4 border-t bg-muted/5 mt-auto">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground/70 font-medium">
          <div className="flex items-center gap-1.5" title="Date Created">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created {formattedDate}</span>
          </div>

          <div className="group-hover:text-primary transition-colors flex items-center gap-1">
            <span>Manage</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ProjectList() {
  const { getList, remove } = useProject();

  const [projects, setProjects] = useState<APIResponseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [booted, setBooted] = useState(false);

  // Edit State
  const [editingProject, setEditingProject] = useState<APIResponseProject | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const onGetProjects = async () => {
    setLoading(true);
    const { success, data, message } = await getList();

    if (success && data) {
      setProjects(data);
    } else {
      toast.error(message || 'Failed to fetch projects');
    }
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

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleteLoading(true);

    try {
      const { success, message } = await remove(deletingId);
      if (success) {
        toast.success('Project deleted successfully');
        await onGetProjects();
      } else {
        toast.error(message || 'Failed to delete project');
      }
    } catch (error) {
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
            className="h-[280px] bg-muted/40 rounded-xl border border-border/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (booted && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <Layout className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          You haven't created any portfolios yet. Start building your first project to share your
          work with the world.
        </p>
        <ProjectFormDialog onOpenChange={handleDialogChange} />
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
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      <ProjectFormDialog
        open={isEditOpen}
        onOpenChange={handleDialogChange}
        project={editingProject}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project and remove the
              data from our servers.
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
            >
              {isDeleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete Project'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
