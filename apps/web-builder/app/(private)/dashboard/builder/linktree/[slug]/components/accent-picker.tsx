'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function parseGradient(value: string) {
  const fallback = { angle: 135, from: '#ef4444', to: '#3b82f6' };
  if (!value || !value.includes('linear-gradient(')) return fallback;

  const match = value.match(
    /linear-gradient\(\s*([0-9.]+)deg\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/i
  );
  if (!match) return fallback;

  return {
    angle: Number.isFinite(Number(match[1])) ? Number(match[1]) : fallback.angle,
    from: match[2].trim(),
    to: match[3].trim(),
  };
}

function isGradient(value: string) {
  return value?.includes('linear-gradient(');
}

export function AccentPicker({ label, value, onChange }: Props) {
  const gradient = parseGradient(value);
  const mode = isGradient(value) ? 'gradient' : 'solid';
  const solidValue = mode === 'solid' && value ? value : '#ef4444';

  const setGradient = (next: Partial<{ angle: number; from: string; to: string }>) => {
    const merged = { ...gradient, ...next };
    onChange(`linear-gradient(${Math.round(merged.angle)}deg, ${merged.from}, ${merged.to})`);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div
        className="h-10 w-full rounded-md border"
        style={{
          background: value || '#ef4444',
        }}
      />

      <Tabs
        value={mode}
        onValueChange={(nextMode) => {
          if (nextMode === 'solid') {
            onChange(solidValue);
            return;
          }
          setGradient({});
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solid">Solid</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
        </TabsList>

        <TabsContent value="solid" className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={solidValue}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 w-14 p-1"
            />
            <Input
              value={solidValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#ef4444"
            />
          </div>
        </TabsContent>

        <TabsContent value="gradient" className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">From</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={gradient.from}
                onChange={(e) => setGradient({ from: e.target.value })}
                className="h-9 w-14 p-1"
              />
              <Input
                value={gradient.from}
                onChange={(e) => setGradient({ from: e.target.value })}
                placeholder="#ef4444"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">To</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={gradient.to}
                onChange={(e) => setGradient({ to: e.target.value })}
                className="h-9 w-14 p-1"
              />
              <Input
                value={gradient.to}
                onChange={(e) => setGradient({ to: e.target.value })}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Angle ({Math.round(gradient.angle)}deg)</Label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[gradient.angle]}
              onValueChange={(val) => setGradient({ angle: val[0] ?? gradient.angle })}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-1">
        <Label className="text-xs">CSS Value</Label>
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
