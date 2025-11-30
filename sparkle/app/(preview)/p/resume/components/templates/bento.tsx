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
  Briefcase,
  GraduationCap,
  Send,
  AlertCircleIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

interface Props {
  portfolio: Portfolio;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
  themeStyles: ThemeStyles;
}

interface Portfolio {
  id: number;
  name: string;
  location: string | null;
  job_title: string | null;
  introduction: string | null;
  about: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;

  work_experiences: {
    id: number;
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string;
    about: string;
  }[];
  education: {
    id: number;
    school: string;
    level: string;
    degree: string;
    location: string;
    about: string;
    year_start: string;
    year_end: string;
  }[];
  showcases: {
    id: number;
    name: string;
    description: string;
    role: string;
    url: string;
    technologies: { id: number; name: string }[];
  }[];
  skills: { id: number; name: string }[];
}

export function Bento({ portfolio, themeMode, onSetThemeMode, themeStyles }: Props) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      user_id: 1, // Ideally this comes from props or context
      project_id: 1,
      date: '',
      time_from: '',
      time_to: '',
      name: form.name,
      email: form.email,
      contact_number: form.contact_number,
      message: form.message,
    };

    const { success, data, message } = await create(payload);

    if (success && data) {
      toast('Portfolio details successfully saved.');
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold tracking-tighter uppercase"></div>
          <ThemeSwitchToggle isDarkMode={isDarkMode} onSetThemeMode={onSetThemeMode} />
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          {/* 1. HERO CARD (Span 2 cols, 2 rows) */}
          <Card className="md:col-span-2 md:row-span-2 flex flex-col justify-between overflow-hidden border-2 hover:border-primary transition-colors duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                  <AvatarImage src="https://yt3.googleusercontent.com/DUK0KCuswoaUwvZZhqAgW4e-tdOKkfguzPAHTjdRzD1KBuqV2SJm8vtpzRJ-_vXljUXnalMvs7M=s160-c-k-c0x00ffffff-no-rj" />
                  <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">
                    {portfolio.name?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                {portfolio.location && (
                  <Badge variant="outline" className="text-xs py-1 px-3 gap-1">
                    <MapPin className="w-3 h-3" />
                    {portfolio.location}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-4xl md:text-5xl font-black mt-4 leading-tight">
                {portfolio.name}
              </CardTitle>
              <CardDescription className="text-xl md:text-2xl font-medium text-primary">
                {portfolio.job_title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {portfolio.introduction}
              </p>
            </CardContent>
          </Card>

          {/* 2. CONTACT INFO CARD */}
          <Card className="md:col-span-1 bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm font-medium">
              <div className="flex flex-col">
                <span className="opacity-70 text-xs uppercase">Email</span>
                <span className="truncate">{portfolio.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="opacity-70 text-xs uppercase">Phone</span>
                <span className="truncate">{portfolio.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* 3. SOCIALS CARD */}
          <Card className="md:col-span-1 flex flex-col justify-center items-center gap-4 p-6">
            <div className="text-center font-bold text-muted-foreground text-sm uppercase tracking-wider">
              Connect
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {socialLinks.map((social, idx) => (
                <Link key={idx} href={social.url!} target="_blank">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <social.icon className="h-5 w-5" />
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          {/* 4. ABOUT CARD (Span 2 cols) */}
          <Card className="md:col-span-2 lg:col-span-2 border-2 hover:border-primary transition-colors duration-300">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {portfolio.about ||
                  "I'm a passionate developer who loves building things for the web."}
              </p>
            </CardContent>
          </Card>

          {/* 5. SKILLS (Span full width mobile, 2 cols desktop) */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⚡ Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="px-3 py-1 text-sm border-transparent hover:border-primary border hover:bg-background transition-all cursor-default"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 6. PROJECTS (Span full width) */}
          <div className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-3 lg:col-span-3 py-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Selected Work</h2>
            </div>
            {portfolio.showcases.map((showcase) => (
              <Card
                key={showcase.id}
                className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-5 w-5 text-primary" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold truncate pr-6">{showcase.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{showcase.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {showcase.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech.id}
                        className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border px-1 rounded"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {showcase.technologies.length > 3 && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border px-1 rounded">
                        +{showcase.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
                <Link href={showcase.url} target="_blank" className="absolute inset-0 z-10" />
              </Card>
            ))}
          </div>

          {/* 7. EXPERIENCE & EDUCATION (Split column) */}
          <div className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-none shadow-none bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="w-5 h-5 text-primary" /> Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolio.work_experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{exp.company}</span>
                      <span className="text-primary font-medium">{exp.role}</span>
                      <span className="text-xs text-muted-foreground mb-2">
                        {exp.start_date} - {exp.end_date}
                      </span>
                      <p className="text-sm text-muted-foreground line-clamp-2">{exp.about}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-none bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <GraduationCap className="w-5 h-5 text-primary" /> Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolio.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="relative pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{edu.school}</span>
                      <span className="text-primary font-medium">{edu.degree}</span>
                      <span className="text-xs text-muted-foreground mb-2">
                        {edu.year_start} - {edu.year_end}
                      </span>
                      <p className="text-sm text-muted-foreground">{edu.location}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 8. CONTACT FORM (Full width footer) */}
          <div className="md:col-span-3 lg:col-span-4 mt-8">
            <Card className="border-2 overflow-hidden">
              <div className="grid md:grid-cols-5 h-full">
                <div className="md:col-span-2 bg-primary text-primary-foreground p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-black mb-4 uppercase">Let's Work Together</h3>
                  <p className="opacity-90">
                    Have a project in mind? Fill out the form and I'll get back to you as soon as
                    possible.
                  </p>
                  <div className="mt-8 space-y-2 opacity-80 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {portfolio.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {portfolio.phone}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 p-6 md:p-8">
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircleIcon className="h-4 w-4" />
                      <AlertTitle>{error}</AlertTitle>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input {...register('name')} placeholder="John Doe" />
                        {errors.name && (
                          <p className="text-destructive text-xs">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Contact No.</Label>
                        <Input {...register('contact_number')} placeholder="+1 234..." />
                        {errors.contact_number && (
                          <p className="text-destructive text-xs">
                            {errors.contact_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input {...register('email')} type="email" placeholder="john@example.com" />
                      {errors.email && (
                        <p className="text-destructive text-xs">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        {...register('message')}
                        placeholder="Tell me about your project..."
                        className="min-h-[120px]"
                      />
                      {errors.message && (
                        <p className="text-destructive text-xs">{errors.message.message}</p>
                      )}
                    </div>
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                      className="w-full md:w-auto font-bold"
                    >
                      {isLoading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
