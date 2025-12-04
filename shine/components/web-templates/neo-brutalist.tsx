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
  ArrowUpRight,
  Terminal,
  Code,
  Briefcase,
  GraduationCap,
  Send,
  AlertCircleIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mode } from '@/contexts/settings-context';
import { useMemo, useState } from 'react';
import { ThemeSwitchToggle } from './components/theme-switch-toggle';
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

export function NeoBrutalist({
  project,
  portfolio,
  themeMode,
  onSetThemeMode,
  themeStyles,
}: Props) {
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
      toast('Message sent successfully!');
      setIsLoading(false);
      reset();
      return;
    }

    setError(message);
    toast('Something went wrong!');
    setIsLoading(false);
  };

  const socialLinks = [
    { type: 'github', url: portfolio.github, icon: Github },
    { type: 'linkedin', url: portfolio.linkedin, icon: Linkedin },
    { type: 'twitter', url: portfolio.twitter, icon: Twitter },
    { type: 'website', url: portfolio.website, icon: Globe },
  ].filter((link) => link.url);

  const brutalCardClass =
    'border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] rounded-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-200';

  const brutalButtonClass =
    'border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]';

  const brutalInputClass =
    'border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all';

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row gap-8 items-start justify-between border-b-4 border-foreground pb-8">
          <div className="flex gap-6 items-center">
            {portfolio.user?.image_url && (
              <div className="relative">
                <div className="absolute inset-0 bg-foreground translate-x-2 translate-y-2" />
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-foreground relative z-10 rounded-none">
                  <AvatarImage src={portfolio.user?.image_url} alt={portfolio.user?.first_name} />
                  <AvatarFallback className="text-4xl font-bold rounded-none bg-primary text-primary-foreground">
                    {portfolio.name?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-primary/20 inline-block px-2">
                {portfolio.name}
              </h1>
              <div className="flex flex-col md:flex-row gap-2 md:items-center text-lg font-bold">
                <span className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" /> {portfolio.job_title}
                </span>
                {portfolio.location && (
                  <>
                    <span className="hidden md:inline text-foreground/50">|</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" /> {portfolio.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <ThemeSwitchToggle isDarkMode={isDarkMode} onSetThemeMode={onSetThemeMode} />
            <div className="flex gap-2">
              {socialLinks.map((link, i) => (
                <Link key={i} href={link.url!} target="_blank">
                  <Button size="icon" variant="outline" className={brutalButtonClass}>
                    <link.icon className="w-5 h-5" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* INTRODUCTION & SKILLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-8">
            <section className="bg-muted p-6 border-4 border-foreground relative">
              <div className="absolute top-0 right-0 bg-foreground text-background px-2 py-1 text-xs font-bold uppercase translate-y-[-50%] translate-x-[50%] rotate-3">
                About_Me.txt
              </div>
              <p className="text-lg leading-relaxed font-medium">{portfolio.introduction}</p>
              <p className="mt-4 text-muted-foreground">{portfolio.about}</p>
            </section>

            <section>
              <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                <Briefcase className="w-8 h-8" /> Work_History
              </h2>
              <div className="space-y-6">
                {portfolio.work_experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className={`p-6 border-4 border-foreground bg-card ${idx % 2 === 0 ? 'translate-x-2' : '-translate-x-2 hover:translate-x-0'} transition-transform`}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-start mb-4 gap-2">
                      <div>
                        <h3 className="text-xl font-bold bg-primary/30 inline px-1">{exp.role}</h3>
                        <div className="font-bold text-lg mt-1">{exp.company}</div>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-none border-2 border-foreground px-3 py-1 text-xs md:text-sm self-start"
                      >
                        {exp.start_date} {'->'} {exp.end_date}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground border-l-4 border-primary/50 pl-4">
                      {exp.about}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                <GraduationCap className="w-8 h-8" /> Education
              </h2>
              <div className="grid gap-4">
                {portfolio.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="border-2 border-foreground p-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-lg">{edu.school}</div>
                        <div className="text-sm opacity-80">{edu.degree}</div>
                      </div>
                      <div className="text-sm font-bold">
                        {edu.year_start}-{edu.year_end}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="md:col-span-4 space-y-8">
            {/* SKILLS BOX */}
            <div className={brutalCardClass + ' bg-card p-6'}>
              <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-foreground pb-2 flex items-center gap-2">
                <Code className="w-6 h-6" /> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="border-2 border-foreground px-3 py-1 font-bold text-sm bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* CONTACT BOX */}
            <div className="border-4 border-foreground p-6 bg-primary text-primary-foreground relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-background border-4 border-foreground rotate-45" />
              <h2 className="text-xl font-black uppercase mb-4">Contact_Info</h2>
              <div className="space-y-3 font-bold text-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{portfolio.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{portfolio.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>{portfolio.website}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS SECTION */}
        <section className="pt-8 border-t-4 border-foreground">
          <h2 className="text-4xl font-black uppercase mb-8 text-center md:text-left">
            Selected_Projects{' '}
            <span className="text-primary text-sm align-middle font-normal normal-case tracking-normal">
              (Click to view)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.showcases.map((project) => (
              <Link
                key={project.id}
                href={project.url}
                target="_blank"
                className="group block h-full"
              >
                <Card className={brutalCardClass + ' h-full flex flex-col'}>
                  <CardHeader className="border-b-4 border-foreground bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <CardTitle className="flex justify-between items-center text-xl font-black uppercase">
                      {project.name}
                      <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col gap-4">
                    <p className="font-medium flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-dashed border-foreground/30">
                      {project.technologies.map((t) => (
                        <span
                          key={t.id}
                          className="text-xs font-bold border border-foreground px-2 py-0.5"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className="py-12">
          <div className="border-4 border-foreground p-4 md:p-8 bg-background relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border-4 border-foreground px-6 py-2">
              <h2 className="text-2xl font-black uppercase">Send_Message</h2>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="mb-6 rounded-none border-2 border-foreground bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100"
              >
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle className="font-bold">{error}</AlertTitle>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="uppercase font-bold">Name *</Label>
                  <Input
                    {...register('name')}
                    placeholder="YOUR NAME"
                    className={brutalInputClass}
                  />
                  {errors.name && (
                    <p className="text-red-500 font-bold text-xs">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-bold">Email *</Label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="YOUR@EMAIL.COM"
                    className={brutalInputClass}
                  />
                  {errors.email && (
                    <p className="text-red-500 font-bold text-xs">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-bold">Contact No.</Label>
                  <Input
                    {...register('contact_number')}
                    placeholder="+63 000 000 0000"
                    className={brutalInputClass}
                  />
                  {errors.contact_number && (
                    <p className="text-red-500 font-bold text-xs">
                      {errors.contact_number.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4 flex flex-col">
                <div className="space-y-2 flex-1 flex flex-col">
                  <Label className="uppercase font-bold">Message</Label>
                  <Textarea
                    {...register('message')}
                    placeholder="TYPE YOUR MESSAGE HERE..."
                    className={brutalInputClass + ' flex-1 min-h-[150px] resize-none'}
                  />
                  {errors.message && (
                    <p className="text-red-500 font-bold text-xs">{errors.message.message}</p>
                  )}
                </div>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className={
                    brutalButtonClass +
                    ' w-full h-12 text-lg font-black uppercase bg-foreground text-background hover:bg-primary hover:text-primary-foreground'
                  }
                >
                  {isLoading ? 'Sending...' : 'Transmit'} <Send className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-sm font-bold uppercase tracking-widest pb-8 opacity-50">
          <p>
            © {new Date().getFullYear()}{' '}
            <a href="http://kislap.test" className="font-medium text-foreground">
              Kislap
            </a>{' '}
            — Transform your forms into beautiful websites.
          </p>
        </footer>
      </div>
    </div>
  );
}
