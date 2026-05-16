import {
  ArrowUpRight,
  BriefcaseBusiness,
  Link2,
  QrCode,
} from "lucide-react";

const pageBenefits = [
  {
    title: "Portfolio",
    kicker: "Win trust faster",
    benefit:
      "Turn scattered proof into one credible page for jobs, clients, and referrals.",
    outcome: "Proof people can scan",
    accent: "bg-blue-500",
    shadow: "shadow-[8px_8px_0_#000]",
    icon: BriefcaseBusiness,
  },
  {
    title: "Link Page",
    kicker: "Route attention clearly",
    benefit:
      "Give every bio, post, and campaign a branded page that makes the next click obvious.",
    outcome: "One obvious next click",
    accent: "bg-fuchsia-500",
    shadow: "shadow-[8px_8px_0_#ef4444]",
    icon: Link2,
  },
  {
    title: "Digital Menu",
    kicker: "Make ordering easier",
    benefit:
      "Replace hard-to-read PDFs with a mobile menu customers can scan, browse, and revisit.",
    outcome: "Faster browsing on mobile",
    accent: "bg-amber-400",
    shadow: "shadow-[8px_8px_0_#000]",
    icon: QrCode,
  },
];

function BenefitsBoard() {
  return (
    <div className="grid gap-6">
      <article className="landing-reveal border-4 border-black bg-black p-6 text-white shadow-[8px_8px_0_#ef4444] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-secondary">
            Publishing benefits
          </p>
          <ArrowUpRight className="h-6 w-6 shrink-0" />
        </div>
        <h3 className="mt-6 max-w-2xl text-4xl font-black uppercase leading-[0.9] md:text-6xl">
          The right page does one job clearly.
        </h3>
        <p className="landing-scrub-text mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-zinc-300">
          Kislap keeps each page type focused, so visitors do not have to guess
          what to read, click, scan, or share next.
        </p>
      </article>

      <div className="landing-benefit-grid grid gap-6 md:grid-cols-3">
        {pageBenefits.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className={`landing-benefit-card group flex min-h-[300px] flex-col border-4 border-black bg-white p-6 text-black transition ${item.shadow}`}
            >
              <div
                className={`landing-wiggle mb-8 flex h-16 w-16 items-center justify-center border-4 border-black ${item.accent} shadow-[4px_4px_0_#000]`}
              >
                <Icon className="h-7 w-7 text-white" />
              </div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                {item.kicker}
              </p>
              <h4 className="mt-4 text-4xl font-black uppercase leading-none">
                {item.title}
              </h4>
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
  );
}

export function BuilderShowcase() {
  return (
    <section className="border-b-4 border-black bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <BenefitsBoard />
      </div>
    </section>
  );
}
