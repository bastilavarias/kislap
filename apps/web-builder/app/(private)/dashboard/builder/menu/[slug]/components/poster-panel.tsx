'use client';

import { useState } from 'react';
import { CheckCircle2, Download, ImagePlus, Loader2, Moon, Sparkles, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface PosterSettings {
  template: 'clean' | 'brand';
  size: 'a6';
  color_mode: 'light' | 'dark';
  headline: string | null;
  subtext: string | null;
  footer_note: string | null;
  preferred_images: string[];
}

interface Props {
  menuURL: string;
  posterSettings: PosterSettings;
  galleryImages: Array<{ image?: File | null; image_url?: string | null }>;
  setPosterField: <K extends keyof PosterSettings>(field: K, value: PosterSettings[K]) => void;
  businessName: string;
  generateDisplayPoster: () => Promise<void>;
}

const TEMPLATE_OPTIONS = [
  {
    value: 'clean' as const,
    title: 'Clean',
    description: 'Minimal, neutral layout that keeps the QR and message crisp.',
  },
  {
    value: 'brand' as const,
    title: 'Brand',
    description: 'Leans harder into business identity and visual tone.',
  },
];

const COLOR_MODE_OPTIONS = [
  {
    value: 'light' as const,
    title: 'Light',
    description: 'Bright poster with a lighter reading surface.',
    icon: Sun,
  },
  {
    value: 'dark' as const,
    title: 'Dark',
    description: 'Higher contrast treatment with a darker poster base.',
    icon: Moon,
  },
];

export function PosterPanel({
  menuURL,
  posterSettings,
  galleryImages,
  setPosterField,
  businessName,
  generateDisplayPoster,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const uploadedGalleryImages = galleryImages
    .map((entry) => entry.image_url || '')
    .filter(Boolean);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateDisplayPoster();
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePreferredImage = (imageURL: string) => {
    const current = posterSettings.preferred_images || [];
    if (current.includes(imageURL)) {
      setPosterField(
        'preferred_images',
        current.filter((value) => value !== imageURL)
      );
      return;
    }

    if (current.length >= 2) {
      return;
    }

    setPosterField('preferred_images', [...current, imageURL]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-12">
        <div className="space-y-2 md:col-span-12">
          <Label>Template</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEMPLATE_OPTIONS.map((option) => {
              const isSelected = posterSettings.template === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPosterField('template', option.value)}
                  className={cn(
                    'relative rounded-xl border-2 p-4 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-muted bg-background hover:border-muted-foreground/30 hover:bg-muted/30'
                  )}
                >
                  {isSelected ? (
                    <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
                  ) : null}
                  <p className={cn('text-sm font-semibold', isSelected && 'text-primary')}>
                    {option.title}
                  </p>
                  <p className="mt-1 pr-5 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 md:col-span-12">
          <Label>Color mode</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {COLOR_MODE_OPTIONS.map((option) => {
              const isSelected = posterSettings.color_mode === option.value;
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPosterField('color_mode', option.value)}
                  className={cn(
                    'relative rounded-xl border-2 p-4 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-muted bg-background hover:border-muted-foreground/30 hover:bg-muted/30'
                  )}
                >
                  {isSelected ? (
                    <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
                  ) : null}
                  <div
                    className={cn(
                      'mb-3 inline-flex rounded-full p-2',
                      isSelected ? 'bg-background text-primary' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className={cn('text-sm font-semibold', isSelected && 'text-primary')}>
                    {option.title}
                  </p>
                  <p className="mt-1 pr-5 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 md:col-span-4">
          <Label>Size</Label>
          <Input value="A6 - 105 x 148 mm" readOnly className="shadow-none" />
          <p className="text-xs text-muted-foreground">
            Optimized for compact acrylic stands and table displays.
          </p>
        </div>

        <div className="space-y-2 md:col-span-8">
          <Label>Menu URL</Label>
          <Input
            value={menuURL}
            readOnly
            placeholder="Publish with a subdomain to enable posters"
            className="shadow-none"
          />
        </div>

        <div className="space-y-2 md:col-span-8">
          <Label>Headline</Label>
          <Input
            value={posterSettings.headline ?? ''}
            onChange={(event) => setPosterField('headline', event.target.value)}
            placeholder="Scan to view our menu"
            className="shadow-none"
          />
        </div>

        <div className="space-y-2 md:col-span-4">
          <Label>Footer note</Label>
          <Input
            value={posterSettings.footer_note ?? ''}
            onChange={(event) => setPosterField('footer_note', event.target.value)}
            placeholder="Updated live for dine-in and takeaway."
            className="shadow-none"
          />
        </div>

        <div className="space-y-2 md:col-span-12">
          <Label>Subtext</Label>
          <Textarea
            value={posterSettings.subtext ?? ''}
            onChange={(event) => setPosterField('subtext', event.target.value)}
            placeholder="Browse our latest dishes, drinks, and prices on your phone."
            rows={3}
            className="shadow-none"
          />
        </div>

        <div className="space-y-3 md:col-span-12">
          <div className="space-y-1">
            <Label>Preferred Images</Label>
            <p className="text-xs text-muted-foreground">
              Select up to 2 gallery images. Brand uses these first. Clean ignores them for now.
            </p>
            <p className="text-xs text-muted-foreground">
              {posterSettings.preferred_images?.length || 0}/2 selected
            </p>
          </div>

          {uploadedGalleryImages.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {uploadedGalleryImages.map((imageURL, index) => {
                const isSelected = (posterSettings.preferred_images || []).includes(imageURL);

                return (
                  <button
                    key={imageURL}
                    type="button"
                    onClick={() => togglePreferredImage(imageURL)}
                    className={cn(
                      'relative overflow-hidden rounded-xl border-2 bg-background text-left transition-all',
                      isSelected
                        ? 'border-primary ring-2 ring-primary/15'
                        : 'border-muted hover:border-muted-foreground/30'
                    )}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="absolute right-3 top-3 z-10 h-4 w-4 text-primary" />
                    ) : null}
                    <img
                      src={imageURL}
                      alt={`Preferred gallery ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                    <div className="border-t px-3 py-2">
                      <p className="text-sm font-medium">
                        Gallery image {index + 1}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {isSelected ? 'Selected for brand poster' : 'Click to use in brand poster'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
              Upload gallery images first. Preferred images can only be selected from saved gallery image URLs.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          className="shadow-none w-full"
          onClick={handleGenerate}
          disabled={isGenerating || !menuURL || !businessName?.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

interface PosterPreviewCardProps {
  posterImageURL: string;
}

export function PosterPreviewCard({ posterImageURL }: PosterPreviewCardProps) {
  const previewURL = posterImageURL
    ? `${posterImageURL}${posterImageURL.includes('?') ? '&' : '?'}preview=${encodeURIComponent(posterImageURL)}`
    : '';
  const downloadFilename = posterImageURL
    ? `menu-poster-${posterImageURL.split('/').pop()?.split('?')[0] || 'a6.png'}`
    : 'menu-poster-a6.png';
  const downloadURL = posterImageURL
    ? `/api/poster-download?url=${encodeURIComponent(previewURL)}&filename=${encodeURIComponent(downloadFilename)}`
    : '';

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImagePlus className="h-4 w-4" />
            Current Poster
          </CardTitle>
          <CardDescription>
            Generate the A6 display poster and review the current active export here. Generating again replaces the current poster.
          </CardDescription>
        </div>
        {posterImageURL ? (
          <Button asChild variant="outline" size="sm" className="shrink-0 shadow-none">
            <a href={downloadURL}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {posterImageURL ? (
          <>
            <a
              href={previewURL}
              target="_blank"
              rel="noreferrer"
              className="block w-full overflow-hidden rounded-lg border bg-background"
            >
              <img
                src={previewURL}
                alt="Generated display poster preview"
                className="h-auto w-full object-cover"
              />
            </a>
          </>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
            <p className="text-sm font-semibold">No poster yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate your A6 poster to preview and download it here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
