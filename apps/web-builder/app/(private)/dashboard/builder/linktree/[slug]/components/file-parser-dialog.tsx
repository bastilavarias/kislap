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
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  FileText,
  Loader2,
  Scan,
  Sparkles,
  UploadCloud,
  X,
  FileSearch,
  Bot,
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  files: File[];
  loading: boolean;
  open: boolean;
  error: string;
  onChangeFiles: (files: File[]) => void;
  onProcess: () => void;
  onOpenChange: (open: boolean) => void;
}

const PdfExtractionAlert = ({ error }: { error: string }) => {
  if (!error) return null;

  const isExtractionError = error === 'failed-pdf-extraction';

  return (
    <Alert variant="destructive" className="mt-4 animate-in fade-in slide-in-from-top-2">
      <AlertCircle className="h-4 w-4" />
      <div className="ml-2">
        <AlertTitle className="font-semibold">
          {isExtractionError ? 'Extraction Failed' : 'Processing Error'}
        </AlertTitle>
        <AlertDescription className="text-sm mt-1 text-muted-foreground">
          {isExtractionError ? (
            <div className="space-y-2">
              <p>We couldn't reliably read the text from this PDF. Common causes:</p>
              <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
                <li>Non-standard fonts or encoding.</li>
                <li>Complex layouts (tables, columns) without linear text.</li>
                <li>Scanned images instead of selectable text.</li>
              </ul>
            </div>
          ) : (
            'An unexpected error occurred. Please try again.'
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
};

export function FileParserDialog({
  files,
  onChangeFiles,
  onProcess,
  loading,
  open,
  onOpenChange,
  error,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'scan', label: 'Scanning Document Structure' },
    { id: 'analyze', label: 'Analyzing Content with AI' },
    { id: 'extract', label: 'Extracting Professional Experience' },
    { id: 'skills', label: 'Identifying Skills & Technologies' },
    { id: 'finalize', label: 'Finalizing Portfolio Data' },
  ];

  // Reset state when dialog opens/closes or loading stops
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    // Simulate progress steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 8, 100);
        const stepIndex = Math.floor((newProgress / 100) * (steps.length - 1));
        setCurrentStep(stepIndex);
        return newProgress;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [loading, steps.length]);

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChangeFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
              <Bot className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            Resume Parser
          </DialogTitle>
          <DialogDescription>
            Import your resume to automatically populate your portfolio details.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <PdfExtractionAlert error={error} />

          {/* LOADING STATE */}
          {loading ? (
            <div className="space-y-6 py-4">
              {/* Visual Scanner Animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
                  <div className="relative bg-gradient-to-br from-violet-100 to-indigo-50 dark:from-violet-900/40 dark:to-indigo-900/40 p-6 rounded-full border border-violet-200 dark:border-violet-800">
                    <FileText className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div className="w-full h-[2px] bg-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.5)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    AI ANALYZING
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-violet-600/80 dark:text-violet-400/80 uppercase tracking-wider">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-violet-100 dark:bg-violet-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-300 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Step Checklist */}
              <div className="space-y-3 pl-1">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isPending = index > currentStep;

                  return (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 text-sm transition-all duration-300"
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-5 h-5 rounded-full border transition-colors',
                          isCompleted
                            ? 'bg-violet-600 border-violet-600 text-white'
                            : isCurrent
                              ? 'border-violet-600 text-violet-600 bg-violet-50 dark:bg-violet-900/20'
                              : 'border-muted text-muted-foreground'
                        )}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isCurrent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {isPending && (
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'transition-colors',
                          isCompleted
                            ? 'text-muted-foreground line-through opacity-60'
                            : isCurrent
                              ? 'text-violet-900 dark:text-violet-100 font-semibold'
                              : 'text-muted-foreground/50'
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* UPLOAD STATE */
            <div className="space-y-4">
              {files.length > 0 ? (
                /* Selected File Card */
                <div className="relative overflow-hidden rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10 p-4 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-white dark:bg-violet-950 p-2 shadow-sm border border-violet-100 dark:border-violet-800">
                      <FileText className="h-8 w-8 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate text-violet-950 dark:text-violet-50">
                        {files[0].name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(files[0].size)} • PDF
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300 ring-1 ring-inset ring-violet-700/10">
                          <Sparkles className="w-3 h-3 mr-1" /> Ready to parse
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                /* Dropzone Area with Empty State Placeholder */
                <Dropzone
                  className={cn(
                    'relative min-h-[220px] flex flex-col items-center justify-center',
                    'border-2 border-dashed border-violet-200 dark:border-violet-800/50 rounded-xl',
                    'bg-violet-50/30 dark:bg-violet-900/5 hover:bg-violet-50/80 dark:hover:bg-violet-900/10 hover:border-violet-400',
                    'transition-all duration-300 cursor-pointer group'
                  )}
                  accept={{ 'application/pdf': [] }}
                  maxFiles={1}
                  maxSize={1024 * 1024 * 10}
                  onDrop={onChangeFiles}
                >
                  <DropzoneEmptyState>
                    <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                      {/* Animated Placeholder Icon */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:bg-violet-500/30 transition-all duration-300" />
                        <div className="relative rounded-full bg-white dark:bg-violet-950 p-5 shadow-sm ring-1 ring-violet-100 dark:ring-violet-800 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <UploadCloud className="h-10 w-10 text-violet-500" />
                          {/* Small 'File' badge on icon */}
                          <div className="absolute -right-1 -bottom-1 bg-violet-600 text-white p-1 rounded-full shadow-sm border-2 border-white dark:border-violet-950">
                            <FileSearch className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 z-10">
                        <p className="font-semibold text-base text-violet-950 dark:text-violet-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                          Click or drag resume to upload
                        </p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          Supports PDF files up to 10MB
                        </p>
                      </div>
                    </div>
                  </DropzoneEmptyState>
                  <DropzoneContent files={files} />
                </Dropzone>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="w-full sm:w-auto hover:bg-violet-50 dark:hover:bg-violet-900/20"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={onProcess}
            disabled={loading || files.length === 0}
            className={cn(
              'w-full sm:w-auto min-w-[150px] font-semibold shadow-none shadow-violet-500/20 border-0 ',
              'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white'
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Parse with AI
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      <style jsx global>{`
        @keyframes scan {
          0%,
          100% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </Dialog>
  );
}
