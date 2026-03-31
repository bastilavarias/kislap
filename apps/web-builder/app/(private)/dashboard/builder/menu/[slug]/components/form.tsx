'use client';

import { useEffect } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Store, Tags, UtensilsCrossed } from 'lucide-react';
import { Settings } from '@/contexts/settings-context';
import { APIResponseProject } from '@/types/api-response';
import { createDefaultBusinessHours, createDefaultSocialLinks } from '@/lib/menu-defaults';
import { MenuFormValues } from '@/lib/schemas/menu';
import { ParsedFileDialog } from '@/components/parsed-file-dialog';
import { BusinessHoursEditor } from './business-hours-editor';
import { CategoriesEditor } from './categories-editor';
import { DesignPanel } from './design-panel';
import { GalleryUploader } from './gallery-uploader';
import { ImageUploadField } from './image-upload-field';
import { ItemsEditor } from './items-editor';
import { SocialLinksEditor } from './social-links-editor';

interface Props {
  formMethods: UseFormReturn<MenuFormValues>;
  categoriesFieldArray: UseFieldArrayReturn<MenuFormValues, 'categories', 'id'>;
  itemsFieldArray: UseFieldArrayReturn<MenuFormValues, 'items', 'id'>;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  layout: string;
  setLayout: (layout: string) => void;
  project: APIResponseProject | null;
  isParserOpen: boolean;
  setIsParserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  applyParsedMenu: (data: Record<string, any>) => void;
}

export function Form({
  formMethods,
  categoriesFieldArray,
  itemsFieldArray,
  localThemeSettings,
  setLocalThemeSettings,
  layout,
  setLayout,
  project,
  isParserOpen,
  setIsParserOpen,
  applyParsedMenu,
}: Props) {
  const { register, watch, setValue, reset } = formMethods;

  useEffect(() => {
    setValue('layout_name', layout);
  }, [layout, setValue]);

  const rootDomain = process.env.NEXT_PUBLIC_SHINE_SUFFIX_URL || 'kislap.test';
  const urlPrefix = process.env.NEXT_PUBLIC_URL_PREFIX || 'http://';
  const menuURL = project?.sub_domain ? `${urlPrefix}${project.sub_domain}.${rootDomain}` : '';
  const galleryImages = watch('gallery_images') || [];

  const handleGalleryChange = (items: Array<{ image: File | null; image_url: string | null }>) => {
    setValue('gallery_images', items, { shouldDirty: true });
  };

  const handleClearContent = () => {
    if (!window.confirm('Clear the current menu form content? Layout and theme will stay as they are.')) {
      return;
    }

    reset({
      name: '',
      description: '',
      logo: null,
      logo_url: '',
      cover_image: null,
      cover_image_url: '',
      phone: '',
      email: '',
      website_url: '',
      address: '',
      city: '',
      google_maps_url: '',
      search_enabled: true,
      hours_enabled: false,
      business_hours: createDefaultBusinessHours(),
      social_links: createDefaultSocialLinks(),
      gallery_images: [],
      layout_name: layout,
      qr_settings: {
        foreground_color: '#111111',
        background_color: '#ffffff',
        show_logo: false,
      },
      categories: [],
      items: [],
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 pb-20 lg:grid-cols-12 lg:pb-0">
      <div className="space-y-6 lg:col-span-8">
        <Card className="border-border shadow-none">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Menu Editor</h1>
              </div>
              <Button type="button" variant="outline" className="shadow-none" onClick={handleClearContent}>
                Clear content
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
              <div>
                <h3 className="text-sm font-semibold">Menu Parser</h3>
                <p className="text-xs text-muted-foreground">
                  Upload a menu PDF to prefill your categories and items.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setIsParserOpen(true)}
                className="shadow-none flex items-center gap-2
                bg-gradient-to-r from-amber-500 to-rose-500 
                hover:from-amber-600 hover:to-rose-600 
                text-white border-0 transition-all"
                size="sm"
              >
                Parse Menus
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-8">
              <Accordion type="single" defaultValue="business" collapsible>
                <AccordionItem value="business" className="rounded-lg border px-4">
                  <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                    Business
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 px-1 pb-4 pt-4">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                      <Store className="h-4 w-4" />
                      Business Profile
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border bg-muted/20 p-4">
                          <Label className="mb-3 block text-sm font-medium">Logo</Label>
                          <ImageUploadField
                            id="menu-logo"
                            previewUrl={watch('logo_url')}
                            currentFile={watch('logo') as File}
                            onFileSelect={(file) => setValue('logo', file, { shouldDirty: true })}
                          />
                        </div>
                        <div className="rounded-lg border bg-muted/20 p-4">
                          <Label className="mb-3 block text-sm font-medium">Cover Image</Label>
                          <ImageUploadField
                            id="menu-cover"
                            previewUrl={watch('cover_image_url')}
                            currentFile={watch('cover_image') as File}
                            onFileSelect={(file) =>
                              setValue('cover_image', file, { shouldDirty: true })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block">Business Name</Label>
                        <Input {...register('name')} placeholder="Cookie Dokey" className="shadow-none" />
                      </div>
                      <div>
                        <Label className="mb-2 block">Description</Label>
                        <Input
                          {...register('description')}
                          placeholder="Wood-fired pizza, pasta, and house specials."
                          className="shadow-none"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="mb-2 block">Phone</Label>
                          <Input {...register('phone')} placeholder="+63 997 221 7704" className="shadow-none" />
                        </div>
                        <div>
                          <Label className="mb-2 block">Email</Label>
                          <Input {...register('email')} placeholder="hello@restaurant.com" className="shadow-none" />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="mb-2 block">Website</Label>
                          <Input {...register('website_url')} placeholder="https://restaurant.com" className="shadow-none" />
                        </div>
                        <div>
                          <Label className="mb-2 block">City</Label>
                          <Input {...register('city')} placeholder="Manila" className="shadow-none" />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block">Address</Label>
                        <Input {...register('address')} placeholder="123 Main Street" className="shadow-none" />
                      </div>
                      <div>
                        <Label className="mb-2 block">Google Maps URL</Label>
                        <Input {...register('google_maps_url')} placeholder="https://maps.google.com/..." className="shadow-none" />
                      </div>

                      <BusinessHoursEditor formMethods={formMethods} />
                      <SocialLinksEditor formMethods={formMethods} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" defaultValue="categories" collapsible>
                <AccordionItem value="categories" className="rounded-lg border px-4">
                  <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                    Categories
                  </AccordionTrigger>
                  <AccordionContent className="px-1 pb-4 pt-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                      <Tags className="h-4 w-4" />
                      Categories
                    </div>
                    <CategoriesEditor formMethods={formMethods} fieldArray={categoriesFieldArray} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" defaultValue="items" collapsible>
                <AccordionItem value="items" className="rounded-lg border px-4">
                  <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                    Items
                  </AccordionTrigger>
                  <AccordionContent className="px-1 pb-4 pt-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                      <UtensilsCrossed className="h-4 w-4" />
                      Menu Items
                    </div>
                    <ItemsEditor formMethods={formMethods} fieldArray={itemsFieldArray} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" defaultValue="gallery" collapsible>
                <AccordionItem value="gallery" className="rounded-lg border px-4">
                  <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                    Gallery
                  </AccordionTrigger>
                  <AccordionContent className="px-1 pb-4 pt-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                      <Store className="h-4 w-4" />
                      Gallery
                    </div>
                    <div className="rounded-lg border bg-muted/20 p-4">
                      <GalleryUploader
                        files={galleryImages.map((item) => item.image as File | null)}
                        urls={galleryImages.map((item) => item.image_url || null)}
                        onChange={handleGalleryChange}
                        maxFiles={8}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative lg:col-span-4">
        <div className="sticky top-6 space-y-4">
          <DesignPanel
            layout={layout}
            setLayout={setLayout}
            localThemeSettings={localThemeSettings}
            setLocalThemeSettings={setLocalThemeSettings}
            menuURL={menuURL}
            qrForegroundColor={watch('qr_settings.foreground_color')}
            qrBackgroundColor={watch('qr_settings.background_color')}
            setQRForegroundColor={(value) =>
              setValue('qr_settings.foreground_color', value, { shouldDirty: true })
            }
            setQRBackgroundColor={(value) =>
              setValue('qr_settings.background_color', value, { shouldDirty: true })
            }
          />
        </div>
      </div>

      <ParsedFileDialog
        open={isParserOpen}
        onOpenChange={setIsParserOpen}
        projectType="menu"
        sourceType="menu"
        title="Menu Parser"
        description="Upload menu images or PDFs and reuse parsed results anytime."
        maxFiles={5}
        acceptedKinds={['image', 'pdf']}
        onApplyParsedData={applyParsedMenu}
      />
    </div>
  );
}
