'use client';

import { useEffect } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Store, Tags, UtensilsCrossed } from 'lucide-react';
import { Settings } from '@/contexts/settings-context';
import { APIResponseProject } from '@/types/api-response';
import { MenuFormValues } from '@/lib/schemas/menu';
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
}: Props) {
  const { register, watch, setValue } = formMethods;

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

  return (
    <div className="grid grid-cols-1 gap-6 pb-20 lg:grid-cols-12 lg:pb-0">
      <div className="space-y-6 lg:col-span-8">
        <Card className="border-border shadow-none">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Menu Editor</h1>
            </div>

            <div className="flex flex-col gap-8">
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
                          <Label className="mb-2 block">WhatsApp</Label>
                          <Input {...register('whatsapp')} placeholder="+639172217704" className="shadow-none" />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="mb-2 block">City</Label>
                          <Input {...register('city')} placeholder="Manila" className="shadow-none" />
                        </div>
                        <div>
                          <Label className="mb-2 block">Country</Label>
                          <Input {...register('country')} placeholder="Philippines" className="shadow-none" />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block">Address</Label>
                        <Input {...register('address')} placeholder="123 Main Street" className="shadow-none" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="mb-2 block">Google Maps URL</Label>
                          <Input {...register('google_maps_url')} placeholder="https://maps.google.com/..." className="shadow-none" />
                        </div>
                        <div>
                          <Label className="mb-2 block">Currency</Label>
                          <Input {...register('currency')} placeholder="PHP" className="shadow-none" />
                        </div>
                      </div>

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

                      <BusinessHoursEditor formMethods={formMethods} />
                      <SocialLinksEditor formMethods={formMethods} />
                    </div>

                    <div className="rounded-lg border bg-muted/20 p-4">
                      <Label className="mb-3 block text-sm font-medium">Gallery</Label>
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
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative lg:col-span-4">
        <div className="sticky top-6 space-y-4">
          <div className="hidden items-center gap-2 lg:flex">
            <Palette className="h-5 w-5" />
            <h2 className="text-xl font-bold">Design & QR</h2>
          </div>
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
    </div>
  );
}
