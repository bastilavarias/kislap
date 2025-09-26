'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Calendar, Plus } from 'lucide-react';
import ThemeControlPanel from '@/components/customizer/theme-control-panel';
import { FileUploadDialog } from '@/app/(private)/projects/builder/portfolio/[slug]/components/file-upload-dialog';
import { PortfolioFormValues, PortfolioSchema } from '@/lib/schemas/portfolio';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(PortfolioSchema),
    defaultValues: {
      name: '',
      location: '',
      introduction: '',
      email: '',
      phone: '',
      about: '',
      workExperiences: [
        // {
        //   jobTitle: 'Financial and Operations Manager',
        //   company: 'Aquamonia Trading',
        //   location: 'Mandaluyong City, National Capital',
        //   startDate: 'Jul 2025',
        //   endDate: 'Pick an end month',
        //   description:
        //     'Responsible for managing financial transactions, invoicing, and client relationships. Ensured accurate and timely financial reporting and maintained client trust. Handled various payment methods including Cash on Delivery (COD) and online payments for the Finance department.',
        // },
      ],
      educations: [
        // {
        //   degree: 'Degree',
        //   school: 'School',
        //   startDate: 'Pick a start month',
        //   endDate: 'Pick an end month',
        // },
      ],
      skills: [],
    },
  });

  return (
    <Card>
      <CardContent className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-6">Content</h2>
            <FileUploadDialog />
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-6">Header</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="font-medium mb-2">Name</Label>
                <Input {...register('name')} className="w-full shadow-none" />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label className="font-medium mb-2">Location</Label>
                <Input {...register('location')} className="w-full shadow-none" />
                {errors.location && (
                  <p className="text-destructive text-sm mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Label className="font-medium mb-2">Introduction</Label>
              <Textarea
                {...register('introduction')}
                className="w-full shadow-none h-20 resize-none"
              />
              {errors.introduction && (
                <p className="text-destructive text-sm mt-1">{errors.introduction.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="font-medium mb-2">Email</Label>
                <Input {...register('email')} className="w-full shadow-none" />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label className="font-medium mb-2">Phone Number</Label>
                <Input {...register('phone')} className="w-full shadow-none" />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Label className="font-medium mb-4">Social Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs mb-2">Website</Label>
                  <Input className="w-full shadow-none" />
                </div>
                <div>
                  <Label className="text-xs  mb-2">GitHub</Label>
                  <Input className="w-full shadow-none" />
                </div>
                <div>
                  <Label className="text-xs  mb-2">LinkedIn</Label>
                  <Input className="w-full shadow-none" />
                </div>
                <div>
                  <Label className="text-xs  mb-2">Twitter/X</Label>
                  <Input className="w-full shadow-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 pt-8">
            <h2 className="text-lg font-medium mb-6">About</h2>
            <Textarea className="w-full shadow-none h-32 resize-none" />
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
                <Input className="w-full shadow-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-medium mb-2">Company</Label>
                  <Input className="w-full shadow-none" />
                </div>
                <div>
                  <Label className="font-medium mb-2">Location</Label>
                  <Input className="w-full shadow-none" />
                </div>
              </div>

              <div>
                <Label className="font-medium mb-2">Date Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs  mb-2">Start Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm"></span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs  mb-2">End Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm "></span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-medium mb-2">Description</Label>
                <Textarea className="w-full shadow-none h-24 resize-none" />
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
                <Input className="w-full shadow-none" placeholder="Degree" />
              </div>

              <div>
                <Label className="font-medium mb-2">School</Label>
                <Input className="w-full shadow-none" placeholder="School" />
              </div>

              <div>
                <Label className="font-medium mb-2">Date Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs  mb-2">Start Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm "></span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs  mb-2">End Date</Label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm "></span>
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
              {/* {formData.skills.map((skill, index) => (
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
              ))} */}
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
