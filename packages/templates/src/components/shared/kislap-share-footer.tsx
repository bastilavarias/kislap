"use client";

import { Github, Globe } from "lucide-react";
import { FaFacebookF } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { KISLAP_LINKS } from "./kislap-links";

interface Props {
  name?: string | null;
  className?: string;
}

export function KislapShareFooter({ name, className }: Props) {
  return (
    <footer className={cn("mt-auto border-t bg-muted/5 py-8", className)}>
      <div className="flex flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            © {new Date().getFullYear()} {name || "My Portfolio"}.
          </p>
          <p className="text-xs text-muted-foreground">
            All rights reserved. Made with <span className="text-red-500">♥</span>
          </p>
        </div>

        <div className="h-1 w-10 bg-foreground/80" />

        <div className="flex flex-col items-center gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
              <span className="text-amber-400">✨</span> Powered by Kislap
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Transform your forms into beautiful websites
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a href={KISLAP_LINKS.github} target="_blank" rel="noreferrer" className="border-2 border-transparent p-1 text-foreground transition-colors hover:border-foreground hover:text-primary" title="Kislap Github">
              <Github className="h-4 w-4" />
            </a>
            <a href={KISLAP_LINKS.website} target="_blank" rel="noreferrer" className="border-2 border-transparent p-1 text-foreground transition-colors hover:border-foreground hover:text-primary" title="Kislap Website">
              <Globe className="h-4 w-4" />
            </a>
            <a href={KISLAP_LINKS.facebook} target="_blank" rel="noreferrer" className="border-2 border-transparent p-1 text-foreground transition-colors hover:border-foreground hover:text-primary" title="Kislap Facebook">
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
