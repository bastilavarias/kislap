import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPaths, productStories } from "@/components/landing/data";
import { PlaceholderMedia } from "@/components/landing/placeholder-media";

export function ExamplesRail() {
  return (
    <section className="overflow-hidden border-b-4 border-black bg-white px-4 py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="rounded-none border-4 border-black bg-secondary px-4 py-2 font-mono text-black shadow-[5px_5px_0_#000]">
              Pages worth sharing
            </Badge>
            <h2 className="mt-8 max-w-4xl text-5xl font-black uppercase leading-[0.9] md:text-7xl">
              Your first link should already look intentional.
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
          {[...productStories, ...productStories].map((story, index) => (
            <div
              key={`${story.title}-${index}`}
              className="landing-stack-card w-[78vw] max-w-[540px] shrink-0 border-4 border-black bg-zinc-100 p-4 shadow-[10px_10px_0_#000] md:w-[520px]"
            >
              <PlaceholderMedia
                title={`${story.title} published example`}
                size={story.imageSize}
                icon={story.icon}
                className="landing-scale-media min-h-[360px] bg-zinc-300 shadow-none"
              />
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-zinc-600">
                    Public output
                  </p>
                  <h3 className="mt-1 text-3xl font-black uppercase">
                    {story.title}
                  </h3>
                </div>
                <div className={`h-10 w-10 border-4 border-black ${story.accent}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
