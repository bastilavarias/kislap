'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Mail, Phone, Github } from 'lucide-react';

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

export function Default({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1 mb-6 md:mb-0 md:pr-8 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{portfolio.name}</h1>
            <p className="font-medium leading-relaxed text-xl mb-4">{portfolio.job_title}</p>
            <p className="text-base">{portfolio.introduction}</p>

            <div className="flex items-center space-x-4">
              {portfolio.website && <Globe className="w-5 h-5 text-gray-400" />}
              {portfolio.email && <Mail className="w-5 h-5 text-gray-400" />}
              {portfolio.phone && <Phone className="w-5 h-5 text-gray-400" />}
              {portfolio.github && <Github className="w-5 h-5 text-gray-400" />}
            </div>
          </div>

          <div className="flex-shrink-0">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src="https://yt3.googleusercontent.com/DUK0KCuswoaUwvZZhqAgW4e-tdOKkfguzPAHTjdRzD1KBuqV2SJm8vtpzRJ-_vXljUXnalMvs7M=s160-c-k-c0x00ffffff-no-rj" />
              <AvatarFallback className="text-2xl">
                {portfolio.name?.charAt(0) ?? 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-600 leading-relaxed">{portfolio.about}</p>
        </div>

        <div className="flex items-start gap-5">
          <div className="flex flex-col justify-start gap-10">
            {/* Skills Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="px-3 py-1 text-sm">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
              <div className="space-y-4">
                {portfolio.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between py-2"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school}</p>
                    </div>
                    <div className="text-gray-500 text-sm mt-1 md:mt-0">
                      {edu.level} - {edu.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start gap-10">
            {/* Work Experience Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Experience</h2>
              <div className="space-y-8">
                {portfolio.work_experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-gray-100 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{exp.role}</h3>
                        <p className="text-gray-600 font-medium">{exp.company}</p>
                        <p className="text-gray-500 text-sm">{exp.location}</p>
                      </div>
                      <div className="text-gray-500 text-sm mt-1 md:mt-0">
                        {exp.start_date} - {exp.end_date}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{exp.about}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Projects</h2>
              <div className="space-y-8">
                {portfolio.showcases.map((proj) => (
                  <div key={proj.id} className="border-l-2 border-gray-100 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{proj.name}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
