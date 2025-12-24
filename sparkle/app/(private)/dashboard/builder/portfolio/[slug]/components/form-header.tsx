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
  CheckCircle2,
  XCircle,
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

interface Props<T> {
  error?: string;
  project: APIResponseProject | null;
  hasContent: boolean; // Treating this as "Basic Info"
  hasContentWorkExperience: boolean;
  hasContentEducation: boolean;
  hasContentProjects: boolean;
  hasContentSkills: boolean;
  hasLayout: boolean;
  hasTheme: boolean;

  onTabChange?: (value: string) => void;
  onSave: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  onPublish: (isPublished: boolean) => Promise<void>;
}

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

export function FormHeader<T>({
  project,
  onSave,
  error,
  onPublish,
  hasContent,
  hasContentWorkExperience,
  hasContentEducation,
  hasContentProjects,
  hasContentSkills,
  hasLayout,
  hasTheme,
}: Props<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isPublished = useMemo(() => project?.published, [project?.published]);
  const isEditPage = pathname.endsWith('/edit');
  const ProjectIcon = getProjectIcon(project?.type);

  const isContentReady =
    hasContent &&
    hasContentWorkExperience &&
    hasContentEducation &&
    hasContentProjects &&
    hasContentSkills;

  const isReadyToPublish = isContentReady && hasLayout && hasTheme;

  const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'kislap.test';
  const liveUrl = project?.sub_domain ? `${urlPrefix}${project.sub_domain}.${rootDomain}` : '#';

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      router.refresh();
    }
  };

  const handlePublishConfirm = async () => {
    if (!isPublished && !isReadyToPublish) return;
    await onPublish(!isPublished);
    setIsPublishConfirmOpen(false);
  };

  const handleSaveConfirm = async () => {
    await onSave();
    setIsSaveConfirmOpen(false);
  };

  // Helper component for checklist items
  const RequirementItem = ({
    label,
    met,
    nested = false,
  }: {
    label: string;
    met: boolean;
    nested?: boolean;
  }) => (
    <div
      className={cn(
        'flex items-center gap-3 p-2 rounded-md border border-transparent transition-colors',
        nested ? 'ml-6 text-sm py-1 h-8' : 'bg-muted/30 hover:border-border/50'
      )}
    >
      {met ? (
        <CheckCircle2 className={cn('text-green-500', nested ? 'w-4 h-4' : 'w-5 h-5')} />
      ) : (
        <XCircle className={cn('text-destructive/70', nested ? 'w-4 h-4' : 'w-5 h-5')} />
      )}
      <span
        className={cn(
          'font-medium',
          met ? 'text-foreground' : 'text-muted-foreground',
          nested && 'text-xs font-normal'
        )}
      >
        {label}
      </span>
    </div>
  );

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

            {/* CENTER: Navigation */}
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

      {/* PUBLISH CONFIRMATION DIALOG */}
      <AlertDialog open={isPublishConfirmOpen} onOpenChange={setIsPublishConfirmOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPublished
                ? 'Unpublish Project?'
                : !isReadyToPublish
                  ? 'Requirements Missing'
                  : 'Ready to Publish?'}
            </AlertDialogTitle>

            <div className="text-sm text-muted-foreground mt-2">
              {isPublished ? (
                <p>
                  This will make your project inaccessible to the public. You can republish it at
                  any time.
                </p>
              ) : (
                <div className="space-y-4">
                  <p>
                    {!isReadyToPublish
                      ? 'Complete the following sections to go live:'
                      : 'Your project is ready! Confirm your checklist:'}
                  </p>

                  <div className="flex flex-col gap-1">
                    {/* Top Level: Content with Nested Items */}
                    <div className="bg-muted/30 rounded-md pb-2">
                      <RequirementItem label="Content Sections" met={isContentReady} />
                      <div className="flex flex-col gap-0.5 mt-1">
                        <RequirementItem label="Basic Info" met={hasContent} nested />
                        <RequirementItem
                          label="Work Experience"
                          met={hasContentWorkExperience}
                          nested
                        />
                        <RequirementItem label="Education" met={hasContentEducation} nested />
                        <RequirementItem label="Projects" met={hasContentProjects} nested />
                        <RequirementItem label="Skills" met={hasContentSkills} nested />
                      </div>
                    </div>

                    <RequirementItem label="Layout Selected" met={hasLayout} />

                    <RequirementItem label="Theme Configured" met={hasTheme} />
                  </div>

                  {isReadyToPublish && (
                    <p className="text-xs text-muted-foreground mt-2 bg-primary/5 p-3 rounded border border-primary/10">
                      🚀 Making live at{' '}
                      <span className="font-semibold text-primary">
                        {project?.sub_domain}.{rootDomain}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              disabled={!isPublished && !isReadyToPublish}
              className={cn(
                isPublished
                  ? 'bg-destructive text-white hover:bg-destructive/90'
                  : !isReadyToPublish
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
              )}
            >
              {isPublished ? 'Yes, Unpublish' : 'Yes, Publish Live'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
