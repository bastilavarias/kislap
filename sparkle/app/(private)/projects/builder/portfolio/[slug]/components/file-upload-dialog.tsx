'use client';

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
} from '@/components/ui/dialog';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

interface Props {
  files: File[];
  onChangeFiles: any;
  onProcess: any;
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string;
}

export function FileUploadDialog({
  files,
  onChangeFiles,
  onProcess,
  loading,
  open,
  onOpenChange,
  error,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] md:max-w-[620px] lg:max-w-[820px]">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, cum.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle className="capitalize">{error}</AlertTitle>
            </Alert>
          )}

          <Dropzone
            className="shadow-none"
            accept={{ 'pdf/*': [] }}
            maxFiles={1}
            maxSize={1024 * 1024 * 10}
            minSize={1024}
            onDrop={onChangeFiles}
            onError={console.error}
            src={files}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>

        <DialogFooter>
          {/* Use DialogClose to let the Cancel button close the dialog via onOpenChange(false) */}
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {/* The Process button now calls our internal handler */}
          <Button className="w-24" onClick={onProcess} disabled={loading}>
            {loading ? 'Processing' : 'Process'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
