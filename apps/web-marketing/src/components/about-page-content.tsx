import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Globe2, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function AboutPageContent() {
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
              Kislap isn't just a website builder. It's a canvas for your
              career. We believe every developer, designer, and founder deserves
              a world class portfolio without the headache of coding it from
              scratch.
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
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { label: "Sites Published", value: "100+" },
              { label: "Active Builders", value: "20+" },
              { label: "Templates", value: "8" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]"
          >
            <motion.div
              variants={itemVariants}
              className="col-span-1 md:col-span-2 overflow-hidden relative group rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/20 text-card-foreground shadow-sm"
            >
              <div className="p-8 md:p-12 h-full flex flex-col justify-between relative z-10">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Unmatched Speed</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Time is your most valuable asset. Our engine is optimized to
                    get you from "blank page" to "published" in minutes.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-orange-500/10 transition-colors duration-500" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="col-span-1 overflow-hidden relative group rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/20 text-card-foreground shadow-sm"
            >
              <div className="p-8 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Design First</h3>
                  <p className="text-muted-foreground">
                    We sweat the details—typography, spacing, and animations—so
                    you don't have to.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="col-span-1 overflow-hidden relative group rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/20 text-card-foreground shadow-sm"
            >
              <div className="p-8 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Developer Ready</h3>
                  <p className="text-muted-foreground">
                    Built by developers, for developers. Clean code exports and
                    easy integrations.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="col-span-1 md:col-span-2 overflow-hidden relative group rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/20 text-card-foreground shadow-sm"
            >
              <div className="p-8 md:p-12 h-full flex flex-col justify-between relative z-10">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Community Driven</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    We are open source and community funded. We listen to our
                    users and build what they actually need.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-green-500/10 transition-colors duration-500" />
              </div>
            </motion.div>
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
                  alt="Sebastian Curtis Lavarias"
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
              <h2 className="text-3xl md:text-4xl font-bold">Built with ❤️</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "I started Kislap because I was tired of spending weekends
                fighting with CSS just to update my portfolio. I wanted a tool
                that felt like magic—something that respected my time as a
                builder but delivered the polish of a professional designer.
                Soon, Kislap will also serve business owners who want an online
                presence and founders to kickstart their product!"
              </p>
              <div>
                <h4 className="font-bold text-xl">Sebastian Curtis Lavarias</h4>
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
                  "w-full sm:w-auto font-bold h-12 px-8"
                )}
              >
                Start Building for Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="/showcase"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto h-12 px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
