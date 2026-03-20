'use client';

interface Point {
  label: string;
  value: number;
}

interface Props {
  title: string;
  points: Point[];
}

export function ActivityBarChart({ title, points }: Props) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="rounded-xl border bg-muted/15 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 flex h-40 items-end gap-3">
        {points.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-md bg-primary/80"
                style={{
                  height: `${Math.max((point.value / maxValue) * 100, point.value ? 16 : 4)}%`,
                }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
