'use client';

import { useMemo, useState } from 'react';
import { Check, Download, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const QR_PRESETS = [
  { name: 'Classic', foreground: '#111111', background: '#ffffff' },
  { name: 'Warm', foreground: '#7c3f00', background: '#fff4e6' },
  { name: 'Forest', foreground: '#0f5132', background: '#edfdf5' },
  { name: 'Midnight', foreground: '#ffffff', background: '#111827' },
] as const;

interface Props {
  menuURL: string;
  foregroundColor: string;
  backgroundColor: string;
  setForegroundColor: (value: string) => void;
  setBackgroundColor: (value: string) => void;
}

function normalizeHex(hex: string) {
  return hex.replace('#', '');
}

export function QRPanel({
  menuURL,
  foregroundColor,
  backgroundColor,
  setForegroundColor,
  setBackgroundColor,
}: Props) {
  const [copied, setCopied] = useState(false);
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    menuURL
  )}&color=${normalizeHex(foregroundColor)}&bgcolor=${normalizeHex(backgroundColor)}`;
  const downloadURL = `/api/poster-download?url=${encodeURIComponent(qrURL)}&filename=${encodeURIComponent('menu-qr.png')}`;
  const activePreset = useMemo(
    () =>
      QR_PRESETS.find(
        (preset) =>
          preset.foreground.toLowerCase() === foregroundColor.toLowerCase() &&
          preset.background.toLowerCase() === backgroundColor.toLowerCase()
      )?.name,
    [backgroundColor, foregroundColor]
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="mx-auto flex w-fit flex-col items-center gap-3">
          <img
            src={qrURL}
            alt="Menu QR code preview"
            className="h-48 w-48 rounded-lg border bg-white p-2"
          />
          <div className="text-center">
            <p className="text-sm font-medium">Live preview</p>
            <p className="text-xs text-muted-foreground">Generated from the current menu URL.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Quick Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {QR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setForegroundColor(preset.foreground);
                setBackgroundColor(preset.background);
              }}
              className="flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors hover:bg-accent/30"
            >
              <span
                className="h-8 w-8 rounded-md border"
                style={{
                  backgroundColor: preset.background,
                  boxShadow: `inset 0 0 0 8px ${preset.foreground}`,
                }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{preset.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {activePreset === preset.name ? 'Active preset' : 'Apply preset'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-2 block">Foreground</Label>
          <div className="flex items-center gap-2 rounded-md border px-3">
            <input
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="h-8 w-8 border-none bg-transparent p-0"
            />
            <Input
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="border-none px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div>
          <Label className="mb-2 block">Background</Label>
          <div className="flex items-center gap-2 rounded-md border px-3">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-8 w-8 border-none bg-transparent p-0"
            />
            <Input
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="border-none px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Menu URL</Label>
        <div className="flex gap-2">
          <Input value={menuURL} readOnly className="shadow-none" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={async () => {
              await navigator.clipboard.writeText(menuURL);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button asChild className="w-full">
        <a href={downloadURL}>
          <Download className="mr-2 h-4 w-4" />
          Download QR
        </a>
      </Button>
    </div>
  );
}
