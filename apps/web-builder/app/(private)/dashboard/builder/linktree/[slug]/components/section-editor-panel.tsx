'use client';

import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import { BlockLayoutControls } from './block-layout-controls';
import { renderTypeFields, type SectionType } from './sections-editor-fields';
import { SECTION_TYPES, typeLabel } from './section-type-options';

type Props = {
  index: number;
  formMethods: UseFormReturn<LinktreeFormValues>;
  onDone: () => void;
};

function cloneSection(section: LinktreeFormValues['sections'][number]) {
  return {
    ...section,
    content: section.content ? { ...section.content } : undefined,
    layout: section.layout ? { ...section.layout } : { width: 'auto' as const, align: 'left' as const },
    style: section.style
      ? { ...section.style }
      : { variant: 'default' as const, padding: 'normal' as const },
  };
}

export function SectionEditorPanel({ index, formMethods, onDone }: Props) {
  const sourceSection = cloneSection(formMethods.getValues(`sections.${index}`));

  const draftForm = useForm<LinktreeFormValues>({
    defaultValues: {
      sections: [sourceSection],
    },
  });

  const { watch, setValue, register, control, getValues } = draftForm;
  const type = watch('sections.0.type') as SectionType;

  const commitDraft = () => {
    const nextSection = getValues('sections.0');
    formMethods.setValue(`sections.${index}`, nextSection, {
      shouldDirty: true,
      shouldTouch: true,
    });
    onDone();
  };

  return (
    <div className="border-2 border-black bg-background shadow-[4px_4px_0_#000]">
      <div className="flex items-start justify-between gap-4 border-b-2 border-black bg-secondary px-4 py-3">
        <div>
          <p className="font-black uppercase">Edit {typeLabel(type)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Draft changes stay here until you click Done editing.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 border-2 border-black bg-background"
          onClick={onDone}
          aria-label="Discard block changes"
          title="Discard changes"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5 p-4">
        <div className="space-y-2">
          <Label className="font-black uppercase tracking-wide">Block type</Label>
          <Controller
            name="sections.0.type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose block type" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {renderTypeFields({
          editIndex: 0,
          type,
          register,
          setValue,
          watch,
        })}

        <BlockLayoutControls index={0} watch={watch} setValue={setValue} />

        <div className="flex items-center justify-between gap-3 border-t-2 border-black pt-4">
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
          <Button type="button" onClick={commitDraft}>
            Done editing
          </Button>
        </div>
      </div>
    </div>
  );
}
