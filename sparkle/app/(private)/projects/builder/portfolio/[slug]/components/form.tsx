'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Calendar, Plus, File } from 'lucide-react';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';

export function Form() {
  const [formData, setFormData] = useState({
    name: 'Jose J',
    location: 'Mandaluyong City, National Capital R',
    shortAbout:
      'Experienced financial and operations professional with a strong background in managing financial transactions, invoicing, and client relationships. Skilled in ensuring accurate and timely financial reporting and maintaining client trust.',
    email: 'jh.aquamonia@gmail.com',
    phone: 'Your phone number',
    website: 'your-website.com',
    github: 'github.com/ username',
    linkedin: 'linkedin.com/in/ username',
    twitter: 'x.com/ username',
    about:
      'Dedicated financial and operations professional with a proven track record in managing financial transactions, invoicing, and client relationships. Adept at ensuring accurate and timely financial reporting and maintaining client trust. Skilled in handling various payment methods and maintaining detailed financial records.',
    workExperience: [
      {
        jobTitle: 'Financial and Operations Manager',
        company: 'Aquamonia Trading',
        location: 'Mandaluyong City, National Capital',
        startDate: 'Jul 2025',
        endDate: 'Pick an end month',
        description:
          'Responsible for managing financial transactions, invoicing, and client relationships. Ensured accurate and timely financial reporting and maintained client trust. Handled various payment methods including Cash on Delivery (COD) and online payments for the Finance department.',
      },
    ],
    education: [
      {
        degree: 'Degree',
        school: 'School',
        startDate: 'Pick a start month',
        endDate: 'Pick an end month',
      },
    ],
    skills: [
      'Financial Management',
      'Invoicing',
      'Client Relationship Management',
      'Payment Processing',
      'Cash on Delivery (COD)',
      'Online Payments',
      'Financial Reporting',
      'Transaction Management',
      'Banking Operations',
      'Customer Service',
    ],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({  
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-6">Content</h2>
            <Button variant="outline" className="cursor-pointer shadow-none">
              <File className="size-4" />
              Upload
            </Button>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-6">Header</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="font-medium mb-2">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full shadow-none shadow-none"
                />
              </div>
              <div>
                <Label className="font-medium mb-2">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full shadow-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <Label className="font-medium mb-2">Introduction</Label>
              <Textarea
                value={formData.shortAbout}
                onChange={(e) => handleInputChange('shortAbout', e.target.value)}
                className="w-full shadow-none h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="font-medium mb-2">Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full shadow-none"
                />
              </div>
              <div>
                <Label className="font-medium mb-2">Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full shadow-none"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div className="mb-6">
              <Label className="font-medium mb-4">Social Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs  mb-2">Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full shadow-none"
                  />
                </div>
                <div>
                  <Label className="text-xs  mb-2">GitHub</Label>
                  <Input
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="w-full shadow-none"
                  />
                </div>
                <div>
                  <Label className="text-xs  mb-2">LinkedIn</Label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full shadow-none"
                  />
                </div>
                <div>
                  <Label className="text-xs  mb-2">Twitter/X</Label>
                  <Input
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="w-full shadow-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 pt-8">
            <h2 className="text-lg font-medium mb-6">About</h2>
            <Textarea
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
              className="w-full shadow-none h-32 resize-none"
            />
          </div>
          <div className="mb-8 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Work Experience</h2>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded p-6 space-y-6">
              <div>
                <Label className="font-medium mb-2">Job Title</Label>
                <Input
                  value={formData.workExperience[0].jobTitle}
                  onChange={(e) => handleWorkExperienceChange(0, 'jobTitle', e.target.value)}
                  className="w-full shadow-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-medium mb-2">Company</Label>
                  <Input
                    value={formData.workExperience[0].company}
                    onChange={(e) => handleWorkExperienceChange(0, 'company', e.target.value)}
                    className="w-full shadow-none"
                  />
                </div>
                <div>
                  <Label className="font-medium mb-2">Location</Label>
                  <Input
                    value={formData.workExperience[0].location}
                    onChange={(e) => handleWorkExperienceChange(0, 'location', e.target.value)}
                    className="w-full shadow-none"
                  />
                </div>
              </div>

              <div>
                <Label className="font-medium mb-2">Date Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs  mb-2">Start Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{formData.workExperience[0].startDate}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs  mb-2">End Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm ">{formData.workExperience[0].endDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-medium mb-2">Description</Label>
                <Textarea
                  value={formData.workExperience[0].description}
                  onChange={(e) => handleWorkExperienceChange(0, 'description', e.target.value)}
                  className="w-full shadow-none h-24 resize-none"
                />
              </div>
            </div>

            <Button variant="outline" className="mt-6">
              <Plus className="w-4 h-4 mr-2" />
              Add Work Experience
            </Button>
          </div>
          <div className="mb-8 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Education</h2>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded p-6 space-y-6">
              <div>
                <Label className="font-medium mb-2">Degree</Label>
                <Input
                  value={formData.education[0].degree}
                  onChange={(e) => handleEducationChange(0, 'degree', e.target.value)}
                  className="w-full shadow-none"
                  placeholder="Degree"
                />
              </div>

              <div>
                <Label className="font-medium mb-2">School</Label>
                <Input
                  value={formData.education[0].school}
                  onChange={(e) => handleEducationChange(0, 'school', e.target.value)}
                  className="w-full shadow-none"
                  placeholder="School"
                />
              </div>

              <div>
                <Label className="font-medium mb-2">Date Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs  mb-2">Start Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm ">{formData.education[0].startDate}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs  mb-2">End Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm ">{formData.education[0].endDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="mt-6">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
          <div className="pt-8">
            <h2 className="text-lg font-medium mb-6">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 flex items-center space-x-2"
                >
                  <span>{skill}</span>
                  <button onClick={() => removeSkill(index)} className="text-gray-400 hover:">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button variant="outline" className="mt-6">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div>
            <h2 className="text-2xl font-bold mb-6">Customization</h2>
            <ThemeControlPanel
              stateless={true}
              hideTopActionButtons={true}
              hideModeToggle={true}
              hideScrollArea={true}
              hideThemeSaverButton={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
