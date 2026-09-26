'use client';

import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Edit2, LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableList } from '@/components/sortable-list';
import { cn } from '@/lib/utils';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import { SectionEditorPanel } from './section-editor-panel';
import { typeLabel } from './section-type-options';

interface Props {
  formMethods: UseFormReturn<LinktreeFormValues>;
  sectionsFieldArray: UseFieldArrayReturn<LinktreeFormValues, 'sections', 'id'>;
  onAddSection: () => void;
  selectedIndex: number | null;
  onSelectedIndexChange: (index: number | null) => void;
}

export function SectionsEditor({
  formMethods,
  sectionsFieldArray,
  onAddSection,
  selectedIndex,
  onSelectedIndexChange,
}: Props) {
  const { watch } = formMethods;
  const { fields, move, remove } = sectionsFieldArray;

  const addAndEdit = () => {
    const nextIndex = fields.length;
    onAddSection();
    window.setTimeout(() => onSelectedIndexChange(nextIndex), 0);
  };

  const removeBlock = (index: number) => {
    remove(index);

    if (selectedIndex === index) {
      onSelectedIndexChange(null);
    } else if (selectedIndex !== null && selectedIndex > index) {
      onSelectedIndexChange(selectedIndex - 1);
    }
  };

  return (
    <section className="border-2 border-black bg-card p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-black uppercase">Blocks</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Reorder the page here, or click a block in the preview to edit it.
          </p>
        </div>
        <Button type="button" size="sm" onClick={addAndEdit}>
          <Plus className="mr-1 h-4 w-4" />
          Add block
        </Button>
      </div>

      {selectedIndex !== null && fields[selectedIndex] ? (
        <div className="mb-4">
          <SectionEditorPanel
            key={selectedIndex}
            index={selectedIndex}
            formMethods={formMethods}
            onDone={() => onSelectedIndexChange(null)}
          />
        </div>
      ) : null}

      {fields.length === 0 ? (
        <button
          type="button"
          onClick={addAndEdit}
          className="w-full border-2 border-dashed border-black bg-secondary/30 py-8 text-center transition hover:bg-secondary/50"
        >
          <LayoutTemplate className="mx-auto mb-2 h-7 w-7 opacity-50" />
          <p className="font-black uppercase">Add your first block</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Links, projects, banners, skills, text, and more.
          </p>
        </button>
      ) : (
        <SortableList
          items={fields}
          onDragEnd={(oldIndex, newIndex) => {
            move(oldIndex, newIndex);
            onSelectedIndexChange(null);
          }}
          renderItem={(_, index) => {
            const type = watch(`sections.${index}.type`);
            const title = watch(`sections.${index}.title`);
            const url = watch(`sections.${index}.url`);
            const bannerText = watch(`sections.${index}.banner_text`);
            const quoteText = watch(`sections.${index}.quote_text`);
            const content = watch(`sections.${index}.content`) as
              | Record<string, unknown>
              | undefined;
            const layoutWidth = watch(`sections.${index}.layout.width`) || 'auto';

            const displayTitle =
              title ||
              bannerText ||
              quoteText ||
              String(content?.title || content?.heading || content?.role || 'Untitled block');
            const selected = selectedIndex === index;

            return (
              <div
                className={cn(
                  'flex min-h-14 items-center justify-between gap-3 border-2 border-black bg-background px-3 py-2 transition',
                  selected ? 'bg-secondary shadow-[3px_3px_0_#000]' : 'hover:bg-secondary/30',
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectedIndexChange(index)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-black uppercase">{displayTitle}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {type === 'link' && url ? `${typeLabel(type)} · ${url}` : typeLabel(type)}
                    <span className="ml-2 font-mono uppercase">· {layoutWidth}</span>
                  </p>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onSelectedIndexChange(index)}
                    aria-label={`Edit ${displayTitle}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => removeBlock(index)}
                    aria-label={`Delete ${displayTitle}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          }}
        />
      )}

      {fields.length > 0 ? (
        <Button
          type="button"
          onClick={addAndEdit}
          variant="outline"
          className="mt-3 w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add content block
        </Button>
      ) : null}
    </section>
  );
}
