import { motion } from "framer-motion";
import { ArrowRight, Database, Globe2, ServerCog, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getBuilderProjectCreateUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { APIResponsePublicProjectStats } from "@/types/api-response";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const platformSteps = [
  {
    title: "Answer focused forms",
    copy: "Add the proof, links, menu items, contact paths, and settings your page actually needs.",
  },
  {
    title: "Kislap shapes the page",
    copy: "Your content is stored, mapped to the right layout, and rendered with metadata and public-page structure.",
  },
  {
    title: "Publish one clear URL",
    copy: "The domain path, database, templates, hosting flow, and code details stay out of your way.",
  },
];

const platformWork = [
  {
    title: "Domain",
    copy: "A public Kislap URL is generated without DNS setup.",
    icon: Globe2,
  },
  {
    title: "Database",
    copy: "Your content stays editable instead of becoming a one-off static page.",
    icon: Database,
  },
  {
    title: "Code",
    copy: "Rendering, templates, and publishing logic happen behind the scenes.",
    icon: ServerCog,
  },
];

const useCases = [
  ["Portfolio", "Show proof, experience, services, and contact paths."],
  ["Link page", "Route attention from bios, campaigns, offers, and socials."],
  ["Digital menu", "Give customers a scan-ready menu that works on mobile."],
];

interface AboutPageContentProps {
  stats: APIResponsePublicProjectStats;
}

export function AboutPageContent({ stats }: AboutPageContentProps) {
  const currentStats = [
    { label: "Sites Published", value: `${stats.sites_published}+` },
    { label: "Active Builders", value: `${stats.active_builders}+` },
    { label: "Templates", value: `${stats.template_count}` },
    { label: "Uptime", value: stats.uptime },
  ];

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-white text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white px-4 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.045]" />
        <div className="container relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl"
          >
            <motion.p
              variants={itemVariants}
              className="inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-black uppercase text-black shadow-[6px_6px_0_#000]"
            >
              Be Visible
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="mt-7 max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-normal md:text-7xl lg:text-[6.75rem]"
            >
              Show up with a page that makes sense.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-3xl text-xl font-semibold leading-relaxed text-zinc-700"
            >
              Kislap helps makers, freelancers, creators, and small businesses
              turn scattered details into one public page people can open,
              scan, and act on.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-secondary px-4 py-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-2 border-4 border-black bg-white shadow-[10px_10px_0_#000] md:grid-cols-4"
          >
            {currentStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="space-y-3 border-black px-4 py-6 text-center odd:border-r [&:nth-child(-n+2)]:border-b md:border-b-0 md:border-r md:last:border-r-0"
              >
                <h2 className="text-3xl font-black uppercase md:text-5xl">
                  {stat.value}
                </h2>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-fuchsia-500 px-4 py-24 md:py-32">
        <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="border-4 border-black bg-primary p-7 text-white shadow-[12px_12px_0_#000] md:p-10"
          >
            <motion.p
              variants={itemVariants}
              className="inline-flex border-4 border-black bg-secondary px-4 py-2 font-mono text-sm font-black uppercase text-black shadow-[5px_5px_0_#000]"
            >
              Platform idea
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="mt-8 max-w-4xl text-5xl font-black uppercase leading-[0.88] md:text-7xl"
            >
              Fill the form. Kislap handles the stack.
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-2xl text-xl font-bold leading-relaxed text-white"
            >
              You do not need to manage domain setup, database shape, page code,
              templates, hosting, or the publishing path just to get a useful
              page online.
            </motion.p>
          </motion.div>

          <div className="grid gap-5">
            {platformWork.map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={itemVariants}
                  className="group grid gap-5 border-4 border-black bg-white p-6 text-black shadow-[8px_8px_0_#000] transition hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] md:grid-cols-[72px_minmax(0,1fr)] md:items-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-secondary shadow-[4px_4px_0_#000] transition group-hover:-rotate-3">
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
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-white px-4 py-24 md:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {platformSteps.map((step, index) => (
              <motion.article
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={itemVariants}
                className="flex min-h-[280px] flex-col border-4 border-black bg-white p-6 shadow-[8px_8px_0_#000] transition hover:-translate-y-1 hover:shadow-[12px_12px_0_#000]"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center border-4 border-black bg-secondary font-mono text-2xl font-black shadow-[4px_4px_0_#000]">
                  {index + 1}
                </div>
                <h2 className="text-3xl font-black uppercase leading-none">
                  {step.title}
                </h2>
                <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-700">
                  {step.copy}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-black px-4 py-24 text-white md:py-32">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex border-4 border-white bg-secondary px-4 py-2 font-mono text-sm font-black uppercase text-black shadow-[5px_5px_0_#fff]">
              What it is for
            </p>
            <h2 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-none md:text-7xl">
              Small pages with a real job.
            </h2>
            <p className="mt-7 max-w-2xl text-xl font-semibold leading-relaxed text-zinc-300">
              Kislap stays narrow on purpose. Each page type is designed around
              what visitors need to understand or do next.
            </p>
          </div>

          <div className="grid gap-5">
            {useCases.map(([title, copy]) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={itemVariants}
                className="border-4 border-white bg-white p-5 text-black shadow-[8px_8px_0_#ef4444] transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#facc15]"
              >
                <h3 className="text-2xl font-black uppercase leading-none">
                  {title}
                </h3>
                <p className="mt-4 text-base font-bold leading-relaxed text-zinc-700">
                  {copy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="border-4 border-black bg-primary px-6 py-20 text-center text-white shadow-[12px_12px_0_#000] md:px-16"
        >
          <motion.div variants={itemVariants} className="mx-auto max-w-4xl">
            <Sparkles className="mx-auto mb-6 h-10 w-10" />
            <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">
              Publish a page people can act on.
            </h2>
            <p className="mt-6 text-lg font-semibold text-white/90">
              Start with a focused page type, add real content, and share one
              clear URL.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={getBuilderProjectCreateUrl()}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-12 w-full rounded-none border-4 border-black bg-secondary px-8 font-black uppercase text-black shadow-[6px_6px_0_#000] sm:w-auto",
                )}
              >
                Start building
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/showcase"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full rounded-none border-4 border-white bg-transparent px-8 font-black uppercase text-white hover:bg-white hover:text-black sm:w-auto",
                )}
              >
                View Showcase
                <Globe2 className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
