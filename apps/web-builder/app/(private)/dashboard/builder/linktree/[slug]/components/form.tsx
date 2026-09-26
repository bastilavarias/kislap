'use client';

import { useRef, useState } from 'react';
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Settings } from '@/contexts/settings-context';
import type { LinktreeFormValues } from '@/lib/schemas/linktree';
import {
  builderOutlineButtonClass,
  builderTabsListClass,
  builderTabsTriggerClass,
} from '@/components/builder/builder-ui';
import { DesignPanel } from './design-panel';
import { LinktreeFormPreview } from './linktree-form-preview';
import { ProfileEditor } from './profile-editor';
import { SectionsEditor } from './sections-editor';

interface Props {
  formMethods: UseFormReturn<LinktreeFormValues>;
  sectionsFieldArray: UseFieldArrayReturn<LinktreeFormValues, 'sections', 'id'>;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  onAddSection: () => void;
}

export function Form({
  formMethods,
  sectionsFieldArray,
  onAddSection,
  localThemeSettings,
  setLocalThemeSettings,
}: Props) {
  const { watch, setValue, reset } = formMethods;
  const previewValues = watch();
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const blocksRef = useRef<HTMLDivElement | null>(null);

  const backgroundStyle = (watch('background_style') as 'plain' | 'grid') || 'grid';
  const compositionLayout = watch('composition_layout') || 'classic';

  const handleClearContent = () => {
    if (
      !window.confirm(
        'Clear the current page content? Layout, background style, and theme will stay as they are.',
      )
    ) {
      return;
    }

    reset({
      name: '',
      tagline: '',
      about: '',
      phone: '',
      email: '',
      logo: null,
      logo_url: '',
      background_style: backgroundStyle,
      layout_name: 'linktree-default',
      composition_layout: compositionLayout,
      sections: [],
    });
    setSelectedBlockIndex(null);
  };

  const handlePreviewBlockSelect = (index: number) => {
    setSelectedBlockIndex(index);
    setMobileTab('edit');
    window.requestAnimationFrame(() => {
      blocksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="relative w-full">
      <div className="mb-4 xl:hidden">
        <Tabs value={mobileTab} onValueChange={(value) => setMobileTab(value as 'edit' | 'preview')}>
          <TabsList className={`${builderTabsListClass} grid h-12 w-full grid-cols-2`}>
            <TabsTrigger value="edit" className={builderTabsTriggerClass}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className={builderTabsTriggerClass}>
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(430px,5fr)_minmax(0,7fr)] xl:items-start">
        <section
          className={[
            'min-w-0 space-y-5',
            mobileTab === 'preview' ? 'hidden xl:block' : 'block',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-4 border-b-2 border-black pb-4">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-primary">
                Page editor
              </p>
              <h1 className="mt-1 text-2xl font-black uppercase">Content & design</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Edit on the left. Your page updates live on the right.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className={builderOutlineButtonClass}
              onClick={handleClearContent}
            >
              <Eraser className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>

          <ProfileEditor formMethods={formMethods} />

          <div ref={blocksRef} className="scroll-mt-4">
            <SectionsEditor
              formMethods={formMethods}
              sectionsFieldArray={sectionsFieldArray}
              onAddSection={onAddSection}
              selectedIndex={selectedBlockIndex}
              onSelectedIndexChange={setSelectedBlockIndex}
            />
          </div>

          <DesignPanel
            compositionLayout={compositionLayout}
            setCompositionLayout={(value) =>
              setValue('composition_layout', value, { shouldDirty: true })
            }
            backgroundStyle={backgroundStyle}
            setBackgroundStyle={(style) =>
              setValue('background_style', style, { shouldDirty: true })
            }
            localThemeSettings={localThemeSettings}
            setLocalThemeSettings={setLocalThemeSettings}
          />
        </section>

        <section
          className={[
            'min-w-0 max-w-full',
            'min-h-[70vh] xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)]',
            mobileTab === 'edit' ? 'hidden xl:block' : 'block',
          ].join(' ')}
        >
          <LinktreeFormPreview
            values={previewValues}
            themeSettings={localThemeSettings}
            onBlockSelect={handlePreviewBlockSelect}
          />
        </section>
      </div>
    </div>
  );
}
