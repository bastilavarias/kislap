'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Github,
  Zap,
  LineChart,
  Globe,
  LayoutTemplate,
  Code2,
  ShieldCheck,
  GitBranch,
  Terminal,
  Cpu,
  Database,
  FileText,
  Wand2,
  Send,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto max-w-6xl text-center z-10">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
          >
            Turn simple forms into <br />
            <span className="text-primary">stunning websites.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            No drag and drop chaos. No design skills needed. <br className="hidden md:block" />
            Just fill in the blanks, and Kislap generates a high-performance site instantly.
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
              <Link href="/dashboard">
                Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full" asChild>
              <a
                href="https://github.com/bastilavarias/kislap"
                target="_blank"
                rel="noopener noreferrer"
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
                {/* Window Header */}
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
                        <label className="text-[10px] font-medium text-zinc-500">Full Name</label>
                        <div className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 flex items-center text-sm font-medium text-foreground shadow-sm">
                          Jane Doe
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-zinc-500">Job Title</label>
                        <div className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 flex items-center text-sm font-medium text-foreground shadow-sm">
                          Full-stack Web Developer
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-zinc-500">Bio</label>
                        <div className="h-20 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-xs text-muted-foreground shadow-sm leading-relaxed">
                          Passionate developer building modern web experiences with Next.js and
                          Cloudflare...
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />

                    {/* Section 2: Layout Picker */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Design & Style
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 opacity-60 hover:opacity-100 cursor-pointer transition-all">
                          <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2" />
                          <div className="text-[10px] font-medium text-center">Minimal</div>
                        </div>
                        {/* Selected State (Neo-Brutal) */}
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

              {/* --- RIGHT SIDE: The Live Preview (Neo-Brutal Theme) --- */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-2xl h-[500px] flex flex-col">
                {/* Fake Browser Toolbar */}
                <div className="h-10 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 justify-center relative shrink-0">
                  <div className="absolute left-4 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md px-3 py-1 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> janedoe.kislap.app
                  </div>
                </div>

                {/* Website Canvas */}
                <div className="flex-1 p-6 md:p-8 overflow-hidden relative">
                  {/* The Neo-Brutal Container */}
                  <div className="w-full h-full bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 relative flex flex-col">
                    {/* Header Section */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 shrink-0 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-zinc-200">
                        <div className="w-full h-full bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Sebastian')] bg-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="bg-pink-100 border-2 border-black px-3 py-1 inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-1">
                          <h2 className="text-lg font-black uppercase tracking-tighter text-black leading-none">
                            Jane Doe
                          </h2>
                        </div>
                        <div className="text-xs font-bold font-mono text-zinc-600 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          FULL-STACK DEV
                        </div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 flex gap-4">
                      {/* Main Text */}
                      <div className="flex-1 space-y-3">
                        <div className="h-2 w-full bg-zinc-100 rounded-sm" />
                        <div className="h-2 w-[90%] bg-zinc-100 rounded-sm" />
                        <div className="h-2 w-[95%] bg-zinc-100 rounded-sm" />
                        <p className="text-xs font-mono leading-relaxed mt-4 text-zinc-600">
                          Passionate developer building modern web experiences with Next.js and
                          Cloudflare. I turn caffeine into code.
                        </p>
                      </div>

                      {/* Sidebar (Skills) */}
                      <div className="hidden sm:block w-24 space-y-3">
                        <div className="border-2 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-[8px] font-bold mb-2 uppercase border-b border-black pb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {['React', 'Next', 'Go'].map((s) => (
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

                    {/* Footer / Contact */}
                    <div className="mt-auto pt-4">
                      <div className="bg-red-500 border-2 border-black p-3 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                        <span className="text-xs font-bold font-mono">CONTACT_ME</span>
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

      {/* --- 3. TECH STACK (Instead of Logos) --- */}
      <section className="border-y bg-muted/30 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
            Built with the modern stack you love
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            {[
              { name: 'Next.js', icon: Globe },
              { name: 'Go', icon: Cpu },
              { name: 'MySQL', icon: Database },
              { name: 'Cloudflare', icon: Zap },
              { name: 'Tailwind CSS', icon: LayoutTemplate },
              { name: 'TypeScript', icon: Code2 },
            ].map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2 font-mono text-sm md:text-base font-medium select-none hover:text-foreground hover:opacity-100 transition-colors"
              >
                <tech.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION: Bento Grid --- */}
      <section className="container mx-auto px-4 max-w-6xl py-20">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Everything you need. <br /> Nothing you don't.
          </h2>
          <p className="text-xl text-muted-foreground">
            We stripped away the complex menus and confusing plugins. What's left is pure
            performance.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Speed */}
          <motion.div
            variants={fadeIn}
            className="md:col-span-2 relative group overflow-hidden rounded-3xl border bg-gradient-to-br from-background to-muted/20 p-8 hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-6 right-6 p-3 bg-primary/10 rounded-2xl text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground mb-8 max-w-md">
              Google loves fast sites. Kislap sites are optimized for Core Web Vitals out of the
              box. No plugins needed.
            </p>
            {/* Visual Rep of Speed */}
            <div className="w-full bg-background border rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Performance</span>
                  <span className="text-green-600">100/100</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-full bg-green-500 rounded-full" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>SEO</span>
                  <span className="text-green-600">100/100</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-full bg-green-500 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="relative group overflow-hidden rounded-3xl border bg-background p-8 hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-6 right-6 p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Analytics</h3>
            <p className="text-muted-foreground mb-6 mt-5">
              Privacy-friendly view counts and click tracking built-in.
            </p>
            <div className="mt-auto h-24 w-full bg-muted/50 rounded-lg border border-dashed flex items-center justify-center text-xs text-muted-foreground font-mono">
              [Live Graph Mockup]
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="relative group overflow-hidden rounded-3xl border bg-background p-8 hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-6 right-6 p-3 bg-purple-500/10 rounded-2xl text-purple-500">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Free Domains</h3>
            <p className="text-muted-foreground mt-5">
              You will have a <strong>FREE</strong> <code>kislap.app</code> domain instantly. We
              handle the SSL certificates automatically.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="md:col-span-2 relative group overflow-hidden rounded-3xl border bg-gradient-to-tr from-background to-muted/20 p-8 hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-6 right-6 p-3 bg-orange-500/10 rounded-2xl text-orange-500">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Designed to Convert</h3>
            <p className="text-muted-foreground mb-8 max-w-lg">
              Don't stress about design theory. Our templates are crafted by top designers to look
              good on mobile, tablet, and desktop.
            </p>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-40 h-32 bg-muted rounded-lg border shadow-sm shrink-0" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

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
              For Job Seekers & Freelancers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Building a Portfolio? <br />
              <span className="text-muted-foreground">We made it unfair for the competition.</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-md text-right hidden md:block">
            Specific tools designed to help you land your next role or client faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature A: Resume Parser */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Resume to Website</h3>
            </div>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Hate filling out forms? Just drag & drop your existing resume (PDF). Our AI extracts
              your bio, experience, and skills to build your site instantly.
            </p>

            {/* Visual: PDF Upload Simulation */}
            <div className="relative h-48 bg-muted/20 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-3 overflow-hidden group-hover:border-blue-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <FileText className="w-12 h-12 text-muted-foreground/40" />
              </motion.div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground/60 font-medium">
                <Wand2 className="w-3 h-3 text-blue-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  Parsing with AI...
                </span>
              </div>
              {/* Floating Extracted Data Pills */}
              <div className="absolute bottom-4 flex gap-2 opacity-80 z-20">
                <Badge variant="secondary" className="bg-white dark:bg-zinc-800 shadow-sm">
                  Experience
                </Badge>
                <Badge variant="secondary" className="bg-white dark:bg-zinc-800 shadow-sm">
                  Skills
                </Badge>
              </div>
            </div>
          </div>

          {/* Feature B: Appointments */}
          {/* Feature B: Contact Form */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-background p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Direct Messaging</h3>
            </div>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Let visitors reach you instantly. A built-in, spam-protected contact form that
              delivers messages straight to your dashboard. No backend required.
            </p>

            {/* Visual: Neo-Brutal Form Simulation */}
            <div className="relative h-48 bg-muted/20 rounded-xl border border-muted/20 p-5 flex items-center justify-center overflow-hidden">
              {/* The Form Card */}
              <div className="w-full max-w-[280px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 relative scale-90 group-hover:scale-95 transition-transform duration-300">
                {/* Floating Header Label */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-3 py-0.5 font-black text-[10px] tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  SEND_MESSAGE
                </div>

                <div className="grid grid-cols-5 gap-2 mt-2">
                  {/* Left Inputs */}
                  <div className="col-span-3 space-y-2">
                    <div className="h-6 w-full border border-black bg-white px-2 flex items-center text-[8px] font-mono text-zinc-400">
                      YOUR NAME
                    </div>
                    <div className="h-6 w-full border border-black bg-white px-2 flex items-center text-[8px] font-mono text-zinc-400">
                      YOUR@EMAIL.COM
                    </div>
                    <div className="h-6 w-full border border-black bg-white px-2 flex items-center text-[8px] font-mono text-zinc-400">
                      +63 900 000 000
                    </div>
                  </div>

                  {/* Right Textarea */}
                  <div className="col-span-2">
                    <div className="h-full w-full border border-black bg-white p-2 text-[8px] font-mono text-zinc-400 leading-tight">
                      TYPE YOUR MESSAGE HERE...
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-3 w-full bg-black text-white border border-black py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold hover:bg-zinc-800 cursor-pointer">
                  TRANSMIT <Send className="w-2 h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. NEW SECTION: FOR DEVELOPERS (Open Source) --- */}
      <section className="py-24 relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-foreground">
        {/* Abstract Grid BG (Adaptive Opacity) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 dark:opacity-20" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                <Terminal className="w-3 h-3 mr-2" /> For Developers
              </Badge>

              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Open Source & <br />
                Community Driven.
              </h2>

              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                Kislap isn't just a tool; it's a platform built by developers, for developers.
                Inspect the code, self-host it, or contribute a new feature.
              </p>

              <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                <Button
                  variant="outline"
                  className="h-12 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 bg-transparent"
                  asChild
                >
                  <a
                    href="https://github.com/bastilavarias/kislap"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="mr-2 w-4 h-4" /> View Source
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  className="h-12 text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                  asChild
                >
                  <a
                    href="https://github.com/bastilavarias/kislap/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitBranch className="mr-2 w-4 h-4" /> Contribute
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <div className="rounded-xl bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-2xl dark:shadow-none overflow-hidden font-mono text-sm relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-50 transition duration-1000" />

                <div className="relative">
                  <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-950/50 gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <div className="ml-auto text-xs text-zinc-500">stack.ts</div>
                  </div>

                  <div className="p-6 text-blue-200/90 space-y-2 leading-relaxed selection:bg-white/20">
                    <div className="flex">
                      <span className="text-purple-400 mr-2">export</span>{' '}
                      <span className="text-yellow-300 mr-1">const </span> architecture = {'{'}
                    </div>

                    <div className="pl-4">
                      <span className="text-zinc-100">backend:</span>{' '}
                      <span className="text-green-400">'Go'</span>,
                    </div>

                    <div className="pl-4">
                      <span className="text-zinc-100">frontend:</span>{' '}
                      <span className="text-green-400">'Next.js'</span>,
                    </div>

                    <div className="pl-4">
                      <span className="text-zinc-100">cloud:</span>{' '}
                      <span className="text-green-400">'Cloudflare'</span>,
                    </div>

                    <div className="pl-4">
                      <span className="text-zinc-100">ai_engine:</span>{' '}
                      <span className="text-green-400">'Gemini'</span>,
                    </div>

                    <div className="pl-4">
                      <span className="text-zinc-100">os:</span>{' '}
                      <span className="text-green-400">'Linux'</span>,
                    </div>

                    <div>{'}'};</div>
                    <div className="pt-4 text-zinc-500 italic">// Built for performance.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: 'Is Kislap free to use?',
              a: 'Yes! You can build, publish, and host your site on our kislap.app subdomain for free, forever.',
            },
            {
              q: 'Can I export my code?',
              a: 'Currently, Kislap is a hosted platform. This ensures your site is always fast, secure, and updated.',
            },
            {
              q: 'Do you support SEO?',
              a: 'Native SEO is our superpower. We automatically generate sitemaps, metadata, and structured data for every site you build.',
            },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-lg font-medium text-left">{faq.q}</AccordionTrigger>
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
              Ready to claim your corner <br className="hidden md:block" /> of the internet?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/login">Get Started for Free</Link>
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
