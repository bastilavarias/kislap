'use client';

import { useState, useEffect } from 'react';
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
  CheckCircle2,
  Palette,
  Store,
  ShoppingBasket,
  CalendarDays,
  MessageSquare,
  MapPin,
  Edit2,
  Trash2,
  Settings2,
  Image as ImageIcon,
  UploadCloud,
  HelpCircle,
  Bold as BoldIcon,
  List as ListIcon,
  Link as LinkIcon,
  Strikethrough as StrikethroughIcon,
  ChevronDown,
  Check,
  Map as MapIcon,
  Clock,
  Calendar,
  ExternalLink,
  Cpu,
  CloudFog,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';
import { BizFormValues } from '@/lib/schemas/biz';
import { SortableList } from '@/components/sortable-list';

const LAYOUT_OPTIONS = [
  { id: 'biz-default', name: 'Default', icon: LayoutTemplate, description: 'Clean & balanced.' },
  { id: 'biz-retro', name: 'Retro', icon: CloudFog, description: 'Vintage & nostalgic.' },
  { id: 'biz-cyber', name: 'Cyber', icon: Cpu, description: 'Dark & futuristic.' },
];

function SimpleRichTextEditor({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const insertFormat = (format: 'bold' | 'list' | 'link' | 'strike') => {
    let newText = value;
    if (format === 'bold') newText += ' **bold text** ';
    if (format === 'strike') newText += ' ~~strikethrough~~ ';
    if (format === 'link') newText += ' [link text](https://example.com) ';
    if (format === 'list') newText += '\n- list item';

    onChange(newText);
  };

  return (
    <div
      className={cn(
        'border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring',
        className
      )}
    >
      <div className="bg-muted/50 border-b p-2 flex gap-1 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('bold')}
          title="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('strike')}
          title="Strikethrough"
        >
          <StrikethroughIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('link')}
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertFormat('list')}
          title="List"
        >
          <ListIcon className="w-4 h-4" />
        </Button>
        <span className="text-[10px] text-muted-foreground self-center ml-auto px-2">
          Markdown Supported
        </span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none shadow-none focus-visible:ring-0 rounded-none min-h-[150px] resize-none font-mono text-sm"
        placeholder="Type content here..."
      />
    </div>
  );
}

function CategoryAutocomplete({
  value,
  onChange,
  existingCategories,
}: {
  value: string;
  onChange: (val: string) => void;
  existingCategories: string[];
}) {
  const [open, setOpen] = useState(false);
  const uniqueCats = Array.from(new Set(existingCategories)).filter(Boolean);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal shadow-none"
        >
          {value || 'Select or type category...'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search category..."
            onValueChange={(search) => {
              if (!uniqueCats.includes(search)) onChange(search);
            }}
          />
          <CommandEmpty>Typing new category...</CommandEmpty>
          <CommandGroup>
            {uniqueCats.map((cat) => (
              <CommandItem
                key={cat}
                value={cat}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', value === cat ? 'opacity-100' : 'opacity-0')}
                />
                {cat}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function MultiImageUpload({
  files,
  urls,
  onChange,
  maxFiles = 8,
}: {
  files: (File | undefined)[];
  urls: (string | undefined)[];
  onChange: (newFiles: (File | string)[]) => void;
  maxFiles?: number;
}) {
  const totalImages = files.length;

  const displayItems = files
    .map((file, i) => ({
      type: file instanceof File ? 'file' : 'url',
      src: file instanceof File ? URL.createObjectURL(file) : urls[i],
      original: file || urls[i],
    }))
    .filter((item) => item.src);

  const handleRemove = (index: number) => {
    const validItems = files.map((f, i) => f || urls[i]).filter(Boolean);
    const newItems = validItems.filter((_, i) => i !== index);
    onChange(newItems as (File | string)[]);
  };

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentItems = files.map((f, i) => f || urls[i]).filter(Boolean);
      const combined = [...currentItems, ...newFiles].slice(0, maxFiles);
      onChange(combined as (File | string)[]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
          >
            <img src={item.src} className="w-full h-full object-cover" alt="Gallery" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {totalImages < maxFiles && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">Add Image</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleAdd} />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {totalImages} / {maxFiles} images
      </p>
    </div>
  );
}

function ImageUploadField({
  id,
  previewUrl,
  currentFile,
  onFileSelect,
}: {
  id: string;
  previewUrl?: string | null;
  currentFile?: File | null;
  onFileSelect: (file: File | null) => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentFile) {
      const objectUrl = URL.createObjectURL(currentFile);
      setLocalPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLocalPreview(null);
    }
  }, [currentFile]);

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
          htmlFor={id}
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {displayImage ? 'Change Image' : 'Upload Image'}
        </Label>
        <Input
          id={id}
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

function LocationMapPreview({
  address,
  mapLink,
}: {
  address?: string | null;
  mapLink?: string | null;
}) {
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setCoords(null);
      return;
    }

    const fetchCoords = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setCoords({ lat: data[0].lat, lon: data[0].lon });
        } else {
          setCoords(null);
        }
      } catch (e) {
        console.error('Failed to geocode address', e);
        setCoords(null);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCoords, 1000); // Debounce API calls
    return () => clearTimeout(debounce);
  }, [address]);

  return (
    <div className="w-full rounded-lg border overflow-hidden bg-muted/20 relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
          <MapIcon className="w-3 h-3 mr-1" /> OpenStreetMap
        </Badge>
        {mapLink && (
          <a href={mapLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs bg-background/80 backdrop-blur"
            >
              <ExternalLink className="w-3 h-3 mr-1" /> Open Link
            </Button>
          </a>
        )}
      </div>

      <div className="h-[250px] w-full flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-xs">Locating address...</span>
          </div>
        ) : coords ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(coords.lon) - 0.01},${parseFloat(coords.lat) - 0.01},${parseFloat(coords.lon) + 0.01},${parseFloat(coords.lat) + 0.01}&layer=mapnik&marker=${coords.lat},${coords.lon}`}
            className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
          ></iframe>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">
              {address ? 'Location not found.' : 'Enter an address to preview map.'}
            </p>
          </div>
        )}
      </div>
      <div className="bg-muted p-2 text-[10px] text-center text-muted-foreground border-t">
        Map preview is generated based on the <strong>Address</strong> field.
      </div>
    </div>
  );
}

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

interface Props {
  formMethods: UseFormReturn<BizFormValues>;
  socialLinksFieldArray: UseFieldArrayReturn<BizFormValues, 'social_links', 'id'>;
  servicesFieldArray: UseFieldArrayReturn<BizFormValues, 'services', 'id'>;
  productsFieldArray: UseFieldArrayReturn<BizFormValues, 'products', 'id'>;
  testimonialsFieldArray: UseFieldArrayReturn<BizFormValues, 'testimonials', 'id'>;
  faqsFieldArray: UseFieldArrayReturn<BizFormValues, 'faqs', 'id'>;
  galleryFieldArray: UseFieldArrayReturn<BizFormValues, 'gallery_images', 'id'>;

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
  onAddFaq: () => void;
}

export function Form({
  formMethods,
  socialLinksFieldArray,
  servicesFieldArray,
  productsFieldArray,
  testimonialsFieldArray,
  faqsFieldArray,
  galleryFieldArray,
  onAddService,
  onAddProduct,
  onAddSocialLink,
  onAddTestimonial,
  onAddFaq,
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
  const { fields: serviceFields, remove: removeService, move: moveService } = servicesFieldArray;
  const { fields: productFields, remove: removeProduct, move: moveProduct } = productsFieldArray;
  const {
    fields: testimonialFields,
    remove: removeTestimonial,
    move: moveTestimonial,
  } = testimonialsFieldArray;
  const { fields: faqFields, remove: removeFaq, move: moveFaq } = faqsFieldArray;
  const { fields: galleryFields, replace: replaceGallery } = galleryFieldArray;

  const [editState, setEditState] = useState<{
    type: 'service' | 'product' | 'testimonial' | 'faq' | null;
    index: number | null;
  }>({ type: null, index: null });

  const closeDialog = () => setEditState({ type: null, index: null });

  useEffect(() => {
    //@ts-ignore
    setValue('layout_name', layout);
  }, [layout, setValue]);

  const handleGalleryChange = (newItems: (File | string)[]) => {
    const formatted = newItems.map((item) => ({
      image: item instanceof File ? item : undefined,
      image_url: typeof item === 'string' ? item : undefined,
    }));
    // @ts-ignore
    replaceGallery(formatted);
  };

  const allCategories = productFields
    .map((_, i) => watch(`products.${i}.category`))
    .filter(Boolean);

  const currentAddress = watch('address');
  const currentMapLink = watch('map_link');

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-none border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Store className="w-6 h-6" /> Business Content
                </h1>
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
                              <Label className="mb-2 block">Business Name</Label>
                              <Input
                                {...register('name')}
                                placeholder="My Awesome Shop"
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
                                placeholder="We do it better."
                                className="shadow-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <LayoutTemplate className="w-4 h-4" /> Hero Section
                        </div>
                        <div className="grid gap-4">
                          <div>
                            <Label className="mb-2 block">Hero Title</Label>
                            <Input
                              {...register('hero_title')}
                              placeholder="Welcome to..."
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Hero Description</Label>
                            <Textarea
                              {...register('hero_description')}
                              className="h-20 resize-none shadow-none"
                              placeholder="Catchy intro text..."
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Hero Background Image</Label>
                            <ImageUploadField
                              id="hero-image-upload"
                              previewUrl={watch('hero_image_url')}
                              currentFile={watch('hero_image') as File}
                              onFileSelect={(f) => setValue('hero_image', f)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <Store className="w-4 h-4" /> About Us
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label className="mb-2 block">About Image</Label>
                            <ImageUploadField
                              id="about-image-upload"
                              previewUrl={watch('about_image_url')}
                              currentFile={watch('about_image') as File}
                              onFileSelect={(f) => setValue('about_image', f)}
                            />
                          </div>
                          <div>
                            <Label className="mb-2 block">Our Story</Label>
                            <Textarea
                              {...register('description')}
                              className="h-[125px] resize-none shadow-none"
                              placeholder="Tell your story..."
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <MapPin className="w-4 h-4" /> Contact & Location
                        </div>

                        <div className="space-y-2">
                          <Label>Location Preview</Label>
                          <LocationMapPreview address={currentAddress} mapLink={currentMapLink} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-2">Email</Label>
                            <Input {...register('email')} className="shadow-none" />
                          </div>
                          <div>
                            <Label className="mb-2">Phone</Label>
                            <Input {...register('phone')} className="shadow-none" />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="mb-2">Address</Label>
                            <Input
                              {...register('address')}
                              placeholder="e.g. 123 Main St, New York, NY"
                              className="shadow-none"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Used to generate the map preview above.
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <Label className="mb-2 flex items-center gap-2">
                              Map Link (Google Maps)
                              <HelpCircle className="w-3 h-3 text-muted-foreground" />
                            </Label>
                            <Input
                              {...register('map_link')}
                              placeholder="https://maps.google.com/..."
                              className="shadow-none"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Paste the "Share" link from Google Maps here. This will be used for
                              the "Get Directions" button.
                            </p>
                          </div>
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <Calendar className="w-3 h-3" /> Schedule
                            </Label>
                            <Input
                              {...register('schedule')}
                              placeholder="e.g. Mon - Fri"
                              className="shadow-none"
                            />
                          </div>
                          <div>
                            <Label className="mb-2 flex items-center gap-2">
                              <Clock className="w-3 h-3" /> Hours
                            </Label>
                            <Input
                              {...register('operation_hours')}
                              placeholder="e.g. 9:00 AM - 6:00 PM"
                              className="shadow-none"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <ImageIcon className="w-4 h-4" /> Photo Gallery
                        </div>
                        <MultiImageUpload
                          files={galleryFields.map((f, i) => watch(`gallery_images.${i}.image`))}
                          urls={galleryFields.map((f, i) => watch(`gallery_images.${i}.image_url`))}
                          onChange={handleGalleryChange}
                          maxFiles={8}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                          <Settings2 className="w-4 h-4" /> Features
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {['products'].map((feature) => (
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

                <Accordion type="single" defaultValue="services" collapsible>
                  {/* <AccordionItem value="services" className="rounded-lg border px-4 shadow-none">
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
                        <SortableList
                          items={serviceFields}
                          onDragEnd={(oldIndex, newIndex) => moveService(oldIndex, newIndex)}
                          renderItem={(field, index) => {
                            const name = watch(`services.${index}.name`);
                            const price = watch(`services.${index}.price`);
                            const imageUrl = watch(`services.${index}.image_url`);
                            const imageFile = watch(`services.${index}.image`);

                            let thumbnail = null;
                            if (imageFile instanceof File)
                              thumbnail = URL.createObjectURL(imageFile);
                            else if (imageUrl) thumbnail = imageUrl;

                            return (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center border">
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
                          }}
                        />
                      )}
                      <Button
                        onClick={onAddService}
                        variant="outline"
                        className="w-full mt-4 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                      </Button>
                    </AccordionContent>
                  </AccordionItem> */}

                  <AccordionItem value="services">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Services
                    </AccordionTrigger>
                    <AccordionContent className="p-4 relative min-h-[200px]">
                      <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-md m-2">
                        <div className="bg-primary/10 p-4 rounded-full mb-3 ring-4 ring-primary/5">
                          <Settings2 className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Work in Progress</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                          The services module is currently under development. Please check back
                          later.
                        </p>
                      </div>

                      <div className="opacity-30 pointer-events-none filter blur-[1px]">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Service List</h3>
                            <Button size="sm" variant="outline" disabled>
                              <Plus className="w-4 h-4 mr-2" /> Add Service
                            </Button>
                          </div>
                          <div className="border rounded-md p-8 text-center text-muted-foreground bg-muted/20">
                            No services added.
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

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
                        <SortableList
                          items={productFields}
                          onDragEnd={(oldIndex, newIndex) => moveProduct(oldIndex, newIndex)}
                          renderItem={(field, index) => {
                            const name = watch(`products.${index}.name`);
                            const price = watch(`products.${index}.price`);
                            const active = watch(`products.${index}.is_active`);
                            const imageUrl = watch(`products.${index}.image_url`);
                            const imageFile = watch(`products.${index}.image`);
                            const category = watch(`products.${index}.category`);

                            let thumbnail = null;
                            if (imageFile instanceof File)
                              thumbnail = URL.createObjectURL(imageFile);
                            else if (imageUrl) thumbnail = imageUrl;

                            return (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center border">
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
                                      {category && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] h-4 px-1 shadow-none"
                                        >
                                          {category}
                                        </Badge>
                                      )}
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
                          }}
                        />
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

                <Accordion type="single" defaultValue="faqs" collapsible>
                  <AccordionItem value="faqs" className="rounded-lg border px-4 shadow-none">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      FAQs
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      {faqFields.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                          <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No questions yet.</p>
                        </div>
                      ) : (
                        <SortableList
                          items={faqFields}
                          onDragEnd={(oldIndex, newIndex) => moveFaq(oldIndex, newIndex)}
                          renderItem={(field, index) => {
                            const question = watch(`faqs.${index}.question`);
                            const answer = watch(`faqs.${index}.answer`);

                            return (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3 w-full overflow-hidden">
                                  <div className="h-10 w-10 rounded-md bg-muted shrink-0 flex items-center justify-center border">
                                    <HelpCircle className="w-4 h-4 text-muted-foreground/50" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-sm truncate">
                                      {question || 'Untitled Question'}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-md">
                                      {answer
                                        ? answer.substring(0, 50) + '...'
                                        : 'No answer provided'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditState({ type: 'faq', index })}
                                    className="shadow-none"
                                  >
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFaq(index)}
                                    className="hover:text-destructive shadow-none"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          }}
                        />
                      )}
                      <Button
                        onClick={onAddFaq}
                        variant="outline"
                        className="w-full mt-4 border-dashed shadow-none"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add FAQ
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* 5. TESTIMONIALS SECTION */}
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
                        <SortableList
                          items={testimonialFields}
                          onDragEnd={(oldIndex, newIndex) => moveTestimonial(oldIndex, newIndex)}
                          renderItem={(field, index) => {
                            const author = watch(`testimonials.${index}.author`);
                            const rating = watch(`testimonials.${index}.rating`);
                            const avatarURL = watch(`testimonials.${index}.avatar_url`);
                            const avatarFile = watch(`testimonials.${index}.avatar`);

                            let thumbnail = null;
                            if (avatarFile instanceof File)
                              thumbnail = URL.createObjectURL(avatarFile);
                            else if (avatarURL) thumbnail = avatarURL;

                            return (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
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
                          }}
                        />
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

                {/* 6. SOCIAL LINKS SECTION */}
                <Accordion type="single" defaultValue="socials" collapsible>
                  <AccordionItem value="socials" className="rounded-lg border px-4 shadow-none">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Social Links
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 px-1">
                      <div className="space-y-3">
                        {socialFields.map((field, index) => (
                          <div key={field.id} className="flex gap-3 items-end">
                            <Input
                              className="hidden"
                              {...register(`social_links.${index}.id` as const)}
                            />
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {editState.type === 'service' && 'Edit Service'}
              {editState.type === 'product' && 'Edit Product'}
              {editState.type === 'testimonial' && 'Edit Testimonial'}
              {editState.type === 'faq' && 'Edit FAQ'}
            </DialogTitle>
            <DialogDescription>Make changes to the selected item below.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {editState.type === 'service' && editState.index !== null && (
              <>
                <input type="hidden" {...register(`services.${editState.index}.id`)} />
                <div>
                  <Label className="mb-2 block">Service Image</Label>
                  <ImageUploadField
                    id="service-edit-image"
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

            {editState.type === 'product' && editState.index !== null && (
              <>
                <input type="hidden" {...register(`products.${editState.index}.id`)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Product Image</Label>
                      <ImageUploadField
                        id="product-edit-image"
                        previewUrl={watch(`products.${editState.index}.image_url`)}
                        currentFile={watch(`products.${editState.index}.image`) as File}
                        onFileSelect={(file) => setValue(`products.${editState.index}.image`, file)}
                      />
                    </div>
                    <div className="flex items-center gap-2 border p-3 rounded-lg bg-muted/20">
                      <input
                        type="checkbox"
                        {...register(`products.${editState.index}.is_active`)}
                        className="w-4 h-4 text-primary shadow-none"
                      />
                      <Label className="font-normal cursor-pointer">Active / Available</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Product Name</Label>
                      <Input
                        {...register(`products.${editState.index}.name`)}
                        className="shadow-none"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Category</Label>
                      <CategoryAutocomplete
                        value={watch(`products.${editState.index}.category`)}
                        onChange={(val) => setValue(`products.${editState.index}.category`, val)}
                        existingCategories={allCategories}
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
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Description</Label>
                  <SimpleRichTextEditor
                    value={watch(`products.${editState.index}.description`) || ''}
                    onChange={(val) => setValue(`products.${editState.index}.description`, val)}
                  />
                </div>
              </>
            )}

            {/* TESTIMONIAL EDIT */}
            {editState.type === 'testimonial' && editState.index !== null && (
              <>
                <input type="hidden" {...register(`testimonials.${editState.index}.id`)} />
                <div>
                  <Label className="mb-2 block">Author Avatar</Label>
                  <ImageUploadField
                    id="testimonial-edit-avatar"
                    previewUrl={watch(`testimonials.${editState.index}.avatar_url`)}
                    currentFile={watch(`testimonials.${editState.index}.avatar`) as File}
                    onFileSelect={(file) =>
                      setValue(`testimonials.${editState.index}.avatar`, file)
                    }
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

            {/* FAQ EDIT */}
            {editState.type === 'faq' && editState.index !== null && (
              <>
                <input type="hidden" {...register(`faqs.${editState.index}.id`)} />
                <div>
                  <Label className="mb-2 block">Question</Label>
                  <Input
                    {...register(`faqs.${editState.index}.question`)}
                    placeholder="e.g. Do you deliver?"
                    className="shadow-none font-bold text-lg"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Answer</Label>
                  <SimpleRichTextEditor
                    value={watch(`faqs.${editState.index}.answer`) || ''}
                    onChange={(val) => setValue(`faqs.${editState.index}.answer`, val)}
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
