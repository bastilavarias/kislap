"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Terminal,
  Cpu,
  Zap,
  Disc,
  Activity,
  Send,
  AlertCircle,
  ExternalLink,
  Wifi,
  Facebook,
  Loader2,
} from "lucide-react";
import { Mode } from "@/contexts/settings-context";
import { useMemo, useState, useEffect, useRef } from "react";
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
import { toast } from "sonner";
import { Project } from "@/types/project";
import { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

// --- Types ---
interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

// --- VISUAL EFFECTS COMPONENTS ---

const ScanlineOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden">
    <div className="absolute inset-0 z-10 animate-scanline bg-[linear-gradient(transparent_0%,rgba(var(--primary-rgb),0.1)_50%,transparent_100%)] opacity-10" />
    <div
      className="absolute inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
      style={{ backgroundSize: "100% 4px, 6px 100%" }}
    />
    <style jsx>{`
      @keyframes scanline {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100%);
        }
      }
      .animate-scanline {
        animation: scanline 8s linear infinite;
      }
    `}</style>
  </div>
);

const PerspectiveGrid = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
    <div className="absolute inset-0 perspective-lg">
      <div
        className="absolute bottom-[-20%] left-[-50%] right-[-50%] h-[80vh] bg-grid-pattern opacity-30 dark:opacity-40"
        style={{
          transform: "perspective(500px) rotateX(60deg) translateY(0)",
          transformOrigin: "bottom center",
          animation: "grid-scroll 20s linear infinite",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
    </div>
    <style jsx global>{`
      .bg-grid-pattern {
        background-image:
          linear-gradient(
            0deg,
            transparent 24%,
            hsl(var(--primary)) 25%,
            hsl(var(--primary)) 26%,
            transparent 27%,
            transparent 74%,
            hsl(var(--primary)) 75%,
            hsl(var(--primary)) 76%,
            transparent 77%,
            transparent
          ),
          linear-gradient(
            90deg,
            transparent 24%,
            hsl(var(--primary)) 25%,
            hsl(var(--primary)) 26%,
            transparent 27%,
            transparent 74%,
            hsl(var(--primary)) 75%,
            hsl(var(--primary)) 76%,
            transparent 77%,
            transparent
          );
        background-size: 50px 50px;
        box-shadow: 0 0 100px hsl(var(--primary)) inset;
      }
      @keyframes grid-scroll {
        0% {
          transform: perspective(500px) rotateX(60deg) translateY(0);
        }
        100% {
          transform: perspective(500px) rotateX(60deg) translateY(50px);
        }
      }
      .glitch-text {
        position: relative;
        color: hsl(var(--foreground));
      }
      .glitch-text::before,
      .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: hsl(var(--background));
      }
      .glitch-text::before {
        left: 2px;
        text-shadow: -1px 0 hsl(var(--primary));
        clip-path: inset(24% 0 29% 0);
        animation: glitch-anim 2.5s infinite linear alternate-reverse;
      }
      .glitch-text::after {
        left: -2px;
        text-shadow: -1px 0 hsl(var(--secondary));
        clip-path: inset(85% 0 13% 0);
        animation: glitch-anim 3s infinite linear alternate-reverse;
      }
      @keyframes glitch-anim {
        0% {
          clip-path: inset(89% 0 8% 0);
        }
        20% {
          clip-path: inset(12% 0 79% 0);
        }
        40% {
          clip-path: inset(34% 0 12% 0);
        }
        60% {
          clip-path: inset(67% 0 21% 0);
        }
        80% {
          clip-path: inset(4% 0 45% 0);
        }
        100% {
          clip-path: inset(56% 0 34% 0);
        }
      }
    `}</style>
  </div>
);

const RetroSun = () => (
  <div className="fixed top-[15vh] left-1/2 -translate-x-1/2 -z-20">
    <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-t from-primary via-secondary to-transparent opacity-60 blur-2xl" />
    <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-t from-primary to-transparent opacity-80" />
    <div className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col justify-end gap-1 md:gap-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-full bg-background"
          style={{ height: `${(i + 1) * 4}px` }}
        />
      ))}
    </div>
  </div>
);

const VwReveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform"
      )}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.95)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// --- Styles ---
const panelClass =
  "relative bg-background/95 backdrop-blur-xl border border-primary/30 p-6 md:p-8 shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] hover:border-primary/60 transition-all duration-300 rounded-xl overflow-hidden group";
const neonText =
  "font-black tracking-widest uppercase drop-shadow-[0_0_5px_hsl(var(--primary)/0.8)]";

// --- Sub-Components ---

const HeaderSection = ({
  portfolio,
  themeMode,
  onSetThemeMode,
  isDarkMode,
}: {
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  isDarkMode: boolean;
}) => (
  <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Wifi className="w-4 h-4 text-primary animate-pulse" />
        <span className="font-bold tracking-widest text-sm uppercase">
          SYS.ONLINE <span className="text-muted-foreground">//</span>{" "}
          {portfolio.name || "USER_404"}
        </span>
      </div>
      <ThemeSwitchToggle
        isDarkMode={isDarkMode}
        onSetThemeMode={onSetThemeMode}
      />
    </div>
  </header>
);

const HeroSection = ({ portfolio }: { portfolio: Portfolio }) => {
  const socialLinks = useMemo(() => {
    return [
      { type: "github", url: portfolio.github, icon: Github },
      { type: "linkedin", url: portfolio.linkedin, icon: Linkedin },
      { type: "twitter", url: portfolio.twitter, icon: Twitter },
      { type: "website", url: portfolio.website, icon: Globe },
    ].filter((link) => link.url);
  }, [portfolio]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
      <VwReveal>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 animate-spin-slow" />
          <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-background relative">
            <AvatarImage
              src={portfolio.user.image_url}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted text-4xl font-black text-primary">
              {portfolio.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </VwReveal>

      <div className="space-y-4 max-w-4xl mx-auto">
        <VwReveal delay={200}>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-tight italic transform -skew-x-3">
            <span
              className="glitch-text"
              data-text={portfolio.job_title || "CREATOR"}
            >
              {portfolio.job_title || "CREATOR"}
            </span>
          </h1>
        </VwReveal>
        <VwReveal delay={400}>
          <p className="text-lg md:text-xl text-primary font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md border-l-2 border-primary pl-4 text-left md:text-center md:border-l-0 md:pl-0">
            {portfolio.introduction}
          </p>
        </VwReveal>
      </div>

      <VwReveal delay={600}>
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((link, i) => (
            <Link key={i} href={link.url!} target="_blank">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider h-12 px-6"
              >
                <link.icon className="w-5 h-5 mr-2" /> {link.type}
              </Button>
            </Link>
          ))}
        </div>
      </VwReveal>
    </section>
  );
};

const SkillsSection = ({ portfolio }: { portfolio: Portfolio }) => {
  if (!portfolio.skills || portfolio.skills.length === 0) return null;

  return (
    <section>
      <VwReveal>
        <div className="flex items-center gap-4 mb-8">
          <Cpu className="w-8 h-8 text-primary" />
          <h2 className={`text-3xl md:text-4xl ${neonText}`}>Arsenal</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-primary to-transparent" />
        </div>
      </VwReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {portfolio.skills.map((skill, i) => (
          <VwReveal key={skill.id} delay={i * 50}>
            <div className="relative group overflow-hidden bg-background/90 border border-primary/30 p-4 text-center hover:bg-primary/10 transition-colors rounded-md shadow-sm">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-primary group-hover:h-full transition-all h-0" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-secondary group-hover:h-full transition-all h-0" />
              <span className="font-bold uppercase tracking-wider text-sm">
                {skill.name}
              </span>
            </div>
          </VwReveal>
        ))}
      </div>
    </section>
  );
};

const ExperienceEducationSection = ({
  portfolio,
}: {
  portfolio: Portfolio;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Experience Logs */}
      {portfolio.work_experiences && portfolio.work_experiences.length > 0 && (
        <section className="space-y-8">
          <VwReveal>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Activity className="w-6 h-6" />
              <h2 className={`text-2xl md:text-3xl ${neonText}`}>
                System Logs
              </h2>
            </div>
          </VwReveal>
          <div className="space-y-6">
            {portfolio.work_experiences.map((exp, i) => (
              <VwReveal key={exp.id} delay={i * 100}>
                <div className={`${panelClass} border-l-4 border-l-secondary`}>
                  <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                    <h3 className="text-xl font-bold uppercase text-foreground">
                      {exp.role}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-secondary text-muted-foreground font-mono"
                    >
                      {exp.start_date || "N/A"} :: {exp.end_date || "Present"}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground font-bold uppercase text-xs mb-4 tracking-wider">
                    {exp.company} @ {exp.location || "REMOTE"}
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed border-l-2 border-foreground/10 pl-3">
                    {exp.about}
                  </p>
                </div>
              </VwReveal>
            ))}
          </div>
        </section>
      )}

      {/* Education Data */}
      {portfolio.education && portfolio.education.length > 0 && (
        <section className="space-y-8">
          <VwReveal>
            <div className="flex items-center gap-3 mb-4">
              <Disc className="w-6 h-6 text-primary" />
              <h2 className={`text-2xl md:text-3xl ${neonText} text-primary`}>
                Core Data
              </h2>
            </div>
          </VwReveal>
          <div className="space-y-6">
            {portfolio.education.map((edu, i) => (
              <VwReveal key={edu.id} delay={i * 100}>
                <div className={`${panelClass} border-l-4 border-l-primary`}>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold uppercase text-foreground">
                      {edu.school}
                    </h3>
                    <span className="text-primary font-bold text-sm tracking-wide">
                      {edu.degree}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center border-t border-primary/20 pt-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      {edu.location || "UNKNOWN_SECTOR"}
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {edu.year_start || "N/A"} // {edu.year_end || "Present"}
                    </span>
                  </div>
                </div>
              </VwReveal>
            ))}
          </div>
        </section>
      )}
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

  if (!portfolio.showcases || portfolio.showcases.length === 0) return null;

  const handleTrackClick = (modelId: number) => {
    trackPageProjectClick(projectId, modelId);
  };

  return (
    <section>
      <VwReveal>
        <div className="flex items-center gap-4 mb-12">
          <Terminal className="w-8 h-8 text-primary" />
          <h2 className={`text-3xl md:text-4xl ${neonText}`}>Executables</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-primary to-transparent" />
        </div>
      </VwReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.showcases.map((proj, i) => (
          <VwReveal key={proj.id} delay={i * 100} className="h-full">
            <Link
              href={proj.url || "#"}
              target={proj.url ? "_blank" : undefined}
              onClick={() => handleTrackClick(proj.id)}
              className={`block h-full ${!proj.url ? "pointer-events-none" : ""}`}
            >
              <div
                className={`${panelClass} h-full flex flex-col hover:-translate-y-2`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold uppercase text-primary group-hover:text-foreground transition-colors">
                    {proj.name}
                  </h3>
                  {proj.url && (
                    <ExternalLink className="w-4 h-4 text-secondary group-hover:animate-pulse" />
                  )}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {proj.technologies.slice(0, 4).map((t) => (
                    <Badge
                      key={t.id}
                      variant="secondary"
                      className="rounded-none font-mono text-[10px] uppercase"
                    >
                      {t.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          </VwReveal>
        ))}
      </div>
    </section>
  );
};

const ContactSection = ({
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
    defaultValues: { name: "", contact_number: "", email: "", message: "" },
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
      toast.success("PACKET SENT SUCCESSFULLY");
      setIsLoading(false);
      reset();
      return;
    }

    setError(message || "TRANSMISSION ERROR");
    toast.error("TRANSMISSION ERROR");
    setIsLoading(false);
  };

  return (
    <section className="max-w-4xl mx-auto">
      <VwReveal>
        <div className="bg-background border-2 border-primary rounded-lg shadow-[0_0_30px_hsl(var(--primary)/0.2)] overflow-hidden">
          <div className="bg-primary/5 p-2 flex items-center gap-2 border-b border-primary/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs font-mono ml-2 text-muted-foreground opacity-70">
              bash --login contact-form
            </span>
          </div>

          <div className="p-6 md:p-12 bg-background/95 backdrop-blur">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3
                  className={`text-3xl font-black italic uppercase ${neonText} text-secondary`}
                >
                  Uplink
                </h3>
                <div className="space-y-4 text-sm font-bold tracking-wider text-muted-foreground">
                  {portfolio.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="hover:text-primary transition-colors cursor-default">
                        {portfolio.email}
                      </span>
                    </div>
                  )}
                  {portfolio.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span>{portfolio.phone}</span>
                    </div>
                  )}
                </div>
                <div className="font-mono text-xs text-primary/60 mt-8 p-4 border border-primary/20 rounded bg-primary/5">
                  $ status check
                  <br />
                  {`> `} port 8080 open
                  <br />
                  {`> `} encryption enabled
                  <br />
                  {`> `} waiting for input...
                  <span className="animate-pulse">_</span>
                </div>
              </div>

              <div className="space-y-4">
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-destructive/50 bg-destructive/10 rounded-none"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle className="font-mono uppercase text-xs">
                      Error: {error}
                    </AlertTitle>
                  </Alert>
                )}

                <div className="space-y-1">
                  <Label className="text-primary text-xs font-bold uppercase">
                    User_ID
                  </Label>
                  <Input
                    {...register("name")}
                    className="bg-muted/30 border-primary/30 focus:border-primary rounded-none font-mono text-sm"
                    placeholder="GUEST_USER"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-mono mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-primary text-xs font-bold uppercase">
                    Target_Mail
                  </Label>
                  <Input
                    {...register("email")}
                    className="bg-muted/30 border-primary/30 focus:border-primary rounded-none font-mono text-sm"
                    placeholder="USER@NET.COM"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-mono mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-primary text-xs font-bold uppercase">
                    Frequency
                  </Label>
                  <Input
                    {...register("contact_number")}
                    className="bg-muted/30 border-primary/30 focus:border-primary rounded-none font-mono text-sm"
                    placeholder="OPTIONAL"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-primary text-xs font-bold uppercase">
                    Data_Packet
                  </Label>
                  <Textarea
                    {...register("message")}
                    className="bg-muted/30 border-primary/30 focus:border-primary rounded-none font-mono text-sm min-h-[100px]"
                    placeholder="INPUT MESSAGE..."
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 font-mono mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-none h-12 mt-2"
                >
                  {isLoading ? (
                    <>
                      TRANSMITTING...{" "}
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    </>
                  ) : (
                    <>
                      INITIATE UPLOAD <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </VwReveal>
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
    <footer className="relative z-10 py-12 border-t border-primary/20 bg-background/80 backdrop-blur font-mono uppercase tracking-widest">
      <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="space-y-1 text-xs">
          <p className="text-primary/70 mb-2">END OF LINE</p>
          <p className="text-muted-foreground opacity-70">
            © {new Date().getFullYear()} {portfolio?.name || "USER"}. ALL
            RIGHTS RESERVED.
          </p>
        </div>

        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        <div className="flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-primary flex items-center gap-1.5">
              <span className="text-secondary animate-pulse">✨</span> POWERED
              BY KISLAP
            </span>
            <p className="text-[8px] text-muted-foreground/60">
              TRANSFORM YOUR FORMS INTO BEAUTIFUL WEBSITES
            </p>
          </div>

          <div className="flex items-center gap-4 mt-1">
            <a
              href={githubURL}
              target="_blank"
              rel="noreferrer"
              className="text-primary/60 hover:text-primary transition-colors hover:drop-shadow-[0_0_5px_rgba(var(--primary-rgb),0.8)]"
              title="Kislap Github"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={rootURL}
              target="_blank"
              rel="noreferrer"
              className="text-primary/60 hover:text-primary transition-colors hover:drop-shadow-[0_0_5px_rgba(var(--primary-rgb),0.8)]"
              title="Kislap Website"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href={facebookURL}
              target="_blank"
              rel="noreferrer"
              className="text-primary/60 hover:text-primary transition-colors hover:drop-shadow-[0_0_5px_rgba(var(--primary-rgb),0.8)]"
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

export function Vaporware({
  project,
  portfolio,
  themeMode,
  onSetThemeMode,
}: Props) {
  const isDarkMode = useMemo(() => themeMode === "dark", [themeMode]);

  if (!portfolio) return null;

  return (
    <div className="min-h-screen font-mono text-foreground bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden relative">
      <ScanlineOverlay />
      <PerspectiveGrid />
      <RetroSun />

      <HeaderSection
        portfolio={portfolio}
        themeMode={themeMode}
        onSetThemeMode={onSetThemeMode}
        isDarkMode={isDarkMode}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 space-y-24">
        <HeroSection portfolio={portfolio} />
        <SkillsSection portfolio={portfolio} />
        <ExperienceEducationSection portfolio={portfolio} />
        <ProjectsSection portfolio={portfolio} projectId={project.id} />
        <ContactSection portfolio={portfolio} project={project} />
      </main>

      <FooterSection portfolio={portfolio} />
    </div>
  );
}
