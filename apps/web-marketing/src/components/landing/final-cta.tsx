import { ArrowRight, ShieldCheck } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs, type LandingBuildPaths } from "@/components/landing/data";

type FinalCtaProps = {
  buildPaths: LandingBuildPaths;
};

export function FinalCta({ buildPaths }: FinalCtaProps) {
  return (
    <section className="bg-secondary py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="landing-reveal grid border-4 border-black bg-primary p-6 text-white shadow-[12px_12px_0_#000] md:p-8 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div className="p-2 md:p-4">
            <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-secondary">
              Your corner of the internet
            </p>
            <h2 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.88] md:text-7xl">
              Your internet has too many links. Give them a home.
            </h2>
            <p className="landing-scrub-text mt-8 max-w-2xl text-xl font-semibold leading-relaxed">
              Start with the links you already share. Add projects, promos, skills,
              experience, banners, support links, or whatever your page needs next.
            </p>
            <Button
              asChild
              variant="secondary"
              className="mt-10 h-14 rounded-none border-4 border-black bg-white px-8 font-black uppercase text-black shadow-[5px_5px_0_#000] hover:bg-secondary"
            >
              <a href={buildPaths.default}>
                Build my page <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <div className="mt-8 flex items-center gap-3 font-mono text-sm font-bold uppercase">
              <ShieldCheck className="h-5 w-5" />
              Free to publish · Open source · Hosted Kislap URL
            </div>
          </div>

          <div className="landing-pop-card mt-8 border-4 border-black bg-white p-6 text-black shadow-[10px_10px_0_#000] md:p-8 lg:mt-0 lg:translate-x-4">
            <h3 className="text-3xl font-black uppercase">Questions</h3>
            <Accordion type="single" collapsible className="mt-5">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${index}`}
                  className="border-black"
                >
                  <AccordionTrigger className="text-base font-black uppercase hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base font-semibold leading-relaxed text-zinc-700">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
