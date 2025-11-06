'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function Form() {
  const [formData, setFormData] = useState({
    // Business Info / Branding
    businessName: 'My Business',
    tagline: 'Your success starts here',
    industry: 'General Services',
    shortDescription: 'We provide high-quality services to help your business grow.',
    logoUrl: 'https://via.placeholder.com/160x160',
    faviconUrl: 'https://via.placeholder.com/32',
    themeColor: '#2563eb',

    // Contact & Location
    email: 'business@email.com',
    phone: '+63 900 000 0000',
    address: 'Mandaluyong City, NCR',
    businessHours: 'Mon–Sat: 9AM–6PM',

    // Socials
    facebook: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    whatsapp: '',
    messenger: '',

    // Hero Section
    heroTitle: 'Welcome to My Business',
    heroSubtitle: 'Trusted by customers worldwide.',
    heroImageUrl: 'https://via.placeholder.com/1200x500',
    primaryCtaText: 'Book Now',
    primaryCtaLink: 'mailto:business@email.com',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '#about',

    // About Section
    aboutTitle: 'About Us',
    about: 'We are a passionate team delivering excellent results for our clients.',
    teamImageUrl: 'https://via.placeholder.com/800x500',
    highlights: ['10+ Years Experience', 'Local & Friendly', 'Fast Turnaround'],

    // Services Section
    servicesTitle: 'Our Services',
    services: [
      {
        title: 'Service Title',
        description: 'Short description of the service',
        imageUrl: 'https://via.placeholder.com/600x400',
        price: '',
      },
    ],

    // Showcase Section
    showcaseTitle: 'Our Work',
    showcase: [{ imageUrl: 'https://via.placeholder.com/600x400', caption: 'Sample Work' }],

    // Testimonials Section
    testimonialsTitle: 'What Clients Say',
    testimonials: [
      {
        name: 'Juan D.',
        photoUrl: 'https://via.placeholder.com/80',
        text: 'Great service and friendly team!',
        rating: 5,
      },
    ],

    // FAQ Section
    faqTitle: 'FAQs',
    faqs: [{ question: 'Do you offer delivery?', answer: 'Yes, within Metro Manila.' }],

    // CTA Section
    ctaHeadline: 'Ready to work with us?',
    ctaSubtext: 'Get a free quote today.',
    ctaButtonText: 'Contact Us',
    ctaButtonLink: 'mailto:business@email.com',

    // Contact Section
    contactTitle: 'Get In Touch',
    enableContactForm: true,
    mapEmbedUrl: 'https://maps.google.com/',

    // Footer
    footerText: '© My Business 2025. All rights reserved.',
    newsletterEnabled: false,
  });

  // --- Generic value change ---
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Highlights (badge list) ---
  const addHighlight = () => {
    setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, 'New highlight'] }));
  };
  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  // --- Services ---
  const handleServiceChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((s: any, i: number) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };
  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { title: 'New Service', description: '', imageUrl: '', price: '' },
      ],
    }));
  };
  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_: any, i: number) => i !== index),
    }));
  };

  // --- Showcase ---
  const handleShowcaseChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      showcase: prev.showcase.map((it: any, i: number) =>
        i === index ? { ...it, [field]: value } : it
      ),
    }));
  };
  const addShowcase = () => {
    setFormData((prev) => ({
      ...prev,
      showcase: [...prev.showcase, { imageUrl: '', caption: '' }],
    }));
  };
  const removeShowcase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      showcase: prev.showcase.filter((_: any, i: number) => i !== index),
    }));
  };

  // --- Testimonials ---
  const handleTestimonialChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t: any, i: number) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  };
  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: '', photoUrl: '', text: '', rating: 5 }],
    }));
  };
  const removeTestimonial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_: any, i: number) => i !== index),
    }));
  };

  // --- FAQs ---
  const handleFaqChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f: any, i: number) => (i === index ? { ...f, [field]: value } : f)),
    }));
  };
  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };
  const removeFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_: any, i: number) => i !== index),
    }));
  };

  return (
    <Card>
      <CardContent>
        {/* BUSINESS INFO / BRANDING */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Business Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">Business Name</Label>
              <Input
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Tagline</Label>
              <Input
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">Industry</Label>
              <Input
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Theme Color</Label>
              <Input
                type="color"
                value={formData.themeColor}
                onChange={(e) => handleInputChange('themeColor', e.target.value)}
                className="h-10 p-1"
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Business Hours</Label>
              <Input
                value={formData.businessHours}
                onChange={(e) => handleInputChange('businessHours', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">Logo URL</Label>
              <Input
                value={formData.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Favicon URL</Label>
              <Input
                value={formData.faviconUrl}
                onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="font-medium mb-2">Short Description</Label>
            <Textarea
              value={formData.shortDescription}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              className="h-24"
            />
          </div>
        </section>

        {/* CONTACT & LOCATION */}
        <section className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="font-medium mb-2">Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* SOCIAL LINKS */}
        <section className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-xs mb-2">Facebook</Label>
              <Input
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2">Instagram</Label>
              <Input
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2">LinkedIn</Label>
              <Input
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2">TikTok</Label>
              <Input
                value={formData.tiktok}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2">WhatsApp</Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2">Messenger</Label>
              <Input
                value={formData.messenger}
                onChange={(e) => handleInputChange('messenger', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <section className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Hero</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">Headline</Label>
              <Input
                value={formData.heroTitle}
                onChange={(e) => handleInputChange('heroTitle', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Subheadline</Label>
              <Input
                value={formData.heroSubtitle}
                onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">Hero Image URL</Label>
              <Input
                value={formData.heroImageUrl}
                onChange={(e) => handleInputChange('heroImageUrl', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-2">Primary CTA Text</Label>
                <Input
                  value={formData.primaryCtaText}
                  onChange={(e) => handleInputChange('primaryCtaText', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-2">Primary CTA Link</Label>
                <Input
                  value={formData.primaryCtaLink}
                  onChange={(e) => handleInputChange('primaryCtaLink', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-2">Secondary CTA Text</Label>
                <Input
                  value={formData.secondaryCtaText}
                  onChange={(e) => handleInputChange('secondaryCtaText', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-2">Secondary CTA Link</Label>
                <Input
                  value={formData.secondaryCtaLink}
                  onChange={(e) => handleInputChange('secondaryCtaLink', e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="mb-8 border-t border-gray-200 pt-8" id="about">
          <h2 className="text-2xl font-bold mb-6">About</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">About Title</Label>
              <Input
                value={formData.aboutTitle}
                onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Team Image URL</Label>
              <Input
                value={formData.teamImageUrl}
                onChange={(e) => handleInputChange('teamImageUrl', e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <Label className="font-medium mb-2">About Description</Label>
            <Textarea
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
              className="h-28"
            />
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Key Highlights</h3>
            <Button variant="outline" size="sm" onClick={addHighlight}>
              <Plus className="w-4 h-4 mr-2" /> Add Highlight
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {formData.highlights.map((h: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                <span>{h}</span>
                <button onClick={() => removeHighlight(idx)} className="text-gray-400">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{formData.servicesTitle || 'Services'}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addService}>
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <Label className="font-medium mb-2">Section Title</Label>
            <Input
              value={formData.servicesTitle}
              onChange={(e) => handleInputChange('servicesTitle', e.target.value)}
            />
          </div>
          {formData.services.map((service: any, index: number) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded p-6 mb-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <Label className="font-medium">Service Title</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                  onClick={() => removeService(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={service.title}
                onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
              />

              <Label className="font-medium">Description</Label>
              <Textarea
                value={service.description}
                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                className="h-20"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-2">Image URL (optional)</Label>
                  <Input
                    value={service.imageUrl}
                    onChange={(e) => handleServiceChange(index, 'imageUrl', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs mb-2">Price (optional)</Label>
                  <Input
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* SHOWCASE SECTION */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{formData.showcaseTitle || 'Showcase'}</h2>
            <Button variant="outline" size="sm" onClick={addShowcase}>
              <Plus className="w-4 h-4 mr-2" /> Add Showcase Item
            </Button>
          </div>
          <div className="mb-6">
            <Label className="font-medium mb-2">Section Title</Label>
            <Input
              value={formData.showcaseTitle}
              onChange={(e) => handleInputChange('showcaseTitle', e.target.value)}
            />
          </div>
          {formData.showcase.map((item: any, index: number) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded p-6 mb-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <Label className="font-medium">Image URL</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                  onClick={() => removeShowcase(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={item.imageUrl}
                onChange={(e) => handleShowcaseChange(index, 'imageUrl', e.target.value)}
              />
              <Label className="font-medium">Caption (optional)</Label>
              <Input
                value={item.caption}
                onChange={(e) => handleShowcaseChange(index, 'caption', e.target.value)}
              />
            </div>
          ))}
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{formData.testimonialsTitle || 'Testimonials'}</h2>
            <Button variant="outline" size="sm" onClick={addTestimonial}>
              <Plus className="w-4 h-4 mr-2" /> Add Testimonial
            </Button>
          </div>
          <div className="mb-6">
            <Label className="font-medium mb-2">Section Title</Label>
            <Input
              value={formData.testimonialsTitle}
              onChange={(e) => handleInputChange('testimonialsTitle', e.target.value)}
            />
          </div>
          {formData.testimonials.map((t: any, index: number) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded p-6 mb-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-2">Client Name</Label>
                  <Input
                    value={t.name}
                    onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs mb-2">Photo URL</Label>
                  <Input
                    value={t.photoUrl}
                    onChange={(e) => handleTestimonialChange(index, 'photoUrl', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-2">Testimonial</Label>
                <Textarea
                  value={t.text}
                  onChange={(e) => handleTestimonialChange(index, 'text', e.target.value)}
                  className="h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <Label className="text-xs mb-2">Star Rating (1-5)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={t.rating}
                    onChange={(e) =>
                      handleTestimonialChange(index, 'rating', Number(e.target.value))
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400"
                    onClick={() => removeTestimonial(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FAQ SECTION */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{formData.faqTitle || 'FAQs'}</h2>
            <Button variant="outline" size="sm" onClick={addFaq}>
              <Plus className="w-4 h-4 mr-2" /> Add FAQ
            </Button>
          </div>
          <div className="mb-6">
            <Label className="font-medium mb-2">Section Title</Label>
            <Input
              value={formData.faqTitle}
              onChange={(e) => handleInputChange('faqTitle', e.target.value)}
            />
          </div>
          {formData.faqs.map((f: any, index: number) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded p-6 mb-6 space-y-4"
            >
              <div>
                <Label className="text-xs mb-2">Question</Label>
                <Input
                  value={f.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-2">Answer</Label>
                <Textarea
                  value={f.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  className="h-20"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                  onClick={() => removeFaq(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </section>

        {/* CTA BANNER */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Call To Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="font-medium mb-2">Headline</Label>
              <Input
                value={formData.ctaHeadline}
                onChange={(e) => handleInputChange('ctaHeadline', e.target.value)}
              />
            </div>
            <div>
              <Label className="font-medium mb-2">Subtext</Label>
              <Input
                value={formData.ctaSubtext}
                onChange={(e) => handleInputChange('ctaSubtext', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-xs mb-2">Button Text</Label>
              <Input
                value={formData.ctaButtonText}
                onChange={(e) => handleInputChange('ctaButtonText', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2">Button Link</Label>
              <Input
                value={formData.ctaButtonLink}
                onChange={(e) => handleInputChange('ctaButtonLink', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* CONTACT SECTION (embedded/contact form toggles) */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Contact Section</h2>
          <div className="mb-6 flex items-center gap-3">
            <Switch
              id="enableContactForm"
              checked={formData.enableContactForm}
              onCheckedChange={(v) => handleInputChange('enableContactForm', v)}
            />
            <Label htmlFor="enableContactForm">Enable Contact Form</Label>
          </div>
          <div>
            <Label className="font-medium mb-2">Google Maps Embed URL (optional)</Label>
            <Input
              value={formData.mapEmbedUrl}
              onChange={(e) => handleInputChange('mapEmbedUrl', e.target.value)}
            />
          </div>
        </section>

        {/* FOOTER */}
        <section className="border-t border-gray-200 pt-8 pb-2">
          <h2 className="text-2xl font-bold mb-6">Footer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="font-medium mb-2">Footer Text</Label>
              <Input
                value={formData.footerText}
                onChange={(e) => handleInputChange('footerText', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 mt-8 md:mt-0">
              <Switch
                id="newsletter"
                checked={formData.newsletterEnabled}
                onCheckedChange={(v) => handleInputChange('newsletterEnabled', v)}
              />
              <Label htmlFor="newsletter">Enable Newsletter Signup</Label>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
