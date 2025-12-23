'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Code2, Heart, Zap, Globe2, Users, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm rounded-full bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10"
            >
              Our Mission
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              We help builders <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                tell their story.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Kislap isn't just a website builder. It's a canvas for your career. We believe every
              developer, designer, and founder deserves a world class portfolio without the headache
              of coding it from scratch.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/20">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Sites Published', value: '100+' },
              { label: 'Active Builders', value: '20+' },
              { label: 'Templates', value: '8' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why we exist.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The internet is noisy. Standing out is hard. We built Kislap to give you the signal
              amidst the noise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {/* Card 1: Speed */}
            <Card className="col-span-1 md:col-span-2 overflow-hidden relative group border-border/50 bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-8 md:p-12 h-full flex flex-col justify-between relative z-10">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Unmatched Speed</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Time is your most valuable asset. Our engine is optimized to get you from "blank
                    page" to "published" in minutes, not days.
                  </p>
                </div>
                {/* Decorative bg element */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-orange-500/10 transition-colors duration-500" />
              </CardContent>
            </Card>

            {/* Card 2: Design */}
            <Card className="col-span-1 overflow-hidden relative group border-border/50 bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Design First</h3>
                  <p className="text-muted-foreground">
                    We sweat the details—typography, spacing, and animations—so you don't have to.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Open Source / Code */}
            <Card className="col-span-1 overflow-hidden relative group border-border/50 bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Developer Ready</h3>
                  <p className="text-muted-foreground">
                    Built by developers, for developers. Clean code exports and easy integrations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Community */}
            <Card className="col-span-1 md:col-span-2 overflow-hidden relative group border-border/50 bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-8 md:p-12 h-full flex flex-col justify-between relative z-10">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Community Driven</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    We are open source and community funded. We listen to our users and build what
                    they actually need.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-green-500/10 transition-colors duration-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="w-full md:w-1/3 flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ring-1 ring-white/10">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src="https://avatars.githubusercontent.com/u/24890911?v=4"
                    alt="Sebastian Curtis Lavarias"
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="text-4xl font-bold rounded-none bg-zinc-900 text-zinc-500">
                    SC
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-2/3 space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">
                Built with{' '}
                <Heart className="inline w-8 h-8 text-red-500 fill-red-500 mx-1 animate-pulse" /> in
                Manila.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "I started Kislap because I was tired of spending weekends fighting with CSS just to
                update my portfolio. I wanted a tool that felt like magic—something that respected
                my time as a builder but delivered the polish of a professional designer."
              </p>

              <div>
                <h4 className="font-bold text-xl">Sebastian Curtis Lavarias</h4>
                <p className="text-muted-foreground">"Ang Pasimuno ng Kalokohan :D"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 container px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-24 text-center text-primary-foreground shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to claim your corner of the internet?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of other developers building their legacy with Kislap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto font-bold h-12 px-8"
                asChild
              >
                <Link href="/login">
                  Start Building for Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/showcase">
                  View Showcase
                  <Globe2 className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
