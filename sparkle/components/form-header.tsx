"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditIcon, EyeIcon, ExternalLinkIcon } from "lucide-react";

type HeaderProps = {
  tab: string;
  onTabChange: (value: string) => void;
};

export function FormHeader({ tab, onTabChange }: HeaderProps) {
  const [slug, setSlug] = useState("sebastech");

  return (
    <div className="p-4 border rounded-md shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-32"
          />
          <span className="text-gray-500 font-mono ml-1">.kislap.com</span>
        </div>

        <div className="ml-auto flex gap-2">
          <Button variant="outline">Unpublish</Button>
          <Button>
            Visit Site <ExternalLinkIcon />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={tab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="edit">
              <EditIcon className="mr-1" /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <EyeIcon className="mr-1" /> Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="secondary">Upload Resume</Button>
      </div>
    </div>
  );
}
