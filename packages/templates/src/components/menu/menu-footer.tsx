"use client";

import React from "react";
import { Github, Globe } from "lucide-react";
import { FaFacebookF } from "react-icons/fa6";
import { KISLAP_LINKS } from "../shared/kislap-links";
import { MenuData } from "./menu-types";

interface MenuFooterProps {
  menu: MenuData;
  borderColor: string;
  foregroundColor: string;
  mutedColor: string;
  headingFont: string;
  metaFont?: string;
  className?: string;
}

export function MenuFooter({
  menu,
  borderColor,
  foregroundColor,
  mutedColor,
  headingFont,
  metaFont,
  className = "mt-12",
}: MenuFooterProps) {
  const menuName = menu.name?.trim() || "Menu";
  const supportingFont = metaFont || headingFont;

  return (
    <footer
      className={`${className} border-t-4 pt-10 pb-10 text-center`}
      style={{ borderColor }}
    >
      <div className="flex flex-col items-center justify-center gap-6 px-4">
        <div className="space-y-1">
          <p
            className="text-sm font-bold uppercase"
            style={{ color: foregroundColor, fontFamily: headingFont }}
          >
            © {new Date().getFullYear()} {menuName}.
          </p>
          <p
            className="text-xs"
            style={{
              color: mutedColor,
              fontFamily: supportingFont,
            }}
          >
            All rights reserved. Made with <span className="text-red-500">♥</span>
          </p>
        </div>

        <div
          className="h-1 w-12"
          style={{ backgroundColor: foregroundColor }}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <span
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"
              style={{ color: foregroundColor, fontFamily: headingFont }}
            >
              <span className="text-amber-400">✨</span> Powered by Kislap
            </span>
            <p
              className="text-[10px] uppercase tracking-widest"
              style={{
                color: mutedColor,
                fontFamily: supportingFont,
              }}
            >
              Transform your forms into beautiful websites
            </p>
          </div>

          <div className="mt-1 flex items-center gap-4">
            <a
              href={KISLAP_LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="border-2 border-transparent p-1 transition-colors hover:border-current hover:opacity-80"
              style={{ color: foregroundColor, fontFamily: headingFont }}
              title="Kislap Github"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={KISLAP_LINKS.website}
              target="_blank"
              rel="noreferrer"
              className="border-2 border-transparent p-1 transition-colors hover:border-current hover:opacity-80"
              style={{ color: foregroundColor, fontFamily: headingFont }}
              title="Kislap Website"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href={KISLAP_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              className="border-2 border-transparent p-1 transition-colors hover:border-current hover:opacity-80"
              style={{ color: foregroundColor, fontFamily: headingFont }}
              title="Kislap Facebook"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
