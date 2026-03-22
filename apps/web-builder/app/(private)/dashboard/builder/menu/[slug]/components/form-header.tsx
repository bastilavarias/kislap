'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  ExternalLink,
  LayoutDashboard,
  MoreHorizontal,
  PenTool,
  Rocket,
  Save,
  UtensilsCrossed,
  XCircle,
} from 'lucide-react';
import { APIResponseProject } from '@/types/api-response';
import { cn } from '@/lib/utils';
import { ProjectFormDialog } from '@/components/project-form-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  error?: string;
  project: APIResponseProject | null;
  hasContent: boolean;
  hasCategories: boolean;
  hasItems: boolean;
  hasLayout: boolean;
  hasTheme: boolean;
  onSave: () => Promise<void>;
  onPublish: (isPublished: boolean) => Promise<void>;
}

function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-muted/30 p-2">
      {met ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-destructive/70" />
      )}
      <span className={cn('font-medium', met ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </span>
    </div>
  );
}

export function FormHeader({
  project,
  onSave,
  error,
  onPublish,
  hasContent,
  hasCategories,
  hasItems,
  hasLayout,
  hasTheme,
}: Props) {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const isPublished = useMemo(() => project?.published, [project?.published]);
  const isEditPage = pathname.endsWith('/edit');
  const isReadyToPublish = hasContent && hasCategories && hasItems && hasLayout && hasTheme;
  const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
  const rootDomain = process.env.NEXT_PUBLIC_SHINE_SUFFIX_URL || 'kislap.test';
  const liveUrl = project?.sub_domain ? `${urlPrefix}${project.sub_domain}.${rootDomain}` : '#';

  const handlePublishConfirm = async () => {
    if (!isPublished && !isReadyToPublish) return;
    await onSave();
    await onPublish(!isPublished);
    setIsPublishConfirmOpen(false);
  };

  return (
    <>
      <Card className="sticky top-4 z-50 overflow-hidden rounded-xl border-border/60 bg-card/80 py-0 shadow-sm backdrop-blur-md">
        <CardContent className="flex flex-col gap-4 p-3 md:p-4">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>System Alert</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary md:flex">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="max-w-[180px] truncate text-base font-bold tracking-tight md:text-lg">
                      {project?.name || 'Untitled menu'}
                    </h1>
                    <Badge
                      variant={isPublished ? 'default' : 'secondary'}
                      className={cn(
                        'h-5 px-1.5 text-[10px] font-mono uppercase tracking-wider',
                        isPublished ? 'bg-green-500/15 text-green-600' : 'bg-muted text-muted-foreground'
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
                            className="h-6 w-6 text-muted-foreground"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Project</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden truncate text-xs text-muted-foreground hover:text-primary hover:underline md:block"
                  >
                    {liveUrl}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 md:hidden">
                <Button size="sm" variant="outline" onClick={() => setIsSaveConfirmOpen(true)}>
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsPublishConfirmOpen(true)}
                  className={cn(
                    isPublished ? 'border border-red-200 bg-red-100 text-red-600' : 'bg-primary'
                  )}
                >
                  {isPublished ? 'Unpublish' : 'Publish'}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href={liveUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Menu
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 rounded-lg border border-border/50 bg-muted/50 p-1 md:w-auto md:flex">
              <Button
                asChild
                variant={!isEditPage ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'h-8 w-full md:w-auto',
                  !isEditPage && 'bg-background shadow-sm font-semibold'
                )}
              >
                <Link href={`/dashboard/builder/menu/${project?.slug}`}>
                  <LayoutDashboard className="mr-2 h-3.5 w-3.5 opacity-70" />
                  Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant={isEditPage ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'h-8 w-full md:w-auto',
                  isEditPage && 'bg-background shadow-sm font-semibold'
                )}
              >
                <Link href={`/dashboard/builder/menu/${project?.slug}/edit`}>
                  <PenTool className="mr-2 h-3.5 w-3.5 opacity-70" />
                  Editor
                </Link>
              </Button>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="outline" size="sm" onClick={() => setIsSaveConfirmOpen(true)}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={() => setIsPublishConfirmOpen(true)}
                className={cn(
                  'min-w-[110px] font-bold',
                  isPublished
                    ? 'border border-red-200 bg-red-500/10 text-red-600 hover:bg-red-500/20'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                {isPublished ? (
                  'Unpublish'
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Publish
                  </>
                )}
              </Button>
              <Button asChild size="icon" variant="ghost">
                <a href={liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProjectFormDialog
        project={project}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        replaceURL={true}
      />

      <AlertDialog open={isSaveConfirmOpen} onOpenChange={setIsSaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite the current version of your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void onSave()}>Yes, Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isPublishConfirmOpen} onOpenChange={setIsPublishConfirmOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPublished
                ? 'Unpublish Menu?'
                : !isReadyToPublish
                  ? 'Requirements Missing'
                  : 'Ready to Publish?'}
            </AlertDialogTitle>
            <div className="mt-2 space-y-4 text-sm text-muted-foreground">
              {isPublished ? (
                <p>
                  This will make your menu inaccessible to the public until you publish it again.
                </p>
              ) : (
                <>
                  <p>
                    {isReadyToPublish
                      ? 'Your menu is ready. Confirm the checklist:'
                      : 'Complete the following before you go live:'}
                  </p>
                  <div className="space-y-2">
                    <RequirementItem label="Business profile" met={hasContent} />
                    <RequirementItem label="At least one category" met={hasCategories} />
                    <RequirementItem label="At least one item" met={hasItems} />
                    <RequirementItem label="Layout selected" met={hasLayout} />
                    <RequirementItem label="Theme configured" met={hasTheme} />
                  </div>
                </>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              disabled={!isPublished && !isReadyToPublish}
              className={cn(
                isPublished
                  ? 'bg-destructive text-white hover:bg-destructive/90'
                  : !isReadyToPublish && 'cursor-not-allowed opacity-50'
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
