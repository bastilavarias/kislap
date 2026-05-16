import { ArrowRight, Database, Globe2, ServerCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LandingBuildPaths } from "@/components/landing/data";

type VisibilitySectionProps = {
  buildPaths: LandingBuildPaths;
};

const handledItems = [
  {
    title: "Domain",
    copy: "Your page gets a public Kislap URL without DNS setup.",
    icon: Globe2,
  },
  {
    title: "Database",
    copy: "Your form content is stored and mapped into the right page type.",
    icon: Database,
  },
  {
    title: "Code",
    copy: "Templates, rendering, hosting, and updates stay behind the scenes.",
    icon: ServerCog,
  },
];

export function VisibilitySection({ buildPaths }: VisibilitySectionProps) {
  return (
    <section className="border-b-4 border-black bg-fuchsia-500 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="landing-reveal border-4 border-black bg-primary p-7 text-white shadow-[12px_12px_0_#000] md:p-10">
          <p className="inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-black uppercase text-black shadow-[5px_5px_0_#000]">
            Be visible
          </p>
          <h2 className="mt-8 max-w-4xl text-5xl font-black uppercase leading-[0.88] md:text-7xl">
            Fill the form. Publish the page.
          </h2>
          <p className="mt-7 max-w-2xl text-xl font-bold leading-relaxed text-white">
            You bring the real details. Kislap turns them into a public page and
            handles the domain, database, code, hosting, and page structure.
          </p>
          <Button
            asChild
            className="mt-9 h-14 rounded-none border-4 border-black bg-white px-6 font-black uppercase text-black shadow-[6px_6px_0_#000] hover:bg-secondary"
          >
            <a href={buildPaths.default}>
              Start a page <ArrowRight className="h-5 w-5" />
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
