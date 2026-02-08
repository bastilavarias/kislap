'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Plus,
  X,
  LayoutTemplate,
  CheckCircle2,
  Palette,
  Link as LinkIcon,
  Cpu,
  CloudFog,
  Image as ImageIcon,
  UploadCloud,
  Edit2,
  Trash2,
  Bold as BoldIcon,
  Strikethrough as StrikethroughIcon,
  List as ListIcon,
  GripVertical,
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
import { LinktreeFormValues } from '@/lib/schemas/linktree';

const LAYOUT_OPTIONS = [
  {
    id: 'linktree-default',
    name: 'Default',
    icon: LayoutTemplate,
    description: 'Clean & balanced.',
  },
  { id: 'linktree-retro', name: 'Retro', icon: CloudFog, description: 'Vintage & nostalgic.' },
  { id: 'linktree-cyber', name: 'Cyber', icon: Cpu, description: 'Dark & futuristic.' },
];

// --- Components from Biz Form ---

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
    let newText = value || '';
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
        className="border-none shadow-none focus-visible:ring-0 rounded-none min-h-[100px] resize-none font-mono text-sm"
        placeholder="Type content here..."
      />
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
              <CardDescription>Select a structure for your linktree page.</CardDescription>
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
  formMethods: UseFormReturn<LinktreeFormValues>;
  socialLinksFieldArray: UseFieldArrayReturn<LinktreeFormValues, 'social_links', 'id'>;
  localThemeSettings: Settings | null;
  setLocalThemeSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  layout: string;
  setLayout: (layout: string) => void;
  onAddSocialLink: () => void;
}

export function Form({
  formMethods,
  socialLinksFieldArray,
  onAddSocialLink,
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
  const [editSocialIndex, setEditSocialIndex] = useState<number | null>(null);

  useEffect(() => {
    //@ts-ignore
    setValue('layout_name', layout);
  }, [layout, setValue]);

  const handleAddNewLink = () => {
    onAddSocialLink();
    // The new item is at the end of the array
    setTimeout(() => {
      setEditSocialIndex(socialFields.length);
    }, 0);
  };

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-none border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <LinkIcon className="w-6 h-6" /> Linktree Content
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
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* 6. SOCIAL LINKS SECTION - UPDATED TO LIST & MODAL STYLE */}
                <Accordion type="single" defaultValue="socials" collapsible>
                  <AccordionItem value="socials" className="rounded-lg border px-4 shadow-none">
                    <AccordionTrigger className="cursor-pointer py-3 text-base font-medium hover:no-underline">
                      Social Links
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 px-1">
                      <div className="space-y-3">
                        {socialFields.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                            <LinkIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No links added yet.</p>
                          </div>
                        ) : (
                          socialFields.map((field, index) => {
                            // Watch values for display in the list
                            const name = watch(`social_links.${index}.platform`);
                            const url = watch(`social_links.${index}.url`);
                            const imgUrl = watch(`social_links.${index}.image_url`);
                            const imgFile = watch(`social_links.${index}.image`);

                            // Determine preview image source
                            let displayImg = imgUrl;
                            if (imgFile instanceof File) {
                              displayImg = URL.createObjectURL(imgFile);
                            }

                            return (
                              <div
                                key={field.id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
                              >
                                <div className="flex items-center gap-3 w-full overflow-hidden">
                                  {/* Drag Handle or Icon Placeholder */}
                                  <div className="h-12 w-12 rounded-md bg-muted shrink-0 flex items-center justify-center border overflow-hidden">
                                    {displayImg ? (
                                      <img
                                        src={displayImg}
                                        alt="Icon"
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <LinkIcon className="w-5 h-5 text-muted-foreground/50" />
                                    )}
                                  </div>

                                  <div className="space-y-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {name || 'Untitled Link'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-md">
                                      {url || 'No URL set'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    onClick={() => setEditSocialIndex(index)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeSocial(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <Button
                        onClick={handleAddNewLink}
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

      {/* EDIT MODAL DIALOG */}
      <Dialog
        open={editSocialIndex !== null}
        onOpenChange={(open) => !open && setEditSocialIndex(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editSocialIndex !== null && watch(`social_links.${editSocialIndex}.platform`)
                ? 'Edit Link'
                : 'Add New Link'}
            </DialogTitle>
            <DialogDescription>Customize the details for this link.</DialogDescription>
          </DialogHeader>

          {editSocialIndex !== null && (
            <div className="grid gap-6 py-4">
              <div className="space-y-3">
                <Label>Icon / Image</Label>
                <ImageUploadField
                  id={`social-img-${editSocialIndex}`}
                  previewUrl={watch(`social_links.${editSocialIndex}.image_url`)}
                  currentFile={watch(`social_links.${editSocialIndex}.image`)}
                  onFileSelect={(file) => setValue(`social_links.${editSocialIndex}.image`, file)}
                />
              </div>

              <div className="space-y-2">
                <Label>Name / Title</Label>
                <Input
                  {...register(`social_links.${editSocialIndex}.platform`)}
                  className="shadow-none"
                  placeholder="e.g. My Portfolio"
                />
              </div>

              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  {...register(`social_links.${editSocialIndex}.url`)}
                  className="shadow-none"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <SimpleRichTextEditor
                  value={watch(`social_links.${editSocialIndex}.description`) || ''}
                  onChange={(val) => setValue(`social_links.${editSocialIndex}.description`, val)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setEditSocialIndex(null)} className="w-full sm:w-auto">
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
