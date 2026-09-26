'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import type { UseFormReturn } from 'react-hook-form';

export type PortfolioBlockType = 'text' | 'project' | 'experience' | 'skills';

type Props = {
  index: number;
  type: PortfolioBlockType;
  register: UseFormReturn<LinktreeFormValues>['register'];
};

export function PageBlockFields({ index, type, register }: Props) {
  if (type === 'text') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Heading</Label>
          <Input {...register(`sections.${index}.content.heading`)} placeholder="About me" />
        </div>
        <div className="space-y-2">
          <Label>Body</Label>
          <Textarea
            rows={6}
            {...register(`sections.${index}.content.body`)}
            placeholder="Tell people what you do, what you care about, or what you are working on."
          />
        </div>
      </div>
    );
  }

  if (type === 'project') {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Project name</Label>
            <Input {...register(`sections.${index}.content.title`)} placeholder="Kislap" />
          </div>
          <div className="space-y-2">
            <Label>Project URL</Label>
            <Input {...register(`sections.${index}.content.url`)} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={4} {...register(`sections.${index}.content.description`)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input {...register(`sections.${index}.content.image_url`)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Technologies</Label>
            <Input
              {...register(`sections.${index}.content.technologies`)}
              placeholder="Next.js, Go, MySQL"
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'experience') {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input {...register(`sections.${index}.content.role`)} placeholder="Senior Developer" />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input {...register(`sections.${index}.content.company`)} placeholder="Company name" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Start</Label>
            <Input {...register(`sections.${index}.content.start`)} placeholder="2024" />
          </div>
          <div className="space-y-2">
            <Label>End</Label>
            <Input {...register(`sections.${index}.content.end`)} placeholder="Present" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={4} {...register(`sections.${index}.content.description`)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input {...register(`sections.${index}.content.heading`)} placeholder="Skills" />
      </div>
      <div className="space-y-2">
        <Label>Skills</Label>
        <Textarea
          rows={4}
          {...register(`sections.${index}.content.items`)}
          placeholder="TypeScript, Next.js, Go, Product Design"
        />
        <p className="text-xs text-muted-foreground">Separate skills with commas.</p>
      </div>
    </div>
  );
}
