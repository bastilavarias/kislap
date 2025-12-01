'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Briefcase,
  GraduationCap,
  Sparkles,
  Zap,
  Send,
  AlertCircle,
  Code,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mode } from '@/contexts/settings-context';
import { useMemo, useState, useRef, useEffect } from 'react';
import { ThemeSwitchToggle } from '@/app/(preview)/p/resume/components/templates/components/theme-switch-toggle';
import Link from 'next/link';
import { ThemeStyles } from '@/types/theme';
import { AppointmentFormValues, AppointmentSchema } from '@/lib/schemas/appointment';
import { CreateAppointmentPayload, useAppointment } from '@/hooks/api/use-appointment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';

const neonText = (color: string) => `text-shadow-neon-${color} font-extrabold`;
const neonBorder = (color: string) => `shadow-neon-border-${color} border-2 border-[--neon-color]`;

const styleVariables = {
  '--vp-pink': '#FF3AF0',
  '--vp-cyan': '#00FFFF',
  '--neon-color': 'var(--vp-pink)',
  '--bg-dark': '#1A0436',
  '--bg-light': '#F0F0FF',
  '--grid-color': '#4a0d91',
};

const VwReveal = ({
  children,
  delay = 0,
  className = '',
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

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    transitionDelay: `${delay}ms`,
  };

  return (
    <div ref={ref} className={`${className} will-change-transform`} style={style}>
      {children}
    </div>
  );
};

const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-[15vh] left-1/2 -translate-x-1/2 w-[600px] h-[300px] md:w-[1000px] md:h-[500px] rounded-t-full bg-orange-600/30 blur-3xl shadow-lg shadow-orange-600/50 opacity-80 animate-pulse-slow" />
      <div className="absolute inset-0 perspective">
        <div
          className="absolute bottom-0 left-0 right-0 h-[80vh] bg-repeat-y"
          style={{
            backgroundImage: `
                            repeating-linear-gradient(
                                0deg, 
                                var(--grid-color) 0, 
                                transparent 1px, 
                                transparent 100px
                            ), 
                            repeating-linear-gradient(
                                90deg, 
                                var(--grid-color) 0, 
                                transparent 1px, 
                                transparent 100px
                            )
                        `,
            backgroundSize: '100px 100px',
            transform: 'perspective(500px) rotateX(80deg) scale(2.5) translateY(100px)',
            transformOrigin: 'bottom center',
            opacity: 0.25,
            animation: 'grid-scroll 60s linear infinite',
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes grid-scroll {
          from {
            background-position-y: 0;
          }
          to {
            background-position-y: 1000px;
          }
        }
        .text-shadow-neon-pink {
          text-shadow:
            0 0 5px var(--vp-pink),
            0 0 15px var(--vp-pink),
            0 0 30px #ffd5fa;
        }
        .text-shadow-neon-cyan {
          text-shadow:
            0 0 5px var(--vp-cyan),
            0 0 15px var(--vp-cyan),
            0 0 30px #d5ffff;
        }
        .shadow-neon-border-pink {
          box-shadow:
            0 0 10px var(--vp-pink),
            0 0 20px var(--vp-pink) inset;
        }
        .shadow-neon-border-cyan {
          box-shadow:
            0 0 10px var(--vp-cyan),
            0 0 20px var(--vp-cyan) inset;
        }
      `}</style>
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

export function Vaporware({ project, portfolio, themeMode, onSetThemeMode, themeStyles }: Props) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentStyles = useMemo(() => {
    return themeMode === 'dark'
      ? { ...styleVariables, '--bg-color': styleVariables['--bg-dark'] }
      : { ...styleVariables, '--bg-color': styleVariables['--bg-light'] };
  }, [themeMode]);

  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      name: '',
      contact_number: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (form: AppointmentFormValues) => {
    setError('');
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
      toast('Transmission successful. Data packet received.');
      setIsLoading(false);
      reset();
      return;
    }

    setError(message);
    toast('ERROR: Data corruption detected.');
    setIsLoading(false);
  };

  const socialLinks = [
    { type: 'github', url: portfolio.github, icon: Github },
    { type: 'linkedin', url: portfolio.linkedin, icon: Linkedin },
    { type: 'twitter', url: portfolio.twitter, icon: Twitter },
    { type: 'website', url: portfolio.website, icon: Globe },
  ].filter((link) => link.url);

  const vwCardClass = `p-6 md:p-8 rounded-lg border-2 border-vp-pink bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-neon-border-pink hover:border-vp-cyan hover:shadow-neon-border-cyan`;
  const vwAccentText = `font-bold uppercase tracking-widest text-[--vp-pink] ${neonText('pink')}`;
  const vwHeaderClass = `text-4xl md:text-5xl font-black uppercase mb-8 pb-4 border-b-4 border-vp-cyan ${neonText('cyan')} inline-block`;

  return (
    <div
      className="min-h-screen font-mono text-foreground overflow-x-hidden"
      style={{ ...currentStyles, backgroundColor: currentStyles['--bg-color'] }}
    >
      {/* 1. ANIMATED BACKGROUND */}
      <BackgroundGrid />

      {/* 2. HEADER/NAV */}
      <header className="sticky top-0 z-50 bg-[var(--bg-color)]/80 backdrop-blur-sm border-b border-vp-cyan/50 shadow-lg shadow-vp-cyan/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <VwReveal>
            <div className="text-xl font-black uppercase cursor-default tracking-widest text-[--vp-pink] transition-all duration-500 hover:text-[--vp-cyan]">
              {portfolio.name}{' '}
              <span className={`text-vp-cyan ${neonText('cyan')} text-2xl`}>_</span>
            </div>
          </VwReveal>
          <ThemeSwitchToggle isDarkMode={themeMode === 'dark'} onSetThemeMode={onSetThemeMode} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-20 pb-24">
        <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center space-y-6 pt-12 md:pt-0">
          <VwReveal>
            <div className="relative inline-block mb-4 transition-transform duration-500 hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-[--vp-pink]/50 to-[--vp-cyan]/50 blur-xl rounded-full scale-105 animate-[pulse_4s_ease-in-out_infinite]" />
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-[--vp-pink] shadow-neon-border-pink relative z-10">
                <AvatarImage src={portfolio.user?.image_url} className="object-cover" />
                <AvatarFallback className="text-4xl font-bold bg-vp-cyan/30 text-[--vp-pink]">
                  {portfolio.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </VwReveal>

          <VwReveal delay={100}>
            <h1
              className={`text-4xl md:text-7xl font-black tracking-widest leading-none uppercase ${neonText('pink')}`}
            >
              // {portfolio.job_title} //
            </h1>
          </VwReveal>

          <VwReveal delay={200}>
            <p
              className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-vp-cyan ${neonText('cyan')} opacity-70`}
            >
              {portfolio.introduction}
            </p>
          </VwReveal>

          <VwReveal delay={300}>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {socialLinks.map((link, i) => (
                <Link key={i} href={link.url!} target="_blank">
                  <Button
                    variant="outline"
                    className={`h-12 px-6 gap-2 uppercase font-bold tracking-wider 
                                border-[--vp-pink] text-[--vp-pink] bg-transparent hover:bg-[--vp-pink]/10 
                                transition-all duration-300 hover:text-[--vp-cyan] hover:shadow-neon-border-cyan`}
                  >
                    <link.icon className="w-5 h-5" />
                  </Button>
                </Link>
              ))}
              <Button
                className={`h-12 px-8 gap-2 uppercase font-bold tracking-wider bg-[--vp-pink] 
                           text-foreground shadow-neon-border-pink transition-all duration-300 
                           hover:bg-[--vp-cyan] hover:text-background hover:shadow-neon-border-cyan 
                           active:scale-95`}
              >
                <Mail className="w-4 h-4" /> Connect::
              </Button>
            </div>
          </VwReveal>
        </section>

        {/* 4. SKILLS / ARSENAL */}
        <section>
          <VwReveal>
            <h2 className={vwHeaderClass}>
              <Code className="inline-block mb-1 mr-2 w-8 h-8" /> [ARSENAL]
            </h2>
          </VwReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {portfolio.skills.map((skill, idx) => (
              <VwReveal key={skill.id} delay={idx * 50}>
                <div
                  className={`p-4 text-center rounded-lg bg-background/50 backdrop-blur-sm border border-vp-cyan 
                                    transition-all duration-300 cursor-default hover:bg-[--vp-cyan]/10 hover:shadow-neon-border-cyan`}
                >
                  <Zap className="w-6 h-6 mx-auto mb-2 text-[--vp-pink] shadow-neon-border-pink" />
                  <span
                    className={`text-sm font-bold uppercase tracking-widest ${neonText('pink')}`}
                  >
                    {skill.name}
                  </span>
                </div>
              </VwReveal>
            ))}
          </div>
        </section>

        {/* 5. EXPERIENCE & EDUCATION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          {/* Experience Col */}
          <div className="space-y-10">
            <VwReveal>
              <h2
                className={vwHeaderClass}
                style={{ '--neon-color': styleVariables['--vp-pink'] } as React.CSSProperties}
              >
                <Briefcase className="inline-block mb-1 mr-2 w-8 h-8" /> ::LOGS::
              </h2>
            </VwReveal>

            <div className="space-y-8">
              {portfolio.work_experiences.map((exp, idx) => (
                <VwReveal key={exp.id} delay={idx * 100}>
                  <div
                    className={vwCardClass}
                    style={{ '--neon-color': styleVariables['--vp-pink'] } as React.CSSProperties}
                  >
                    <div className="mb-2 flex flex-wrap items-baseline gap-3">
                      <h3 className={`text-xl font-bold uppercase ${neonText('pink')}`}>
                        {exp.role}
                      </h3>
                      <Badge className="font-mono text-xs font-normal bg-vp-cyan/20 border border-vp-cyan text-vp-cyan shadow-lg shadow-vp-cyan/20">
                        {exp.start_date} - {exp.end_date}
                      </Badge>
                    </div>

                    <div className="text-sm font-semibold uppercase tracking-widest text-[--vp-cyan] mb-3 opacity-80">
                      {exp.company} // {exp.location}
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">{exp.about}</p>
                  </div>
                </VwReveal>
              ))}
            </div>
          </div>

          {/* Education Col */}
          <div className="space-y-10">
            <VwReveal>
              <h2
                className={vwHeaderClass}
                style={{ '--neon-color': styleVariables['--vp-cyan'] } as React.CSSProperties}
              >
                <GraduationCap className="inline-block mb-1 mr-2 w-8 h-8" /> ::TRAINING::
              </h2>
            </VwReveal>

            <div className="space-y-8">
              {portfolio.education.map((edu, idx) => (
                <VwReveal key={edu.id} delay={idx * 100}>
                  <div
                    className={vwCardClass}
                    style={{ '--neon-color': styleVariables['--vp-cyan'] } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg uppercase ${neonText('cyan')}`}>
                          {edu.school}
                        </h4>
                        <p className="text-vp-pink font-medium uppercase tracking-wider">
                          {edu.degree}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 opacity-80">
                          {edu.location}
                        </p>
                      </div>
                      <div className="text-xs font-mono font-bold bg-vp-pink/20 text-vp-pink px-3 py-1 rounded border border-vp-pink shadow-lg shadow-vp-pink/20">
                        {edu.year_start} - {edu.year_end}
                      </div>
                    </div>
                  </div>
                </VwReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PROJECTS (HOLO SCREENS) */}
        <section className="space-y-12">
          <VwReveal>
            <h2
              className={vwHeaderClass}
              style={{ '--neon-color': styleVariables['--vp-pink'] } as React.CSSProperties}
            >
              <Sparkles className="inline-block mb-1 mr-2 w-8 h-8" /> // PROJECTS //
            </h2>
          </VwReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.showcases.map((project, idx) => (
              <VwReveal key={project.id} delay={idx * 100} className="h-full">
                <Link href={project.url} target="_blank" className="block h-full">
                  <div
                    className={`p-6 bg-background/50 backdrop-blur-sm rounded-xl border-2 border-vp-cyan 
                                       shadow-neon-border-cyan transition-all duration-500 group 
                                       hover:border-vp-pink hover:shadow-neon-border-pink hover:scale-[1.02]`}
                    style={{ transitionDelay: '0s' }} // Ensure immediate transition on hover
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-xl font-bold uppercase ${neonText('cyan')}`}>
                        {project.name}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-vp-pink group-hover:text-vp-cyan transition-colors group-hover:translate-x-1" />
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-vp-cyan/30 mt-auto">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech.id}
                          className="text-xs font-bold px-3 py-1 bg-vp-pink/10 rounded-sm text-vp-pink border border-vp-pink/50"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </VwReveal>
            ))}
          </div>
        </section>

        {/* 7. CONTACT / TERMINAL */}
        <section>
          <VwReveal>
            <div className="bg-black/50 rounded-xl p-6 md:p-12 border-4 border-vp-pink shadow-neon-border-pink relative">
              <h2 className={`text-2xl font-black uppercase mb-6 ${neonText('pink')}`}>
                // INITIATE CONTACT PROTOCOL //
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className={`flex items-center gap-4 text-lg font-bold ${neonText('cyan')}`}>
                    <Mail className="w-6 h-6 text-vp-pink" /> {portfolio.email}
                  </div>
                  {portfolio.phone && (
                    <div
                      className={`flex items-center gap-4 text-lg font-bold ${neonText('cyan')}`}
                    >
                      <Phone className="w-6 h-6 text-vp-pink" /> {portfolio.phone}
                    </div>
                  )}
                  <div className="pt-4 space-y-2">
                    <p className="text-vp-pink font-bold">// STATUS: READY FOR DATA TRANSMISSION</p>
                    <p className="text-vp-cyan font-bold">// AWAITING INPUT...</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="mb-4 bg-red-900/50 border-red-500 shadow-neon-border-pink"
                      style={{ '--neon-color': '#FF3AF0' } as React.CSSProperties}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="uppercase text-red-300">ERROR: {error}</AlertTitle>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={vwAccentText}>NAME</Label>
                      <Input
                        {...register('name')}
                        className="bg-black/80 border-vp-cyan text-vp-pink focus:ring-1 focus:ring-vp-pink"
                        placeholder="UNIT_01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={vwAccentText}>CONTACT_ID</Label>
                      <Input
                        {...register('contact_number')}
                        className="bg-black/80 border-vp-cyan text-vp-pink focus:ring-1 focus:ring-vp-pink"
                        placeholder="00-00-00-00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={vwAccentText}>EMAIL</Label>
                    <Input
                      {...register('email')}
                      type="email"
                      className="bg-black/80 border-vp-cyan text-vp-pink focus:ring-1 focus:ring-vp-pink"
                      placeholder="EMAIL@GRID.NET"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className={vwAccentText}>MESSAGE</Label>
                    <Textarea
                      {...register('message')}
                      className="bg-black/80 border-vp-cyan text-vp-pink focus:ring-1 focus:ring-vp-pink min-h-[100px] resize-none"
                      placeholder="SYSTEM_LOGS..."
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 font-bold">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-12 font-black text-lg uppercase bg-[--vp-pink] text-background 
                                       shadow-lg shadow-vp-pink/50 transition-all duration-300 
                                       hover:bg-[--vp-cyan] hover:text-background hover:shadow-vp-cyan/50 active:scale-95`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-background border-t-background/30 rounded-full animate-spin" />
                    ) : (
                      <>
                        SEND DATA <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </VwReveal>
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="border-t-4 border-vp-pink/50 shadow-lg shadow-vp-pink/10 py-8 text-center text-sm font-bold uppercase tracking-widest text-vp-cyan">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            PROTOCOL END. {new Date().getFullYear()} {portfolio.name}.
          </p>
        </div>
      </footer>
    </div>
  );
}
