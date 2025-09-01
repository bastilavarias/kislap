"use client";

import * as React from "react";
import { Home, Folder, Settings2 } from "lucide-react";

import { NavFavorites } from "@/app/(private)/_components/nav-favorites";
import { NavMain } from "@/app/(private)/_components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoVersion } from "@/components/logo-version";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Folder,
      badge: "10",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="flex justify-center">
        <LogoVersion />
      </SidebarHeader>
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
