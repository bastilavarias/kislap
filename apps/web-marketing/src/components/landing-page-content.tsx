import { motion } from "framer-motion";

import {
  ArrowRight,
  Github,
  Zap,
  LineChart,
  Globe,
  Database,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
  FileText,
  Wand2,
  Send,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBuilderProjectCreateUrl, SITE_HOST_LABEL } from "@/lib/site-config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function LandingPageContent() {
  return (
    <div className="flex flex-col gap-24 pb-20 overflow-x-hidden">
      <section className="relative pt-16 pb-16 md:pt-32 md:pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto max-w-6xl text-center z-10">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
          >
            Build your portfolio, <br />
            <span className="text-primary">link page, or menu fast.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            No drag and drop chaos. No design skills needed.{" "}
            <br className="hidden md:block" />
            Pick the right builder, fill the form, and publish a polished page
            that is ready to share.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
              asChild
            >
              <a
                href={getBuilderProjectCreateUrl()}
                className="flex items-center"
              >
                Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full"
              asChild
            >
              <a
                href="https://github.com/bastilavarias/kislap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Github className="mr-2 w-5 h-5" /> Star on GitHub
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto max-w-6xl mt-16"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-indigo-500/20 blur-[120px] rounded-full -z-10 opacity-40" />

            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="w-12 h-12 rounded-full bg-background border border-zinc-200 dark:border-zinc-700 shadow-xl flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
              </div>
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 items-stretch">
              <div className="relative flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl h-[500px]">
                <div className="h-10 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-md z-10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 font-medium flex items-center gap-2">
                    <LayoutTemplate className="w-3 h-3" /> kislap-editor
                  </div>
                </div>

                <div className="p-6 flex flex-col h-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] -z-10" />

                  <div className="space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          Content
                        </h4>
                        <Badge variant="secondary" className="text-[10px] h-5">
                          Auto-Save
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-zinc-500">
                          Full Name
                        </label>
                        <div className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 flex items-center text-sm font-medium text-foreground shadow-sm">
                          Juan Delacruz
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-zinc-500">
                          Job Title
                        </label>
                        <div className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 flex items-center text-sm font-medium text-foreground shadow-sm">
                          Full-stack Web Developer
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-zinc-500">
                          Bio
                        </label>
                        <div className="h-20 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-xs text-muted-foreground shadow-sm leading-relaxed">
                          Passionate developer building modern web experiences
                          with Next.js and Cloudflare...
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Design & Style
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 opacity-60 hover:opacity-100 cursor-pointer transition-all">
                          <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2" />
                          <div className="text-[10px] font-medium text-center">
                            Minimal
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer relative">
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px]">
                            ✓
                          </div>
                          <div className="w-full h-10 bg-white border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-sm mb-2" />
                          <div className="text-[10px] font-bold text-center text-primary">
                            Neo-Brutal
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-2xl h-[500px] flex flex-col">
                <div className="h-10 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 justify-center relative shrink-0">
                  <div className="absolute left-4 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md px-3 py-1 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> juandelacruz.{SITE_HOST_LABEL}
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 overflow-hidden relative">
                  <div className="w-full h-full bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 relative flex flex-col">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 shrink-0 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-zinc-200">
                        <div
                          className="w-full h-full bg-cover"
                          style={{
                            backgroundImage:
                              "url('https://api.dicebear.com/9.x/avataaars/svg?seed=6')",
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="bg-pink-100 border-2 border-black px-3 py-1 inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-1">
                          <h2 className="text-lg font-black uppercase tracking-tighter text-black leading-none">
                            Juan Delacruz
                          </h2>
                        </div>
                        <div className="text-xs font-bold font-mono text-zinc-600 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          FULL-STACK WEB DEVELOPER
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="h-2 w-full bg-zinc-100 rounded-sm" />
                        <div className="h-2 w-[90%] bg-zinc-100 rounded-sm" />
                        <div className="h-2 w-[95%] bg-zinc-100 rounded-sm" />
                        <p className="text-xs font-mono leading-relaxed mt-4 text-zinc-600">
                          Passionate developer building modern web experiences
                          with Next.js, Go and Cloudflare. I turn caffeine into
                          code.
                        </p>
                      </div>

                      <div className="hidden sm:block w-24 space-y-3">
                        <div className="border-2 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-[8px] font-bold mb-2 uppercase border-b border-black pb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {["React", "Next", "Go"].map((s) => (
                              <span
                                key={s}
                                className="text-[7px] border border-black px-1 bg-zinc-50"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="bg-red-500 border-2 border-black p-3 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                        <span className="text-xs font-bold font-mono">
                          CONTACT_ME
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-zinc-200 bg-zinc-50 py-24 text-foreground dark:border-zinc-800 dark:bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(59,130,246,0.12)_1px,_transparent_1px)] [background-size:18px_18px] opacity-40" />
        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary"
            >
              Launch Flow
            </Badge>
            <div className="space-y-5">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-50">
                Go Public in <span className="text-primary">3 Steps</span>
              </h2>
              <p className="text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                Kislap keeps the path short: start with the right builder, add
                your content, and publish a page that is ready to share.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {[
                {
                  label: "No drag-and-drop setup spiral",
                  icon: Sparkles,
                },
                {
                  label: "No plugin hunting or theme confusion",
                  icon: ShieldCheck,
                },
                {
                  label: "No waiting around to get something live",
                  icon: Send,
                },
              ].map((point) => {
                const Icon = point.icon;

                return (
                  <div
                    key={point.label}
                    className="inline-flex items-center gap-3"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{point.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl">
            <div className="pointer-events-none absolute left-[18%] right-[18%] top-14 hidden h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 md:block" />

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Create a project",
                  description:
                    "Choose the builder that matches what you actually need to publish.",
                  icon: LayoutTemplate,
                },
                {
                  step: "02",
                  title: "Fill form",
                  description:
                    "Add your content, tune the design, and let the structure do the heavy lifting.",
                  icon: FileText,
                },
                {
                  step: "03",
                  title: "Publish",
                  description:
                    "Launch your public page and start sharing it the same day.",
                  icon: Globe,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.step}
                    className="group relative flex flex-col rounded-[2rem] border border-zinc-200 bg-background/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                  >
                    <div className="mb-8 flex items-start justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-primary/15 bg-primary/5 text-primary">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="rounded-full border border-zinc-200 bg-background px-3 py-1 text-xs font-semibold tracking-[0.22em] text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                        {item.step}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-8 h-1.5 w-16 rounded-full bg-gradient-to-r from-primary to-primary/20 transition-all duration-300 group-hover:w-24" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className=""
        >
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <motion.div variants={fadeIn} className="space-y-6 lg:pr-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Why Kislap
              </div>
              <h3 className="text-3xl font-bold leading-tight md:text-4xl">
                Publish faster without assembling a website stack first.
              </h3>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Kislap gives you the builder and the practical infrastructure
                around it, so the job stays simple: create the page, fill the
                content, and go live.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="divide-y">
              {[
                {
                  title: "Dashboard",
                  meta: "Managed for you",
                  description:
                    "Keep projects, content, and changes in one workspace instead of scattering them across tools.",
                  icon: Database,
                  footer: null,
                },
                {
                  title: "Analytics",
                  meta: "Views and clicks",
                  description:
                    "See what people open and what they actually click without adding another service first.",
                  icon: LineChart,
                  footer: (
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      {[
                        ["Views", "263"],
                        ["Clicks", "91"],
                        ["CTR", "19.6%"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {label}
                          </div>
                          <div className="mt-1.5 text-xl font-bold">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  title: "Hosting + public URL",
                  meta: "SSL ready",
                  description:
                    "Every project gets a live public URL without you solving hosting, SSL, or deployment first.",
                  icon: Globe,
                  footer: (
                    <div className="space-y-2 pt-4 text-base">
                      <div className="font-semibold text-primary underline underline-offset-4 decoration-primary/40">
                        https://juandelacruz.kislap.app
                      </div>
                      <div className="font-semibold text-primary underline underline-offset-4 decoration-primary/40">
                        https://cafemoto.kislap.app
                      </div>
                    </div>
                  ),
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="grid gap-5 py-6 md:grid-cols-[190px_1fr] md:gap-8"
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 text-base font-medium">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[15px] text-muted-foreground">
                        {item.meta}
                      </div>
                    </div>
                    <div>
                      <p className="text-[15px] leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      {item.footer}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- 5. SPECIALIZED BUILDERS --- */}
      <section className="container mx-auto px-4 max-w-6xl pb-24">
        <div className="flex items-center gap-4 mb-12 opacity-50">
          <div className="h-px bg-border flex-1" />
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Specialized Features
          </span>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="w-fit text-emerald-600 border-emerald-600/20 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400"
            >
              Purpose-built Builders
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Choose the page type that matches <br />
              <span className="text-muted-foreground">
                what you actually need to publish.
              </span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-md text-right hidden md:block">
            Each builder has its own structure, content flow, and public
            experience. Pick the one that fits the job, then go deeper.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500/80 mb-2">
                  Portfolio
                </p>
                <h3 className="text-2xl font-bold">Portfolio Builder</h3>
              </div>
            </div>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Turn your resume, work, and proof into a portfolio site that wins
              trust faster.
            </p>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Wand2 className="mt-0.5 h-4 w-4 text-blue-500" />
                Resume parsing for a faster first draft
              </li>
              <li className="flex items-start gap-3">
                <LayoutTemplate className="mt-0.5 h-4 w-4 text-blue-500" />
                Portfolio layouts with SEO and social sharing built in
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-blue-500" />
                Public page ready for applications, outreach, and inquiries
              </li>
            </ul>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Best for job seekers, freelancers, and creative professionals
              </span>
              <Button asChild variant="outline" className="rounded-full">
                <a href="/portfolio-builder">
                  Explore more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="p-3 bg-fuchsia-500/10 rounded-2xl text-fuchsia-600 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-600/80 mb-2">
                  Link in Bio
                </p>
                <h3 className="text-2xl font-bold">Linktree Builder</h3>
              </div>
            </div>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Route social traffic into one branded page that feels intentional,
              not disposable.
            </p>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <LayoutTemplate className="mt-0.5 h-4 w-4 text-fuchsia-600" />
                Mobile-first layouts for creators and personal brands
              </li>
              <li className="flex items-start gap-3">
                <LineChart className="mt-0.5 h-4 w-4 text-fuchsia-600" />
                Better routing for launches, newsletters, booking, and offers
              </li>
              <li className="flex items-start gap-3">
                <Send className="mt-0.5 h-4 w-4 text-fuchsia-600" />
                Stronger branding and cleaner social sharing than generic link
                hubs
              </li>
            </ul>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Best for creators, founders, and speakers
              </span>
              <Button asChild variant="outline" className="rounded-full">
                <a href="/linktree-builder">
                  Explore more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600/80 mb-2">
                  Digital Menu
                </p>
                <h3 className="text-2xl font-bold">Menu Builder</h3>
              </div>
            </div>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Publish a QR-ready menu page people can actually browse on mobile.
            </p>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <LayoutTemplate className="mt-0.5 h-4 w-4 text-amber-600" />
                Branded menu layouts with gallery and cover support
              </li>
              <li className="flex items-start gap-3">
                <LineChart className="mt-0.5 h-4 w-4 text-amber-600" />
                Categories, items, variants, and QR-friendly structure
              </li>
              <li className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 text-amber-600" />
                Public menu pages that can be shared, indexed, and revisited
              </li>
            </ul>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Best for cafes, restaurants, and food brands
              </span>
              <Button asChild variant="outline" className="rounded-full">
                <a href="/menu-builder">
                  Explore more <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Common Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "Is Kislap free to use?",
              a: "Yes! You can build, publish, and host your site on a Kislap public URL for free, forever.",
            },
            {
              q: "Can I export my code?",
              a: "Currently, Kislap is a hosted platform. This ensures your site is always fast, secure, and updated.",
            },
            {
              q: "Do you support SEO?",
              a: "Native SEO is our superpower. We automatically generate sitemaps, metadata, and structured data for every site you build.",
            },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-lg font-medium text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container mx-auto px-4 max-w-5xl">
        <div className="relative rounded-[2.5rem] bg-primary overflow-hidden px-6 py-16 md:px-20 md:py-24 text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 text-primary-foreground">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to claim your corner <br className="hidden md:block" /> of
              the internet?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                asChild
              >
                <a
                  href={getBuilderProjectCreateUrl()}
                  className="flex items-center"
                >
                  Get Started for Free
                </a>
              </Button>
              <div className="flex items-center gap-2 text-sm font-medium opacity-80 mt-4 sm:mt-0 sm:ml-6">
                <ShieldCheck className="w-5 h-5" /> Open Source & Free
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
