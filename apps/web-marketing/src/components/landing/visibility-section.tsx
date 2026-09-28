import { ArrowRight, Blocks, LayoutGrid, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LandingBuildPaths } from "@/components/landing/data";

type VisibilitySectionProps = {
  buildPaths: LandingBuildPaths;
};

const handledItems = [
  {
    title: "Blocks",
    copy: "Add links, projects, text, skills, experience, promos, banners, quotes, support cards, and more.",
    icon: Blocks,
  },
  {
    title: "Layout",
    copy: "Reorder content and give each block the space it deserves with full, half, third, and flexible widths.",
    icon: LayoutGrid,
  },
  {
    title: "Theme",
    copy: "Choose the visual direction once. Kislap keeps colors, spacing, shadows, and typography consistent across the page.",
    icon: Palette,
  },
];

export function VisibilitySection({ buildPaths }: VisibilitySectionProps) {
  return (
    <section className="border-b-4 border-black bg-fuchsia-500 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="landing-reveal border-4 border-black bg-primary p-7 text-white shadow-[12px_12px_0_#000] md:p-10">
          <p className="inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-black uppercase text-black shadow-[5px_5px_0_#000]">
            More than a list of links
          </p>
          <h2 className="mt-8 max-w-4xl text-5xl font-black uppercase leading-[0.88] md:text-7xl">
            Build the page around you.
          </h2>
          <p className="mt-7 max-w-2xl text-xl font-bold leading-relaxed text-white">
            Your latest video should not have to look like your GitHub link. Your
            best project should not have to fit the same box as everything else.
            Kislap lets you compose one page without turning into a blank-canvas website builder.
          </p>
          <Button
            asChild
            className="mt-9 h-14 rounded-none border-4 border-black bg-white px-6 font-black uppercase text-black shadow-[6px_6px_0_#000] hover:bg-secondary"
          >
            <a href={buildPaths.default}>
              Build your page <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>

        <div className="grid gap-5">
          {handledItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="landing-pop-card group grid gap-5 border-4 border-black bg-white p-6 text-black shadow-[8px_8px_0_#000] md:grid-cols-[72px_minmax(0,1fr)] md:items-center"
              >
                <div className="landing-wiggle flex h-16 w-16 items-center justify-center border-4 border-black bg-secondary shadow-[4px_4px_0_#000]">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase leading-none">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base font-bold leading-relaxed text-zinc-700">
                    {item.copy}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
