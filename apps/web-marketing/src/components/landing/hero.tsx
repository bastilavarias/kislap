import { ArrowRight, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildPaths } from "@/components/landing/data";
import { PlaceholderMedia } from "@/components/landing/placeholder-media";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-4 border-black bg-white px-4 py-20 md:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.045]" />
      <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-6xl">
          <div className="mb-8 inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-bold uppercase shadow-[6px_6px_0_#000]">
            Forms in. Public pages out.
          </div>
          <h1 className="max-w-6xl text-[clamp(3.25rem,8vw,7.75rem)] font-black uppercase leading-[0.86] tracking-normal">
            Build the page people see first.
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-semibold leading-relaxed text-zinc-700 md:text-2xl">
            Kislap turns structured content into portfolio pages, link pages,
            and QR-ready menus without making you design from a blank canvas.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-none border-4 border-black bg-primary px-7 text-base font-black uppercase text-white shadow-[7px_7px_0_#000] hover:bg-primary/90 hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_#000]"
            >
              <a href={buildPaths.default}>
                Start a page <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 rounded-none border-4 border-black bg-white px-7 text-base font-black uppercase text-black shadow-[7px_7px_0_#000] hover:bg-secondary hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_#000]"
            >
              <a
                href="https://github.com/bastilavarias/kislap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" /> GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <PlaceholderMedia
            title="Hero product composite"
            size="2400 x 1400"
            note="Builder screen plus three published outputs."
            className="landing-scale-media absolute right-0 top-0 h-[360px] w-full rotate-1 bg-zinc-300"
          />
          <PlaceholderMedia
            title="Mobile menu preview"
            size="1200 x 1600"
            note="Drop a real phone screenshot here."
            className="landing-stack-card absolute bottom-0 left-0 h-[250px] w-[54%] -rotate-3 bg-amber-300"
          />
          <div className="landing-stack-card absolute bottom-8 right-4 w-[48%] border-4 border-black bg-primary p-5 text-white shadow-[10px_10px_0_#000]">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em]">
              Output formats
            </p>
            <div className="mt-5 space-y-3 text-3xl font-black uppercase leading-none">
              <p>Portfolio</p>
              <p>Link page</p>
              <p>Menu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
