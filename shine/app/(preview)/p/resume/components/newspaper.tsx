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
  ExternalLink,
  Send,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code,
  Newspaper as NewspaperIcon,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mode } from '@/contexts/settings-context';
import { useMemo, useState } from 'react';
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

interface Props {
  project: Project;
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

export function Newspaper({ project, portfolio, themeMode, onSetThemeMode, themeStyles }: Props) {
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
      toast('Dispatch successful. A correspondent will be in touch shortly.');
      setIsLoading(false);
      reset();
      return;
    }

    setError(message);
    toast('Front-page error: Could not submit report.');
    setIsLoading(false);
  };

  const socialLinks = [
    { type: 'github', url: portfolio.github, icon: Github },
    { type: 'linkedin', url: portfolio.linkedin, icon: Linkedin },
    { type: 'twitter', url: portfolio.twitter, icon: Twitter },
    { type: 'website', url: portfolio.website, icon: Globe },
  ].filter((link) => link.url);

  // Helper date formatter
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Newspaper specific styling classes, adapted for Theme
  // using 'border-border' ensures it matches the user's theme color (gray, slate, etc.)
  const columnDivider = 'border-l border-r border-border/60';
  const sectionTitle =
    'text-xs uppercase font-bold tracking-[0.2em] border-b border-border pb-2 mb-4 text-muted-foreground';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="border-b-4 border-foreground/10 py-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto relative">
          <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest border-b border-border pb-2 mb-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                Edition:{' '}
                {portfolio.job_title
                  ?.split(' ')
                  .map((w) => w.charAt(0))
                  .join('') || 'DEV'}
              </span>
              <span className="opacity-30">|</span>
              <span>Vol. {portfolio.work_experiences.length + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <NewspaperIcon className="w-3 h-3" />
              <span>Circulation: {portfolio.location || 'Global'}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <h1 className="text-5xl md:text-8xl font-black text-left tracking-tighter leading-none uppercase text-foreground">
              The {portfolio.user?.last_name || 'Portfolio'}
            </h1>
            <div className="text-left md:text-right text-sm text-muted-foreground">
              <p className="font-bold text-foreground">{dateString}</p>
              <p className="text-xs opacity-70">Daily Portfolio Edition</p>
            </div>
          </div>

          <div className="absolute top-0 right-0 hidden md:block">
            <ThemeSwitchToggle isDarkMode={isDarkMode} onSetThemeMode={onSetThemeMode} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-1 border-r-0 lg:border-r border-border/60 pr-0 lg:pr-6 space-y-8">
            <div className="relative border border-border p-1 bg-muted/20 shadow-sm">
              <Avatar className="w-full h-auto aspect-square rounded-sm">
                <AvatarImage src={portfolio.user?.image_url} className="object-cover" />
                <AvatarFallback className="text-4xl rounded-sm font-bold">
                  {portfolio.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground px-2 py-0.5 text-[10px] uppercase font-bold">
                IMG. {portfolio.name}
              </div>
            </div>

            <section>
              <h2 className="text-3xl font-extrabold leading-tight mb-4 uppercase text-foreground">
                {portfolio.job_title}
              </h2>
              <p className="text-sm text-justify leading-relaxed text-muted-foreground">
                {portfolio.introduction}
              </p>
            </section>

            <section className="border-t border-b border-border py-6">
              <h3 className={sectionTitle}>
                <Code className="inline w-3 h-3 mr-1" /> Technical Warrants
              </h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.slice(0, 8).map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="rounded-sm px-2 py-0.5 text-xs font-medium"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {portfolio.skills.length > 8 && (
                  <span className="text-xs text-muted-foreground pt-1">
                    +{portfolio.skills.length - 8} more
                  </span>
                )}
              </div>
            </section>

            <section>
              <h3 className={sectionTitle}>
                <Mail className="inline w-3 h-3 mr-1" /> Contact The Desk
              </h3>
              <div className="text-sm space-y-3 text-muted-foreground">
                {portfolio.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <a
                      href={`mailto:${portfolio.email}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {portfolio.email}
                    </a>
                  </div>
                )}
                {portfolio.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{portfolio.phone}</span>
                  </div>
                )}
                {portfolio.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{portfolio.location}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className={`lg:col-span-1 ${columnDivider} px-0 md:px-6 space-y-8`}>
            <section>
              <h3 className={sectionTitle}>
                <Briefcase className="inline w-3 h-3 mr-1" /> Breaking News: Career History
              </h3>
              <div className="space-y-8">
                {portfolio.work_experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="border-b border-border pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-lg leading-snug">{exp.role}</h4>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                      <span>
                        {exp.company}, {exp.location}
                      </span>
                      <span>
                        {exp.start_date.split(' ')[1]} - {exp.end_date.split(' ')[1]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                      {exp.about}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-border pt-6">
              <h3 className={sectionTitle}>
                <GraduationCap className="inline w-3 h-3 mr-1" /> Scholarly Reports
              </h3>
              <div className="space-y-4">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="pb-3 border-b border-border/40 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm">{edu.school}</h4>
                      <span className="text-xs text-muted-foreground">
                        {edu.year_start} - {edu.year_end}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 pl-0 lg:pl-6 space-y-8">
            <section>
              <h3 className={sectionTitle}>
                <CalendarDays className="inline w-3 h-3 mr-1" /> Project Dispatches
              </h3>
              <div className="space-y-6">
                {portfolio.showcases.map((project) => (
                  <Link
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    className="block group border border-border p-4 hover:border-primary transition-colors bg-card hover:bg-muted/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {project.name}
                      </h4>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className="text-[10px] uppercase font-bold text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="border-t border-border pt-6">
              <h3 className={sectionTitle}>
                <Send className="inline w-3 h-3 mr-1" /> Classifieds: Submit An Inquiry
              </h3>

              <div className="bg-muted/30 p-5 border border-border rounded-sm">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-xs font-bold">Delivery Error: {error}</AlertTitle>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        {...register('name')}
                        className="bg-background border-input rounded-sm shadow-none focus-visible:ring-1"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                        Email
                      </Label>
                      <Input
                        {...register('email')}
                        type="email"
                        className="bg-background border-input rounded-sm shadow-none focus-visible:ring-1"
                        placeholder="editor@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                      Message
                    </Label>
                    <Textarea
                      {...register('message')}
                      className="bg-background border-input rounded-sm shadow-none focus-visible:ring-1 min-h-[100px]"
                      placeholder="Your proposal or classified ad content..."
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="w-full rounded-sm h-10 text-xs font-bold uppercase tracking-widest"
                  >
                    {isLoading ? 'Sending Press...' : 'Submit to Editor'}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="border-t-4 border-foreground/10 mt-12 py-6 px-4 md:px-12 bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest text-muted-foreground font-medium">
          <p className="order-2 md:order-1 mt-4 md:mt-0">
            PUBLISHED BY {portfolio.name} PRESS — © {new Date().getFullYear()}. ALL RIGHTS
            RESERVED.
          </p>
          <div className="flex gap-4 order-1 md:order-2">
            {socialLinks.map((link, i) => (
              <Link
                key={i}
                href={link.url!}
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <link.icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
