'use client';

interface Props {
  images: string[];
}

export function MenuDefaultGallerySection({ images }: Props) {
  if (!images.length) return null;

  return (
    <section className="mt-12 rounded-[32px] border border-border/70 bg-card p-6 sm:p-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Gallery
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">A Quick Look Inside</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          A few snapshots from the kitchen, the dining room, and the plates people come back for.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="overflow-hidden rounded-[26px] border border-border/70 bg-muted"
          >
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
