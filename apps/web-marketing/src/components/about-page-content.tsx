import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Globe2, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { APIResponsePublicProjectStats } from "@/types/api-response";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface AboutPageContentProps {
  stats: APIResponsePublicProjectStats;
}

export function AboutPageContent({ stats }: AboutPageContentProps) {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center rounded-full border border-secondary-foreground/10 px-4 py-1.5 text-sm font-semibold bg-secondary/50 text-secondary-foreground backdrop-blur-sm"
            >
              Our Mission
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
            >
              We help builders <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                tell their story.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Kislap is a focused publishing tool for people who want to launch
              a strong public page without wrestling with a full website stack.
              Whether you are building a portfolio, a link-in-bio page, or a
              digital menu, the goal stays the same: publish something polished
              fast.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/20">
        <div className="container max-w-6xl px-4 mx-auto py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-2 gap-8 text-center md:grid-cols-4"
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
                className="space-y-3 px-4 py-2 md:border-l md:border-border/50 first:md:border-l-0"
              >
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.24em]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container max-w-6xl px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why we exist.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The internet is noisy. Standing out is hard. We built Kislap to
              give you the signal amidst the noise.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="border-y border-border/50"
          >
            {[
              {
                title: "Unmatched Speed",
                description:
                  "Time is your most valuable asset. Our engine is optimized to get you from blank page to published in minutes.",
                icon: Zap,
                tone: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                title: "Design First",
                description:
                  "We sweat the details: typography, spacing, and motion, so you do not have to.",
                icon: Sparkles,
                tone: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                title: "Developer Ready",
                description:
                  "Built by developers, for developers. Clean code exports and easy integrations.",
                icon: Code2,
                tone: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                title: "Community Driven",
                description:
                  "We are open source and community funded. We listen to our users and build what they actually need.",
                icon: Users,
                tone: "text-green-500",
                bg: "bg-green-500/10",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="grid gap-6 border-t border-border/50 py-8 first:border-t-0 md:grid-cols-[96px_minmax(0,1fr)] md:items-start md:gap-8 md:py-10"
                >
                  <div className="flex justify-center md:justify-start">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl",
                        item.bg,
                        item.tone,
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="space-y-3 text-center md:text-left">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full md:w-1/3 flex justify-center md:justify-end"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ring-1 ring-white/10">
                <img
                  src="https://avatars.githubusercontent.com/u/24890911?v=4"
                  alt="Sebastian Lavarias"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-2/3 space-y-6 text-center md:text-left"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Built with heart
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "I started Kislap because I was tired of spending weekends
                fighting with CSS just to update what I wanted people to see. I
                wanted a tool that respected my time, gave me a strong starting
                point, and still felt polished when it went live. That is the
                standard we are building around for portfolios, link pages, and
                digital menus."
              </p>
              <div>
                <h4 className="font-bold text-xl">Sebastian Lavarias</h4>
                <p className="text-muted-foreground">~ Pasimuno</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 container max-w-6xl px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-primary px-6 py-24 text-center text-primary-foreground shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to claim your corner of the internet?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of other developers building their legacy with
              Kislap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://builder.kislap.app/"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "w-full sm:w-auto font-bold h-12 px-8",
                )}
              >
                Start Building for Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="/showcase"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto h-12 px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                )}
              >
                View Showcase
                <Globe2 className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
