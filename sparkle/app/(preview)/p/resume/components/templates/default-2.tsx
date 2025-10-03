'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  FileText,
  Briefcase,
  Code,
  BookOpen,
  FolderOpen,
  Award,
  Quote,
  Users,
  MessageSquare,
  Mic,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface Portfolio {
  id: number;
  name: string;
  job_title: string | null;
  introduction: string;
  about: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  linkedin?: string;
  twitter?: string;
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
  }[];
  showcases: {
    id: number;
    name: string;
    description: string;
    role: string;
  }[];
  skills: { id: number; name: string }[];
}

export function Default2({ portfolio }: { portfolio: Portfolio }) {
  const formatDate = (dateStr: string) => {
    if (dateStr === 'Present') return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const categorizeSkills = () => {
    const frontend = portfolio.skills.filter((s) =>
      ['JavaScript', 'TypeScript', 'React', 'Vue 2', 'Vue 3', 'HTML5 + CSS3'].includes(s.name)
    );
    const backend = portfolio.skills.filter((s) =>
      ['Node.js', 'PHP', 'Laravel', 'SQL'].includes(s.name)
    );
    const devops = portfolio.skills.filter((s) =>
      ['Docker', 'Digital Ocean', 'Ubuntu / Linux', 'Git'].includes(s.name)
    );
    return { frontend, backend, devops };
  };

  const categorizedSkills = categorizeSkills();

  return (
    <div className="flex flex-col gap-6 py-6">
      <Card>
        <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src="https://yt3.googleusercontent.com/DUK0KCuswoaUwvZZhqAgW4e-tdOKkfguzPAHTjdRzD1KBuqV2SJm8vtpzRJ-_vXljUXnalMvs7M=s160-c-k-c0x00ffffff-no-rj" />
              <AvatarFallback className="text-2xl">
                {portfolio.name?.charAt(0) ?? 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Name and Title */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{portfolio.name}</h1>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  {portfolio.work_experiences[0]?.location || 'Metro Manila, Philippines'}
                </p>
              </div>

              <p className="text-sm">{portfolio.introduction}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* About Section */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-bold">About</h2>
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p>{portfolio.about}</p>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">Tech Stack</h2>
              </div>
              <Button variant="link" className="h-auto p-0 text-sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {categorizedSkills.frontend.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {categorizedSkills.backend.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">DevOps & Cloud</h3>
                <div className="flex flex-wrap gap-2">
                  {categorizedSkills.devops.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Beyond Coding */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">Beyond Coding</h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  When not writing code, I focus on learning about emerging technologies,
                  frameworks, and best practices.
                </p>
                <p>I share my knowledge through content creation and community building.</p>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-bold">Recent Projects</h2>
                </div>
                <Button variant="link" className="h-auto p-0 text-sm">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {portfolio.showcases.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                    <p className="mt-1 text-xs text-primary">{project.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Certifications */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-bold">Certifications</h2>
                </div>
                <Button variant="link" className="h-auto p-0 text-sm">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {portfolio.education.slice(0, 3).map((edu) => (
                  <div key={edu.id} className="rounded-lg bg-muted/50 p-3">
                    <h3 className="text-sm font-semibold">{edu.degree}</h3>
                    <p className="text-xs text-muted-foreground">{edu.school}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Quote className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">Recommendations</h2>
              </div>

              <div className="flex h-32 items-center justify-center">
                <div className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Three Column Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* A member of */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-base font-bold">A member of</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium">Philippine Developers</p>
                    <p className="text-xs text-muted-foreground">Community</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium">Tech Industry Association</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-base font-bold">Social Links</h2>
              </div>

              <div className="space-y-3">
                {portfolio.linkedin && (
                  <a
                    href={portfolio.linkedin}
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}

                <a
                  href={portfolio.github}
                  className="flex items-center gap-2 text-sm hover:text-primary"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>

                {portfolio.twitter && (
                  <a
                    href={portfolio.twitter}
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                )}
              </div>
            </div>

            {/* Speaking */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-base font-bold">Speaking</h2>
              </div>

              <p className="mb-3 text-xs text-muted-foreground">
                I speak about software development and emerging technologies
              </p>

              <Button variant="link" className="h-auto p-0 text-xs">
                Get in touch <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - 1 col */}
        <div className="space-y-6">
          {/* Experience Section */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-bold">Experience</h2>
            </div>

            <div className="space-y-4">
              {portfolio.work_experiences.map((exp) => (
                <div key={exp.id} className="relative pl-6">
                  <div
                    className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${exp.end_date === 'Present' ? 'bg-foreground' : 'bg-muted-foreground'}`}
                  />
                  <h3 className="font-semibold">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </p>
                </div>
              ))}

              {portfolio.education.map((edu) => (
                <div key={edu.id} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-muted-foreground" />
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.school}</p>
                  <p className="text-xs text-muted-foreground">{edu.level}</p>
                </div>
              ))}

              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-muted-foreground" />
                <h3 className="font-semibold">Hello World! 👋</h3>
                <p className="text-sm text-muted-foreground">Wrote my first line of code</p>
                <p className="text-xs text-muted-foreground">2006</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{portfolio.email}</p>
                </div>
              </div>
            </div>

            <div className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Let's talk</p>
                    <p className="font-medium">Schedule a Call</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Community</p>
                    <p className="font-medium">Join Discussion</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
