'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboardIcon, EditIcon, File } from 'lucide-react';
import { ThemeCustomizer } from '@/components/customizer';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type HeaderProps = {
  tab: string;
  onTabChange: (value: string) => void;
};

export function FormHeader({ tab, onTabChange }: HeaderProps) {
  const [slug, setSlug] = useState('sebastech');
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label className="">Domain</Label>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-32 shadow"
              />
              <span className="text-gray-500 font-mono ml-1">.kislap.com</span>
            </div>

            <div className="ml-auto flex gap-2">
              <Button>Publish</Button>
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
            <Button variant="outline" className="shadow-none">
              <File className="size-4" />
              Save
            </Button>
            <Button asChild={true} variant="secondary" className="shadow-none">
              <Link href="/p/resume">Preview</Link>
            </Button>
          </div>
        </div>
      </CardContent>

      <ThemeCustomizer open={isThemeCustomizerOpen} setOpen={setIsThemeCustomizerOpen} />
    </Card>
  );
}
