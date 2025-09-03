'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLinkIcon, LayoutDashboardIcon, EditIcon } from 'lucide-react';
import { ThemeCustomizer } from '@/components/customizer';
import Link from 'next/link';

type HeaderProps = {
  tab: string;
  onTabChange: (value: string) => void;
};

export function FormHeader({ tab, onTabChange }: HeaderProps) {
  const [slug, setSlug] = useState('sebastech');
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);

  return (
    <div>
      <div className="p-4 border rounded-md shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-32" />
            <span className="text-gray-500 font-mono ml-1">.kislap.com</span>
          </div>

          <div className="ml-auto flex gap-2">
            <Button variant="outline">Save</Button>
            <Button>Publish</Button>
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
          <Button asChild={true} variant="secondary">
            <Link href="/p/resume">Preview</Link>
          </Button>
        </div>
      </div>

      <ThemeCustomizer open={isThemeCustomizerOpen} setOpen={setIsThemeCustomizerOpen} />
    </div>
  );
}
