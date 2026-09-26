import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BuilderPanel, builderInputClass } from '@/components/builder/builder-ui';
import { cn } from '@/lib/utils';
import {
  createSubdomainCandidate,
  getLinktreeStarterPreviewName,
} from './project-creation-options';

interface ProjectBasicsPanelProps {
  starterId: string;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  subDomain: string;
  setSubDomain: (value: string) => void;
  setSubDomainTouched: (value: boolean) => void;
}

export function ProjectBasicsPanel({
  starterId,
  name,
  setName,
  description,
  setDescription,
  subDomain,
  setSubDomain,
  setSubDomainTouched,
}: ProjectBasicsPanelProps) {
  const placeholder = getLinktreeStarterPreviewName(starterId);

  return (
    <BuilderPanel className="space-y-4 p-6">
      <div>
        <p className="font-mono text-sm font-black uppercase tracking-[0.2em] text-primary">
          Page basics
        </p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Keep this light. You can change the content and structure after the page is created.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-name">Page name</Label>
        <Input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={placeholder}
          className={builderInputClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-subdomain">Public URL</Label>
        <div className="relative">
          <Input
            id="project-subdomain"
            value={subDomain}
            onChange={(event) => {
              setSubDomainTouched(true);
              setSubDomain(createSubdomainCandidate(event.target.value));
            }}
            placeholder="john-doe"
            className={cn('pr-28', builderInputClass)}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
            .kislap.app
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What is this page for?"
          className={cn('min-h-28 resize-none', builderInputClass)}
        />
      </div>
    </BuilderPanel>
  );
}
