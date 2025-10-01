// React Imports
import { useEffect, useMemo, useState } from 'react';

// Component Imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ThemeFontSelectProps = {
  fonts: Record<string, string>;
  defaultValue: string;
  currentFont: string | null;
  onFontChange: (font: string) => void;
};

export const ThemeFontSelect = ({
  fonts,
  defaultValue,
  currentFont,
  onFontChange,
}: ThemeFontSelectProps) => {
  const [value, setValue] = useState(currentFont ?? defaultValue);

  const fontNames = useMemo(() => ['System', ...Object.keys(fonts)], [fonts]);

  const onValueChange = (fontName: string) => {
    setValue(fontName);
    onFontChange(fontName);
  };

  useEffect(() => {
    if (currentFont) {
      onValueChange(currentFont);
    }
  }, [currentFont]);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-12 w-full cursor-pointer">
        <SelectValue placeholder="Select theme font" />
      </SelectTrigger>
      <SelectContent>
        {fontNames.map((fontName) => (
          <SelectItem key={fontName} value={fontName}>
            <span style={{ fontFamily: fonts[fontName] ?? 'inherit' }}>{fontName}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
