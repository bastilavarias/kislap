'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  ExternalLink,
  Save,
  Rocket,
  Layout,
  BarChart3,
  Zap,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
  PenTool,
  Edit,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APIResponseProject } from '@/types/api-response';
import { cn } from '@/lib/utils';
import { ProjectFormDialog } from '@/components/project-form-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props<T> {
  error?: string;
  project: APIResponseProject | null;
  hasContent: boolean;
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
      <Card className="rounded-xl shadow-sm border-border/60 bg-card/80 backdrop-blur-md sticky top-4 z-50 overflow-hidden py-0">
        <CardContent className="p-3 md:p-4 flex flex-col gap-4">
          {error && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize font-semibold">System Alert</AlertTitle>
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-3 overflow-hidden mr-2">
                <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <ProjectIcon className="h-5 w-5" />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-base md:text-lg leading-none tracking-tight truncate max-w-[120px] md:max-w-[200px]">
                      {project?.name || 'Untitled'}
                    </h1>
                    <Badge
                      variant={isPublished ? 'default' : 'secondary'}
                      className={cn(
                        'text-[10px] h-5 px-1.5 font-mono uppercase tracking-wider shrink-0',
                        isPublished
                          ? 'bg-green-500/15 text-green-600'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isPublished ? 'Live' : 'Draft'}
                    </Badge>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsDialogOpen(true)}
                            className="h-6 w-6 text-muted-foreground shrink-0 ml-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Project</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <a
                      href={liveUrl}
                      target="_blank"
                      className="hover:text-primary hover:underline truncate max-w-[200px]"
                    >
                      {liveUrl}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex md:hidden items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => setIsPublishConfirmOpen(true)}
                  className="h-8 px-3 text-xs font-bold transition-all shadow-none"
                  variant="outline"
                >
                  Save
                </Button>

                <Button
                  size="sm"
                  onClick={() => setIsPublishConfirmOpen(true)}
                  className={cn(
                    'h-8 px-3 text-xs font-bold transition-all',
                    isPublished ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-primary'
                  )}
                >
                  {isPublished ? 'Stop' : 'Publish'}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href={liveUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" /> View Live Site
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="w-full md:w-auto flex justify-center order-last md:order-none">
              <div className="grid grid-cols-2 w-full md:w-auto md:flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
                <Button
                  asChild
                  variant={!isEditPage ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-8 px-4 transition-all w-full md:w-auto',
                    !isEditPage && 'bg-background shadow-sm font-semibold'
                  )}
                >
                  <Link
                    href={`/dashboard/builder/${project?.type || 'portfolio'}/${project?.slug}`}
                  >
                    <Eye className="w-3.5 h-3.5 mr-2 opacity-70" />
                    Preview
                  </Link>
                </Button>

                <Button
                  asChild
                  variant={isEditPage ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-8 px-4 transition-all w-full md:w-auto',
                    isEditPage && 'bg-background shadow-sm font-semibold'
                  )}
                >
                  <Link
                    href={`/dashboard/builder/${project?.type || 'portfolio'}/${project?.slug}/edit`}
                  >
                    <PenTool className="w-3.5 h-3.5 mr-2 opacity-70" />
                    Editor
                  </Link>
                </Button>
              </div>
            </div>

            {/* --- RIGHT COL (Desktop Only): Toolbar --- */}
            <div className="hidden md:flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaveConfirmOpen(true)}
                className="h-9 border-border/60 hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button
                size="sm"
                onClick={() => setIsPublishConfirmOpen(true)}
                className={cn(
                  'h-9 font-bold shadow-sm transition-all duration-300 min-w-[110px]',
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

              <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
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
              This will overwrite the current version of your project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveConfirm}>Yes, Save</AlertDialogAction>
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
                      <span className="font-semibold text-primary">{liveUrl}</span>
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
