import { ArrowRight, Code2, GitFork, Github, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const repoUrl = "https://github.com/bastilavarias/kislap";

const proofItems = [
  {
    title: "No black box",
    copy: "You can see how Kislap works, where the product is going, and what changes are being made.",
    icon: Code2,
  },
  {
    title: "Community-shaped",
    copy: "Builders, makers, and early users can suggest improvements instead of waiting behind a closed roadmap.",
    icon: GitFork,
  },
  {
    title: "Trust through access",
    copy: "Open source makes the product easier to inspect, learn from, and believe in before you depend on it.",
    icon: ShieldCheck,
  },
];

export function OpenSourceSection() {
  return (
    <section className="border-b-4 border-black bg-red-500 px-4 py-28 text-white md:py-40">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-4 border-black bg-white p-7 text-black shadow-[12px_12px_0_#000] md:p-10">
          <Badge className="rounded-none border-4 border-black bg-secondary px-4 py-2 font-mono text-black shadow-[5px_5px_0_#000]">
            Open source
          </Badge>
          <h2 className="mt-8 max-w-4xl text-5xl font-black uppercase leading-[0.88] md:text-7xl">
            Built in public, useful in public.
          </h2>
          <p className="mt-8 max-w-2xl text-xl font-semibold leading-relaxed text-zinc-700">
            Kislap is open source because publishing tools should be easier to
            trust, easier to inspect, and easier to improve with the people who
            use them.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 rounded-none border-4 border-black bg-black px-7 font-black uppercase text-white shadow-[6px_6px_0_#ef4444] hover:bg-zinc-900"
            >
              <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                View on GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-none border-4 border-black bg-white px-7 font-black uppercase text-black shadow-[6px_6px_0_#000] hover:bg-secondary"
            >
              <a href="/about">
                Read the story <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="landing-stack-card border-4 border-black bg-black p-5 shadow-[12px_12px_0_#fff]">
          <div className="border-4 border-white bg-zinc-950 p-4 font-mono text-sm text-green-300">
            <div className="mb-4 flex gap-2">
              <span className="h-3 w-3 border-2 border-white bg-red-500" />
              <span className="h-3 w-3 border-2 border-white bg-secondary" />
              <span className="h-3 w-3 border-2 border-white bg-green-400" />
            </div>
            <p>$ git clone github.com/bastilavarias/kislap</p>
            <p className="mt-2 text-white">apps/web-builder</p>
            <p className="text-white">apps/web-marketing</p>
            <p className="text-white">apps/web-sites</p>
            <p className="text-white">apps/api-service</p>
            <p className="mt-6 text-secondary">public pages from structured content</p>
          </div>

          <div className="mt-6 grid gap-4">
            {proofItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group border-4 border-white bg-white p-4 text-black transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-black bg-secondary shadow-[4px_4px_0_#000]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase leading-none">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-700">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
