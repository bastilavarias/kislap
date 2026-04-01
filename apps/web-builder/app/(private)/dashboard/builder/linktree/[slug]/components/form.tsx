'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Link as LinkIcon } from 'lucide-react';
import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Settings } from '@/contexts/settings-context';
import { LinktreeFormValues } from '@/lib/schemas/linktree';
import { Controller } from 'react-hook-form';
import { SimpleRichTextEditor } from '@/components/simple-rich-text-editor';
import { SectionsEditor } from './sections-editor';
import { ImageUploadField } from './image-upload-field';
import { DesignPanel } from './design-panel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinktreeFormPreview } from './linktree-form-preview';

interface Props {
  formMethods: UseFormReturn<LinktreeFormValues>;
  sectionsFieldArray: UseFieldArrayReturn<LinktreeFormValues, 'sections', 'id'>;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  layout: string;
  setLayout: (layout: string) => void;
  onAddSection: () => void;
}

export function Form({
  formMethods,
  sectionsFieldArray,
  onAddSection,
  localThemeSettings,
  setLocalThemeSettings,
  layout,
  setLayout,
}: Props) {
  const {
    register,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = formMethods;
  const previewValues = watch();
  const [builderTab, setBuilderTab] = useState<'form' | 'preview'>('form');

  useEffect(() => {
    //@ts-ignore
    setValue('layout_name', layout);
  }, [layout, setValue]);

  const backgroundStyle = (watch('background_style') as 'plain' | 'grid') || 'grid';

  const handleClearContent = () => {
    if (!window.confirm('Clear the current link page form content? Layout, background style, and theme will stay as they are.')) {
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
      layout_name: layout,
      sections: [],
    });
  };

  return (
    <div className="w-full relative">
      <div className="mb-6">
        <Tabs value={builderTab} onValueChange={(value) => setBuilderTab(value as 'form' | 'preview')}>
          <TabsList className="grid h-12 w-full max-w-md grid-cols-2 rounded-none border border-border/70 bg-background p-1">
            <TabsTrigger
              value="form"
              className="rounded-none shadow-none data-[state=active]:bg-background"
            >
              Form
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="rounded-none shadow-none data-[state=active]:bg-background"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {builderTab === 'preview' ? (
        <LinktreeFormPreview values={previewValues} layout={layout} themeSettings={localThemeSettings} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-none border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 gap-4">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <LinkIcon className="w-6 h-6" /> Linktree Content
                  </h1>
                  <Button type="button" variant="outline" className="shadow-none" onClick={handleClearContent}>
                    Clear content
                  </Button>
                </div>

                <div className="flex flex-col gap-10">
                  <Accordion type="single" defaultValue="details" collapsible>
                    <AccordionItem value="details" className="rounded-lg border px-4 shadow-none">
                      <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                        Identity & Branding
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-4 space-y-8 px-1">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <Palette className="w-4 h-4" /> Branding
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="shrink-0">
                            <Label className="mb-2 block">Logo</Label>
                            <ImageUploadField
                              id="logo-upload"
                              previewUrl={watch('logo_url')}
                              currentFile={watch('logo') as File}
                              onFileSelect={(f) => setValue('logo', f)}
                            />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <Label className="mb-2 block">Name</Label>
                              <Input
                                {...register('name')}
                                placeholder="My Awesome Linktree"
                                className="shadow-none"
                              />
                              {errors.name && (
                                <p className="text-destructive text-sm mt-1">
                                  {errors.name.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="mb-2 block">Tagline</Label>
                              <Input
                                {...register('tagline')}
                                placeholder="All my links in one place."
                                className="shadow-none"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="mb-2 block">Phone</Label>
                                <Input
                                  {...register('phone')}
                                  placeholder="0997-221-7704"
                                  className="shadow-none"
                                />
                              </div>
                              <div>
                                <Label className="mb-2 block">Email</Label>
                                <Input
                                  {...register('email')}
                                  placeholder="you@email.com"
                                  className="shadow-none"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="mb-2 block">About (Optional)</Label>

                              <Controller
                                control={control}
                                name="about"
                                render={({ field }) => (
                                  <SimpleRichTextEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="Tell your story..."
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Accordion type="single" defaultValue="sections" collapsible>
                    <AccordionItem value="sections" className="rounded-lg border px-4 shadow-none">
                      <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                        Links & Custom Sections
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 px-1">
                        <SectionsEditor
                          formMethods={formMethods}
                          sectionsFieldArray={sectionsFieldArray}
                          onAddSection={onAddSection}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:col-span-4 lg:block relative">
            <div className="sticky top-6 space-y-4">
              <DesignPanel
                layout={layout}
                setLayout={setLayout}
                backgroundStyle={backgroundStyle}
                setBackgroundStyle={(style) =>
                  setValue('background_style', style, { shouldDirty: true })
                }
                localThemeSettings={localThemeSettings}
                setLocalThemeSettings={setLocalThemeSettings}
              />
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-xl bg-primary hover:bg-primary/90 flex items-center justify-center"
            >
              <Palette className="w-6 h-6 text-primary-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] pt-6 px-4">
            <SheetHeader className="mb-4 text-left">
              <SheetTitle>Design & Style</SheetTitle>
              <SheetDescription>Switch layouts and customize your theme.</SheetDescription>
            </SheetHeader>
            <div className="h-full overflow-y-auto pb-20">
              <DesignPanel
                layout={layout}
                setLayout={setLayout}
                backgroundStyle={backgroundStyle}
                setBackgroundStyle={(style) =>
                  setValue('background_style', style, { shouldDirty: true })
                }
                localThemeSettings={localThemeSettings}
                setLocalThemeSettings={setLocalThemeSettings}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
