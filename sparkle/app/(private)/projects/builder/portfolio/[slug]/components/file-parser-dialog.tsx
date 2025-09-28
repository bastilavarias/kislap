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
  Zap,
  Sparkles,
  FileText,
  User,
  GraduationCap,
  Wrench,
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

interface Props {
  files: File[];
  onChangeFiles: (files: File[]) => void;
  onProcess: () => void;
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string;
}

const PdfExtractionAlert = ({ error }: { error: string }) => {
  if (!error) {
    return null;
  }

  const isExtractionError = error === 'failed-pdf-extraction';

  return (
    // The variant="destructive" handles the red background and text color based on shadcn/ui theming
    <Alert variant="destructive" className="mt-4">
      {/* Icon placed correctly, often provided by the Alert component wrapper */}
      <AlertCircle className="h-4 w-4" />

      {isExtractionError ? (
        <>
          <AlertTitle className="capitalize font-semibold">PDF Extraction Failed</AlertTitle>
          <AlertDescription className="text-sm">
            <p className="mb-2">
              The data in your PDF could not be reliably extracted. This often happens due to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Using custom or non-standard fonts that the parser can't read correctly.</li>
              <li>
                Overly complex designs (like multiple columns, text boxes, or heavy graphics) that
                confuse the text order.
              </li>
              <li>Unorganized data structure where text isn't laid out linearly.</li>
            </ul>
            <p className="mt-3">
              For better results, please try uploading a simpler, standard document, or visit this
              sample{' '}
              <a
                href="https://sebastech.vercel.app/documents/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline font-medium"
              >
                resume
              </a>{' '}
              as a reference.
            </p>
          </AlertDescription>
        </>
      ) : (
        <>
          <AlertTitle className="capitalize font-semibold">An Error Occurred</AlertTitle>
          <AlertDescription className="text-sm">
            An unexpected error occurred. Please try your operation again.
          </AlertDescription>
        </>
      )}
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
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  const steps = [
    { icon: FileText, label: 'Scanning Document', color: 'text-blue-500' },
    { icon: Brain, label: 'AI Analysis', color: 'text-purple-500' },
    { icon: User, label: 'Extracting Experience', color: 'text-green-500' },
    { icon: GraduationCap, label: 'Processing Education', color: 'text-orange-500' },
    { icon: Wrench, label: 'Identifying Skills', color: 'text-cyan-500' },
  ];

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setCurrentStep(0);
      setParticles([]);
      return;
    }

    // Generate floating particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    // Simulate AI processing steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 15 + 5, 100);
        const newStep = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(newStep, steps.length - 1));
        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [loading, steps.length]);

  const renderAILoading = () => {
    const CurrentIcon = steps[currentStep]?.icon || Brain;

    return (
      <div className="relative flex flex-col items-center gap-6 py-8">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Central AI brain animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse scale-150" />
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
            <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full animate-ping" />
        </div>

        {/* AI Status */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Neural Network Active
            </p>
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">
            {steps[currentStep]?.label || 'Processing...'}
          </p>
        </div>

        {/* Progress visualization */}
        <div className="w-full max-w-md space-y-4">
          {/* Overall progress bar */}
          <div className="relative">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-1">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-110'
                        : isCompleted
                          ? 'bg-green-500'
                          : 'bg-muted'
                    }`}
                  >
                    <StepIcon
                      className={`w-3 h-3 ${
                        isActive || isCompleted ? 'text-white' : 'text-muted-foreground'
                      } ${isActive ? 'animate-pulse' : ''}`}
                    />
                  </div>
                  <div className="text-xs text-center max-w-16">
                    <span className={isActive ? step.color : 'text-muted-foreground'}>
                      {step.label.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neural network visualization */}
        <div className="flex items-center gap-1 opacity-60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] md:max-w-[620px] lg:max-w-[720px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Parser
              </DialogTitle>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                LLM Ready
              </div>
            </div>
          </div>
          <DialogDescription className="text-base">
            Upload your resume and watch our advanced AI neural network automatically extract and
            analyze your work experience, education, skills, and achievements with lightning speed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 my-4">
          <PdfExtractionAlert error={error} />

          {!loading && (
            <Dropzone
              className="shadow-none border-dashed border-2 rounded-lg p-8 border-border hover:border-blue-400 transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
              accept={{ 'application/pdf': [] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 10}
              minSize={1024}
              onDrop={onChangeFiles}
              onError={console.error}
              src={files}
            >
              <DropzoneEmptyState>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                    <Sparkles className="w-4 h-4 text-blue-500 absolute -top-1 -right-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">Drop your PDF resume here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to select a file • Max 10MB
                    </p>
                  </div>
                </div>
              </DropzoneEmptyState>
              <DropzoneContent files={files} />
            </Dropzone>
          )}

          {loading && renderAILoading()}
        </div>

        <DialogFooter className="flex justify-between items-center mt-6">
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            className="flex items-center gap-2 min-w-32 justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
            onClick={onProcess}
            disabled={loading || files.length === 0}
          >
            {loading ? (
              <>
                <Brain className="w-4 h-4 animate-pulse" />
                AI Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Parse with AI
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
