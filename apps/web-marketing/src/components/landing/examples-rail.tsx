import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { productStories, type LandingBuildPaths } from "@/components/landing/data";
import { PlaceholderMedia } from "@/components/landing/placeholder-media";

type ExamplesRailProps = {
  buildPaths: LandingBuildPaths;
};

export function ExamplesRail({ buildPaths }: ExamplesRailProps) {
  return (
    <section className="overflow-hidden border-b-4 border-black bg-black py-28 text-white md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="rounded-none border-4 border-black bg-secondary px-4 py-2 font-mono text-black shadow-[5px_5px_0_#000]">
              One Page, different jobs
            </Badge>
            <h2 className="mt-8 max-w-5xl text-5xl font-black uppercase leading-[0.9] md:text-7xl">
              Start simple. Grow into the page you actually need.
            </h2>
          </div>

          <Button
            asChild
            className="h-13 w-fit rounded-none border-4 border-black bg-primary px-6 font-black uppercase text-white shadow-[6px_6px_0_#000] hover:bg-primary/90"
          >
            <a href={buildPaths.default}>
              Open builder <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="landing-horizontal-rail mt-16 flex w-max gap-6 pr-6">
          {productStories.map((story) => (
            <article
              key={story.title}
              className="landing-stack-card landing-pop-card w-[78vw] max-w-[560px] shrink-0 border-4 border-white bg-white p-4 text-black shadow-[10px_10px_0_#ef4444] md:w-[540px]"
            >
              <div className="overflow-hidden border-4 border-black bg-white">
                <div className="flex items-center gap-3 border-b-4 border-black bg-zinc-100 px-4 py-3">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 border-2 border-black bg-primary" />
                    <span className="h-3 w-3 border-2 border-black bg-secondary" />
                    <span className="h-3 w-3 border-2 border-black bg-black" />
                  </div>
                  <div className="min-w-0 flex-1 border-2 border-black bg-white px-3 py-1 font-mono text-[11px] font-black text-zinc-700">
                    yourname.kislap.app
                  </div>
                </div>

                <PlaceholderMedia
                  title={story.imageSize}
                  size={story.imageSize}
                  icon={story.icon}
                  imageSrc={story.imageSrc}
                  className="landing-scale-media landing-image-lift h-[300px] border-0 bg-zinc-300 shadow-none md:h-[360px]"
                />
              </div>

              <div className="mt-5">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-zinc-600">
                  {story.eyebrow}
                </p>
                <h3 className="mt-2 text-3xl font-black uppercase">
                  {story.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-zinc-700">
                  {story.copy}
                </p>
              </div>

              <Button
                asChild
                className="mt-5 h-13 w-full rounded-none border-4 border-black bg-black font-black uppercase text-white shadow-[5px_5px_0_#facc15] hover:bg-primary"
              >
                <a href={buildPaths.default}>
                  Build this kind of page <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="https://juandelacruz.kislap.app"
            target="_blank"
            rel="noopener noreferrer"
            className="border-4 border-white bg-secondary px-6 py-4 font-mono text-sm font-black uppercase text-black shadow-[6px_6px_0_#ef4444] transition hover:-translate-y-1"
          >
            Open Juan's live Kislap Page ↗
          </a>
        </div>
      </div>
    </section>
  );
}
