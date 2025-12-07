'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  LayoutDashboardIcon,
  EditIcon,
  File,
  AlertCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { APIResponseProject } from '@/types/api-response';
import { cn } from '@/lib/utils';

type HeaderProps<T> = {
  error?: string;
  project: APIResponseProject | null;
  // onTabChange is kept for interface compatibility but not used for routing
  onTabChange?: (value: string) => void;
  onSave: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  onPublish: (isPublished: boolean) => Promise<void>;
};

export function FormHeader<T>({ project, onSave, error, onPublish }: HeaderProps<T>) {
  const [slug, setSlug] = useState('sebastech');

  const pathname = usePathname();
  const isPublished = useMemo(() => project?.published, [project?.published]);

  const isEditPage = pathname.endsWith('/edit');

  return (
    <Card className="rounded-xl shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex flex-col gap-6 p-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="capitalize font-semibold">An Error Occurred</AlertTitle>
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* --- Top Row: Domain & Publish Actions --- */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" /> Domain Configuration
            </Label>
          </div>

          <div className="flex items-center justify-between gap-4 p-1">
            {/* Styled Domain Input */}
            <div className="relative flex items-center group">
              <span className="text-muted-foreground/60 text-sm font-medium mr-1 transition-colors group-hover:text-muted-foreground">
                https://
              </span>
              <div className="relative">
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent border-b-2 border-border border-dashed outline-none w-auto min-w-[120px] font-bold text-foreground placeholder:text-muted-foreground/30 focus:border-primary focus:border-solid transition-all py-0.5"
                  placeholder="your-project"
                />
              </div>
              <span className="text-muted-foreground/60 font-medium text-sm ml-0.5">
                .kislap.app
              </span>
            </div>

            {/* Publish Toggle */}
            <Button
              variant={isPublished ? 'outline' : 'default'}
              size="sm"
              onClick={() => onPublish(!isPublished)}
              className={cn(
                'font-bold transition-all duration-300',
                isPublished
                  ? 'border-green-500/30 bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700 hover:border-green-500/50'
                  : 'bg-primary text-primary-foreground shadow-md hover:shadow-lg'
              )}
            >
              {isPublished ? (
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </span>
              ) : (
                'Publish'
              )}
            </Button>
          </div>
        </div>

        {/* --- Bottom Row: Navigation & Actions --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-border/40">
          {/* Navigation Buttons (Replaces Tabs) */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              asChild
              variant={!isEditPage ? 'secondary' : 'ghost'}
              className={cn(
                'h-9 px-4 rounded-full transition-all duration-200',
                !isEditPage ? 'font-semibold ring-0' : 'text-muted-foreground'
              )}
            >
              <Link href={`/projects/builder/portfolio/${project?.slug || slug}`}>
                <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>

            <Button
              asChild
              variant={isEditPage ? 'secondary' : 'ghost'}
              className={cn(
                'h-9 px-4 rounded-full transition-all duration-200',
                isEditPage ? 'font-semibold ring-0' : 'text-muted-foreground'
              )}
            >
              <Link href={`/projects/builder/portfolio/${project?.slug || slug}/edit`}>
                <EditIcon className="w-4 h-4 mr-2" />
                Editor
              </Link>
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="flex-1 md:flex-none h-9 border-border/60"
            >
              <File className="w-4 h-4 mr-2 text-muted-foreground" />
              Save Changes
            </Button>

            <Button
              asChild
              size="sm"
              className="flex-1 md:flex-none h-9 bg-foreground text-background hover:bg-foreground/90 shadow-sm"
            >
              <Link
                href={`//${project?.sub_domain}.kislap.test/preview?token=sample_token`}
                target="_blank"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Site
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
