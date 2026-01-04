"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Send,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  Zap,
  ArrowRight,
  MousePointer2,
  Facebook,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mode } from "@/contexts/settings-context";
import { useMemo, useState, useRef, useEffect } from "react";
import { ThemeSwitchToggle } from "../theme-switch-toggle";
import Link from "next/link";
import { ThemeStyles } from "@/types/theme";
import {
  AppointmentFormValues,
  AppointmentSchema,
} from "@/lib/schemas/appointment";
import {
  CreateAppointmentPayload,
  useAppointment,
} from "@/hooks/api/use-appointment";
import { usePageActivity } from "@/hooks/api/use-page-activity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { Portfolio } from "@/types/portfolio";

// --- Types ---
interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

// --- Animation Components ---

const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1)`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.98)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25; // Sensitivity divisor
    const y = (e.clientY - top - height / 2) / 25;
    setTransform(
      `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
};

// --- Sub-Components ---

const HeroSection = ({
  portfolio,
  themeMode,
  onSetThemeMode,
  isDarkMode,
}: {
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  isDarkMode: boolean;
}) => {
  const socialLinks = useMemo(() => {
    return [
      { type: "github", url: portfolio.github, icon: Github },
      { type: "linkedin", url: portfolio.linkedin, icon: Linkedin },
      { type: "twitter", url: portfolio.twitter, icon: Twitter },
      { type: "website", url: portfolio.website, icon: Globe },
    ].filter((link) => link.url);
  }, [portfolio]);

  const glassEffect =
    "bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50";

  return (
    <>
      {/* Dynamic Header */}
      <header className={glassEffect}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground animate-[spin_10s_linear_infinite]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>{portfolio.name}</span>
          </div>
          <ThemeSwitchToggle
            isDarkMode={isDarkMode}
            onSetThemeMode={onSetThemeMode}
          />
        </div>
        {/* Progress bar line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      </header>

      {/* Hero Content */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center space-y-8 pt-12 md:pt-0">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_reverse]" />
        </div>

        <Reveal>
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110" />
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-2xl relative z-10 transition-transform hover:scale-105 duration-300">
              <AvatarImage
                src={portfolio.user?.image_url}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl font-bold bg-muted">
                {portfolio.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 z-20 bg-green-500 w-6 h-6 rounded-full border-4 border-background animate-bounce" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            {portfolio.job_title || "Creator"}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {portfolio.introduction}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((link, i) => (
              <Link key={i} href={link.url!} target="_blank">
                <Button
                  variant="outline"
                  className="rounded-full h-12 px-6 gap-2 hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-1"
                >
                  <link.icon className="w-5 h-5" />
                </Button>
              </Link>
            ))}
            <Button className="rounded-full h-12 px-8 gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <Mail className="w-4 h-4" /> Get in Touch
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
};

const ExperienceSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio.work_experiences || portfolio.work_experiences.length === 0)
    return null;

  return (
    <div className="space-y-12">
      <Reveal>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="w-12 h-1 bg-primary rounded-full" />
          Experience
        </h2>
      </Reveal>

      <div className="space-y-8 border-l-2 border-border ml-2 pl-8 md:pl-12 relative">
        {portfolio.work_experiences.map((exp, idx) => (
          <Reveal key={exp.id} delay={idx * 100}>
            <div className="relative group">
              {/* Timeline Dot with Pulse */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-4 h-4 bg-background border-2 border-primary rounded-full group-hover:bg-primary transition-colors duration-300">
                <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" />
              </div>

              <div className="mb-2 flex flex-wrap items-baseline gap-3">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  {exp.role}
                </h3>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs font-normal"
                >
                  {exp.start_date || "N/A"} — {exp.end_date || "Present"}
                </Badge>
              </div>

              <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {exp.company}
                {exp.location && (
                  <>
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span className="opacity-70">{exp.location}</span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {exp.about}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

const EducationStatsSection = ({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <div className="space-y-12">
      <Reveal delay={200}>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="w-12 h-1 bg-primary rounded-full" />
          Stats & Education
        </h2>
      </Reveal>

      {/* Skills Cloud */}
      {portfolio.skills && portfolio.skills.length > 0 && (
        <Reveal delay={300}>
          <div className="bg-muted/30 p-8 rounded-3xl border border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Technical Arsenal
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={skill.id}
                  className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-300 cursor-default select-none hover:-translate-y-1"
                  style={{ transitionDelay: `${idx * 20}ms` }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Education List */}
      <div className="space-y-6">
        {portfolio.education &&
          portfolio.education.map((edu, idx) => (
            <Reveal key={edu.id} delay={400 + idx * 100}>
              <TiltCard className="p-6 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{edu.school}</h4>
                    {edu.degree && (
                      <p className="text-primary font-medium">{edu.degree}</p>
                    )}
                    {edu.location && (
                      <p className="text-sm text-muted-foreground mt-2 opacity-80">
                        {edu.location}
                      </p>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold bg-muted px-2 py-1 rounded">
                    {edu.year_start || "N/A"} - {edu.year_end || "Present"}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
      </div>
    </div>
  );
};

const ProjectsSection = ({
  portfolio,
  projectId,
}: {
  portfolio: Portfolio;
  projectId: number;
}) => {
  const { trackPageProjectClick } = usePageActivity();
  const cardBaseStyle =
    "bg-background border border-border shadow-sm rounded-xl overflow-hidden h-full";

  if (!portfolio.showcases || portfolio.showcases.length === 0) return null;

  const handleTrackClick = (modelId: number) => {
    trackPageProjectClick(projectId, modelId);
  };

  return (
    <section className="space-y-12">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-2">
              Featured Work
            </h2>
            <p className="text-muted-foreground">
              A selection of recent deployments
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-bold text-primary">
            <MousePointer2 className="w-4 h-4 animate-bounce" /> Hover for
            details
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolio.showcases.map((project, idx) => (
          <Reveal key={project.id} delay={idx * 100} className="h-full">
            <Link
              href={project.url || "#"}
              target={project.url ? "_blank" : undefined}
              onClick={() => handleTrackClick(project.id)}
              className={`block h-full cursor-none-custom ${!project.url ? "pointer-events-none" : ""}`}
            >
              <TiltCard
                className={`${cardBaseStyle} group hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500`}
              >
                {/* Card Header with Gradient */}
                <div className="h-2 bg-gradient-to-r from-primary to-purple-500 w-full" />

                <div className="p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <div className="p-2 bg-muted rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {project.url ? (
                        <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      ) : (
                        <ArrowRight className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-border mt-auto">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech.id}
                          className="text-xs font-bold px-2 py-1 bg-muted rounded-md text-muted-foreground"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const ContactFormSection = ({
  portfolio,
  project,
}: {
  portfolio: Portfolio;
  project: Project;
}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      name: "",
      contact_number: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (form: AppointmentFormValues) => {
    if (!portfolio?.user?.id || !project?.id) {
      setError("Configuration error: Missing ID.");
      return;
    }

    setError("");
    setIsLoading(true);

    const payload: CreateAppointmentPayload = {
      user_id: portfolio.user.id,
      project_id: project.id,
      name: form.name,
      email: form.email,
      contact_number: form.contact_number,
      message: form.message,
    };

    const { success, data, message } = await create(payload);

    if (success && data) {
      toast.success("Message sent successfully!");
      setIsLoading(false);
      reset();
      return;
    }

    setError(message || "Failed to send message");
    toast.error("Failed to send message.");
    setIsLoading(false);
  };

  return (
    <section className="relative">
      <Reveal>
        <div className="bg-primary/5 rounded-[2.5rem] p-8 md:p-16 border border-primary/10 relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Let's Build <br /> Something{" "}
                <span className="text-primary">Impossible.</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Have a vision? I'm ready to help you realize it. Send me a
                signal and let's get to work.
              </p>

              <div className="space-y-4 pt-8">
                {portfolio.email && (
                  <div className="flex items-center gap-4 text-lg font-medium">
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    {portfolio.email}
                  </div>
                )}
                {portfolio.phone && (
                  <div className="flex items-center gap-4 text-lg font-medium">
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    {portfolio.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl border border-border shadow-xl">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error: {error}</AlertTitle>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Name</Label>
                    <Input
                      {...register("name")}
                      className="bg-background/50 border-input focus:ring-2 ring-primary/20 transition-all"
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive font-bold">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Contact No.</Label>
                    <Input
                      {...register("contact_number")}
                      className="bg-background/50 border-input focus:ring-2 ring-primary/20 transition-all"
                      placeholder="+1 234..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Email</Label>
                  <Input
                    {...register("email")}
                    type="email"
                    className="bg-background/50 border-input focus:ring-2 ring-primary/20 transition-all"
                    placeholder="jane@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive font-bold">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Message</Label>
                  <Textarea
                    {...register("message")}
                    className="bg-background/50 border-input focus:ring-2 ring-primary/20 transition-all min-h-[120px] resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive font-bold">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="w-full h-12 font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:translate-y-[-2px] hover:shadow-primary/40 transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const FooterSection = ({ portfolio }: { portfolio: Portfolio }) => {
  const rootURL = process.env.NEXT_PUBLIC_ROOT_URL || "https://kislap.app";
  const githubURL =
    process.env.NEXT_PUBLIC_KISLAP_GITHUB_URL ||
    "https://github.com/sebas-tech/kislap";
  const facebookURL =
    process.env.NEXT_PUBLIC_KISLAP_FACEBOOK_URL || "https://facebook.com";

  return (
    <footer className="border-t border-border bg-muted/20 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6 text-center">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            © {new Date().getFullYear()} {portfolio?.name || "My Portfolio"}.
          </p>
          <p className="text-xs text-muted-foreground">
            All rights reserved. Built with Kinetic Energy &{" "}
            <span className="text-red-500 animate-pulse">❤️</span>
          </p>
        </div>

        <div className="w-8 h-px bg-border/60" />

        <div className="flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
              <span className="text-amber-400">✨</span> Powered by Kislap
            </span>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
              Transform your forms into beautiful websites
            </p>
          </div>

          <div className="flex items-center gap-4 mt-1">
            <a
              href={githubURL}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Kislap Github"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={rootURL}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Kislap Website"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href={facebookURL}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Kislap Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Component ---

export function Kinetic({
  project,
  portfolio,
  themeMode,
  onSetThemeMode,
}: Props) {
  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <HeroSection
        portfolio={portfolio}
        themeMode={themeMode}
        onSetThemeMode={onSetThemeMode}
        isDarkMode={isDarkMode}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-24 pb-24">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
          <ExperienceSection portfolio={portfolio} />
          <EducationStatsSection portfolio={portfolio} />
        </section>

        <ProjectsSection portfolio={portfolio} projectId={project.id} />

        <ContactFormSection portfolio={portfolio} project={project} />
      </main>

      <FooterSection portfolio={portfolio} />
    </div>
  );
}
