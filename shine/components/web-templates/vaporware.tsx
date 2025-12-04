'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle } from '@/components/ui/alert';
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
} from 'lucide-react';
import { Mode } from '@/contexts/settings-context';
import { useMemo, useState, useEffect, useRef } from 'react';
import { ThemeSwitchToggle } from './components/theme-switch-toggle';
import Link from 'next/link';
import { ThemeStyles } from '@/types/theme';
import { AppointmentFormValues, AppointmentSchema } from '@/lib/schemas/appointment';
import { CreateAppointmentPayload, useAppointment } from '@/hooks/api/use-appointment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';
import { cn } from '@/lib/utils';

// --- VISUAL EFFECTS COMPONENTS ---

// 1. CRT Scanline Overlay
const ScanlineOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden">
    {/* Moving Scanline */}
    <div className="absolute inset-0 z-10 animate-scanline bg-[linear-gradient(transparent_0%,rgba(var(--primary-rgb),0.1)_50%,transparent_100%)] opacity-10" />
    {/* Static Lines */}
    <div
      className="absolute inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
      style={{ backgroundSize: '100% 4px, 6px 100%' }}
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

// 2. Perspective Grid Floor
const PerspectiveGrid = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
    <div className="absolute inset-0 perspective-lg">
      <div
        className="absolute bottom-[-20%] left-[-50%] right-[-50%] h-[80vh] bg-grid-pattern opacity-30 dark:opacity-40"
        style={{
          transform: 'perspective(500px) rotateX(60deg) translateY(0)',
          transformOrigin: 'bottom center',
          animation: 'grid-scroll 20s linear infinite',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
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
      /* Glitch Text Utility */
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

// 3. The Retro Sun
const RetroSun = () => (
  <div className="fixed top-[15vh] left-1/2 -translate-x-1/2 -z-20">
    <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-t from-primary via-secondary to-transparent opacity-60 blur-2xl" />
    <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-t from-primary to-transparent opacity-80" />
    {/* Sun Cuts */}
    <div className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col justify-end gap-1 md:gap-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-full bg-background" style={{ height: `${(i + 1) * 4}px` }} />
      ))}
    </div>
  </div>
);

// 4. Reveal Animation Wrapper
const VwReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
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
      className={cn('transition-all duration-700 ease-out will-change-transform')}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

export function Vaporware({ project, portfolio, themeMode, onSetThemeMode }: Props) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

  const { create } = useAppointment();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: { name: '', contact_number: '', email: '', message: '' },
  });

  const onSubmit = async (form: AppointmentFormValues) => {
    setIsLoading(true);
    const { success, message } = await create({
      user_id: portfolio.user.id,
      project_id: project.id,
      ...form,
    });

    if (success) {
      toast.success('PACKET SENT SUCCESSFULLY');
      reset();
    } else {
      setError(message);
      toast.error('TRANSMISSION ERROR');
    }
    setIsLoading(false);
  };

  const socialLinks = [
    { type: 'github', url: portfolio.github, icon: Github },
    { type: 'linkedin', url: portfolio.linkedin, icon: Linkedin },
    { type: 'twitter', url: portfolio.twitter, icon: Twitter },
    { type: 'website', url: portfolio.website, icon: Globe },
  ].filter((link) => link.url);

  // --- UPDATED UI CLASSES ---
  // Increased opacity to /95 and used bg-background to ensure text is readable against the busy grid.
  const panelClass =
    'relative bg-background/95 backdrop-blur-xl border border-primary/30 p-6 md:p-8 shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] hover:border-primary/60 transition-all duration-300 rounded-xl overflow-hidden group';
  const neonText =
    'font-black tracking-widest uppercase drop-shadow-[0_0_5px_hsl(var(--primary)/0.8)]';

  return (
    <div className="min-h-screen font-mono text-foreground bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden relative">
      <ScanlineOverlay />
      <PerspectiveGrid />
      <RetroSun />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-bold tracking-widest text-sm uppercase">
              SYS.ONLINE <span className="text-muted-foreground">//</span> {portfolio.name}
            </span>
          </div>
          <ThemeSwitchToggle isDarkMode={isDarkMode} onSetThemeMode={onSetThemeMode} />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 space-y-24">
        {/* HERO SECTION */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
          <VwReveal>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 animate-spin-slow" />
              <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-background relative">
                <AvatarImage src={portfolio.user.image_url} className="object-cover" />
                <AvatarFallback className="bg-muted text-4xl font-black text-primary">
                  {portfolio.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </VwReveal>

          <div className="space-y-4 max-w-4xl mx-auto">
            <VwReveal delay={200}>
              <h1 className="text-4xl md:text-7xl font-black uppercase leading-tight italic transform -skew-x-3">
                <span className="glitch-text" data-text={portfolio.job_title}>
                  {portfolio.job_title}
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

        {/* SKILLS ARSENAL */}
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
                  <span className="font-bold uppercase tracking-wider text-sm">{skill.name}</span>
                </div>
              </VwReveal>
            ))}
          </div>
        </section>

        {/* EXPERIENCE & EDUCATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Experience Logs */}
          <section className="space-y-8">
            <VwReveal>
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Activity className="w-6 h-6" />
                <h2 className={`text-2xl md:text-3xl ${neonText}`}>System Logs</h2>
              </div>
            </VwReveal>
            <div className="space-y-6">
              {portfolio.work_experiences.map((exp, i) => (
                <VwReveal key={exp.id} delay={i * 100}>
                  {/* Using panelClass which now has bg-background/95 */}
                  <div className={`${panelClass} border-l-4 border-l-secondary`}>
                    <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                      <h3 className="text-xl font-bold uppercase text-foreground">{exp.role}</h3>
                      <Badge
                        variant="outline"
                        className="border-secondary text-secondary font-mono"
                      >
                        {exp.start_date} :: {exp.end_date}
                      </Badge>
                    </div>
                    <div className="text-secondary font-bold uppercase text-xs mb-4 tracking-wider">
                      {exp.company} @ {exp.location}
                    </div>
                    {/* Switched to text-foreground/90 for better contrast */}
                    <p className="text-foreground/90 text-sm leading-relaxed border-l-2 border-foreground/10 pl-3">
                      {exp.about}
                    </p>
                  </div>
                </VwReveal>
              ))}
            </div>
          </section>

          {/* Education Data */}
          <section className="space-y-8">
            <VwReveal>
              <div className="flex items-center gap-3 mb-4">
                <Disc className="w-6 h-6 text-primary" />
                <h2 className={`text-2xl md:text-3xl ${neonText} text-primary`}>Core Data</h2>
              </div>
            </VwReveal>
            <div className="space-y-6">
              {portfolio.education.map((edu, i) => (
                <VwReveal key={edu.id} delay={i * 100}>
                  <div className={`${panelClass} border-l-4 border-l-primary`}>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold uppercase text-foreground">{edu.school}</h3>
                      <span className="text-primary font-bold text-sm tracking-wide">
                        {edu.degree}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between items-center border-t border-primary/20 pt-3">
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        {edu.location}
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {edu.year_start} // {edu.year_end}
                      </span>
                    </div>
                  </div>
                </VwReveal>
              ))}
            </div>
          </section>
        </div>

        {/* PROJECTS SHOWCASE */}
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
                <Link href={proj.url || '#'} target="_blank" className="block h-full">
                  <div className={`${panelClass} h-full flex flex-col hover:-translate-y-2`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold uppercase text-primary group-hover:text-foreground transition-colors">
                        {proj.name}
                      </h3>
                      {proj.url && (
                        <ExternalLink className="w-4 h-4 text-secondary group-hover:animate-pulse" />
                      )}
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed mb-6 flex-1">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
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

        {/* CONTACT TERMINAL */}
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
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <span className="hover:text-primary transition-colors cursor-default">
                          {portfolio.email}
                        </span>
                      </div>
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
                      {`> `} waiting for input...<span className="animate-pulse">_</span>
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
                      <Label className="text-primary text-xs font-bold uppercase">User_ID</Label>
                      <Input
                        {...register('name')}
                        className="bg-muted/30 border-primary/30 focus:border-primary rounded-none font-mono text-sm"
                        placeholder="GUEST_USER"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-primary text-xs font-bold uppercase">
                        Target_Mail
                      </Label>
                      <Input
                        {...register('email')}
                        className="bg-muted/30 border-primary/30 focus:border-primary rounded-none font-mono text-sm"
                        placeholder="USER@NET.COM"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-primary text-xs font-bold uppercase">
                        Data_Packet
                      </Label>
                      <Textarea
                        {...register('message')}
                        className="bg-muted/30 border-primary/30 focus:border-primary rounded-none font-mono text-sm min-h-[100px]"
                        placeholder="INPUT MESSAGE..."
                      />
                    </div>

                    <Button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-none h-12 mt-2"
                    >
                      {isLoading ? 'TRANSMITTING...' : 'INITIATE UPLOAD'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </VwReveal>
        </section>
      </main>

      <footer className="relative z-10 text-center py-8 border-t border-primary/20 bg-background/80 backdrop-blur text-xs font-mono text-muted-foreground uppercase tracking-widest">
        <p>
          End of Line // © {new Date().getFullYear()} {portfolio.name}
        </p>
      </footer>
    </div>
  );
}
