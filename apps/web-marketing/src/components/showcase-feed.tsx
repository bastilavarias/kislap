import { cn } from "@/lib/utils";
import type { APIResponseProject } from "@/types/api-response";
import { Layout, BarChart3, Zap, Globe, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LivePreviewFrame } from "./live-preview";
import { motion } from "framer-motion";

const styleConfig: Record<
  string,
  { label: string; gradient: string; icon: any; glow: string }
> = {
  portfolio: {
    label: "Portfolio",
    gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    glow: "group-hover:shadow-indigo-500/20",
    icon: Layout,
  },
  biz: {
    label: "Business",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    glow: "group-hover:shadow-emerald-500/20",
    icon: BarChart3,
  },
  waitlist: {
    label: "Waitlist",
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    glow: "group-hover:shadow-orange-500/20",
    icon: Zap,
  },
  default: {
    label: "Project",
    gradient: "from-zinc-500/20 via-slate-500/20 to-gray-500/20",
    glow: "group-hover:shadow-zinc-500/20",
    icon: Globe,
  },
};

function ShowcaseCard({ project }: { project: APIResponseProject }) {
  const [isHovered, setIsHovered] = useState(false);
  const styles = styleConfig[project.type] || styleConfig.default;

  const liveUrl = project.sub_domain
    ? `https://${project.sub_domain}.kislap.app`
    : "#";
  const displayUrl = liveUrl.replace(/^https?:\/\//, "");

  return (
    <div
      className={cn(
        "group relative flex flex-col h-[380px] rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/30",
        styles.glow,
        "hover:shadow-xl"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-muted/30 group-hover:bg-muted/40 transition-colors">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-20 transition-transform duration-700 group-hover:scale-110",
            styles.gradient
          )}
        />
        <div className="absolute top-8 left-8 right-8 bottom-0 bg-background/40 backdrop-blur-md rounded-t-xl border border-border/40 shadow-2xl transition-transform duration-500 group-hover:translate-y-1 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-md border-b border-border/40 z-20 flex items-center px-3 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            <div className="ml-2 h-4 flex-1 max-w-[140px] rounded-sm bg-muted/60 text-[9px] flex items-center px-2 text-muted-foreground truncate font-mono opacity-70">
              {displayUrl}
            </div>
          </div>
          <div className="absolute top-8 left-0 right-0 bottom-0 bg-white">
            <LivePreviewFrame url={liveUrl} isHovered={isHovered} />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6 relative z-10 bg-card">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-wider opacity-70"
          >
            {styles.label}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date(project.created_at).getFullYear()}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
          {project.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description ||
            "A digital experience crafted with precision."}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="w-full font-semibold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all"
          >
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              Visit Site{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delays each child by 0.1s
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

interface ShowcaseFeedProps {
  projects: APIResponseProject[];
}

export function ShowcaseFeed({ projects }: ShowcaseFeedProps) {
  return (
    <motion.div
      className="flex flex-col space-y-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
            Our Samples
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
          >
            Kislap <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
              Showcase
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            Explore sites builth with Kislap. Take a look for inspiration!
          </motion.p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        {!projects || projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              No projects found. Be the first to build one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ShowcaseCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
