'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboardIcon, EditIcon, File, AlertCircle, ExternalLink } from 'lucide-react';
import { ThemeCustomizer } from '@/components/customizer';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { APIResponseProject } from '@/types/api-response';

type HeaderProps<T> = {
  tab: string;
  error?: string;
  project: APIResponseProject | null;
  onTabChange: (value: string) => void;
  onSave: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  onPublish: (isPublished: boolean) => Promise<void>;
};

export function FormHeader<T>({
  project,
  tab,
  onTabChange,
  onSave,
  error,
  onPublish,
}: HeaderProps<T>) {
  const [slug, setSlug] = useState('sebastech');
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);

  const isPublished = useMemo(() => project?.published, [project?.published]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="capitalize font-semibold">An Error Occurred</AlertTitle>
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          <Label className="">Domain</Label>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-32 shadow"
              />
              <span className="text-gray-500 dark:text-gray-400 font-mono ml-1">.kislap.app</span>
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant={isPublished ? 'default' : 'outline'}
                onClick={() => onPublish(!isPublished)}
              >
                {isPublished ? 'Unpublish' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList>
              <TabsTrigger value="overview">
                <LayoutDashboardIcon className="mr-1" /> Overview
              </TabsTrigger>
              <TabsTrigger value="edit">
                <EditIcon className="mr-1" /> Edit
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="shadow-none" onClick={onSave}>
              <File className="size-4" />
              Save
            </Button>
            <Button asChild={true} variant="secondary" className="shadow-none">
              <Link
                href={`//${project?.sub_domain}.kislap.test/preview?token=sample_token`}
                target="_blank"
              >
                <ExternalLink className="size-4" />
                Preview
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>

      <ThemeCustomizer open={isThemeCustomizerOpen} setOpen={setIsThemeCustomizerOpen} />
    </Card>
  );
}
