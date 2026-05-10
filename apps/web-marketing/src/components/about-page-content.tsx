import { motion } from "framer-motion";
import { getBuilderProjectCreateUrl } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Code2, Globe2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { APIResponsePublicProjectStats } from "@/types/api-response";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface AboutPageContentProps {
  stats: APIResponsePublicProjectStats;
}

export function AboutPageContent({ stats }: AboutPageContentProps) {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-white text-black">
      <section className="border-b-4 border-black px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end"
          >
            <div className="space-y-7">
              <motion.p variants={itemVariants} className="font-mono text-sm font-bold uppercase tracking-[0.28em] text-primary">
                Why Kislap exists
              </motion.p>
              <motion.h1 variants={itemVariants} className="max-w-6xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-7xl lg:text-8xl">
                A small publishing tool for pages people actually open.
              </motion.h1>
              <motion.p variants={itemVariants} className="max-w-3xl text-xl font-semibold leading-relaxed text-zinc-700">
                Kislap helps people publish a portfolio, link page, or digital menu without turning a simple public page into a full website project.
              </motion.p>
            </div>
            <motion.div variants={itemVariants} className="border-4 border-black bg-zinc-300 p-5 shadow-[12px_12px_0_#000]">
              <div className="flex h-[380px] flex-col justify-between border-2 border-black bg-zinc-200 p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em]">Replace image: 900 x 1100</p>
                <div>
                  <p className="text-3xl font-black uppercase">Founder / product photo</p>
                  <p className="mt-2 text-sm font-bold text-zinc-700">Use a real portrait or workspace image.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-secondary">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-2 border-4 border-black bg-white md:grid-cols-4"
          >
            {[
              {
                label: "Sites Published",
                value: `${stats.sites_published}+`,
              },
              {
                label: "Active Builders",
                value: `${stats.active_builders}+`,
              },
              { label: "Templates", value: `${stats.template_count}` },
              { label: "Uptime", value: stats.uptime },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="space-y-3 border-black px-4 py-6 text-center odd:border-r md:border-r md:last:border-r-0"
              >
                <h3 className="text-3xl font-black uppercase md:text-5xl">
                  {stat.value}
                </h3>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-zinc-600">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-24 md:py-32">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="font-mono text-sm font-bold uppercase tracking-[0.26em] text-primary">What we care about</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-none md:text-6xl">
              Publish fast, keep ownership, look intentional.
            </h2>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-zinc-700">
              The product is intentionally narrow: focused builders, direct public pages, and an open codebase that can be inspected.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-5"
          >
            {[
              {
                title: "No blank-canvas tax",
                description:
                  "Kislap starts from the page type you need, then helps you fill the right content instead of designing from nothing.",
                icon: Globe2,
              },
              {
                title: "Public pages with a point of view",
                description:
                  "Portfolio, link page, and menu templates are treated as real publishing surfaces, not generic profile cards.",
                icon: Users,
              },
              {
                title: "Open source by default",
                description:
                  "The product code is visible, forkable, and easier to trust because the core implementation is not hidden.",
                icon: Code2,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="grid gap-6 border-4 border-black bg-white p-7 shadow-[8px_8px_0_#000] md:grid-cols-[80px_minmax(0,1fr)] md:items-start"
                >
                  <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-secondary text-black">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase tracking-normal">
                      {item.title}
                    </h3>
                    <p className="max-w-3xl text-lg font-semibold leading-relaxed text-zinc-700">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-black px-4 py-24 text-white md:py-32">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.26em] text-secondary">Founder note</p>
            <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">Built because small pages still deserve taste.</h2>
            <p className="max-w-3xl text-xl font-semibold leading-relaxed text-zinc-300">
              "I started Kislap because I wanted a tool that respected my time, gave me a strong starting point, and still felt polished when it went live. That is the standard we are building around for portfolios, link pages, and digital menus."
            </p>
            <div>
              <h4 className="text-xl font-black uppercase">Sebastian Lavarias</h4>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">Pasimuno</p>
            </div>
          </div>
          <div className="border-4 border-white bg-zinc-700 p-5 shadow-[12px_12px_0_#facc15]">
            <div className="flex h-[360px] flex-col justify-between border-2 border-white bg-zinc-600 p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em]">Replace image: 1600 x 900</p>
              <p className="text-3xl font-black uppercase">Product timeline / workspace</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-24 md:py-32">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-4 border-black bg-primary px-6 py-20 text-center text-white shadow-[12px_12px_0_#000] md:px-16"
        >
          <div className="relative z-10 mx-auto max-w-4xl space-y-8">
            <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">
              Publish the page your audience needs next.
            </h2>
            <p className="text-lg font-semibold text-white/90">
              Start with a focused builder, add real content, and share a page that feels deliberate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getBuilderProjectCreateUrl()}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-12 w-full rounded-none border-2 border-black bg-secondary px-8 font-black uppercase text-black shadow-[6px_6px_0_#000] sm:w-auto",
                )}
              >
                Start building
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="/showcase"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full rounded-none border-2 border-white bg-transparent px-8 font-black uppercase text-white hover:bg-white hover:text-black sm:w-auto",
                )}
              >
                View Showcase
                <Globe2 className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
