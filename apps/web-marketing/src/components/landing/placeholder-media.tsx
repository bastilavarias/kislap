import type { ElementType } from "react";

import { cn } from "@/lib/utils";

type PlaceholderMediaProps = {
  title: string;
  size: string;
  note?: string;
  className?: string;
  icon?: ElementType;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
};

export function PlaceholderMedia({
  title,
  size,
  note,
  className,
  icon: Icon,
  imageSrc,
  imageAlt,
  imageClassName,
}: PlaceholderMediaProps) {
  return (
    <div
      className={cn(
        "group relative flex min-h-64 overflow-hidden border-4 border-black bg-zinc-200 shadow-[10px_10px_0_#000]",
        className
      )}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt || title}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]",
            imageClassName
          )}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.12)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.12)_50%,rgba(0,0,0,0.12)_75%,transparent_75%,transparent)] bg-[length:32px_32px] opacity-25 transition-transform duration-700 ease-out group-hover:scale-105" />
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]">
                  Preview
                </p>
                <h3 className="mt-2 max-w-sm text-2xl font-black uppercase leading-none">
                  {title}
                </h3>
              </div>
              {Icon ? (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_#000]">
                  <Icon className="h-6 w-6" />
                </div>
              ) : null}
            </div>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
              <div className="border-4 border-black bg-white px-3 py-2 font-mono text-sm font-bold text-black shadow-[4px_4px_0_#000]">
                Recommended format: {size}
              </div>
              {note ? (
                <p className="max-w-xs text-right text-sm font-semibold">{note}</p>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
