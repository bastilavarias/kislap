import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Megaphone,
} from "lucide-react";

const personas = [
  {
    title: "Creator",
    kicker: "Route attention",
    benefit:
      "Feature your latest content, socials, affiliate links, brand partnerships, support links, and the one thing you want people to open next.",
    outcome: "One shareable creator hub",
    accent: "bg-fuchsia-500",
    shadow: "shadow-[8px_8px_0_#000]",
    icon: Megaphone,
  },
  {
    title: "Developer",
    kicker: "Show proof",
    benefit:
      "Mix GitHub, featured projects, experience, skills, writing, contact details, and social links on one page.",
    outcome: "Links plus real work",
    accent: "bg-blue-500",
    shadow: "shadow-[8px_8px_0_#ef4444]",
    icon: Code2,
  },
  {
    title: "Freelancer",
    kicker: "Make action obvious",
    benefit:
      "Show services, selected work, testimonials, booking links, contact details, and social proof without building a full website.",
    outcome: "A page that can sell your work",
    accent: "bg-amber-400",
    shadow: "shadow-[8px_8px_0_#000]",
    icon: BriefcaseBusiness,
  },
];

export function BuilderShowcase() {
  return (
    <section className="border-b-4 border-black bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <article className="landing-reveal border-4 border-black bg-black p-6 text-white shadow-[8px_8px_0_#ef4444] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-secondary">
              One product, different people
            </p>
            <ArrowUpRight className="h-6 w-6 shrink-0" />
          </div>
          <h2 className="mt-6 max-w-4xl text-4xl font-black uppercase leading-[0.9] md:text-6xl">
            The page changes with what you do.
          </h2>
          <p className="landing-scrub-text mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-zinc-300">
            Kislap does not ask you to choose between a portfolio product, a bio-link
            product, and another website builder. You start with one Page, then add
            the blocks that match your work and audience.
          </p>
        </article>

        <div className="landing-benefit-grid mt-6 grid gap-6 md:grid-cols-3">
          {personas.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={`landing-benefit-card group flex min-h-[330px] flex-col border-4 border-black bg-white p-6 text-black transition ${item.shadow}`}
              >
                <div
                  className={`landing-wiggle mb-8 flex h-16 w-16 items-center justify-center border-4 border-black ${item.accent} shadow-[4px_4px_0_#000]`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                  {item.kicker}
                </p>
                <h3 className="mt-4 text-4xl font-black uppercase leading-none">
                  {item.title}
                </h3>
                <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-700">
                  {item.benefit}
                </p>

                <div className="mt-auto pt-8">
                  <div className="border-2 border-black bg-secondary px-3 py-3 font-mono text-xs font-black uppercase shadow-[3px_3px_0_#000]">
                    {item.outcome}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
