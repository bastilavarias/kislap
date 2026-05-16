import { ArrowRight, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LandingBuildPaths } from "@/components/landing/data";

const previewBio =
  "Creative consultant helping small brands turn ideas into clear, polished public pages that are easy to share.";

function WindowControls() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
      <span className="h-3 w-3 rounded-full bg-[#28c840]" />
    </div>
  );
}

function EditorPanel() {
  return (
    <div className="landing-hero-panel border-4 border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="flex items-center justify-between border-b-4 border-black bg-white px-4 py-3">
        <WindowControls />
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
          kislap-editor
        </span>
      </div>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-black uppercase tracking-[0.2em]">
            Content
          </p>
          <span className="border-2 border-black bg-secondary px-3 py-1 font-mono text-[10px] font-black uppercase shadow-[3px_3px_0_#000]">
            Auto-save
          </span>
        </div>

        {[
          ["Full name", "Juan Delacruz"],
          ["Role", "Creative Consultant"],
          ["Bio", previewBio],
          ["Services", "Brand pages, launch links, content updates"],
        ].map(([label, value]) => (
          <label key={label} className="block">
            <span className="mb-2 block text-center font-mono text-[10px] font-bold uppercase text-zinc-500">
              {label}
            </span>
            <div className="border-2 border-black bg-white px-4 py-3 text-base font-semibold shadow-[3px_3px_0_#e5e7eb]">
              {value}
            </div>
          </label>
        ))}

        <div className="border-t-2 border-black pt-5">
          <p className="mb-3 text-center font-mono text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
            Design & Style
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-zinc-200 bg-zinc-50 p-3 text-center">
              <div className="mb-3 h-10 bg-zinc-200" />
              <p className="text-xs font-semibold text-zinc-500">Minimal</p>
            </div>
            <div className="relative border-4 border-primary bg-[#fff1f2] p-3 text-center shadow-[4px_4px_0_#000]">
              <span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-primary text-xs font-black text-white">
                ✓
              </span>
              <div className="mb-3 h-10 border-2 border-black bg-white" />
              <p className="font-mono text-xs font-black uppercase text-primary">
                Neo-Brutal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputPanel() {
  return (
    <div className="landing-hero-panel border-4 border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="flex items-center justify-between border-b-4 border-black bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-zinc-300" />
          <span className="h-3 w-3 rounded-full bg-zinc-300" />
        </div>
        <span className="border-2 border-black bg-zinc-100 px-4 py-1 font-mono text-[10px] font-black text-zinc-500">
          juandelacruz.kislap.app
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-black bg-[#fecdd3] text-3xl shadow-[4px_4px_0_#000]">
            👨
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="inline border-4 border-black bg-[#ffe4e6] px-3 py-1 text-3xl font-black uppercase leading-tight shadow-[4px_4px_0_#000]">
              Juan Delacruz
            </h3>
            <p className="mt-3 font-mono text-xs font-black uppercase text-zinc-600">
              <span className="text-green-500">●</span> Creative Consultant
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="h-3 w-4/5 bg-zinc-100" />
          <div className="h-3 w-3/5 bg-zinc-100" />
          <div className="h-3 w-2/3 bg-zinc-100" />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_150px]">
          <p className="font-mono text-sm leading-relaxed">{previewBio}</p>
          <div className="border-4 border-black p-3 shadow-[4px_4px_0_#000]">
            <p className="mb-3 text-center font-mono text-[10px] font-black uppercase">
              Services
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Brand", "Links", "Pages"].map((skill) => (
                <span
                  key={skill}
                  className="border-2 border-black px-2 py-1 text-[10px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t-4 border-black pt-6">
          <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.16em]">
            Contact_Me
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-2 border-black bg-white px-3 py-2 text-xs font-semibold text-zinc-500">
              Name
            </div>
            <div className="border-2 border-black bg-white px-3 py-2 text-xs font-semibold text-zinc-500">
              Email
            </div>
          </div>
          <div className="mt-3 border-2 border-black bg-white px-3 py-5 text-xs font-semibold text-zinc-500">
            Message
          </div>
          <div className="mt-3 w-fit border-2 border-black bg-primary px-4 py-2 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0_#000]">
            Send
          </div>
        </div>
      </div>
    </div>
  );
}

function MascotArrow() {
  return (
    <div className="absolute left-[41%] top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
      <div className="landing-bounce flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-100 bg-white text-primary shadow-[0_14px_30px_rgba(0,0,0,0.14)]">
        <ArrowRight className="h-6 w-6" strokeWidth={2} />
      </div>
    </div>
  );
}

type HeroProps = {
  buildPaths: LandingBuildPaths;
};

export function Hero({ buildPaths }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b-4 border-black bg-white py-16 md:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.045]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 md:px-6">
        <div className="landing-hero-copy max-w-5xl">
          <div className="mb-8 inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-bold uppercase shadow-[6px_6px_0_#000]">
            Forms in. Public pages out.
          </div>
          <h1 className="max-w-5xl text-[clamp(3.25rem,7vw,6.8rem)] font-black uppercase leading-[0.86] tracking-normal">
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
            className="landing-pop-card h-14 rounded-none border-4 border-black bg-primary px-7 text-base font-black uppercase text-white shadow-[7px_7px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:bg-primary/90 hover:shadow-[3px_3px_0_#000]"
            >
              <a href={buildPaths.default}>
                Start a page <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="landing-pop-card h-14 rounded-none border-4 border-black bg-white px-7 text-base font-black uppercase text-black shadow-[7px_7px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:bg-secondary hover:shadow-[3px_3px_0_#000]"
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

        <div className="relative">
          <MascotArrow />
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <EditorPanel />
            <OutputPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
