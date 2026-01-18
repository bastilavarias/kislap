'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  X,
  LayoutTemplate,
  Grid,
  Box,
  Ghost,
  Cpu,
  Newspaper,
  Zap,
  CloudFog,
  CheckCircle2,
  Palette,
  Store,
  ShoppingBasket,
  CalendarDays,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit2,
  Trash2,
  Settings2,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { BizFormValues } from '@/lib/schemas/biz';

const LAYOUT_OPTIONS = [
  { id: 'default', name: 'Default', icon: LayoutTemplate, description: 'Clean & Standard' },
  { id: 'bento', name: 'Bento', icon: Grid, description: 'Modern Grid' },
  { id: 'neo-brutalist', name: 'Neo-Brutal', icon: Box, description: 'Bold Borders' },
  { id: 'glass', name: 'Glass', icon: Ghost, description: 'Frosted UI' },
  { id: 'cyber', name: 'Cyber', icon: Cpu, description: 'Futuristic' },
  { id: 'newspaper', name: 'Editorial', icon: Newspaper, description: 'Classic Print' },
  { id: 'restaurant', name: 'Menu', icon: Zap, description: 'Food Focused' },
  { id: 'retail', name: 'Retail', icon: CloudFog, description: 'Product Focused' },
];

interface Props {
  formMethods: UseFormReturn<BizFormValues>;
  socialLinksFieldArray: UseFieldArrayReturn<BizFormValues, 'social_links', 'id'>;
  servicesFieldArray: UseFieldArrayReturn<BizFormValues, 'services', 'id'>;
  productsFieldArray: UseFieldArrayReturn<BizFormValues, 'products', 'id'>;
  testimonialsFieldArray: UseFieldArrayReturn<BizFormValues, 'testimonials', 'id'>;
  files: File[] | [];
  setFiles: React.Dispatch<React.SetStateAction<File[] | []>>;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  layout: string;
  setLayout: (layout: string) => void;
  onAddService: () => void;
  onAddProduct: () => void;
  onAddSocialLink: () => void;
  onAddTestimonial: () => void;
}

// --- Helper Component for Image Upload ---
function ImageUploadField({
  previewUrl, // From DB (image_url)
  currentFile, // From State (image)
  onFileSelect,
}: {
  previewUrl?: string | null;
  currentFile?: File | null;
  onFileSelect: (file: File | null) => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Generate preview for newly selected file
  useEffect(() => {
    if (currentFile) {
      const objectUrl = URL.createObjectURL(currentFile);
      setLocalPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLocalPreview(null);
    }
  }, [currentFile]);

  // Determine which image to show (New File > Existing URL)
  const displayImage = localPreview || previewUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="relative group h-20 w-20 shrink-0 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
        {displayImage ? (
          <img src={displayImage} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>

      <div className="flex-1">
        <Label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {displayImage ? 'Change Image' : 'Upload Image'}
        </Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        <p className="text-[10px] text-muted-foreground mt-2">Max 2MB. Supports PNG, JPG, WEBP.</p>
      </div>
    </div>
  );
}

// Extracted Design Panel
function DesignPanel({
  layout,
  setLayout,
  localThemeSettings,
  setLocalThemeSettings,
}: {
  layout: string;
  setLayout: (l: string) => void;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
}) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <h2 className="text-xl font-bold mb-4 hidden lg:block">Design & Style</h2>
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-4 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="layout"
            className="rounded-lg shadow-none data-[state=active]:bg-background"
          >
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="rounded-lg shadow-none data-[state=active]:bg-background"
          >
            Theme
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layout" className="mt-0">
          <Card className="shadow-none border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Choose Layout</CardTitle>
              <CardDescription>Select a structure for your business site.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {LAYOUT_OPTIONS.map((option) => {
                const isSelected = layout === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setLayout(option.id)}
                    className={cn(
                      'cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30 hover:bg-muted/30'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-full mb-3 transition-colors',
                        isSelected
                          ? 'bg-background text-primary'
                          : 'bg-muted text-muted-foreground group-hover:bg-background'
                      )}
                    >
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className={cn('font-semibold text-sm', isSelected && 'text-primary')}>
                        {option.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="theme" className="mt-0">
          <Card className="shadow-none border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Choose Theme</CardTitle>
              <CardDescription>Customize colors, fonts, and radius.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeControlPanel
                stateless={true}
                themeSettings={localThemeSettings}
                setThemeSettings={setLocalThemeSettings}
                hideTopActionButtons={true}
                hideModeToggle={true}
                hideScrollArea={true}
                hideThemeSaverButton={false}
                hideImportButton={true}
                hideRandomButton={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export function Form({
  formMethods,
  socialLinksFieldArray,
  servicesFieldArray,
  productsFieldArray,
  testimonialsFieldArray,
  onAddService,
  onAddProduct,
  onAddSocialLink,
  onAddTestimonial,
  files,
  setFiles,
  localThemeSettings,
  setLocalThemeSettings,
  layout,
  setLayout,
}: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  const { fields: socialFields, remove: removeSocial } = socialLinksFieldArray;
  const { fields: serviceFields, remove: removeService } = servicesFieldArray;
  const { fields: productFields, remove: removeProduct } = productsFieldArray;
  const { fields: testimonialFields, remove: removeTestimonial } = testimonialsFieldArray;

  const [editState, setEditState] = useState<{
    type: 'service' | 'product' | 'testimonial' | null;
    index: number | null;
  }>({ type: null, index: null });

  const closeDialog = () => setEditState({ type: null, index: null });

  useEffect(() => {
    //@ts-ignore
    setValue('layout_name', layout);
  }, [layout, setValue]);

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
        {/* --- LEFT COLUMN: CONTENT --- */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-none border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Store className="w-6 h-6" /> Business Content
                </h1>
              </div>

              <div className="flex flex-col gap-4">
                {/* 1. General Information */}
                <Accordion type="single" defaultValue="details" collapsible>
                  <AccordionItem value="details" className="rounded-lg border px-4 shadow-none">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      General Information
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-6">
                      {/* Group: Identity */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <Store className="w-4 h-4" /> Identity
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="col-span-1 md:col-span-8">
                            <Label className="mb-2 block">Business Name</Label>
                            <Input
                              {...register('name')}
                              placeholder="My Awesome Shop"
                              className="shadow-none"
                            />
                            {errors.name && (
                              <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                            )}
                          </div>
                          <div className="col-span-1 md:col-span-4">
                            <Label className="mb-2 block">Slug</Label>
                            <Input
                              {...register('slug')}
                              placeholder="my-shop"
                              className="shadow-none"
                            />
                          </div>
                        </div>
                        <div className="grid gap-4">
                          <div>
                            <Label className="mb-2 block">Tagline</Label>
                            <Input
                              {...register('tagline')}
                              placeholder="We do it better."
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Description</Label>
                            <Textarea
                              {...register('description')}
                              className="h-20 resize-none shadow-none"
                              placeholder="About us..."
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Group: Contact */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <MapPin className="w-4 h-4" /> Contact & Location
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2 block flex items-center gap-2">
                              <Mail className="w-3 h-3" /> Email
                            </Label>
                            <Input
                              {...register('email')}
                              placeholder="hello@biz.com"
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block flex items-center gap-2">
                              <Phone className="w-3 h-3" /> Phone
                            </Label>
                            <Input
                              {...register('phone')}
                              placeholder="+1 234..."
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> Address
                            </Label>
                            <Input
                              {...register('address')}
                              placeholder="123 Main St"
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block flex items-center gap-2">
                              <Globe className="w-3 h-3" /> Website
                            </Label>
                            <Input
                              {...register('website')}
                              placeholder="www.mysite.com"
                              className="shadow-none"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Group: Configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <Settings2 className="w-4 h-4" /> Features
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {['services', 'products', 'booking', 'ordering'].map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center space-x-2 border p-3 rounded-lg bg-muted/20"
                            >
                              <input
                                type="checkbox"
                                id={`${feature}_enabled`}
                                // @ts-ignore
                                {...register(`${feature}_enabled`)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary shadow-none"
                              />
                              <Label
                                htmlFor={`${feature}_enabled`}
                                className="cursor-pointer text-sm font-medium capitalize"
                              >
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* 2. Services */}
                <Accordion type="single" defaultValue="services" collapsible>
                  <AccordionItem value="services" className="rounded-lg border px-4 shadow-none">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Services
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      {serviceFields.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                          <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No services yet.</p>
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {serviceFields.map((field, index) => {
                            const name = watch(`services.${index}.name`);
                            const price = watch(`services.${index}.price`);
                            // Watch for image_url or a File object in 'image'
                            const imageUrl = watch(`services.${index}.image_url`);
                            const imageFile = watch(`services.${index}.image`);

                            // Determine preview for list item
                            let thumbnail = null;
                            if (imageFile instanceof File) {
                              thumbnail = URL.createObjectURL(imageFile);
                            } else if (imageUrl) {
                              thumbnail = imageUrl;
                            }

                            return (
                              <div
                                key={field.id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {/* List Thumbnail */}
                                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                                    {thumbnail ? (
                                      <img
                                        src={thumbnail}
                                        alt=""
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {name || 'Untitled Service'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">${price}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditState({ type: 'service', index })}
                                    className="shadow-none"
                                  >
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeService(index)}
                                    className="hover:text-destructive shadow-none"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <Button
                        onClick={onAddService}
                        variant="outline"
                        className="w-full mt-4 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* 3. Products */}
                <Accordion type="single" defaultValue="products" collapsible>
                  <AccordionItem value="products" className="rounded-lg border px-4 shadow-none">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Products
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      {productFields.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                          <ShoppingBasket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No products yet.</p>
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {productFields.map((field, index) => {
                            const name = watch(`products.${index}.name`);
                            const price = watch(`products.${index}.price`);
                            const active = watch(`products.${index}.is_active`);

                            const imageUrl = watch(`products.${index}.image_url`);
                            const imageFile = watch(`products.${index}.image`);

                            let thumbnail = null;
                            if (imageFile instanceof File)
                              thumbnail = URL.createObjectURL(imageFile);
                            else if (imageUrl) thumbnail = imageUrl;

                            return (
                              <div
                                key={field.id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                                    {thumbnail ? (
                                      <img
                                        src={thumbnail}
                                        alt=""
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm">
                                        {name || 'Untitled Product'}
                                      </span>
                                      {!active && (
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] h-4 px-1 shadow-none"
                                        >
                                          Inactive
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">${price}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditState({ type: 'product', index })}
                                    className="shadow-none"
                                  >
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeProduct(index)}
                                    className="hover:text-destructive shadow-none"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <Button
                        onClick={onAddProduct}
                        variant="outline"
                        className="w-full mt-4 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* 4. Testimonials */}
                <Accordion type="single" defaultValue="testimonials" collapsible>
                  <AccordionItem
                    value="testimonials"
                    className="rounded-lg border px-4 shadow-none"
                  >
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Testimonials
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      {testimonialFields.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No reviews yet.</p>
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {testimonialFields.map((field, index) => {
                            const author = watch(`testimonials.${index}.author`);
                            const rating = watch(`testimonials.${index}.rating`);

                            const imageUrl = watch(`testimonials.${index}.image_url`);
                            const imageFile = watch(`testimonials.${index}.image`);

                            let thumbnail = null;
                            if (imageFile instanceof File)
                              thumbnail = URL.createObjectURL(imageFile);
                            else if (imageUrl) thumbnail = imageUrl;

                            return (
                              <div
                                key={field.id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center border">
                                    {thumbnail ? (
                                      <img
                                        src={thumbnail}
                                        alt=""
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {author || 'Anonymous'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Rating: {rating}/5
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditState({ type: 'testimonial', index })}
                                    className="shadow-none"
                                  >
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTestimonial(index)}
                                    className="hover:text-destructive shadow-none"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <Button
                        onClick={onAddTestimonial}
                        variant="outline"
                        className="w-full mt-4 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* 5. Social Links (Unchanged) */}
                <Accordion type="single" defaultValue="socials" collapsible>
                  <AccordionItem value="socials" className="rounded-lg border px-4 shadow-none">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Social Links
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-3">
                        {socialFields.map((field, index) => (
                          <div key={field.id} className="flex gap-3 items-end">
                            <div className="w-1/3">
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Platform
                              </Label>
                              <Input
                                {...register(`social_links.${index}.platform` as const)}
                                placeholder="Instagram"
                                className="shadow-none"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                URL
                              </Label>
                              <Input
                                {...register(`social_links.${index}.url` as const)}
                                placeholder="https://..."
                                className="shadow-none"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSocial(index)}
                              className="mb-0.5 text-muted-foreground hover:text-destructive shadow-none"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={onAddSocialLink}
                        variant="outline"
                        className="w-full mt-4 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Social Link
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: DESIGN PANEL --- */}
        <div className="hidden lg:col-span-4 lg:block relative">
          <div className="sticky top-6 space-y-4">
            <DesignPanel
              layout={layout}
              setLayout={setLayout}
              localThemeSettings={localThemeSettings}
              setLocalThemeSettings={setLocalThemeSettings}
            />
          </div>
        </div>
      </div>

      <Dialog open={editState.type !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editState.type === 'service' && 'Edit Service'}
              {editState.type === 'product' && 'Edit Product'}
              {editState.type === 'testimonial' && 'Edit Testimonial'}
            </DialogTitle>
            <DialogDescription>Make changes to the selected item below.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {/* SERVICE FORM */}
            {editState.type === 'service' && editState.index !== null && (
              <>
                {/* Image Upload for Service */}
                <div>
                  <Label className="mb-2 block">Service Image</Label>
                  <ImageUploadField
                    previewUrl={watch(`services.${editState.index}.image_url`)}
                    currentFile={watch(`services.${editState.index}.image`) as File}
                    onFileSelect={(file) => setValue(`services.${editState.index}.image`, file)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Name</Label>
                  <Input
                    {...register(`services.${editState.index}.name`)}
                    className="shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Price ($)</Label>
                    <Input
                      type="number"
                      {...register(`services.${editState.index}.price`)}
                      className="shadow-none"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Duration (min)</Label>
                    <Input
                      type="number"
                      {...register(`services.${editState.index}.duration_minutes`)}
                      className="shadow-none"
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Description</Label>
                  <Textarea
                    {...register(`services.${editState.index}.description`)}
                    className="min-h-[100px] shadow-none"
                  />
                </div>
                <div className="flex items-center gap-2 border p-3 rounded-lg">
                  <input
                    type="checkbox"
                    {...register(`services.${editState.index}.is_featured`)}
                    className="w-4 h-4 text-primary shadow-none"
                  />
                  <Label className="font-normal">Feature on Homepage</Label>
                </div>
              </>
            )}

            {/* PRODUCT FORM */}
            {editState.type === 'product' && editState.index !== null && (
              <>
                {/* Image Upload for Product */}
                <div>
                  <Label className="mb-2 block">Product Image</Label>
                  <ImageUploadField
                    previewUrl={watch(`products.${editState.index}.image_url`)}
                    currentFile={watch(`products.${editState.index}.image`) as File}
                    onFileSelect={(file) => setValue(`products.${editState.index}.image`, file)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Product Name</Label>
                  <Input
                    {...register(`products.${editState.index}.name`)}
                    className="shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Price ($)</Label>
                    <Input
                      type="number"
                      {...register(`products.${editState.index}.price`)}
                      className="shadow-none"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Stock</Label>
                    <Input
                      type="number"
                      {...register(`products.${editState.index}.stock`)}
                      className="shadow-none"
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Description</Label>
                  <Textarea
                    {...register(`products.${editState.index}.description`)}
                    className="min-h-[100px] shadow-none"
                  />
                </div>
                <div className="flex items-center gap-2 border p-3 rounded-lg">
                  <input
                    type="checkbox"
                    {...register(`products.${editState.index}.is_active`)}
                    className="w-4 h-4 text-primary shadow-none"
                  />
                  <Label className="font-normal">Active / Available</Label>
                </div>
              </>
            )}

            {/* TESTIMONIAL FORM */}
            {editState.type === 'testimonial' && editState.index !== null && (
              <>
                {/* Image Upload for Testimonial */}
                <div>
                  <Label className="mb-2 block">Author Avatar</Label>
                  <ImageUploadField
                    previewUrl={watch(`testimonials.${editState.index}.image_url`)}
                    currentFile={watch(`testimonials.${editState.index}.image`) as File}
                    onFileSelect={(file) => setValue(`testimonials.${editState.index}.image`, file)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Author Name</Label>
                  <Input
                    {...register(`testimonials.${editState.index}.author`)}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    {...register(`testimonials.${editState.index}.rating`)}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Content</Label>
                  <Textarea
                    {...register(`testimonials.${editState.index}.content`)}
                    className="min-h-[100px] shadow-none"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={closeDialog} className="w-full shadow-none">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
