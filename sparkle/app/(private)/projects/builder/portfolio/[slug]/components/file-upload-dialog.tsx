'use client';

import { useState } from 'react';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FilePlus2 } from 'lucide-react';

export function FileUploadDialog() {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="cursor-pointer shadow-none">
            <FilePlus2 className="size-4" />
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[420px] md:max-w-[620px] lg:max-w-[820px]">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, cum.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6">
            <Dropzone
              className="shadow-none"
              accept={{ 'pdf/*': [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 10}
              minSize={1024}
              onDrop={handleDrop}
              onError={console.error}
              src={files}
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="w-24">
              Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
