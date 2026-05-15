'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoVersion } from '@/components/logo-version';
import { Github, ArrowUpRight, MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sebastiancurtislavarias@gmail.com';

  const productLinks = [
    { title: 'Open Builder', href: '/dashboard' },
    { title: 'Showcase', href: 'https://kislap.app/showcase' },
  ];

  return (
    <footer className="border-t-4 border-black bg-black px-4 py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-4 border-white bg-primary p-7 shadow-[12px_12px_0_#fff] md:p-10">
            <div className="w-fit">
              <LogoVersion url="/" showVersion />
            </div>
            <h2 className="mt-10 max-w-3xl text-5xl font-black uppercase leading-[0.88] md:text-7xl">
              Forms in. Public pages out.
            </h2>
            <p className="mt-7 max-w-2xl text-xl font-semibold leading-relaxed text-white/90">
              Kislap helps people publish portfolios, link pages, and QR-ready menus without
              dragging blocks around an empty canvas.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-none border-4 border-black bg-white px-6 font-black uppercase text-black shadow-[6px_6px_0_#000] hover:bg-secondary"
              >
                <Link href="/dashboard">
                  Open Builder
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-none border-4 border-white bg-black px-6 font-black uppercase text-white shadow-[6px_6px_0_#fff] hover:bg-zinc-900 hover:text-white"
              >
                <a href="https://github.com/bastilavarias/kislap" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>

          <div className="border-4 border-white bg-white text-black shadow-[10px_10px_0_#ef4444]">
            <div className="border-b-4 border-black bg-secondary p-6">
              <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-black/70">
                Explore Kislap
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase leading-none">
                Pick a builder or get help.
              </h3>
            </div>

            <div className="grid md:grid-cols-[0.82fr_1.18fr]">
              <div className="border-b-4 border-black p-6 md:border-b-0 md:border-r-4">
                <h4 className="font-mono text-sm font-black uppercase tracking-[0.18em]">
                  Product
                </h4>
                <div className="mt-6 flex flex-col gap-3">
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between border-b-2 border-black pb-2 text-sm font-black uppercase transition hover:text-primary"
                    >
                      <span>{link.title}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-mono text-sm font-black uppercase tracking-[0.18em]">
                  Company
                </h4>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="https://kislap.app/about"
                    className="flex items-center justify-between border-b-2 border-black pb-2 text-sm font-black uppercase transition hover:text-primary"
                  >
                    <span>About Us</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="https://kislap.app/help"
                    className="flex items-center justify-between border-b-2 border-black pb-2 text-sm font-black uppercase transition hover:text-primary"
                  >
                    <span>Help</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex min-w-0 items-center gap-3 border-b-2 border-black pb-2 text-sm font-black uppercase transition hover:text-primary"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{contactEmail}</span>
                  </a>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href="https://github.com/bastilavarias/kislap"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a
                    href="https://discord.gg/YcmUebEWhT"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="sr-only">Discord</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-4 border-white bg-secondary px-5 py-4 font-mono text-sm font-black uppercase text-black shadow-[8px_8px_0_#fff] md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} Kislap. All rights reserved.</p>
          <a
            href="https://github.com/bastilavarias"
            className="w-fit underline decoration-4 underline-offset-4 transition hover:text-primary"
          >
            Built by bastilavarias
          </a>
        </div>
      </div>
    </footer>
  );
}
