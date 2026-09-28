import { ArrowRight, Github, GripVertical, LayoutGrid, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LandingBuildPaths } from "@/components/landing/data";

const previewBlocks = [
  { label: "Featured Project", type: "Project", width: "1/2" },
  { label: "YouTube", type: "Link", width: "1/2" },
  { label: "About Me", type: "Text", width: "Full" },
  { label: "GitHub", type: "Link", width: "1/2" },
  { label: "TikTok", type: "Link", width: "1/2" },
];

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
      <div className="flex items-center justify-between border-b-4 border-black px-4 py-3">
        <WindowControls />
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
          kislap page builder
        </span>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div className="border-2 border-black bg-secondary p-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
            Profile
          </p>
          <p className="mt-2 text-xl font-black">Juan Delacruz</p>
          <p className="mt-1 text-sm font-semibold text-zinc-600">
            Developer · Creator · Builder
          </p>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em]">
              Blocks
            </p>
            <span className="border-2 border-black bg-black px-2 py-1 font-mono text-[9px] font-black uppercase text-white">
              Drag to arrange
            </span>
          </div>

          <div className="grid gap-2">
            {previewBlocks.map((block) => (
              <div
                key={block.label}
                className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 border-2 border-black bg-white px-3 py-2 shadow-[2px_2px_0_#e5e7eb]"
              >
                <GripVertical className="h-4 w-4 text-zinc-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black uppercase">{block.label}</p>
                  <p className="font-mono text-[9px] uppercase text-zinc-500">{block.type}</p>
                </div>
                <span className="border border-black bg-secondary px-2 py-1 font-mono text-[9px] font-black uppercase">
                  {block.width}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 border-2 border-dashed border-black bg-zinc-50 py-3 font-mono text-xs font-black uppercase">
            <Plus className="h-4 w-4" /> Add block
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t-2 border-black pt-4">
          <div className="border-2 border-black p-3">
            <p className="font-mono text-[9px] font-black uppercase text-zinc-500">Layout</p>
            <div className="mt-2 flex items-center gap-2 font-black">
              <LayoutGrid className="h-4 w-4" /> Bento
            </div>
          </div>
          <div className="border-2 border-black bg-[#fff1f2] p-3 shadow-[3px_3px_0_#000]">
            <p className="font-mono text-[9px] font-black uppercase text-zinc-500">Theme</p>
            <div className="mt-2 flex items-center gap-2 font-black">
              <Sparkles className="h-4 w-4 text-primary" /> Neo Brutal
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
      <div className="flex items-center justify-between border-b-4 border-black bg-zinc-100 px-4 py-3">
        <WindowControls />
        <span className="border-2 border-black bg-white px-3 py-1 font-mono text-[10px] font-black">
          juandelacruz.kislap.app
        </span>
      </div>

      <div className="bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:36px_36px] p-5">
        <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0_#000]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-black bg-secondary text-2xl font-black shadow-[4px_4px_0_#000]">
              JD
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase">Juan Delacruz</h3>
              <p className="mt-1 font-mono text-xs font-black uppercase text-zinc-500">
                Developer · Creator · Builder
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-zinc-700">
            I build software, make tech content, and share the things I am working on.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="border-4 border-black bg-primary p-4 text-white shadow-[4px_4px_0_#000]">
              <p className="font-mono text-[9px] font-black uppercase">Featured project</p>
              <p className="mt-2 text-lg font-black uppercase">Kislap</p>
            </div>
            <div className="border-4 border-black bg-secondary p-4 shadow-[4px_4px_0_#000]">
              <p className="font-mono text-[9px] font-black uppercase">Latest</p>
              <p className="mt-2 text-lg font-black uppercase">YouTube</p>
            </div>
          </div>

          <div className="mt-4 border-4 border-black p-4 shadow-[4px_4px_0_#000]">
            <p className="font-mono text-[9px] font-black uppercase text-zinc-500">About me</p>
            <p className="mt-2 text-sm font-semibold">Software, videos, experiments, and the links worth keeping.</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {["GitHub", "TikTok"].map((label) => (
              <div key={label} className="border-4 border-black bg-white px-4 py-3 font-black uppercase shadow-[4px_4px_0_#000]">
                {label}
              </div>
            ))}
          </div>
        </div>
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
        <div className="landing-hero-copy max-w-6xl">
          <div className="mb-8 inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-bold uppercase shadow-[6px_6px_0_#000]">
            One page. Your whole internet.
          </div>

          <h1 className="max-w-6xl text-[clamp(3.5rem,7.5vw,7.2rem)] font-black uppercase leading-[0.84] tracking-normal">
            One page for everything you do online.
          </h1>

          <p className="mt-8 max-w-3xl text-xl font-semibold leading-relaxed text-zinc-700 md:text-2xl">
            Add your links, work, socials, projects, promos, and whatever matters.
            Arrange the blocks, choose a theme, and publish at your own Kislap URL.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="landing-pop-card h-14 rounded-none border-4 border-black bg-primary px-7 text-base font-black uppercase text-white shadow-[7px_7px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:bg-primary/90 hover:shadow-[3px_3px_0_#000]"
            >
              <a href={buildPaths.default}>
                Build your page <ArrowRight className="h-5 w-5" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="landing-pop-card h-14 rounded-none border-4 border-black bg-white px-7 text-base font-black uppercase text-black shadow-[7px_7px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:bg-secondary hover:shadow-[3px_3px_0_#000]"
            >
              <a href="/showcase">
                Browse pages
              </a>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-14 px-4 font-black uppercase"
            >
              <a href="/source">
                <Github className="h-5 w-5" /> GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </section>
  );
}
