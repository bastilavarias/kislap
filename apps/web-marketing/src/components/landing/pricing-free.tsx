import { ArrowRight, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LandingBuildPaths } from "@/components/landing/data";

type PricingFreeProps = {
  buildPaths: LandingBuildPaths;
};

export function PricingFree({ buildPaths }: PricingFreeProps) {
  return (
    <section className="border-b-4 border-black bg-blue-500 py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="landing-reveal">
            <div className="mb-8 inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-black uppercase text-black shadow-[6px_6px_0_#000]">
              Pricing
            </div>
            <h2 className="landing-free-word text-[clamp(5rem,18vw,16rem)] font-black uppercase leading-[0.72] tracking-normal text-white [text-shadow:8px_8px_0_#000]">
              Free
            </h2>
          </div>

          <div className="landing-pop-card border-4 border-black bg-white p-6 text-black shadow-[12px_12px_0_#000] md:p-8">
            <div className="landing-bounce mb-6 flex h-14 w-14 items-center justify-center border-4 border-black bg-secondary shadow-[5px_5px_0_#000]">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <h3 className="text-3xl font-black uppercase leading-none">
              Publish without a bill.
            </h3>
            <p className="mt-5 text-lg font-bold leading-relaxed text-black">
              Build portfolios, link pages, and digital menus with a public
              Kislap URL. No pricing table needed for the first version.
            </p>
            <Button
              asChild
              className="mt-8 h-14 rounded-none border-4 border-black bg-primary px-6 font-black uppercase text-white shadow-[6px_6px_0_#000] hover:bg-primary/90"
            >
              <a href={buildPaths.default}>
                Start free <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
