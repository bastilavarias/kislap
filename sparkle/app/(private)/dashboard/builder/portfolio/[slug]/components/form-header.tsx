'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboardIcon,
  EditIcon,
  AlertCircle,
  ExternalLink,
  Globe,
  Settings,
  Save,
  Rocket,
  Layout,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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
import { APIResponseProject } from '@/types/api-response';
import { cn } from '@/lib/utils';
import { ProjectFormDialog } from '@/components/project-form-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type HeaderProps<T> = {
  error?: string;
  project: APIResponseProject | null;
  onTabChange?: (value: string) => void;
  onSave: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  onPublish: (isPublished: boolean) => Promise<void>;
};

// Helper to get icon based on type
const getProjectIcon = (type?: string) => {
  switch (type) {
    case 'biz':
      return BarChart3;
    case 'waitlist':
      return Zap;
    case 'portfolio':
    default:
      return Layout;
  }
};

export function FormHeader<T>({ project, onSave, error, onPublish }: HeaderProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Confirmation Dialog States
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isPublished = useMemo(() => project?.published, [project?.published]);
  const isEditPage = pathname.endsWith('/edit');
  const ProjectIcon = getProjectIcon(project?.type);

  // Construct the live URL
  const liveUrl = project?.sub_domain ? `https://${project.sub_domain}.kislap.app` : '#';

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      router.refresh();
    }
  };

  const handlePublishConfirm = async () => {
    await onPublish(!isPublished);
    setIsPublishConfirmOpen(false);
  };

  const handleSaveConfirm = async () => {
    await onSave();
    setIsSaveConfirmOpen(false);
  };

  return (
    <>
      <Card className="rounded-xl shadow-sm border-border/60 bg-card/80 backdrop-blur-md sticky top-4 z-50">
        <CardContent className="p-4 flex flex-col gap-4">
          {error && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize font-semibold">System Alert</AlertTitle>
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* LAYOUT CHANGE: 
            Using a 3-column grid on md+ screens ensures the center group 
            is truly centered regardless of the width of the left/right sections.
          */}
          <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-4">
            {/* LEFT: Project Identity */}
            <div className="flex items-center gap-4 w-full justify-start">
              <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <ProjectIcon className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg leading-none tracking-tight">
                    {project?.name || 'Untitled Project'}
                  </h1>
                  <Badge
                    variant={isPublished ? 'default' : 'secondary'}
                    className={cn(
                      'text-[10px] h-5 px-1.5 font-mono uppercase tracking-wider transition-colors',
                      isPublished
                        ? 'bg-green-500/15 text-green-600 hover:bg-green-500/25'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isPublished ? 'Live' : 'Draft'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 opacity-70" />
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary hover:underline transition-colors truncate max-w-[200px] md:max-w-[300px]"
                  >
                    {project?.sub_domain ? `${project.sub_domain}.kislap.app` : 'No domain set'}
                  </a>
                </div>
              </div>

              <div className="ml-auto md:ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDialogOpen(true)}
                        className="h-8 w-8 hover:bg-secondary hover:text-secondary-foreground"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Project Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
                <Button
                  asChild
                  variant={!isEditPage ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-8 px-4 transition-all',
                    !isEditPage && 'bg-background shadow-sm font-semibold'
                  )}
                >
                  <Link
                    href={`/dashboard/builder/${project?.type || 'portfolio'}/${project?.slug}`}
                  >
                    <LayoutDashboardIcon className="w-3.5 h-3.5 mr-2 opacity-70" />
                    Preview
                  </Link>
                </Button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                <Button
                  asChild
                  variant={isEditPage ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-8 px-4 transition-all',
                    isEditPage && 'bg-background shadow-sm font-semibold'
                  )}
                >
                  <Link
                    href={`/dashboard/builder/${project?.type || 'portfolio'}/${project?.slug}/edit`}
                  >
                    <EditIcon className="w-3.5 h-3.5 mr-2 opacity-70" />
                    Editor
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT: Actions Toolbar */}
            <div className="flex items-center gap-2 w-full justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaveConfirmOpen(true)}
                className="h-9 border-border/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button
                size="sm"
                onClick={() => setIsPublishConfirmOpen(true)}
                className={cn(
                  'h-9 font-bold shadow-sm transition-all duration-300 min-w-[100px]',
                  isPublished
                    ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-200 dark:border-red-900'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {isPublished ? (
                  <>Unpublish</>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>

              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-9 text-muted-foreground hover:text-primary px-3"
              >
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Site
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProjectFormDialog
        project={project}
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
        replaceURL={true}
      />

      <AlertDialog open={isSaveConfirmOpen} onOpenChange={setIsSaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite the current version of your project. Are you sure you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveConfirm}>Yes, Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={isPublishConfirmOpen} onOpenChange={setIsPublishConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPublished ? 'Unpublish Project?' : 'Publish Project?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isPublished
                ? 'This will make your project inaccessible to the public. You can republish it at any time.'
                : 'This will make your project live and visible to the public at your custom domain.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              className={cn(isPublished && 'bg-destructive text-white hover:bg-destructive/90')}
            >
              {isPublished ? 'Yes, Unpublish' : 'Yes, Publish Live'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
