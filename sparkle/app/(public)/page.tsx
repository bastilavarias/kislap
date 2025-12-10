'use client';

import { Header } from '@/components/header';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, CheckCircle2, Star, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '@/hooks/api/use-auth';
import Link from 'next/link';

function Hero() {
  const { authUser } = useAuth();
  const hasUser = useMemo(() => authUser && authUser !== null, [authUser]);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-40" />

      <div className="container mx-auto px-4 max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm rounded-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            🎉 v0.0.0 is now live and it's 100% Free!
          </Badge>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Build stunning websites <br className="hidden md:block" />
          from{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            simple forms.
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Kislap turns your data into modern, high-converting websites in seconds. No coding
          required. Just fill out a form and launch.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            asChild
          >
            <Link href={hasUser ? '/dashboard' : '/login'}>
              Start Building for Free <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
            View Live Demo
          </Button>
        </motion.div>

        {/* Hero Image / Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto max-w-5xl rounded-xl border bg-background/50 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 w-full h-12 bg-muted/50 border-b flex items-center px-4 space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          {/* Replace this div with an actual screenshot of your builder/dashboard */}
          <div className="aspect-[16/9] bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center text-muted-foreground pt-12">
            [Product Dashboard Interface Screenshot]
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialProof() {
  const logos = ['Acme Corp', 'Stripe', 'Vercel', 'Linear', 'Raycast', 'Supabase']; // Replace with SVGs

  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
          Trusted by modern teams at
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, i) => (
            <div key={i} className="text-xl font-bold flex items-center gap-2">
              {/* Placeholder Icon */}
              <div className="w-6 h-6 rounded bg-foreground/20" />
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: 'Business Websites',
      description:
        'Create a professional online presence for your business in just a few clicks. SEO optimized out of the box.',
      icon: '🏢',
    },
    {
      title: 'Resumes & Portfolios',
      description:
        'Turn your LinkedIn profile or resume into a modern website that stands out to recruiters.',
      icon: '📄',
    },
    {
      title: 'Startup Waitlists',
      description:
        'Validate your idea. Launch a viral waitlist page instantly and start collecting emails.',
      icon: '🚀',
    },
    {
      title: 'Link-in-Bio Pages',
      description:
        'Build your own custom Linktree-style landing page. Own your traffic and your brand.',
      icon: '🔗',
    },
    {
      title: 'Analytics Built-in',
      description:
        'Track views, clicks, and conversions with our privacy-friendly analytics dashboard.',
      icon: '📈',
    },
    {
      title: 'Custom Domains',
      description:
        'Connect your own domain name (e.g., yourname.com) easily with free SSL certificates.',
      icon: '🌐',
    },
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for every use case.</h2>
          <p className="text-xl text-muted-foreground">
            Whether you are a freelancer, a startup founder, or a creator, Kislap gives you the
            tools to look professional online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/60 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote:
        'Kislap is the fastest way to get a site up. I built my portfolio in 5 minutes and got a job offer the next day.',
      author: 'Sarah Chen',
      role: 'Senior Engineer at Stripe',
      stars: 5,
    },
    {
      quote:
        "Finally, a website builder that doesn't feel like a cockpit. The AI assistance is incredibly helpful.",
      author: 'Marcus Rodriguez',
      role: 'Tech Lead at Vercel',
      stars: 5,
    },
    {
      quote:
        "I use Kislap for all my client waitlists. It converts better than any other landing page builder I've tried.",
      author: 'Alex Kim',
      role: 'Founder at StartupX',
      stars: 5,
    },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Founders & Creators</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of smart people who use Kislap to ship faster.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-background h-full border-none shadow-sm">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex gap-1 mb-6 text-yellow-500">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} fill="currentColor" size={18} />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-6 flex-1 leading-relaxed">
                    "{t.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400" />
                    <div>
                      <div className="font-semibold">{t.author}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">Is Kislap free to use?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Yes! You can build and publish your first website for free. We offer premium plans for
              custom domains and advanced analytics.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg">Can I connect my own domain?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Absolutely. Our Pro plan allows you to connect any custom domain (yourname.com) with
              automatic SSL provisioning.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg">Do I need coding skills?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              Zero. Kislap is designed to be a "fill-in-the-blanks" website builder. If you can fill
              out a form, you can build a website.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to launch your site?</h2>
            <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10">
              Join 10,000+ creators building their internet corner today. No credit card required.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg rounded-full font-semibold"
            >
              Get Started for Free
            </Button>
            <p className="mt-6 text-sm opacity-70">
              <CheckCircle2 className="inline-block w-4 h-4 mr-1" /> No credit card required
              <span className="mx-2">•</span>
              <CheckCircle2 className="inline-block w-4 h-4 mr-1" /> Free plan forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      {/* <SocialProof /> */}
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
