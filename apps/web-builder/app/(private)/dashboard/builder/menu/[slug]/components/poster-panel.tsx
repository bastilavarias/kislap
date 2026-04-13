'use client';

import { useState } from 'react';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface PosterSettings {
  template: 'clean';
  size: 'a4' | 'a5' | 'a6';
  color_mode: 'light' | 'dark';
  headline: string;
  subtext: string;
  footer_note: string;
  show_logo: boolean;
  show_address: boolean;
  show_url: boolean;
}

interface Props {
  businessName: string;
  menuURL: string;
  posterSettings: PosterSettings;
  posterImageURL: string;
  setPosterField: <K extends keyof PosterSettings>(field: K, value: PosterSettings[K]) => void;
  generateDisplayPoster: () => Promise<void>;
}

export function PosterPanel({
  businessName,
  menuURL,
  posterSettings,
  posterImageURL,
  setPosterField,
  generateDisplayPoster,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const previewURL = posterImageURL
    ? `${posterImageURL}${posterImageURL.includes('?') ? '&' : '?'}preview=${encodeURIComponent(posterImageURL)}`
    : '';

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateDisplayPoster();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Generate Display Poster</p>
          <p className="text-xs text-muted-foreground">
            Create a ready-to-use store poster for acrylic stands, tables, and counters.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Template</Label>
          <Select
            value={posterSettings.template}
            onValueChange={(value: 'clean') => setPosterField('template', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clean">Clean</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <Select
            value={posterSettings.size}
            onValueChange={(value: 'a4' | 'a5' | 'a6') => setPosterField('size', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="a5">A5</SelectItem>
              <SelectItem value="a6">A6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Color mode</Label>
          <Select
            value={posterSettings.color_mode}
            onValueChange={(value: 'light' | 'dark') => setPosterField('color_mode', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Menu URL</Label>
          <Input value={menuURL} readOnly placeholder="Publish with a subdomain to enable posters" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Headline</Label>
        <Input
          value={posterSettings.headline}
          onChange={(event) => setPosterField('headline', event.target.value)}
          placeholder="Scan to view our menu"
        />
      </div>

      <div className="space-y-2">
        <Label>Subtext</Label>
        <Textarea
          value={posterSettings.subtext}
          onChange={(event) => setPosterField('subtext', event.target.value)}
          placeholder="Browse our latest dishes, drinks, and prices on your phone."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Footer note</Label>
        <Input
          value={posterSettings.footer_note}
          onChange={(event) => setPosterField('footer_note', event.target.value)}
          placeholder="Updated live for dine-in and takeaway."
        />
      </div>

      <div className="grid gap-3 rounded-xl border bg-muted/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Show logo</p>
            <p className="text-xs text-muted-foreground">Include the business logo in the poster.</p>
          </div>
          <Switch
            checked={posterSettings.show_logo}
            onCheckedChange={(checked) => setPosterField('show_logo', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Show address</p>
            <p className="text-xs text-muted-foreground">Add location details near the bottom.</p>
          </div>
          <Switch
            checked={posterSettings.show_address}
            onCheckedChange={(checked) => setPosterField('show_address', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Show URL</p>
            <p className="text-xs text-muted-foreground">Print the live menu URL below the QR code.</p>
          </div>
          <Switch
            checked={posterSettings.show_url}
            onCheckedChange={(checked) => setPosterField('show_url', checked)}
          />
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleGenerate}
        disabled={isGenerating || !menuURL || !businessName?.trim()}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating poster
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Display Poster
          </>
        )}
      </Button>

      {posterImageURL ? (
        <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Latest poster</p>
              <p className="text-xs text-muted-foreground">
                Generated from your current poster settings.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={previewURL} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>

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
        </div>
      ) : null}
    </div>
  );
}
