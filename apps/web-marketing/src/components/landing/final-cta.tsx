import { ArrowRight, ShieldCheck } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { buildPaths, faqs } from "@/components/landing/data";

export function FinalCta() {
  return (
    <section className="bg-secondary px-4 py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.72fr]">
        <div className="border-4 border-black bg-primary p-8 text-white shadow-[12px_12px_0_#000] md:p-12">
          <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.88] md:text-7xl">
            Pick the page type. Publish the first version.
          </h2>
          <p className="mt-8 max-w-2xl text-xl font-semibold leading-relaxed">
            Choose the path that matches what you need to share today. Kislap
            gives it structure, a public URL, and a cleaner first impression.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Portfolio", buildPaths.portfolio],
              ["Link Page", buildPaths.linktree],
              ["Menu", buildPaths.menu],
            ].map(([label, href]) => (
              <Button
                key={label}
                asChild
                variant="secondary"
                className="h-14 rounded-none border-4 border-black bg-white font-black uppercase text-black shadow-[5px_5px_0_#000] hover:bg-secondary"
              >
                <a href={href}>
                  {label} <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 font-mono text-sm font-bold uppercase">
            <ShieldCheck className="h-5 w-5" />
            Open source and hosted public URLs
          </div>
        </div>

        <div className="border-4 border-black bg-white p-6 shadow-[12px_12px_0_#000] md:p-8">
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
    </section>
  );
}
